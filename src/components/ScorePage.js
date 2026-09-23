import './ScorePage.css';
import {useParams, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import useGitHub from '../hooks/useGitHub'; 

const ScorePage = () => {

    const {username} = useParams();
    const location = useLocation();
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

        

    }

    return (  
        <div className="score-page">
            <h2>AI Analysis </h2>
            <p>AI scores and feedback will show here</p>
        </div>
    );
}
 
export default ScorePage;