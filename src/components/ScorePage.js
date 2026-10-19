import './ScorePage.css';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import useGitHub from '../hooks/useGitHub'; 
import ScoreCards from './ScoreCards';

const API_URL = process.env.REACT_APP_API_URL || 'https://gitscan-production-7918.up.railway.app';
const ANALYSIS_VERSION = 3;

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
                if (parsed.role === role && parsed.version === ANALYSIS_VERSION) {
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
    
        try {
            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, role })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setAiError(data.error || 'Failed to generate analysis. Please try again.');
                setAiLoading(false);
                return;
            }
    
            const result = { ...data, role, version: ANALYSIS_VERSION };
            setScores(result);
            localStorage.setItem(`gitscan-${username}`, JSON.stringify(result));
            localStorage.removeItem(`gitscan-checks-${username}`);
            setAiLoading(false);
    
        } catch (err) {
            console.log(err);
            setAiError('Failed to generate analysis. Please try again.');
            setAiLoading(false);
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

            <ScoreCards categories={scores.categories} />

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