import './RepoLists.css';

const RepoLists = ({repos = [], title }) => {
      
      return (
        <div className='repo-list'>
            <h3>{title}</h3>
            {repos.map((repo) => (
                <div className="repo-card" key={repo.id}>
                    <h4>{repo.name}</h4>
                    <p>{repo.description || 'No description'}</p>
                    <div className="repo-meta">
                        <span className="repo-language"> {repo.language || 'Unknown'}</span>
                        <span className="repo-stars">⭐️ {repo.stargazers_count} </span>
                    </div>
                </div>
            ) )}
            </div>
      );
}

export default RepoLists;