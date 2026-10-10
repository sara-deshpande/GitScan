import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { getProfileData } from './github.js';
import { buildPrompt, formatAnalysis } from './prompt.js';

dotenv.config();

const app = express();

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
    message: { error: 'Too many scans from this network. Please wait 15 minutes and try again.' }
}));

app.post('/api/analyze', async (req,res)=> {
    const {prompt} = req.body;

    try {
        const profile = await getProfileData(username);

        if (!profile) {
            return res.status(404).json({ error: 'GitHub user not found. Check the username and try again.' });
        }
        if (profile.repos.length === 0 && !profile.bio) {
            return res.status(422).json({ error: 'This GitHub account has no public repositories or bio. There is not enough data to generate an analysis.' });
        }

        const { system, user } = buildPrompt(profile, role);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
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
        res.json(formatAnalysis(analysis));

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});


export default app;