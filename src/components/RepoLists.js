import './RepoLists.css';

const timeAgo = (dateString) => {
    const days = Math.floor((Date.now() - new Date(dateString)) / 86400000);
    if (days < 1) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
};

const RepoLists = ({ repos = [], title, languageColors = {} }) => {

    return (
        <section className="repo-list">
            <div className="repo-list-head">
                <h3>{title}</h3>
                <span>{repos.length}</span>
            </div>

            <div className="repo-grid">
                {repos.map((repo, index) => (
                    <a
                        className="repo-card"
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="repo-num">[{String(index + 1).padStart(2, '0')}]</span>
                        <h4>{repo.name}</h4>
                        {repo.description
                            ? <p>{repo.description}</p>
                            : <p className="repo-no-desc">No description yet</p>
                        }
                        <div className="repo-meta">
                            <span className="repo-language">
                                <span
                                    className="lang-dot"
                                    style={{ background: languageColors[repo.language || 'Other'] || '#7eb8f7' }}
                                ></span>
                                {repo.language || 'Other'}
                            </span>
                            <span>{repo.stargazers_count} {repo.stargazers_count === 1 ? 'star' : 'stars'}</span>
                            <span>Updated {timeAgo(repo.pushed_at)}</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default RepoLists;