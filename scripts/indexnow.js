/**
 * IndexNow - Notify Bing/Yandex about updated pages after deployment
 *
 * Usage: node scripts/indexnow.js
 * Add to package.json: "postdeploy": "node scripts/indexnow.js"
 */

const SITE_URL = 'https://xalora.one';
const API_KEY = 'ccfc1423f4a1b4dc373a4d5ab4934676';

const PAGES = [
  '/',
  '/about',
  '/contact',
  '/blog',
  '/pricing',
  '/internships',
  '/quiz',
  '/problems',
  '/ai-interview/setup',
  '/algorithms',
  '/algorithms/searching',
  '/algorithms/sorting',
  '/algorithms/fundamentals',
  '/algorithms/dynamic-programming',
  '/algorithms/greedy',
  '/algorithms/graph',
  '/algorithms/tree',
  '/algorithms/string',
  '/algorithms/backtracking',
  '/algorithms/mathematical',
  '/algorithms/geometric',
  '/algorithms/randomized',
  '/data-structures',
  '/data-structures/basic',
  '/data-structures/linear',
  '/data-structures/arrays',
  '/data-structures/linked-lists',
  '/data-structures/stacks',
  '/data-structures/queues',
  '/data-structures/hash-based',
  '/data-structures/hash-based/hash-tables',
  '/data-structures/hash-based/hash-maps',
  '/data-structures/hash-based/hash-sets',
  '/data-structures/hash-based/bloom-filters',
  '/data-structures/hash-based/consistent-hashing',
  '/data-structures/hash-based/perfect-hashing',
  '/data-structures/hash-based/cuckoo-hashing',
  '/system-design',
  '/interview-prep',
  '/careers',
  '/help-center',
  '/community',
  '/status',
  '/roadmap',
  '/job-genie',
  '/privacy',
  '/terms',
  '/cookies',
  '/acceptable-use',
];

async function submitToIndexNow() {
  const urlList = PAGES.map(page => `${SITE_URL}${page}`);

  const payload = {
    host: 'xalora.one',
    key: API_KEY,
    keyLocation: `${SITE_URL}/${API_KEY}.txt`,
    urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`IndexNow: Successfully submitted ${urlList.length} URLs`);
      console.log('Status:', response.status);
    } else {
      const text = await response.text();
      console.error(`IndexNow: Failed with status ${response.status}`);
      console.error('Response:', text);
    }
  } catch (error) {
    console.error('IndexNow: Error submitting URLs', error.message);
  }
}

submitToIndexNow();
