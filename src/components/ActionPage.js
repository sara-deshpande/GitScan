import './ActionPage.css';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

const ActionPage = () => {

    const {username} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const role = new URLSearchParams(location.search).get('role');

    const [actionItems, setActionItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState ([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(`gitscan-${username}`);
        if(saved) {
            const parsed = JSON.parse(saved);
            if (parsed.actionItems) {
                setActionItems(parsed.actionItems);
            }
        }

        const savedChecks = localStorage.getItem(`gitscan-checks-${username}`);
        if(savedChecks) {
            setCheckedItems(JSON.parse(savedChecks));
        }

        setLoaded(true);
    }, [username]);

    useEffect(() => {
        document.title = `GitScan | @${username} action plan`;
    }, [username]);

    const handleClick =(index) => {
        const updated = {
            ...checkedItems,
            [index]: !checkedItems[index]
        };
        setCheckedItems(updated);
        localStorage.setItem(`gitscan-checks-${username}`,JSON.stringify(updated));
    };

    const handleRerun = () => {
        localStorage.removeItem(`gitscan-${username}`);
        localStorage.removeItem(`gitscan-checks-${username}`);
        navigate(`/results/${username}${location.search}`);
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = actionItems.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if(!loaded) {
        return null;
    }

    if(actionItems.length === 0) {
        return(
            <div className="action-empty">
                <h2>No action plan found</h2>
                <p>Run a profile analysis first to generate your action plan. </p>
                <button onClick ={() => navigate (`/`)}>Go back home</button>
            </div>
        );
    }

    return (
        <div className="action-page">

            <section className="action-hero">
                <span className="action-role">Action plan for {role}</span>
                <h2>What to fix on <span className="action-username">@{username}</span></h2>
                <div className="action-progress-labels">
                    <span>{completedCount} of {totalCount} done</span>
                    <span>{progressPercent}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </section>

            <div className="action-list">
                {actionItems.map((item, index) => (
                    <div
                        className={`action-item ${checkedItems[index] ? 'completed' : ''}`}
                        key={index}
                        onClick={() => handleClick(index)}
                    >
                        <div className={`action-checkbox ${checkedItems[index] ? 'checked' : ''}`}>
                            {checkedItems[index] && <span>✓</span>}
                        </div>
                        <div className="action-body">
                            <span className="action-num">[{String(index + 1).padStart(2, '0')}]</span>
                            <p className="action-text">{item}</p>
                        </div>
                    </div>
                ))}
            </div>

            {completedCount === totalCount && totalCount > 0 && (
                <div className="action-complete">
                    <h3>All done</h3>
                </div>
            )}

            <div className="action-nav">
                <button
                    className="back-btn"
                    onClick={() => navigate(`/results/${username}${location.search}`)}
                >
                    ← Back to Analysis
                </button>
                <button
                    className="back-btn"
                    onClick={handleRerun}
                >
                    Run a fresh analysis
                </button>
                <button
                    className="back-btn"
                    onClick={() => navigate('/')}
                >
                    Scan another profile
                </button>
            </div>

        </div>
    );
}
 
export default ActionPage;