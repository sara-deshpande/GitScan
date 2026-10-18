const formatTimeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (24 * 60 * 60 * 1000));
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
};

const describeReadme = (repo) => {
    if (!repo.readme.hasReadme) return 'No README';
    const hasDemo = repo.liveDemoUrl || repo.readme.hasLiveDemoLink;
    return [
        'README',
        repo.readme.hasImagesOrScreenshots ? 'screenshots' : 'no screenshots',
        repo.readme.hasSetupInstructions ? 'setup steps' : 'no setup steps',
        hasDemo ? 'live demo' : 'no live demo'
    ].join(', ');
};

const documentationEvidence = (profile) => {
    const checked = profile.repos.filter(repo => repo.readme !== 'not checked');
    const withReadme = checked.filter(repo => repo.readme.hasReadme);
    const withScreenshots = withReadme.filter(repo => repo.readme.hasImagesOrScreenshots);

    return {
        stats: [
            { label: 'READMEs', value: `${withReadme.length} of ${checked.length}` },
            { label: 'With screenshots', value: String(withScreenshots.length) },
            { label: 'Profile README', value: profile.hasProfileReadme ? 'Yes' : 'No' }
        ],
        rows: checked.map(repo => ({ name: repo.name, detail: describeReadme(repo) }))
    };
};

const varietyEvidence = (profile) => {
    const realRepos = profile.repos.filter(repo => !repo.isEmpty);
    const byLanguage = {};
    realRepos.forEach(repo => {
        const language = repo.language || 'Other';
        byLanguage[language] = byLanguage[language] || [];
        byLanguage[language].push(repo.name);
    });
    const languages = Object.entries(byLanguage).sort((a, b) => b[1].length - a[1].length);

    return {
        stats: [
            { label: 'Original projects', value: String(realRepos.length) },
            { label: 'Languages', value: String(languages.filter(([language]) => language !== 'Other').length) },
            { label: 'Forks skipped', value: String(profile.forkCount || 0) }
        ],
        rows: languages.map(([language, names]) => ({
            name: language,
            detail: names.join(', ')
        }))
    };
};

const activityEvidence = (profile) => {
    const contributions = profile.contributions;
    const age = profile.accountAgeYears < 1
        ? `${Math.max(1, Math.round(profile.accountAgeYears * 12))} months`
        : `${profile.accountAgeYears} years`;

    return {
        stats: [
            { label: 'Contributions this year', value: contributions ? String(contributions.totalContributionsLastYear) : 'Not available' },
            { label: 'Commits this year', value: contributions ? String(contributions.commitsLastYear) : 'Not available' },
            { label: 'On GitHub', value: age }
        ],
        rows: profile.repos.slice(0, 5).map(repo => ({
            name: repo.name,
            detail: `Last pushed ${formatTimeAgo(repo.lastPushed)}`
        }))
    };
};

const roleEvidence = (profile, relevantRepoNames) => {
    const wanted = (relevantRepoNames || []).map(name => String(name).toLowerCase());
    const relevant = profile.repos.filter(repo => wanted.includes(repo.name.toLowerCase()));

    return {
        stats: [
            { label: 'Relevant repos', value: `${relevant.length} of ${profile.repos.length}` }
        ],
        rows: relevant.map(repo => ({
            name: repo.name,
            detail: repo.description || repo.language || 'No description'
        }))
    };
};

export const buildEvidence = (profile, relevantRepoNames) => ({
    'Documentation Quality': documentationEvidence(profile),
    'Project Variety': varietyEvidence(profile),
    'Activity and Consistency': activityEvidence(profile),
    'Role Relevance': roleEvidence(profile, relevantRepoNames)
});