import { mkdirSync, writeFileSync } from 'node:fs';

const API_URL = process.env.EVAL_API || 'http://localhost:5001/api/analyze';
const RUNS = 3;

const CASES = [
    { username: 'torvalds', role: 'Software Engineer', tier: 'elite', expected: [8, 10] },
    { username: 'torvalds', role: 'AI Engineer', tier: 'elite', expected: [6, 8] },
    { username: 'gaearon', role: 'Frontend Engineer', tier: 'elite', expected: [8, 10] },
    { username: 'karpathy', role: 'AI Engineer', tier: 'elite', expected: [8, 10] },
    { username: 'tj', role: 'Backend Engineer', tier: 'elite', expected: [8, 10] },
    { username: 'sara-deshpande', role: 'AI Engineer', tier: 'intermediate', expected: [5, 7] },
    { username: 'sara-deshpande', role: 'Full-Stack Engineer', tier: 'intermediate', expected: [5, 8] },
    { username: 'FRIEND_1', role: 'Software Engineer', tier: 'intermediate', expected: [5, 7] },
    { username: 'FRIEND_2', role: 'Software Engineer', tier: 'beginner', expected: [2, 5] },
    { username: 'octocat', role: 'Software Engineer', tier: 'beginner', expected: [1, 4] }
];

const WORD_LIMITS = {
    verdict: [4, 12],
    strength: [10, 30],
    gap: [18, 42],
    title: [3, 10],
    detail: [10, 36]
};

const ACTION_COUNTS = {
    beginner: [8, 12],
    intermediate: [7, 10],
    advanced: [5, 7]
};

const BANNED = /\b(consider|try to|make sure to|great job|keep up the good work|showcase your skills|demonstrate your skills|the candidate)\b/i;
const DASHES = /[\u2014\u2013]/;
const NEGATIVE = /\b(no|not|lacks?|lacking|missing|without|absent)\b/i;

const FEATURES = [
    { name: 'README', mention: /\breadmes?\b/i, has: (detail) => detail !== 'No README' },
    { name: 'screenshots', mention: /screenshot|images?\b|gif/i, has: (detail) => detail.includes('README, screenshots') },
    { name: 'setup steps', mention: /setup|install|how to run/i, has: (detail) => detail.includes(', setup steps') },
    { name: 'live demo', mention: /live demo|demo link/i, has: (detail) => detail.includes(', live demo') }
];

const countWords = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;

const average = (numbers) => numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

const runOnce = async ({ username, role }) => {
    const started = Date.now();
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return { data, seconds: (Date.now() - started) / 1000 };
};

const checkWords = (result) => {
    const problems = [];
    result.categories.forEach(category => {
        ['verdict', 'strength', 'gap'].forEach(field => {
            const words = countWords(category[field]);
            const [min, max] = WORD_LIMITS[field];
            if (words < min || words > max) problems.push(`${category.name} ${field}: ${words} words`);
        });
    });
    result.actionItems.forEach((item, index) => {
        ['title', 'detail'].forEach(field => {
            const words = countWords(item[field]);
            const [min, max] = WORD_LIMITS[field];
            if (words < min || words > max) problems.push(`Action ${index + 1} ${field}: ${words} words`);
        });
    });
    const [minItems, maxItems] = ACTION_COUNTS[result.level] || [0, 99];
    if (result.actionItems.length < minItems || result.actionItems.length > maxItems) {
        problems.push(`${result.actionItems.length} action items for ${result.level}`);
    }
    return problems;
};

const allText = (result) => [
    ...result.categories.flatMap(c => [c.verdict, c.strength, c.gap]),
    ...result.actionItems.flatMap(a => [a.title, a.detail])
];

const checkStyle = (result) => {
    const problems = [];
    allText(result).forEach(text => {
        const banned = String(text).match(BANNED);
        if (banned) problems.push(`Banned phrase "${banned[0]}": ${text}`);
        if (DASHES.test(text)) problems.push(`Dash: ${text}`);
    });
    return problems;
};

const checkContradictions = (result) => {
    const docs = result.categories.find(c => c.name === 'Documentation Quality');
    const rows = docs?.evidence?.rows || [];
    const flagged = [];

    result.categories.forEach(category => {
        ['strength', 'gap'].forEach(field => {
            const sentences = String(category[field]).split(/(?<=[.!?])\s+/);
            sentences.forEach(sentence => {
                rows.forEach(row => {
                    if (!sentence.toLowerCase().includes(row.name.toLowerCase())) return;
                    FEATURES.forEach(feature => {
                        if (!feature.mention.test(sentence)) return;
                        const saysHas = !NEGATIVE.test(sentence);
                        const reallyHas = feature.has(row.detail);
                        if (saysHas !== reallyHas) {
                            flagged.push(`${category.name} ${field} | ${row.name} | ${feature.name}: text says ${saysHas ? 'has' : 'lacks'}, evidence says "${row.detail}" | "${sentence}"`);
                        }
                    });
                });
            });
        });
    });
    return flagged;
};

const main = async () => {
    const cases = CASES.filter(c => !c.username.startsWith('FRIEND'));
    const report = [];

    for (const testCase of cases) {
        const label = `${testCase.username} (${testCase.role})`;
        const runs = [];
        for (let i = 1; i <= RUNS; i++) {
            process.stdout.write(`Running ${label}, run ${i} of ${RUNS}... `);
            try {
                const { data, seconds } = await runOnce(testCase);
                runs.push({
                    seconds,
                    level: data.level,
                    overall: data.overall,
                    scores: data.categories.map(c => c.score),
                    wordProblems: checkWords(data),
                    styleProblems: checkStyle(data),
                    contradictions: checkContradictions(data),
                    result: data
                });
                console.log(`${data.overall}/10 in ${seconds.toFixed(1)}s`);
            } catch (err) {
                console.log(`FAILED: ${err.message}`);
            }
        }
        report.push({ ...testCase, runs });
    }

    console.log('\n================ EVALUATION SUMMARY ================\n');

    const rows = report.filter(r => r.runs.length > 0).map(r => {
        const overalls = r.runs.map(run => run.overall);
        const categorySpread = Math.max(...[0, 1, 2, 3].map(i => {
            const values = r.runs.map(run => run.scores[i]);
            return Math.max(...values) - Math.min(...values);
        }));
        const mean = average(overalls);
        return {
            profile: `${r.username} / ${r.role}`,
            tier: r.tier,
            levels: [...new Set(r.runs.map(run => run.level))].join(','),
            overalls: overalls.join(' '),
            expected: `${r.expected[0]}-${r.expected[1]}`,
            inRange: overalls.every(o => o >= r.expected[0] && o <= r.expected[1]) ? 'yes' : 'NO',
            consistent: Math.max(...overalls) - Math.min(...overalls) <= 1 && categorySpread <= 2 ? 'yes' : 'NO',
            wordIssues: r.runs.reduce((n, run) => n + run.wordProblems.length, 0),
            styleIssues: r.runs.reduce((n, run) => n + run.styleProblems.length, 0),
            contradictions: r.runs.reduce((n, run) => n + run.contradictions.length, 0),
            avgSeconds: average(r.runs.map(run => run.seconds)).toFixed(1),
            mean
        };
    });

    console.table(rows.map(({ mean, ...rest }) => rest));

    const tierMean = (tier) => {
        const values = rows.filter(r => r.tier === tier).map(r => r.mean);
        return values.length ? average(values) : null;
    };
    const elite = tierMean('elite');
    const intermediate = tierMean('intermediate');
    const beginner = tierMean('beginner');
    console.log(`\nTier averages: elite ${elite?.toFixed(1)}, intermediate ${intermediate?.toFixed(1)}, beginner ${beginner?.toFixed(1)}`);
    console.log(`Tier order correct (elite > intermediate > beginner): ${elite > intermediate && intermediate > beginner ? 'yes' : 'NO'}`);

    const totals = {
        inRange: rows.filter(r => r.inRange === 'yes').length,
        consistent: rows.filter(r => r.consistent === 'yes').length,
        profiles: rows.length
    };
    console.log(`In expected range: ${totals.inRange} of ${totals.profiles} profiles`);
    console.log(`Consistent across ${RUNS} runs: ${totals.consistent} of ${totals.profiles} profiles`);

    console.log('\n---------------- DETAILS ----------------');
    report.forEach(r => {
        const problems = r.runs.flatMap((run, i) => [
            ...run.wordProblems.map(p => `run ${i + 1} words: ${p}`),
            ...run.styleProblems.map(p => `run ${i + 1} style: ${p}`),
            ...run.contradictions.map(p => `run ${i + 1} contradiction: ${p}`)
        ]);
        if (problems.length === 0) return;
        console.log(`\n${r.username} / ${r.role}`);
        problems.forEach(p => console.log(`  - ${p}`));
    });

    mkdirSync('eval/results', { recursive: true });
    const file = `eval/results/results-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    writeFileSync(file, JSON.stringify(report, null, 2));
    console.log(`\nFull results saved to ${file}`);
};

main();