import './Home.css';
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [formError, setFormError] = useState('');  

    const handleClick = (e) => {
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
        document.title = username ? `GitScan | ${username}` : 'GitScan';

        return () => {
            document.title = 'GitScan';
        };
    }, [username]);

    return (
        <div>
            <div className="home">
                <div className="home-left">
                    <h2>Know what <br /> recruiters <br /> <em>actually</em> see.</h2>
                    <p>Enter your GitHub username and the role you want. GitScan scores your profile, shows what's weak and tells you what to fix first.</p>
                </div>
    
                <div className="home-card">
                    <label>GITHUB USERNAME</label>
                    <input
                        type="text"
                        placeholder="Enter your GitHub username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>TARGET ROLE</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled>Select a role</option>
                        <option>Frontend Engineer</option>
                        <option>Backend Engineer</option>
                        <option>Full-Stack Engineer</option>
                        <option>ML Engineer</option>
                        <option>DevOps Engineer</option>
                        <option>Software Engineer</option>
                        <option>Data Analyst</option>
                        <option>Data Scientist</option>
                        <option>Application Developer</option>
                        <option>Software Developer</option>
                        <option>Mobile Application Developer</option>
                        <option>AI Engineer</option>
                    </select>
                    {formError && <p className="error-message">{formError}</p>}
                    <button onClick={handleClick}>Scan my profile </button>
                </div>
            </div>
    
            <section className="steps">
                <div className="steps-header">
                    <h3>What you get</h3>
                    <p>Pick the role you want. GitScan reads your public profile the way a recruiter skims it.</p>
                </div>

                <div className="step-row row 1">
                    <span className="step-num">[01]</span>
                    <h4>Your score</h4>
                    <p>A score out of 10 for the role you picked, broken into four categories.</p>
                </div>

                <div className="step-row row-2">
                    <span className="step-num">[02]</span>
                    <h4>What's holding you back</h4>
                    <p>Specific feedback on your repos, descriptions and activity.</p>
                </div>

                <div className="step-row row-3">
                    <span className="step-num">[03]</span>
                    <h4>What to fix first</h4>
                    <p>A checklist you can tick off as you improve your profile.</p>
                </div>
            </section>
        </div>
    );
}

export default Home;