import './RepoLists.css';

const RepoLists = () => {
    const repos = [
        { id: 1, name: 'GitScan', language: 'JavaScript', description: 'GitHub profile analyzer', stars: 4 },
        { id: 2, name: 'AI-Travel-Planner', language: 'Java', description: 'AI powered itinerary generator', stars: 12 },
        { id: 3, name: 'Shortest-Path-Visualizer', language: 'JavaScript', description: 'Graph algorithm visualizer', stars: 7 },
        { id: 4, name: 'Inventory-System', language: 'Java', description: 'Apparel store inventory manager', stars: 2 },
      ];
      
      return (
        <div className='repo-list'>
            <h3>Public Repositories</h3>
            {repos.map((repo) => (
                <div className="repo-card" key={repo.id}>
                    <h2>{repo.name}</h2>
                    <p>{repo.description}</p>
                    <div className="repo-meta">
                        <span className="repo-language"> {repo.language}</span>
                        <span className="repo-stars"> {repo.stars} </span>
                    </div>
                </div>
            ) )}
            </div>
      );
}

export default RepoLists;