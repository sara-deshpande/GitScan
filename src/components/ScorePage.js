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
        if (profileData && repos.length > 0 && role){
            analyzeProfile();
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[profileData, repos]);

    const analyzeProfile = async () => {
        console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);
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
        ${repoDetails.map(r => `- ${r.name}: ${r.description} | Language: ${r.language} | Stars: ${r.stars}`).join('\n')}

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
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1500
                })
            });

            const data = await response.json();
            const text = data.choices[0].message.content;
            const parsed = JSON.parse(text);
            setScores(parsed);
            localStorage.setItem(`gitscan-${username}`, JSON.stringify(parsed));
            setAiLoading(false);

        } catch (err) {
            setAiError('Failed to generate analysis. Please try again.');
            setAiLoading(false);
            console.log(err);
        }
    };

    if (githubLoading || aiLoading) {
        return (
            <div className="loading">
                <p>{githubLoading ? 'Loading GitHub data...' : 'Generating AI analysis...'}</p>
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
        return null;
    }

    return (  
        <div className="score-page">
            <div className="score-header">
                <h2>AI Analysis for <span>@{username}</span></h2>
                <p>Analyzed for: <strong>{role}</strong> roles</p>
            </div>

            <div className="overall-scores">
                <div className="overall-number">{scores.overall} <span>/10</span></div>
                <p>Overall Recruiter Score</p>
            </div>

            <div className="score-categories">
                {scores.categories.map((category, index) => (
                    <div className="score-card" key={index}>
                        <div className="score-card-header">
                            <h3>{category.name}</h3>
                            <span className={`score-badge ${category.score >= 7 ? 'high' : category.score >= 5 ? 'medium' : 'low' }`}>
                                {category.score}/10
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

            <button 
                className = "action-plan-btn"
                onClick ={() => navigate(`/action-plan/${username}${location.search}`)}
                >
                    View Action Plan 
                </button>
        </div>

    );

}

 
export default ScorePage;