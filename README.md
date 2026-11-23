# Dream Dex — Creature Field Guide

A pocket field guide to thirty original fantasy creatures. Meet the guardians of hidden habitats, read their stories, and assemble a small adventure party.

## Features

- 30 original animated SVG creature portraits, each independently reusable.
- Search by creature name, habitat, rarity, or story.
- Combined habitat and rarity filters.
- Local saved collection with an optional JSON export.
- Four-member party builder with average power score.
- Creature detail dialog with biography and Power, Guard, and Wonder stats.
- Pause/resume for embedded SVG motion and reduced-motion support.
- No framework, remote API, analytics, or runtime dependency.

## Run locally

Requirements: Node.js 20 or newer.

    git clone https://github.com/developer04onserver/dream-dex-creature-index.git
    cd dream-dex-creature-index
    npm test
    npm run check
    npm run build
    npm run dev

Open the URL printed by the local server (default http://localhost:4173).

## Scripts

| Command | Purpose |
| --- | --- |
| npm test | Run Node's built-in test suite |
| npm run check | Check JavaScript syntax |
| npm run build | Copy the production site to dist/ |
| npm run dev | Start the local development server |
| npm run preview | Preview dist/ |

## Project map

    public/creatures/    30 animated SVG illustrations
    src/catalog.js       Creature data and stats
    src/core.js          Search, filters, and party logic
    src/app.js           UI, dialog, favorites, and team builder
    src/style.css        Responsive design and motion states
    scripts/             Build and preview helpers
    tests/               Automated logic tests
    docs/                Architecture, accessibility, and art guides

## Create a new creature

1. Add a standalone accessible SVG in public/creatures.
2. Add its metadata to src/catalog.js, including a unique ID, habitat, rarity, stats, story, and relative art path.
3. Keep animation declarative, gentle, and non-flashing.
4. Add tests for any new filter or party behavior.
5. Run npm test, npm run check, and npm run build.

See docs/SVG_GUIDE.md.

## Privacy

Saved creatures are kept locally in the current browser. Export collection creates a local JSON download. No account or server is involved.

## Deployment

Run npm run build and publish the contents of dist/ to any static host. No environment variables are required.

## License

MIT.
