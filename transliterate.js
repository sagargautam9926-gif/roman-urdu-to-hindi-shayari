// Rule-based Roman Urdu -> Devanagari (Hindi) converter.
// Order of lookup: 1) exceptions lexicon, 2) letter/vowel rules.

const LEXICON = {
  hai: 'है', hain: 'हैं', main: 'मैं', mein: 'में', nahi: 'नहीं', nahin: 'नहीं',
  kya: 'क्या', aur: 'और', yeh: 'यह', woh: 'वो', kyun: 'क्यूँ', kuch: 'कुछ',
  hun: 'हूँ', dunya: 'दुनिया', aankhein: 'आँखें', mehfil: 'महफ़िल', kehna: 'कहना',
};

const CONSONANTS = new Map([
  ['chh', 'छ'], ['kh', 'ख'], ['gh', 'ग़'], ['ch', 'च'], ['sh', 'श'], ['th', 'थ'],
  ['dh', 'ध'], ['ph', 'फ'], ['bh', 'भ'], ['jh', 'झ'], ['zh', 'ज़'],
  ['b', 'ब'], ['c', 'क'], ['d', 'द'], ['f', 'फ़'], ['g', 'ग'], ['h', 'ह'],
  ['j', 'ज'], ['k', 'क'], ['l', 'ल'], ['m', 'म'], ['n', 'न'], ['p', 'प'],
  ['q', 'क़'], ['r', 'र'], ['s', 'स'], ['t', 'त'], ['v', 'व'], ['w', 'व'],
  ['x', 'क्स'], ['y', 'य'], ['z', 'ज़'],
]);

const VOWELS = ['aa', 'ee', 'oo', 'ai', 'au', 'a', 'i', 'u', 'e', 'o'];
const INDEPENDENT = { a: 'अ', aa: 'आ', i: 'इ', ee: 'ई', u: 'उ', oo: 'ऊ', e: 'ए', ai: 'ऐ', o: 'ओ', au: 'औ' };
const MATRA = { a: '', aa: 'ा', i: 'ि', ee: 'ी', u: 'ु', oo: 'ू', e: 'े', ai: 'ै', o: 'ो', au: 'ौ' };
// n/m before these sounds becomes an anusvara (e.g. zindagi -> ज़िंदगी)
const NASAL_BEFORE = new Set(['k', 'kh', 'g', 'gh', 'ch', 'chh', 'j', 't', 'th', 'd', 'dh', 'p', 'b']);

function tokenize(word) {
  const tokens = [];
  let i = 0;
  while (i < word.length) {
    let hit = null;
    for (let len = 3; len >= 1 && !hit; len--) {
      const s = word.slice(i, i + len);
      if (s.length < len) continue;
      if (CONSONANTS.has(s)) hit = { c: CONSONANTS.get(s), raw: s };
      else if (VOWELS.includes(s)) hit = { v: s, raw: s };
    }
    tokens.push(hit);
    i += hit.raw.length;
  }
  return tokens;
}

function convertWord(raw) {
  const word = raw.toLowerCase();
  if (LEXICON[word]) return LEXICON[word];

  const t = tokenize(word);
  const last = t[t.length - 1];
  const beforeLast = t[t.length - 2];
  if (last.v === 'i') last.v = 'ee';
  else if (last.v === 'u') last.v = 'oo';
  else if (last.v === 'a' && beforeLast && beforeLast.c) last.v = 'aa';

  let out = '';
  for (let i = 0; i < t.length; i++) {
    const cur = t[i], prev = t[i - 1], next = t[i + 1];
    if (cur.v) {
      out += prev && prev.c ? MATRA[cur.v] : INDEPENDENT[cur.v];
      continue;
    }
    if ((cur.raw === 'n' || cur.raw === 'm') && prev && prev.v && next && next.c && NASAL_BEFORE.has(next.raw)) {
      out += 'ं';
      continue;
    }
    out += cur.c;
    if (next && next.c) out += '्'; // halant between consecutive consonants
  }
  return out;
}

// Splits text into words/other chars and records where each Hindi word came from.
function parse(text, userLex = {}) {
  const parts = [];
  const re = /([A-Za-z]+)|([^A-Za-z]+)/g;
  let m;
  while ((m = re.exec(text))) {
    if (!m[1]) { parts.push({ out: m[2] }); continue; }
    const key = m[1].toLowerCase();
    if (userLex[key]) parts.push({ src: key, out: userLex[key], source: 'user' });
    else if (LEXICON[key]) parts.push({ src: key, out: LEXICON[key], source: 'lexicon' });
    else parts.push({ src: key, out: convertWord(key), source: 'rule' });
  }
  return parts;
}

function transliterateText(text, userLex) {
  return parse(text, userLex).map((p) => p.out).join('');
}

if (typeof module !== 'undefined') module.exports = { transliterateText, convertWord, parse };
else { window.transliterateText = transliterateText; window.parseText = parse; }
