import './ProfilePage.css';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {useEffect} from 'react';
import useGitHub from '../hooks/useGitHub';
import RepoLists from './RepoLists';

const LANGUAGE_PALETTE = ['#378ADD', '#7eb8f7', '#567C8D', '#C5A28C', '#0D1E3B', '#C8D9E6'];

const ProfilePage = () => {

    const { username }= useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const role = new URLSearchParams(location.search).get('role');
    const {profileData, repos, isLoading, error, fetchGitHubData} = useGitHub();

    useEffect (() => {
        if (username ) {
            fetchGitHubData(username);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    useEffect(() => {
        document.title = `GitScan | @${username} profile`;
    }, [username]);

    if (isLoading) {
        return(
            <div className="skeleton-page skeleton-pulse">
                <div className="skeleton-hero">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-lines">
                        <div className="skeleton-line short"></div>
                        <div className="skeleton-line mid"></div>
                        <div className="skeleton-line long"></div>
                    </div>
                </div>
                <div className="skeleton-grid">
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                </div>
            </div>
        );
    }

    if (error){
        return(
            <div className="profile-error">
                <p>{error}</p>
            </div>
        );
    }

    if(!profileData){
        return null;
    }

    const handleAnalyze = () => {
        navigate(`/results/${username}${location.search}`);
    }

    const repoList = Array.isArray(repos) ? repos : [];

    const totalStars = repoList.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const joined = new Date(profileData.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    const languageCounts = repoList.reduce((counts, repo) => {
        const language = repo.language || 'Other';
        counts[language] = (counts[language] || 0) + 1;
        return counts;
    }, {});

    const languages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

    const languageColors = {};
    languages.forEach(([language], index) => {
        languageColors[language] = LANGUAGE_PALETTE[index % LANGUAGE_PALETTE.length];
    });

    return (
        <div className="profile-page">

            <section className="profile-hero">
                <div className="profile-top">
                    <img
                        src={profileData.avatar_url}
                        alt={`${profileData.login} avatar`}
                        className="profile-avatar"
                    />
                    <div className="profile-info">
                        {role && <span className="profile-role">Scanning for {role}</span>}
                        <h2>{profileData.name || profileData.login}</h2>
                        <p className="profile-username">
                            @{profileData.login}
                            {profileData.location && <span> · {profileData.location}</span>}
                        </p>
                        {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
                    </div>
                    <a
                        className="profile-github-link"
                        href={profileData.html_url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View on GitHub
                    </a>
                </div>

                <div className="profile-stats">
                    <div className="stat">
                        <span className="stat-number">{profileData.public_repos}</span>
                        <span className="stat-label">Repositories</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{totalStars}</span>
                        <span className="stat-label">Stars earned</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{profileData.followers}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{joined}</span>
                        <span className="stat-label">Joined</span>
                    </div>
                </div>
            </section>

            {languages.length > 0 && (
                <section className="profile-languages">
                    <div className="section-head">
                        <h3>Languages</h3>
                        <span>Across {repoList.length} repos</span>
                    </div>
                    <div className="lang-bar">
                        {languages.map(([language, count]) => (
                            <div
                                key={language}
                                className="lang-segment"
                                style={{
                                    width: `${(count / repoList.length) * 100}%`,
                                    background: languageColors[language]
                                }}
                                title={`${language}: ${count}`}
                            ></div>
                        ))}
                    </div>
                    <ul className="lang-legend">
                        {languages.map(([language, count]) => (
                            <li key={language}>
                                <span
                                    className="lang-dot"
                                    style={{ background: languageColors[language] }}
                                ></span>
                                {language}
                                <span className="lang-count">
                                    {Math.round((count / repoList.length) * 100)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {repoList.length > 0 && (
                <RepoLists
                    repos={repoList}
                    title="Public repositories"
                    languageColors={languageColors}
                />
            )}

            <button className="analyze-btn" onClick={handleAnalyze}>
                View AI analysis
            </button>

        </div>
    );
}
 
export default ProfilePage;