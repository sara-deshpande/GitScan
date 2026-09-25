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

    const handleClick =(index) => {
        const updated = {
            ...checkedItems,
            [index]: !checkedItems[index]
        };
        setCheckedItems(updated);
        localStorage.setItem(`gitscan-checks-${username}`,JSON.stringify(updated));
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = actionItems.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if(!loaded) {
        return (
            <div className="loading">
                <p>Loading your action plan...</p>
            </div>
        );
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
            <div className="action-header">
                <h2>Action Plan for <span>@{username}</span></h2>
                <p>Targeted for : <strong>{role}</strong></p>
            </div>

            <div className="progress-section">
                <div className="progress-labels">
                    <span>{completedCount} of {totalCount} completed</span>
                    <span>{progressPercent}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div 
                        className="progress-bar-fill"
                        style={{width : `${progressPercent}%`}}
                        ></div>
                </div>
            </div>

            <div className="action-list">
                {actionItems.map((item, index) => (
                    <div 
                        className={`action-item ${checkedItems[index] ? 'completed' : ''}`}
                        key={index}
                        onClick ={() => handleClick(index)}
                        >
                            <div className={`action-checkbox ${checkedItems[index] ? 'checked' : ''}`}>
                            {checkedItems[index] && <span>✓</span>}
                        </div>
                        <p className="action-text">{item}</p>
                        </div>
                ))}
            </div>

            {completedCount === totalCount && totalCount > 0 && (
                <div className="action-complete">
                    <h3>🎉 All done!</h3>
                    <p>You've completed all your action items. Run a new analysis to see if your score improved.</p>
                    <button onClick={() => navigate('/')}>Analyze again</button>
                </div>
            )}

            <button 
                className="back-btn"
                onClick={() => navigate(`/results/${username}${location.search}`)}
            >
                ← Back to Analysis
            </button>

        </div>
     );
}
 
export default ActionPage;