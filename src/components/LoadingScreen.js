import './LoadingScreen.css';
import { useState, useEffect } from 'react';

const STEPS = [
    'Reading your repos',
    'Checking READMEs and activity',
    'Writing your analysis',
    'Building your action plan'
];

const STEP_TIMES = [2500, 6000, 10500];

const GRID_COLUMNS = 18;
const GRID_ROWS = 9;

const LoadingScreen = ({ username }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = STEP_TIMES.map((time, index) =>
            setTimeout(() => setStep(index + 1), time)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    const cells = Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, i) => {
        const column = i % GRID_COLUMNS;
        const row = Math.floor(i / GRID_COLUMNS);
        return (
            <span
                key={i}
                className="loading-cell"
                style={{ '--delay': `${(column + row) * 0.08}s` }}
            ></span>
        );
    });

    return (
        <div className="loading-page">
            <div className="loading-card" role="status" aria-live="polite">
                <div>
                    <span className="loading-kicker">Scanning @{username}</span>
                    <h2>Reading your GitHub<br />like a recruiter would.</h2>
                    <ul className="loading-steps">
                        {STEPS.map((label, index) => {
                            const state = index < step ? 'done' : index === step ? 'active' : 'todo';
                            return (
                                <li className={`loading-step is-${state}`} key={label}>
                                    <span className="loading-icon" aria-hidden="true">
                                        {state === 'done' ? '✓' : ''}
                                    </span>
                                    {label}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <div className="loading-grid" aria-hidden="true">{cells}</div>
                    <p className="loading-note">This usually takes 10 to 15 seconds</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;