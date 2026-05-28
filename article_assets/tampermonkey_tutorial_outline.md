# Build a Tampermonkey Script to Collapse Long ChatGPT Conversations

## Article purpose

Show how to build a small privacy-first Tampermonkey userscript that improves long ChatGPT conversations by adding local collapse and expand controls to user questions and assistant answers.

The article should focus on practical browser tooling, DOM manipulation, MutationObserver, CSS injection, local UI state, and clear product boundaries.

## Target reader

- Developers who use ChatGPT for long technical workflows.
- JavaScript beginners who want a practical browser enhancement example.
- Technical writers who want a small but useful portfolio project.
- Developers interested in privacy-first local browser tools.

## Section headings

1. The problem: long AI conversations become hard to navigate
2. Why a userscript is enough for the MVP
3. Project boundaries: local UI enhancement, not scraping
4. Tampermonkey metadata and page scope
5. Finding user questions and assistant answers with maintainable selectors
6. Injecting a per-message collapse button
7. Using CSS for a three-line preview with fade effect
8. Adding global collapse and expand controls
9. Watching dynamic conversation updates with MutationObserver
10. Remembering local UI state with localStorage
11. Testing the userscript manually
12. Known limitations and future improvements
13. Conclusion

## Key code snippets

### Tampermonkey metadata

```javascript
// ==UserScript==
// @name         ChatGPT Long Conversation Helper
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
```

### Role selector configuration

```javascript
const CONFIG = {
  roleSelectors: [
    '[data-message-author-role="user"]',
    '[data-message-author-role="assistant"]'
  ]
};
```

### MutationObserver

```javascript
const observer = new MutationObserver(() => {
  scheduleScan();
});

observer.observe(document.querySelector('main') || document.body, {
  childList: true,
  subtree: true
});
```

### localStorage state

```javascript
localStorage.setItem(storageKey, collapsed ? '1' : '0');
```

## Screenshots needed

1. Long ChatGPT conversation before the script is enabled.
2. One user question and one assistant answer with collapse buttons.
3. Several collapsed messages showing the three-line preview and fade effect.
4. Bottom-right global controls.
5. Optional browser console check showing no custom network calls from the script.

## Risks to mention

- ChatGPT DOM can change.
- Selectors should be shallow and maintainable.
- The script should not collect, export, or upload content.
- localStorage state is best-effort.
- Userscripts are good for MVPs, but not always ideal for broad consumer distribution.
