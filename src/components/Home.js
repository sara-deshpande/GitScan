import './Home.css';
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [formError, setFormError] = useState('');  

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
        navigate(`/profile/${username}?role=${encodeURIComponent(role)}`);
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
                {formError && <p className="error-message">{formError}</p>}
            </div>
        </div>
    );
}

export default Home;