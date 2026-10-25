import './Home.css';
import { useState, useEffect, Fragment } from 'react';
import {useNavigate} from "react-router-dom";
import { Reveal, RevealItem } from './Reveal';
import { motion, MotionConfig } from 'framer-motion';

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

const WHAT_WE_CHECK = [
    { name: 'Documentation', weight: 20, text: 'READMEs, screenshots, setup steps and live demos', color: '#0D1E3B', textColor: '#F5F0E8' },
    { name: 'Project variety', weight: 25, text: "Range and depth of what you've built", color: '#1a3a5c', textColor: '#F5F0E8' },
    { name: 'Activity', weight: 25, text: 'Contributions and how recent your work is', color: '#7eb8f7', textColor: '#0D1E3B' },
    { name: 'Role relevance', weight: 30, text: 'How well your projects match the role', color: '#F5F0E8', textColor: '#0D1E3B' }
];

const PIPELINE = [
    { type: 'Source', title: 'GitHub API', text: 'Profile, repos, READMEs and a year of contributions' },
    { type: 'Code', title: 'Fact check', text: 'Counts READMEs, commits and languages, and sets your level' },
    { type: 'AI', title: 'LLM review', text: 'Writes the verdicts, strengths, gaps and action plan', isAi: true },
    { type: 'Code', title: 'Guardrails', text: 'Checks the scores, calculates the overall and drops made-up repos' },
    { type: 'Code', title: '24h cache', text: 'Repeat scans load instantly and cost nothing' }
];

const TECH_STACK = ['React', 'Express', 'GitHub REST + GraphQL', 'OpenAI API', 'Railway + Vercel'];

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
        <MotionConfig reducedMotion="user">
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
                <Reveal className="wyg">
                    <RevealItem className="wyg-intro">
                        <span className="wyg-kicker">What you get</span>
                        <h2>Three things,<br />in one scan.</h2>
                        <p>Everything a recruiter notices in the first minute, and what to do about it.</p>
                    </RevealItem>

                    <div className="wyg-rows">
                        {WHAT_YOU_GET.map((item) => (
                            <RevealItem className="wyg-row" key={item.num}>
                                <span className="wyg-num">[{item.num}]</span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                                <span className="wyg-arrow" aria-hidden="true">→</span>
                            </RevealItem>
                        ))}
                    </div>
                </Reveal>
            </section>
            <Reveal as="section" className="hiw-section">
                <RevealItem className="hiw-head">
                    <div>
                        <span className="hiw-kicker">How it works</span>
                        <h2>From username to plan <br />in about 15 seconds.</h2>
                    </div>
                    <p>No sign-up needed. GitScan only reads what's already public on your GitHub.</p>
                </RevealItem>

                <div className="hiw-timeline">
                    <div className="hiw-track">
                        <motion.div className="hiw-track-fill"></motion.div>
                    </div>

                    {HOW_IT_WORKS.map((step, index) => (
                        <RevealItem className="hiw-step" key={step.title}>
                            <motion.span className="hiw-dot">{index + 1}</motion.span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                            {step.tags.length > 0 && (
                                <div className="hiw-tags">
                                    {step.tags.map(tag => (
                                        <span className="hiw-tag" key={tag}>{tag}</span>
                                    ))}
                                </div>
                            )}
                        </RevealItem>
                    ))}
                </div>
            </Reveal>
            <Reveal className="wwc-section">
                <div className="wwc">
                    <RevealItem className="wwc-head">
                        <div>
                            <span className="wwc-kicker">What we check</span>
                            <h2>Four categories, weighted like a recruiter would.</h2>
                        </div>
                        <p>Role relevance counts the most, because it's the first thing a hiring manager looks for. The overall score is calculated in code, not guessed by the AI.</p>
                    </RevealItem>

                    <RevealItem className="wwc-bar">
                        {WHAT_WE_CHECK.map(item => (
                            <motion.div
                                className="wwc-segment"
                                key={item.name}
                                style={{ background: item.color, color: item.textColor }}
                            >
                                {item.weight}%
                            </motion.div>
                        ))}
                    </RevealItem>

                    <div className="wwc-legend">
                        {WHAT_WE_CHECK.map((item, index) => (
                            <RevealItem className="wwc-item" key={item.name}>
                                <h3>
                                    <span className="wwc-swatch" style={{ background: item.color }}></span>
                                    {item.name}
                                </h3>
                                <p>{item.text}</p>
                            </RevealItem>
                        ))}
                    </div>
                </div>
            </Reveal>
            <section className="bts-section">
                <Reveal className="bts">
                    <RevealItem className="bts-head">
                        <div>
                            <span className="bts-kicker">Behind the score</span>
                            <h2>Facts in code.<br />Judgment from AI.</h2>
                        </div>
                        <p>The AI never invents numbers. Code gathers the facts and checks the AI's answer, so every score can be traced back to real evidence.</p>
                    </RevealItem>

                    <div className="bts-pipeline">
                        {PIPELINE.map((step, index) => (
                            <Fragment key={step.title}>
                                <RevealItem className={`bts-node ${step.isAi ? 'is-ai' : ''}`}>
                                    <span className="bts-node-type">{step.type}</span>
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </RevealItem>
                                {index < PIPELINE.length - 1 && (
                                    <RevealItem className="bts-arrow">
                                        <motion.span className="bts-pulse" ></motion.span>
                                    </RevealItem>
                                )}
                            </Fragment>
                        ))}
                    </div>

                    <div className="bts-tags">
                        {TECH_STACK.map(tech => (
                            <span className="bts-tag" key={tech}>{tech}</span>
                        ))}
                    </div>
                </Reveal>
            </section>
        </div>
        </MotionConfig>
    );
}

export default Home;