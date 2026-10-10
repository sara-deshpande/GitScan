import './ScorePage.css';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import useGitHub from '../hooks/useGitHub'; 

const ScorePage = () => {

    const {username} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const role = new URLSearchParams(location.search).get('role');

    const {profileData, repos, isLoading: githubLoading, error: githubError , fetchGitHubData} = useGitHub();

    const [scores, setScores] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState ('');

    useEffect (() => {
        if (username ) {
            fetchGitHubData(username);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    useEffect(() => {
        document.title = `GitScan | @${username} score`;
    }, [username]);

    useEffect(() => {
        if (profileData && role){
            const saved = localStorage.getItem(`gitscan-${username}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.role === role) {
                    setScores(parsed);
                    return;
                }
            }
    
            if (repos.length === 0 && !profileData.bio) {
                setAiError('This GitHub account has no public repositories or bio. There is not enough data to generate an analysis.');
                return;
            }
            analyzeProfile();
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[profileData, repos]);

    const analyzeProfile = async () => {
        setAiLoading(true);
        setAiError('');

        const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

        const repoDetails = repos.map(r => ({
            name: r.name,
            description: r.description || 'NO DESCRIPTION',
            language: r.language || 'No language set',
            stars: r.stargazers_count,
            hasDescription: !!r.description
        }));

        const reposWithoutDescription = repoDetails
            .filter(r => !r.hasDescription)
            .map(r => r.name)
            .join(', ');

        const reposWithDescription = repoDetails.filter(r => r.hasDescription).length;

        const prompt = `
       You are a senior tech recruiter and career advisor reviewing a GitHub profile for someone targeting ${role} positions.

        Profile Overview:
        - Name: ${profileData.name || profileData.login}
        - Bio: ${profileData.bio || 'NO BIO SET'}
        - Location: ${profileData.location || 'NOT SET'}
        - Public repos: ${profileData.public_repos}
        - Followers: ${profileData.followers}
        - Account age: ${new Date().getFullYear() - new Date(profileData.created_at).getFullYear()} years
        - Languages used: ${languages.join(', ')}

       Repository Analysis (ALL ${repos.length} repos):
        ${repos.length === 0 
        ? 'NO REPOSITORIES — this account has no public repos at all' 
        : repoDetails.map(r => `- ${r.name}: ${r.description} | Language: ${r.language} | Stars: ${r.stars}`).join('\n')
        }
        
        Documentation gaps:
        - Repos WITHOUT descriptions: ${reposWithoutDescription || 'None — great job!'}
        - Repos with descriptions: ${reposWithDescription} out of ${repos.length}

        Your job is to:
        1. Carefully read ALL the repo data above before scoring
        2. Score this specific profile honestly — do not use default or placeholder scores
        3. Identify specific things that are MISSING or need improvement based on what you actually see
        4. Give actionable suggestions based on THIS person's actual profile

        Be strict and honest. A profile with no bio, no descriptions, and irrelevant projects should score low. A strong profile with good documentation and relevant projects should score high. Every score must reflect the actual data above.

        Respond ONLY with valid JSON in this exact format. Replace all descriptions in quotes with real observations about THIS specific profile. No placeholder text:
        {
        "overall": <calculate honestly based on all categories>,
        "categories": [
            {
            "name": "Documentation Quality",
            "score": <0-10 based on how many repos have descriptions and quality of bio>,
            "feedback": ["<specific repo names that are missing descriptions>", "<specific action to improve documentation>"]
            },
            {
            "name": "Project Variety",
            "score": <0-10 based on language diversity and project types>,
            "feedback": ["<observation about the actual languages and project types you see>", "<specific suggestion for what type of project to add>"]
            },
            {
            "name": "Commit Consistency",
            "score": <0-10 based on account age vs number of repos>,
            "feedback": ["<observation about their activity level>", "<specific suggestion to improve consistency>"]
            },
            {
            "name": "Role Relevance",
            "score": <0-10 based on how well their projects match ${role} requirements>,
            "feedback": ["<which of their repos are relevant to ${role} and which are not>", "<specific project type they should add for ${role}>"]
            }
        ],
        "actionItems": [
            "<specific action item based on what you actually found missing in this profile>",
            "<another specific action item>",
            "<another specific action item>",
            "<another specific action item>"
        ]
        }`;

        try {
            const response = await fetch('https://gitscan-production-7918.up.railway.app/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();
            const text = data.choices[0].message.content;
            const parsed = JSON.parse(text);
            const result = { ...parsed, role };
            setScores(result);
            localStorage.setItem(`gitscan-${username}`, JSON.stringify(result));
            localStorage.removeItem(`gitscan-checks-${username}`);
            setAiLoading(false);

        } catch (err) {
            setAiError('Failed to generate analysis. Please try again.');
            setAiLoading(false);
            console.log(err);
        }
    };

    if (githubLoading || aiLoading) {
        return (
            <div className="skeleton-page">
                <div className="skeleton-pulse">
                    <div className="skeleton-hero">
                        <div className="skeleton-lines">
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line long"></div>
                            <div className="skeleton-line mid"></div>
                        </div>
                        <div className="skeleton-square"></div>
                    </div>
                    <div className="skeleton-grid">
                        <div className="skeleton-card bright"></div>
                        <div className="skeleton-card bright"></div>
                        <div className="skeleton-card bright"></div>
                        <div className="skeleton-card bright"></div>
                    </div>
                </div>
                <p className="skeleton-status">
                    {githubLoading
                        ? `Reading @${username}'s repos...`
                        : 'Writing your analysis. This can take a few seconds.'}
                </p>
            </div>
        );
    }

    if (githubError) {
        return (
            <div className="score-error">
                <p>{githubError}</p>
            </div>
        );
    }

    if (aiError) {
        return (
            <div className="score-error">
                <p>{aiError}</p>
            </div>
        );
    }

    if (!scores) {
        return ( 
            <div className="score-error">
                <p>Could not generate analysis. This profile may have no public activity.</p>
            </div>
        );
    }

    const verdict =
    scores.overall >= 9 ? 'Standout profile'
    : scores.overall >= 7 ? 'Strong profile'
    : scores.overall >= 5 ? 'Getting there'
    : 'Needs work';

    const actionCount = scores.actionItems ? scores.actionItems.length : 0;

    return (
        <div className="score-page">

            <section className="score-hero">
                <div className="score-hero-text">
                    <span className="score-role">Scanned for {role}</span>
                    <h2>AI analysis for <span className="score-username">@{username}</span></h2>
                    <p>How a recruiter hiring for {role} roles would read your GitHub, split into four parts.</p>
                </div>
                <div className="score-overall">
                    <div className="score-overall-number">
                        {scores.overall}<span>/10</span>
                    </div>
                    <span className="score-verdict">{verdict}</span>
                </div>
            </section>

            <div className="score-grid">
                {scores.categories.map((category, index) => (
                    <div className="score-card" key={index}>
                        <span className="score-num">[{String(index + 1).padStart(2, '0')}]</span>
                        <div className="score-card-header">
                            <h3>{category.name}</h3>
                            <span className="score-value">
                                {category.score}<span>/10</span>
                            </span>
                        </div>
                        <div className="score-bar-bg">
                            <div
                                className="score-bar-fill"
                                style={{ width: `${category.score * 10}%` }}
                            ></div>
                        </div>
                        <ul className="score-feedback">
                            {category.feedback.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <section className="score-next">
                <div>
                    <h3>Your action plan</h3>
                    <p>{actionCount} things to fix on your profile. Tick them off as you go.</p>
                </div>
                <button
                    className="action-plan-btn"
                    onClick={() => navigate(`/action-plan/${username}${location.search}`)}
                >
                    View action plan
                </button>
            </section>

        </div>
    );
}


 
export default ScorePage;