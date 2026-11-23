# Architecture

Dream Dex is a static browser app with a typed-by-convention catalogue and a small pure logic layer.

## Modules

- src/catalog.js stores immutable specimen records: identity, habitat, rarity, palette, biography, stats, and artwork path.
- src/core.js provides pure filtering, unique random-party selection, and average-power calculation.
- src/app.js owns browser state and the DOM: saved creature IDs, filters, current detail view, party members, and motion.
- src/style.css owns responsive layout, focus states, rarity treatments, and reduced-motion fallback.

## Data flow

The search and selects are independent inputs to filterCreatures. The current visible set is computed and rendered as a sequence of semantic cards. Saving a creature updates the local set and then re-renders from the same source data. The team builder samples unique members from the visible list so the current filters are respected.

## Party selection

buildParty copies the available list and draws without replacement. The random source is injectable for repeatable unit tests. calculatePower returns the rounded mean of the members' power stats, or zero for an empty team.

## Persistence

Saved IDs use the namespaced localStorage key dream-dex:saved. Errors are caught so blocked storage does not interrupt browsing. JSON export creates a temporary Blob URL and downloads the selected records.

## SVG animation

Same-origin SVG documents are embedded as object elements. The app uses the SVG animation API to pause or resume motion when supported. The static illustration remains useful in browsers with no SMIL support.
