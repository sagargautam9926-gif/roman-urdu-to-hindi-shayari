const input = document.getElementById('input');
const output = document.getElementById('output');
const msg = document.getElementById('msg');
const STORE_KEY = 'shayariLipi.userLex';

const SAMPLES = [
  'tera zikr aaye to dil muskuraata hai',
  'raat khamosh hai par dil mein sadaa hai',
  'ishq mein har dard bhi ek saugaat hai',
  'tanha safar mein bas teri yaad saath hai',
];
let sampleIndex = -1;

function loadUserLex() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveUserLex(lex) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(lex)); } catch { /* storage blocked */ }
}
let userLex = loadUserLex();

function render() {
  output.textContent = '';
  for (const p of parseText(input.value, userLex)) {
    if (!p.source || p.source === 'lexicon') { output.append(p.out); continue; }
    const span = document.createElement('span');
    span.className = 'w ' + p.source;
    span.textContent = p.out;
    span.title = p.source === 'user' ? 'Tumhara sudhaara hua word. Click to edit' : 'Click karke theek karo';
    span.addEventListener('click', () => {
      const fixed = prompt('"' + p.src + '" ki sahi Hindi spelling likho:', p.out);
      if (fixed && fixed.trim()) { userLex[p.src] = fixed.trim(); saveUserLex(userLex); render(); }
    });
    output.append(span);
  }
}

function flash(text) {
  msg.textContent = text;
  setTimeout(() => (msg.textContent = ''), 1800);
}

async function downloadCard() {
  const text = output.textContent.trim();
  if (!text) return flash('Pehle kuch likho');
  const font = '64px "Tiro Devanagari Hindi", serif';
  try { await document.fonts.load(font); } catch { /* use fallback font */ }
  const size = 1080, pad = 110, lineHeight = 110;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, '#0d1823'); bg.addColorStop(1, '#14403f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#e0a526'; ctx.fillRect(pad, 140, 90, 6);
  ctx.fillStyle = '#e8eef3'; ctx.font = font; ctx.textAlign = 'center';
  const lines = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/)) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > size - pad * 2 && line) { lines.push(line); line = word; } else line = test;
    }
    lines.push(line);
  }
  let y = size / 2 - ((lines.length - 1) * lineHeight) / 2;
  for (const l of lines) { ctx.fillText(l, size / 2, y); y += lineHeight; }
  ctx.font = '30px "Tiro Devanagari Hindi", serif'; ctx.fillStyle = '#93a4b3';
  ctx.fillText('शायरी लिपि', size / 2, size - 90);
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'shayari-card.png'; a.click();
    URL.revokeObjectURL(a.href);
  });
}

input.addEventListener('input', render);
document.getElementById('sample').addEventListener('click', () => {
  sampleIndex = (sampleIndex + 1) % SAMPLES.length;
  input.value = SAMPLES[sampleIndex]; render();
});
document.getElementById('clear').addEventListener('click', () => { input.value = ''; render(); input.focus(); });
document.getElementById('card').addEventListener('click', downloadCard);
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Tumhare saare saved sudhaar hat jayenge. Pakka?')) { userLex = {}; saveUserLex(userLex); render(); flash('Dictionary reset ho gayi'); }
});
document.getElementById('copy').addEventListener('click', async () => {
  if (!output.textContent) return flash('Pehle kuch likho');
  try { await navigator.clipboard.writeText(output.textContent); flash('Copied'); }
  catch { flash('Copy nahi hua, text select karke copy karo'); }
});

render();
