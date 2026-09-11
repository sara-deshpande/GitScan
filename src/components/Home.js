import './Home.css';
import { useState, useEffect } from 'react';
import RepoLists from './RepoLists';

const Home = () => {

    const repos = [
        { id: 1, name: 'GitScan', language: 'JavaScript', description: 'GitHub profile analyzer', stars: 4 },
        { id: 2, name: 'AI-Travel-Planner', language: 'Java', description: 'AI powered itinerary generator', stars: 12 },
        { id: 3, name: 'Shortest-Path-Visualizer', language: 'JavaScript', description: 'Graph algorithm visualizer', stars: 7 },
        { id: 4, name: 'Inventory-System', language: 'Java', description: 'Apparel store inventory manager', stars: 2 },
      ];

    const [ username, setUsername ] = useState ('');
    const [role, setRole ] = useState ('');
    const [isLoading, setIsLoading ] = useState (false);

    const handleClick = () => {
        if (!username) {
            console.log('Please enter a username');
            return;
        }
        if (!role) {
            console.log('Please select a job role');
            return;
        }
        
        setIsLoading(true);
        console.log ('Scanning:', username, role);
    }

// foundation for github Api call, fires onlywhen both inputs are ready
    useEffect(() => {
        if (!username || !role ) return;
        //real API call will go here
    }, [username, role] ); 

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
                <input type="text"
                placeholder="Enter GitHub username "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled>Select Job Role </option>
                         <option>Frontend Engineer</option>
                         <option>Backend Engineer</option>
                         <option>Full-Stack Engineer</option>
                         <option>ML Engineer</option>
                         <option>DevOps Engineer</option>
                         <option>Software Engineer</option>
                         <option>Data Analyst</option>
                         <option>Data Scientist</option>
                </select>
                <button onClick={handleClick}> Scan Profile </button>
                {isLoading && <p>Scanning profile...</p>}
            </div>
            <RepoLists repos={repos}/>
        </div>
     );
}

 
export default Home; 