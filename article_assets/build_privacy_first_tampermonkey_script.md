# Build a Privacy-First Tampermonkey Script for Long ChatGPT Conversations

**Project:** ChatGPT Long Conversation Helper  
**Companion repository:** https://github.com/OnerGit/ChatGPT-Long-Conversation-Helper  
**Release version:** v0.1.1  
**Article type:** Technical writing portfolio sample / browser tooling tutorial  
**Primary topics:** JavaScript, Tampermonkey, DOM manipulation, MutationObserver, localStorage, privacy-first AI workflow tooling

This article is a public technical writing sample based on a small open-source browser tooling project. It is intended to show how a local userscript can improve long ChatGPT conversation navigation while keeping a strict privacy boundary.

This project is a third-party local userscript. It is not an official OpenAI or ChatGPT feature.

It only changes the local browser view. It does not upload, transmit, collect, export, or send conversation content. It does not call the ChatGPT API. It does not automate sending messages. It stores only local UI state in `localStorage`.

## Screenshot checklist

This article references screenshots stored in the repository-level `screenshots/` directory. Because this Markdown file is intended to live in `article_assets/`, image paths use `../screenshots/...`.

Required screenshot files:

```text
screenshots/before.png
screenshots/single-toggle.png
screenshots/after-collapsed.png
screenshots/global-controls.png
screenshots/lch-launcher.png
```

Avoid screenshots that contain private conversation content.

## Related project files

```text
README.md
chatgpt-long-conversation-helper.user.js
docs/privacy.md
docs/limitations.md
docs/troubleshooting.md
docs/manual-test-plan.md
CHANGELOG.md
LICENSE
```

## Portfolio context

This article complements a backend API tutorial sample by showing a different kind of engineering work: browser tooling, JavaScript DOM handling, local UI state, MutationObserver, privacy boundaries, and small-tool product thinking.

It is written as a practical tutorial with engineering reflection rather than a product announcement.

---

# Build a Privacy-First Tampermonkey Script for Long ChatGPT Conversations

Long AI conversations are useful, but they become hard to scan.

If you use ChatGPT for technical planning, code review, writing drafts, debugging, or research, a single conversation can easily grow into dozens of turns. At that point, the problem is no longer generating more content. The problem is navigation.

You may want to jump back to an earlier question. You may want to hide a long assistant answer after you have already used it. You may want to keep only the most important parts visible while reviewing the whole thread.

I wanted a small tool for that specific problem: collapse and expand long ChatGPT questions and answers in the local browser view.

The result is **ChatGPT Long Conversation Helper**, a Tampermonkey userscript that adds per-message collapse controls, global collapse / expand controls, a three-line preview, and local UI state.

Companion repository:

```text
https://github.com/OnerGit/ChatGPT-Long-Conversation-Helper
```

This is a third-party local userscript. It is not an official OpenAI or ChatGPT feature.

It only changes the local browser view. It does not upload, transmit, collect, export, or send conversation content. It does not call the ChatGPT API. It does not automate sending messages. It stores only local UI state in `localStorage`.

## The problem: long conversations are hard to review

A long conversation is useful while you are building it. It becomes less useful when you need to review it later.

The page can contain long prompts, detailed answers, code blocks, checklists, and repeated planning notes. Scrolling through everything makes it harder to compare earlier decisions with later results.

The tool does not try to summarize the conversation. It keeps the content exactly where it is and adds a local way to hide or show each message.

![Before using the helper, long conversations can take a lot of vertical space](../screenshots/before.png)

## What this userscript does

The first version focuses on one narrow workflow improvement: make long conversations easier to review.

The userscript adds:

- a `Collapse question` / `Expand question` button for user messages;
- a `Collapse answer` / `Expand answer` button for assistant messages;
- a three-line preview when a message is collapsed;
- a subtle fade mask near the preview boundary;
- a floating global control panel;
- `Collapse all` and `Expand all` buttons;
- a compact `LCH` launcher after hiding the full panel;
- local collapsed / expanded state with `localStorage`.

It deliberately does not provide export, scraping, summarization, automation, cloud sync, or API integration.

That scope matters. A browser UI helper should not silently become a data extraction tool.

![A single message-level collapse control is added above a conversation message](../screenshots/single-toggle.png)

## Why I started with Tampermonkey

This project could eventually become a browser extension, but I did not start there.

A Tampermonkey userscript was a better MVP boundary for three reasons.

First, it is quick to test. I can paste a single `.user.js` file into Tampermonkey, open ChatGPT, and validate the DOM behavior immediately.

Second, it avoids extension packaging too early. A Chrome or Edge extension would require more decisions around permissions, manifest configuration, distribution, review, and long-term maintenance.

Third, the real uncertainty was not packaging. The real uncertainty was whether the DOM-based interaction would feel useful and stable enough.

So the first goal was simple: validate the interaction model locally before turning it into a heavier browser extension.

## Setting the privacy boundary

Before writing the DOM code, I defined what the tool must not do.

The script should not:

- upload conversation content;
- transmit conversation content;
- collect conversation content;
- export conversations;
- call the ChatGPT API;
- automate sending messages;
- read cookies;
- read account tokens;
- read payment information;
- collect telemetry;
- use analytics;
- load remote scripts.

The only persisted data should be local UI state: whether a message is collapsed and whether the global panel is hidden.

That boundary influenced the implementation. The script uses browser APIs such as:

```text
querySelectorAll
MutationObserver
localStorage
classList
addEventListener
```

It does not need `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `document.cookie`, or external dependencies.

## Userscript metadata

A userscript starts with metadata. This block tells Tampermonkey where the script should run and which special permissions it needs.

For this project, the metadata is intentionally small:

```javascript
// ==UserScript==
// @name         ChatGPT Long Conversation Helper
// @namespace    chatgpt-long-conversation-helper
// @version      0.1.1
// @description  A privacy-first local UI helper that collapses and expands long ChatGPT questions and answers.
// @author       OnerGit
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==
```

The important lines are:

```javascript
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
```

`@match` limits the script to ChatGPT pages.

`@grant none` keeps the script in a simple mode without requesting special Tampermonkey APIs.

`@run-at document-idle` waits until the page is mostly loaded before running. This is useful for UI scripts because many target elements may not exist at the earliest loading stage.

This does not guarantee all conversation messages are already present. ChatGPT is a dynamic web app, so the script still needs a `MutationObserver`.

## Finding message nodes in a dynamic page

The script needs to find user questions and assistant answers.

A tempting approach would be to copy a long selector chain from DevTools. For example, you might inspect a message and copy a selector that includes many nested class names.

That is usually fragile.

Modern web apps often change generated class names, wrapper elements, or layout structure. A selector that is too deep may break after a small UI update.

Instead, this script prefers shallow role-based selectors:

```javascript
const CONFIG = {
  roleSelectors: [
    '[data-message-author-role="user"]',
    '[data-message-author-role="assistant"]'
  ],
  ignoredAncestors: 'form, textarea, input, nav, aside, header, footer, [role="dialog"]',
  processedAttr: 'data-clch-processed'
};
```

This is still a DOM dependency, and it can break if ChatGPT changes its page structure. But it is more maintainable than relying on a long chain of layout classes.

The script also avoids processing input boxes, dialogs, headers, footers, sidebars, and other non-conversation areas.

A simplified message finder looks like this:

```javascript
function getConversationMessageNodes() {
  const found = new Set();

  CONFIG.roleSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (isLikelyConversationMessage(node)) {
        found.add(node);
      }
    });
  });

  return Array.from(found);
}
```

The `Set` prevents duplicates if selectors overlap.

## Avoiding duplicate processing

A dynamic page can be scanned many times.

If the script adds a toolbar to a message every time it scans, the UI will quickly become broken. The solution is to mark processed nodes.

```javascript
function processMessage(messageNode) {
  if (!messageNode || messageNode.getAttribute(CONFIG.processedAttr) === 'true') {
    return;
  }

  const role = getRole(messageNode);

  if (role !== 'user' && role !== 'assistant') {
    return;
  }

  messageNode.classList.add('clch-message');
  messageNode.setAttribute(CONFIG.processedAttr, 'true');

  addMessageToolbar(messageNode);
  restoreState(messageNode);
}
```

This makes scanning idempotent. Running `scanMessages()` multiple times should not keep adding more buttons to the same message.

That is important when using `MutationObserver`, because DOM changes may trigger scans repeatedly.

## Adding collapse controls

For each message, the script inserts a small toolbar before the message node.

The toolbar contains one button:

```javascript
function addMessageToolbar(messageNode) {
  const role = getRole(messageNode) || 'message';

  const toolbar = document.createElement('div');
  toolbar.className = 'clch-toolbar';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'clch-toggle-button';
  button.textContent = getToggleLabel(role, false);
  button.setAttribute('aria-expanded', 'true');

  button.addEventListener('click', () => {
    const currentlyCollapsed =
      messageNode.getAttribute('data-clch-collapsed') === 'true';

    setCollapsed(messageNode, !currentlyCollapsed, true);
  });

  toolbar.appendChild(button);
  messageNode.parentNode.insertBefore(toolbar, messageNode);
}
```

The button does not move or rewrite the message content. It only toggles a collapsed class on the existing message node.

That design choice matters. Moving or wrapping message nodes can introduce layout risk with Markdown tables, code blocks, and wide answer containers. This version avoids re-parenting ChatGPT message DOM nodes and applies the collapsed state directly to the message node.

## Styling the collapsed state

The collapsed state is mostly CSS.

The script applies a class such as:

```text
clch-collapsed-message
```

Then CSS limits the visible height:

```css
.clch-collapsed-message {
  max-height: calc(3 * 1.55em);
  overflow: hidden !important;
  position: relative !important;
}
```

A fade mask makes the preview feel less abrupt:

```css
.clch-collapsed-message::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.9em;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--clch-fade-bg, #ffffff)
  );
}
```

This is intentionally simple. The script does not try to summarize the message. It does not parse the text. It does not store the content. It only changes how much of the existing message is visible.

![Collapsed messages keep a short preview instead of disappearing completely](../screenshots/after-collapsed.png)

## Watching new messages with MutationObserver

ChatGPT conversations are dynamic. New user messages and assistant replies appear after the initial page load.

A one-time scan is not enough.

The script uses `MutationObserver` to watch for newly inserted content:

```javascript
function startObserver() {
  const target = document.querySelector('main') || document.body;

  const observer = new MutationObserver(() => {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(scheduleScan, CONFIG.observerThrottleMs);
  });

  observer.observe(target, {
    childList: true,
    subtree: true
  });
}
```

The observer does not process every mutation immediately. It schedules a scan with a small delay.

That delay matters because dynamic apps may produce several DOM changes during a single interaction. A small throttle/debounce keeps the script from doing unnecessary repeated work.

The scan function can then process any new message nodes that do not already have the `data-clch-processed` marker.

## Saving local UI state

If you collapse several messages and refresh the page, it is useful for the local view to remember that state.

The script uses `localStorage` for this.

A simplified storage key looks like this:

```text
clch:v0.1.1:/c/example-conversation:assistant:4:collapsed = 1
```

The key includes:

- script namespace and version;
- current URL path;
- message role;
- message index;
- collapsed state.

The value is only a UI flag.

It does not store message text.

The storage helpers are wrapped in `try/catch` because browser storage can fail or be disabled:

```javascript
function safeGetStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('[CLCH] Failed to read localStorage.', error);
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn('[CLCH] Failed to write localStorage.', error);
  }
}
```

This state recovery is best-effort. Because it is index-based, it may not restore perfectly if the conversation order changes or if the page DOM changes.

That limitation is acceptable for an MVP because the script is a local UI helper, not a data management system.

## Global controls and the LCH launcher

Individual controls help when reviewing one message. Global controls help when a conversation is already long.

The floating panel provides:

- `Collapse all`
- `Expand all`
- `Hide controls`

![The floating control panel provides global collapse and expand actions](../screenshots/global-controls.png)

If the panel itself becomes visual noise, it can be hidden into a small `LCH` launcher.

![The LCH launcher reopens the hidden global panel](../screenshots/lch-launcher.png)

This is a small UI detail, but it matters for a browser helper. A tool that reduces visual noise should not create too much noise of its own.

## Manual testing

For a small userscript, manual testing is still important.

The test plan I used focuses on behavior rather than unit tests:

1. Install Tampermonkey.
2. Paste and enable the userscript.
3. Open a ChatGPT conversation at `https://chatgpt.com/`.
4. Confirm the floating control panel appears.
5. Confirm long user questions get `Collapse question`.
6. Confirm assistant answers get `Collapse answer`.
7. Collapse and expand individual messages.
8. Use `Collapse all` and `Expand all`.
9. Hide the panel and reopen it with `LCH`.
10. Send a new message and confirm dynamic content receives controls.
11. Refresh the page and check best-effort state recovery.
12. Test messages containing Markdown tables, code blocks, lists, and long lines.
13. Confirm no message content disappears after expanding.
14. Check that localStorage contains only UI state keys.
15. Confirm there are no script-triggered external requests.

The privacy test is part of the functional test. For this project, “it works” is not enough. It also needs to stay within the local-only boundary.

## Known limitations

This is a best-effort UI enhancement.

The main limitation is DOM dependency. The script depends on the visible ChatGPT web page structure. If ChatGPT changes its DOM, selectors may need to be updated.

Other limitations:

- streaming replies may not always receive controls immediately;
- local state recovery may be imperfect after page changes;
- message indexing can shift if the conversation structure changes;
- the script is manually tested, not tested against an official ChatGPT extension API;
- it is not an official feature;
- it is not affiliated with OpenAI.

These limitations are not hidden because they are part of the engineering reality of a DOM-based userscript.

## What I would improve next

I would keep the next version small.

Useful improvements include:

- configurable preview line count;
- optional keyboard shortcuts;
- more robust selector fallback;
- better settings UI;
- improved dark-mode visual tuning;
- clearer reset controls for local UI state.

A Chrome or Edge extension could also be considered later, but only after the userscript behavior stabilizes.

Moving from userscript to extension would require a new review of permissions, storage behavior, privacy documentation, packaging, and distribution. It should not be treated as a simple file conversion.

## Conclusion

Small local tools can improve AI workflows, but the boundary matters.

For this project, the useful feature is not automation. It is navigation. The script does not send messages, call APIs, scrape conversations, or export data. It only changes the local browser view so long conversations are easier to scan.

That made Tampermonkey a good starting point. It allowed the core interaction to be tested quickly while keeping the project small enough to review.

The broader lesson is simple: when building AI workflow tools, productivity should not come at the cost of unclear data behavior. A small browser tool can still be useful if it has a narrow scope, a clear privacy boundary, and honest limitations.

GitHub repository:

```text
https://github.com/OnerGit/ChatGPT-Long-Conversation-Helper
```

This is a third-party local userscript, not an official OpenAI or ChatGPT feature.
