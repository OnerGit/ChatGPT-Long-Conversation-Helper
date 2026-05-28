# Manual Test Plan

This test plan verifies ChatGPT Long Conversation Helper before publishing screenshots or releasing to GitHub.

## Test environment record

- Date:
- Browser:
- OS:
- Tampermonkey version:
- ChatGPT URL:
- Script version:

## Installation checks

Expected result:

- Tampermonkey is installed.
- The script is pasted into Tampermonkey and saved.
- The script is enabled.
- In Chrome / Chromium-based browsers, `Allow User Scripts` is enabled for Tampermonkey if the option is shown.
- The test page starts with `https://chatgpt.com/`.

## Core function tests

### 1. Script loading

Expected result:

- The floating `Long Conversation Helper` panel appears in the bottom-right corner.
- The Tampermonkey icon shows that the script is running on `https://chatgpt.com/*`.

### 2. Single question collapse

Expected result:

- A long user question has a `Collapse question` button.
- Clicking the button changes it to `Expand question`.
- The question keeps around three preview lines with a fade effect.
- Clicking `Expand question` restores the full question.

### 3. Single answer collapse

Expected result:

- A long assistant reply has a `Collapse answer` button.
- Clicking the button changes it to `Expand answer`.
- The answer keeps around three preview lines with a fade effect.
- Clicking `Expand answer` restores the full answer.

### 4. Collapse all / Expand all

Expected result:

- `Collapse all` collapses visible user questions and assistant answers.
- `Expand all` expands them again.
- Sidebar, input box, account UI, and settings UI are not processed.

### 5. Hide controls / LCH launcher

Expected result:

- `Hide controls` hides the full panel.
- A compact `LCH` button remains fixed near the lower-right area.
- Clicking `LCH` opens the full panel again.

### 6. Dynamic message detection

Expected result:

- New user messages and assistant replies get collapse controls without refreshing the page.

### 7. Refresh-state recovery

Expected result:

- Previously collapsed items are restored on refresh as a best-effort behavior.
- State may be imperfect if the DOM order changes.

## Layout stress tests

Test assistant replies containing:

- Markdown table;
- fenced code block;
- long code line;
- ordered list;
- nested bullet list;
- mixed Chinese and English text.

Expected result:

- Collapse / expand does not stretch the answer container outside the page.
- Markdown tables and code blocks remain readable after expansion.
- No message content disappears.

Public README screenshots do not need to include table / code-block stress tests unless you want to demonstrate layout robustness.

## Privacy boundary checks

Code-level expected behavior:

- No `fetch` call.
- No `XMLHttpRequest` call.
- No `sendBeacon` call.
- No `WebSocket` call.
- No `eval` call.
- No `document.cookie` read.
- No external script dependency.
- No `@require` dependency.
- `localStorage` is used only for UI state.

Browser-level optional checks:

- DevTools Network should not show script-triggered external requests when clicking collapse / expand.
- DevTools Application / Local Storage should show only `clch:*` state keys, not message text.

## Screenshot checklist

Required for the current README:

- `screenshots/before.png`
- `screenshots/single-toggle.png`
- `screenshots/after-collapsed.png`
- `screenshots/global-controls.png`
- `screenshots/lch-launcher.png`

Optional internal evidence:

- `screenshots/local-storage-state.png`
- `screenshots/network-no-extra-request.png`
- table / code-block stress-test screenshots.
