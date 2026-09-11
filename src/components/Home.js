import './Home.css';
import { useState, useEffect } from 'react';
import RepoLists from './RepoLists';

const Home = () => {

    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);  
    const [repos, setRepos] = useState([]);  
    const [error, setError] = useState('');                

    const handleClick = () => {
        if (!username) {
            setError('Please enter a username');
            return;
        }
        if (!role) {
            setError('Please select a job role');
            return;
        }

        setIsLoading(true);
        setError('');

        Promise.all([
            fetch(`https://api.github.com/users/${username}`).then(res => res.json()), //endpoints
            fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json())  //endpoints
        ])
        .then(([userData, reposData]) => {

            if (userData.message === 'Not Found') {
                setError('GitHub user not found. Check the username and try again');
                setIsLoading(false);
                return;
            }
            setProfileData(userData);
            setRepos(reposData);
            setIsLoading(false);
        });
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
                </select>
                <button onClick={handleClick}>Scan Profile</button>
                {isLoading && <p>Scanning profile...</p>}
                {error && <p className="error-message">{error}</p>}
            </div>

            {profileData && (
                <div className="profile-preview">
                    <img src={profileData.avatar_url} alt="avatar" width="60" />
                    <h3>{profileData.name}</h3>
                    <p>@{profileData.login}</p>
                    <p>Public repos: {profileData.public_repos}</p>
                    <p>Followers: {profileData.followers}</p>
                </div>
            )}

            {repos.length > 0 && (
                <RepoLists repos={repos} title="Public Repositories" />
            )}
        </div>
    );
}

export default Home;