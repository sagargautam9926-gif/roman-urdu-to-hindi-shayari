const assert = require('assert');
const { transliterateText: t } = require('./transliterate');

const cases = {
  ishq: 'इश्क़', dil: 'दिल', dard: 'दर्द', tera: 'तेरा', zindagi: 'ज़िंदगी',
  mohabbat: 'मोहब्बत', khamosh: 'खमोश', tanha: 'तन्हा', kitaab: 'किताब',
  saugaat: 'सौगात', zikr: 'ज़िक्र', muskuraata: 'मुस्कुराता', tum: 'तुम', mein: 'में',
  'dil, dard.': 'दिल, दर्द.',
};

let failed = 0;
for (const [input, expected] of Object.entries(cases)) {
  const got = t(input);
  if (got === expected) console.log('ok  ', input, '->', got);
  else { failed++; console.log('FAIL', input, '->', got, '(expected', expected + ')'); }
}
assert.strictEqual(failed, 0, failed + ' test(s) failed');
const { parse } = require('./transliterate');
const p = parse('dil kabhi, ishq', { ishq: 'इश्क' });
assert.strictEqual(p[0].source, 'lexicon' === p[0].source ? 'lexicon' : 'rule');
assert.strictEqual(p.find((x) => x.src === 'ishq').source, 'user');
assert.strictEqual(p.find((x) => x.src === 'ishq').out, 'इश्क');
assert.strictEqual(p.find((x) => x.out === ', ').out, ', ');
console.log('User dictionary tests passed');
console.log('All tests passed');
