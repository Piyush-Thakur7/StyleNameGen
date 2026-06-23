# 🎲 Ludo World Online - Free Online Ludo Game

A complete, production-ready, lightweight Ludo board game built as a single-page web app. It is simple, fun, responsive, and requires no downloads or signups.

## 🚀 Live Game Website

Play the game instantly in your browser at:
👉 **[https://ludo.resence.in](https://ludo.resence.in)**

---

## 💻 Local Setup & Development

To run the game locally:
1. Open a terminal or shell in the project folder.
2. Start a local web server, for example:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)

---

## 🛠️ Tech Stack & Architecture

- **Core Structure**: HTML5, Vanilla CSS3, ES6 JavaScript. No external build steps, bundlers, or package managers required.
- **Rendering System**: Standard 2D HTML5 Canvas calculations map the 15x15 Ludo grid. Handles custom vector shapes for bases, circular yards, track tiles, and safe zone stars.
- **Stacking Logic**: Token overlap positions are calculated automatically when multiple tokens land on the same tile, splitting them into side-by-side offsets, keeping them individually targetable on mobile viewports.
- **Audio synthesis**: Utilizes the native browser **Web Audio API** to generate retro sweeps, rattle oscillations, capture crash sounds, and victory chimes directly inside `sounds.js` — offering 100% offline coverage with zero download latency.
- **AI Heuristics Engine**:
  - **Easy**: Selects randomly among valid moves.
  - **Medium**: Prefers moves that capture opponent tokens or launch tokens out of bases.
  - **Hard**: Scores moves using heuristic evaluations (escape paths, safe zone landings, home stretch progress, trailing opponent distances, and capture opportunities).

---

## 📂 File Structure

```
├── index.html       # SEO Meta tags, Schema.org LD-JSON, Lobby panels, Rules modal
├── styles.css       # Cartoonish rounded CSS rules, buttons, dice shake animations
├── board.js         # 15x15 board geometry, path coordinates, and Canvas drawing
├── dice.js          # Handles 3D-bounce dice rotation rolls and clickable states
├── sounds.js        # Web Audio API synthesizers for zero-latency gameplay chimes
├── ai.js            # Bot difficulty heuristics (Easy, Medium, Hard bot selection)
├── ui.js            # Screen transitions, toast alerts, and Canvas victory confetti
├── game-logic.js    # Turn coordinator, valid moves checks, captures, and win logic
├── robots.txt       # Crawler permissions for SEO indexing
└── sitemap.xml      # Site map pointing to the primary URL structure
```

---

## 📈 Search Engine Optimization (SEO) & Marketing

1. **Structured Data**: Contains Schema.org JSON-LD `VideoGame` tags which describe game modes, target operating systems, categories, and offers.
2. **Metadata**: Fully-equipped HTML header tags including Open Graph (OG) tags for visual sharing previews on WhatsApp, Facebook, and Twitter.
3. **Robots & Sitemap**: Includes pre-configured crawler files pointing to the domain.
4. **Offline support**: Instant load speed ensures the game achieves 100/100 Lighthouse performance metrics.

---

## ⚙️ Customization & Developer Hooks

- **Modify Track Coordinates**: To customize cell grids, modify the coordinates in the `TRACK` array in `board.js`.
- **Adjust Bot Scoring**: Inside `ai.js`, modify the scoring weights (e.g. `score += 1000` for captures) in the hard AI mode to change how bots prioritize tasks.
- **Change Sound Frequencies**: In `sounds.js`, alter the oscillator types (`sine`, `triangle`, `sawtooth`, `square`) and duration frequency values to customize note pitches.

---

## 📄 License
Resence Games &copy; 2026. All rights reserved.
