const GITHUB_API = 'https://api.github.com';

const githubHeaders = () => ({
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'GitScan'
});

const getJson = async (url) => {
    const res = await fetch(url, { headers: githubHeaders() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub request failed (${res.status}): ${url}`);
    return res.json();
};

const getReadme = async (owner, repo) => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
        headers: { ...githubHeaders(), 'Accept': 'application/vnd.github.raw' }
    });
    if (!res.ok) return null;
    return res.text();
};

const summarizeReadme = (text) => {
    if (!text) return { hasReadme: false };
    return {
        hasReadme: true,
        lengthInCharacters: text.length,
        hasImagesOrScreenshots: /!\[[^\]]*\]\([^)]+\)|<img\s/i.test(text),
        hasSetupInstructions: /(npm install|npm start|pip install|yarn|getting started|installation|how to run|setup)/i.test(text),
        hasLiveDemoLink: /https?:\/\/[^\s)]+\.(vercel\.app|netlify\.app|github\.io|herokuapp\.com|onrender\.com|railway\.app)/i.test(text),
        numberOfSections: (text.match(/^#{1,3}\s/gm) || []).length,
        excerpt: text.slice(0, 1500)
    };
};

const getContributions = async (username) => {
    const query = `
        query($login: String!) {
            user(login: $login) {
                contributionsCollection {
                    totalCommitContributions
                    restrictedContributionsCount
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }
    `;

    const res = await fetch(`${GITHUB_API}/graphql`, {
        method: 'POST',
        headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { login: username } })
    });
    if (!res.ok) return null;

    const json = await res.json();
    const collection = json.data?.user?.contributionsCollection;
    if (!collection) return null;

    return {
        totalContributionsLastYear: collection.contributionCalendar.totalContributions,
        commitsLastYear: collection.totalCommitContributions,
        privateContributionsLastYear: collection.restrictedContributionsCount
    };
};

export const getProfileData = async (username) => {
    const user = await getJson(`${GITHUB_API}/users/${username}`);
    if (!user) return null;

    const allRepos = (await getJson(
        `${GITHUB_API}/users/${username}/repos?per_page=100&sort=pushed`
    )) || [];

    const ownRepos = allRepos.filter(repo =>
        !repo.fork && repo.name.toLowerCase() !== username.toLowerCase()
    );
    const forkCount = allRepos.filter(repo => repo.fork).length;

    const reposToRead = ownRepos.slice(0, 8);

    const [readmes, profileReadme, contributions] = await Promise.all([
        Promise.all(reposToRead.map(repo => getReadme(username, repo.name))),
        getReadme(username, username),
        getContributions(username)
    ]);

    const accountAgeYears = Number(
        ((Date.now() - new Date(user.created_at)) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1)
    );

    return {
        username: user.login,
        name: user.name,
        bio: user.bio,
        company: user.company,
        location: user.location,
        website: user.blog || null,
        followers: user.followers,
        publicRepos: user.public_repos,
        accountCreated: user.created_at.slice(0, 10),
        accountAgeYears,
        hasProfileReadme: Boolean(profileReadme),
        profileReadmeExcerpt: profileReadme ? profileReadme.slice(0, 800) : null,
        forkCount,
        contributions,
        repos: ownRepos.slice(0, 15).map((repo, index) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            topics: repo.topics,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            liveDemoUrl: repo.homepage || null,
            createdAt: repo.created_at.slice(0, 10),
            lastPushed: repo.pushed_at.slice(0, 10),
            isEmpty: repo.size === 0,
            readme: index < reposToRead.length ? summarizeReadme(readmes[index]) : 'not checked'
        }))
    };
};