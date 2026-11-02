# शायरी लिपि: Roman Urdu to Hindi Shayari Converter

Type shayari in Roman Urdu / Hinglish and get Hindi (Devanagari) text instantly, right in the browser.

**Live demo:** https://YOUR-USERNAME.github.io/roman-urdu-to-hindi-shayari/

## Features
- Live conversion while you type
- Handles conjuncts (`ishq` -> इश्क़), anusvara (`zindagi` -> ज़िंदगी) and nukta letters (q, z, f, gh)
- Exceptions lexicon for common words (`hai`, `mein`, `kya`, `aankhein`...)
- Random sher button, one-click copy, dark mode, mobile friendly
- Click any rule-based word to correct it; corrections are saved in your browser (localStorage)
- Download the Hindi sher as a shareable PNG card
- Unit tests run automatically on every push (GitHub Actions)
- Zero dependencies, plain HTML/CSS/JavaScript

## How it works
1. Each word is checked against a small exceptions lexicon.
2. Otherwise it is split into consonant and vowel tokens using longest-match (`chh`, `kh`, `sh`, `aa`, `ai`...).
3. Vowels become matras after a consonant (independent vowels otherwise), a halant joins consecutive consonants, and word-final `a`, `i`, `u` are treated as long vowels.

Core logic lives in `transliterate.js`; `app.js` only handles the UI.

## Run locally
```bash
git clone https://github.com/YOUR-USERNAME/roman-urdu-to-hindi-shayari.git
cd roman-urdu-to-hindi-shayari
# open index.html in a browser
node test.js   # run the tests
```

## Known limitations
- Roman Urdu spelling is ambiguous, so some words need a lexicon entry (add yours in `LEXICON`).
- `t`/`d` always map to dental त/द, never retroflex ट/ड.
- It does not translate; it only changes the script.

## Roadmap
- [ ] Hindi to Roman Urdu
- [ ] Urdu (Nastaliq) output
- [ ] Larger lexicon and user-added words
- [ ] React + Node.js/MySQL version with saved favourites

## License
MIT
