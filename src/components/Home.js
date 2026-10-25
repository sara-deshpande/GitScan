import './Home.css';
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const EXAMPLES = [
    { username: 'torvalds', role: 'Software Engineer' },
    { username: 'gaearon', role: 'Frontend Engineer' },
    { username: 'karpathy', role: 'AI Engineer' }
];

const WHAT_YOU_GET = [
    { num: '01', title: 'Your score', text: 'A recruiter-style score out of 10 for the role you want' },
    { num: '02', title: 'Honest feedback', text: "What's working, what's missing, and the evidence behind it" },
    { num: '03', title: 'Your action plan', text: 'A checklist of fixes, most important first' }
];

const HOW_IT_WORKS = [
    { title: 'Enter a username', text: "Pick the role you're applying for, from Frontend to AI Engineer.", tags: [] },
    { title: 'GitScan reads your GitHub', text: 'Your repos, READMEs and a year of contributions, the way a recruiter skims them.', tags: ['Repos', 'READMEs', 'Contributions'] },
    { title: 'Get your score and plan', text: 'Four category scores with evidence, plus a prioritized checklist of fixes.', tags: ['Score', 'Evidence', 'Action plan'] }
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
            <section className="hiw-section">
                <div className="hiw-head">
                    <div>
                        <span className="hiw-kicker">How it works</span>
                        <h2>From username to plan <br />in about 15 seconds.</h2>
                    </div>
                    <p>No sign-up needed. GitScan only reads what's already public on your GitHub.</p>
                </div>

                <div className="hiw-timeline">
                    <div className="hiw-track">
                        <div className="hiw-track-fill"></div>
                    </div>

                    {HOW_IT_WORKS.map((step, index) => (
                        <div className="hiw-step" key={step.title}>
                            <span className="hiw-dot">{index + 1}</span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                            {step.tags.length > 0 && (
                                <div className="hiw-tags">
                                    {step.tags.map(tag => (
                                        <span className="hiw-tag" key={tag}>{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <section className="wwc-section">
                <div className="wwc">
                    <div className="wwc-head">
                        <div>
                            <span className="wwc-kicker">What we check</span>
                            <h2>Four categories, weighted like a recruiter would.</h2>
                        </div>
                        <p>Role relevance counts the most, because it's the first thing a hiring manager looks for. The overall score is calculated in code, not guessed by the AI.</p>
                    </div>

                    <div className="wwc-bar">
                        {WHAT_WE_CHECK.map(item => (
                            <div
                                className="wwc-segment"
                                key={item.name}
                                style={{ background: item.color, color: item.textColor }}
                            >
                                {item.weight}%
                            </div>
                        ))}
                    </div>

                    <div className="wwc-legend">
                        {WHAT_WE_CHECK.map(item => (
                            <div className="wwc-item" key={item.name}>
                                <h3>
                                    <span className="wwc-swatch" style={{ background: item.color }}></span>
                                    {item.name}
                                </h3>
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;