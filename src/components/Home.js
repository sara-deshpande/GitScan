import './Home.css';
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const EXAMPLES = [
    { username: 'torvalds', role: 'Software Engineer' },
    { username: 'gaearon', role: 'Frontend Engineer' },
    { username: 'karpathy', role: 'AI Engineer' }
];

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

    const handleExample = (example) => {
        navigate(`/profile/${example.username}?role=${encodeURIComponent(example.role)}`);
    };

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
                    <div className="examples">
                        <p className="examples-label">Or try an example</p>
                        <div className="examples-list">
                            {EXAMPLES.map(example => (
                                <button
                                    key={example.username}
                                    type="button"
                                    className="example-chip"
                                    onClick={() => handleExample(example)}
                                >
                                    <span className="example-name">@{example.username}</span>
                                    <span className="example-role">{example.role}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
    
            <section className="wyg-section">
                <div className="wyg">
                    <div className="wyg-intro">
                        <span className="wyg-kicker">What you get</span>
                        <h2>Three things,<br />in one scan.</h2>
                        <p>Everything a recruiter notices in the first minute, and what to do about it.</p>
                    </div>

                    <div className="wyg-rows">
                        {WHAT_YOU_GET.map((item) => (
                            <div className="wyg-row" key={item.num}>
                                <span className="wyg-num">[{item.num}]</span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;