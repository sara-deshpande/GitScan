import './RepoLists.css';

const RepoLists = ({repos = [] }) => {
      
      return (
        <div className='repo-list'>
            <h3>Public Repositories</h3>
            {repos.map((repo) => (
                <div className="repo-card" key={repo.id}>
                    <h4>{repo.name}</h4>
                    <p>{repo.description}</p>
                    <div className="repo-meta">
                        <span className="repo-language"> {repo.language}</span>
                        <span className="repo-stars">⭐️ {repo.stars} </span>
                    </div>
                </div>
            ) )}
            </div>
      );
}

export default RepoLists;