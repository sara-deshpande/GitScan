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
            <div className="ticker">
                <span>
                    &nbsp;&nbsp;&nbsp;● AI ANALYSIS &nbsp;&nbsp;&nbsp;● RECRUITER PERSPECTIVE &nbsp;&nbsp;&nbsp;● GITHUB PROFILE SCORING &nbsp;&nbsp;&nbsp;● ACTION PLAN &nbsp;&nbsp;&nbsp;● AI ANALYSIS &nbsp;&nbsp;&nbsp;● RECRUITER PERSPECTIVE &nbsp;&nbsp;&nbsp;
                </span>
            </div>
    
            <div className="home">
                <div className="home-left">
                    <h2>Know what <br /> recruiters <br /> <em>actually</em> see.</h2>
                    <p>GitScan gives you a tailored analysis of your GitHub Profile. Scored, Critiqued, and Optimised for the role you want.</p>
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
                    <button onClick={handleClick}>Scan my profile →</button>
                </div>
            </div>
    
            <div className="what-you-get">
                <div className="divider-line"></div>
                <div className="divider-text">What you get</div>
                <div className="divider-line"></div>
            </div>
    
            <div className="features-row">
                <div className="feat-card navy">
                    <div className="feat-num">01</div>
                    <div className="feat-title">Your Score</div>
                    <div className="feat-desc">A real recruiter-perspective score tailored to your dream role</div>
                </div>
                <div className="feat-card blue">
                    <div className="feat-num">02</div>
                    <div className="feat-title">Honest Feedback</div>
                    <div className="feat-desc">Specific, no-fluff feedback on exactly what's holding you back</div>
                </div>
                <div className="feat-card white">
                    <div className="feat-num">03</div>
                    <div className="feat-title">Your Action Plan</div>
                    <div className="feat-desc">A personalised checklist to level up your profile</div>
                </div>
            </div>
        </div>
    );
}

export default Home;