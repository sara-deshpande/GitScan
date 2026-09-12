import './Home.css';
import { useState, useEffect } from 'react';
import RepoLists from './RepoLists';
import useGitHub from '../hooks/useGitHub';

const Home = () => {

    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [formError, setFormError] = useState('');
    const {profileData, repos, isLoading, error, fetchGitHubData} = useGitHub();         

    const handleClick = () => {
        if (!username) {
            setFormError('Please enter a username');
            return;
        }
        if (!role) {
            setFormError('Please select a job role');
            return;
        }

        setFormError('');
        fetchGitHubData(username);
    }

    useEffect(() => {
        document.title = username ? `GitScan — ${username}` : 'GitScan';

        return () => {
            document.title = 'GitScan';
        };
    }, [username]);

    return (
        <div className="home">
            <h2>Analyze your Github profile</h2>
            <p>Get recruiter perspective feedback based on your target roles</p>
            <div className="home-card">
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="" disabled>Select Job Role</option>
                    <option>Frontend Engineer</option>
                    <option>Backend Engineer</option>
                    <option>Full-Stack Engineer</option>
                    <option>ML Engineer</option>
                    <option>DevOps Engineer</option>
                    <option>Software Engineer</option>
                    <option>Data Analyst</option>
                    <option>Data Scientist</option>
                    <option> Application Developer</option>
                    <option>Software Developer</option>
                    <option>Mobile Application Developer</option>
                    <option>AI Engineer</option>

                </select>
                <button onClick={handleClick}>Scan Profile</button>
                {error && <p className="error-message">{error}</p>}
                {formError && <p className="error-message">{formError}</p>}
            </div>

            {isLoading && <div className="loading">
                <p>Scanning Profile....</p>
            </div> }

            {!isLoading && profileData && (
                <div className="profile-preview">
                    <img src={profileData.avatar_url} alt="avatar" width="60" />
                    <h3>{profileData.name}</h3>
                    <p>@{profileData.login}</p>
                    <p>Public repos: {profileData.public_repos}</p>
                    <p>Followers: {profileData.followers}</p>
                </div>
            )}

            {!isLoading && repos.length > 0 && (
                <RepoLists repos={repos} title="Public Repositories" />
            )}
        </div>
    );
}

export default Home;