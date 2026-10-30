import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { getProfileData } from './github.js';
import { buildPrompt, formatAnalysis, getLevel, getSignals, getScoreLimits } from './prompt.js';
import {buildEvidence} from './evidence.js';

dotenv.config();

const app = express();

const cache = new Map();
const CACHE_TIME = 24 * 60 * 60 * 1000;

const allowedOrigins = [
    'https://git-scan-lake.vercel.app',
    'http://localhost:3000'
];

const ROLES = [
    'Frontend Engineer',
    'Backend Engineer',
    'Full-Stack Engineer',
    'ML Engineer',
    'DevOps Engineer',
    'Software Engineer',
    'Data Analyst',
    'Data Scientist',
    'Application Developer',
    'Software Developer',
    'Mobile Application Developer',
    'AI Engineer'
];

app.set('trust proxy', 1);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    skip: () => process.env.EVAL_MODE === 'true',
    message: { error: 'Too many scans from this network. Please wait 15 minutes and try again.' }
}));

app.post('/api/analyze', async (req, res) => {
    const { username, role } = req.body;

    if (!username || !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
        return res.status(400).json({ error: 'Please enter a valid GitHub username.' });
    }
    if (!ROLES.includes(role)) {
        return res.status(400).json({ error: 'Please select a valid role.' });
    }

    const cacheKey = `${username.toLowerCase()}:${role}`;
    const cached = cache.get(cacheKey);
    if (process.env.EVAL_MODE !== 'true' && cached && Date.now() - cached.savedAt < CACHE_TIME) {
        return res.json(cached.result);
    }

    try {
        const profile = await getProfileData(username);

        if (!profile) {
            return res.status(404).json({ error: 'GitHub user not found. Check the username and try again.' });
        }
        if (profile.repos.length === 0 && !profile.bio) {
            return res.status(422).json({ error: 'This GitHub account has no public repositories or bio. There is not enough data to generate an analysis.' });
        }

        const signals = getSignals(profile);
        const level = getLevel(signals);
        const limits = getScoreLimits(signals);
        const { system, user } = buildPrompt(profile, role, level, limits);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                temperature: 0.2,
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: user }
                ],
                response_format: { type: 'json_object' },
                max_completion_tokens: 4000
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenAI error:', data);
            return res.status(502).json({ error: 'The AI service failed. Please try again.' });
        }

        const analysis = JSON.parse(data.choices[0].message.content);
        const result = formatAnalysis(analysis, level, limits, profile);
        const evidence = buildEvidence(profile, result.relevantRepos);

        result.categories = result.categories.map(category => ({
            ...category,
            evidence: evidence[category.name] || null
        }));
        result.relevantRepos = evidence['Role Relevance'].rows.map(row => row.name);

        cache.set(cacheKey, { result, savedAt: Date.now() });

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

export default app;