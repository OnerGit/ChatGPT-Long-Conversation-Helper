# Changelog

## v0.1.0

Initial MVP release.

### Added

- Tampermonkey userscript metadata.
- Page scope limited to `https://chatgpt.com/*`.
- User question detection using configurable DOM selectors.
- Assistant answer detection using configurable DOM selectors.
- Per-message collapse / expand button.
- Three-line preview when collapsed.
- Fade mask near the third preview line.
- Global controls:
  - Collapse all
  - Expand all
  - Hide controls
- Dynamic message detection with `MutationObserver`.
- Duplicate-processing guard with `data-clch-processed`.
- Local collapsed / expanded state persistence with `localStorage`.
- Basic dark-mode-aware styling.
- Privacy-first README documentation.
- Privacy, limitations, and troubleshooting docs.

### Not included

- Message labels.
- Chrome Extension.
- Edge Extension.
- Conversation export.
- API calls.
- Cloud sync.
- Telemetry.
- AI summarization.
- Backend service.

## v0.1.1

### Fixed

- Avoided re-parenting ChatGPT message DOM nodes. This reduces layout issues with Markdown tables, code blocks, and wide answer containers.
- Improved collapsed preview behavior by applying the collapsed state directly to the message node.

### Added

- Added a compact `LCH` launcher button after hiding the global controls.
- Added persisted local panel visibility state.
- Added compatibility fallback for v0.1.0 collapse-state keys.
- Added clearer installation FAQ for Chrome / Chromium `Allow User Scripts`.
- Updated README screenshots to use the five final public screenshots.

### Privacy

- Still no external API calls.
- Still no fetch, XHR, analytics, telemetry, scraping, or export behavior.
- Still stores only local UI state in localStorage.
