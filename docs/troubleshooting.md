# Troubleshooting

This document lists common issues and checks for ChatGPT Long Conversation Helper.

## Buttons do not appear

Check the following:

1. Tampermonkey is installed.
2. The userscript is enabled.
3. The current page starts with:

```text
https://chatgpt.com/
```

4. The conversation contains visible user questions and assistant answers.
5. The page has been refreshed after enabling the script.
6. In Chrome / Chromium-based browsers, `Allow User Scripts` is enabled for Tampermonkey if the option is shown.

If buttons still do not appear, open the browser console and search for:

```text
[CLCH]
```

## Tampermonkey is enabled, but nothing appears on ChatGPT

This can happen if the browser blocks userscript execution.

In Chrome:

1. Open `chrome://extensions/`.
2. Find `Tampermonkey`.
3. Open `Details`.
4. Enable `Allow User Scripts` if this option is shown.
5. If required, enable Developer Mode first.
6. Refresh the ChatGPT page.

## Buttons appear only after refresh

ChatGPT pages are dynamic.

The script uses `MutationObserver`, but some messages may be rendered or updated in a way that requires a refresh.

Try refreshing the page once.

## Collapse state is not restored after refresh

Collapse-state restore is best-effort.

The script stores only index-based state in `localStorage`.

It does not store message text.

State restore may fail or shift if:

- messages are added or removed;
- ChatGPT changes the DOM;
- the URL path changes;
- the conversation renders differently after refresh.

## The page layout looks strange

Disable the userscript in Tampermonkey and refresh the page.

If the issue disappears, the current ChatGPT DOM may no longer match the script assumptions.

Check whether the selector strategy needs updating.

## Global controls cover page content

The global controls appear in the bottom-right corner.

You can click:

```text
Hide controls
```

This hides the full panel and leaves a compact `LCH` launcher.

Click `LCH` to reopen the panel.

If needed, adjust the CSS in:

```javascript
.clch-global-controls
.clch-launcher
```

## Script stopped working after ChatGPT UI changed

This project depends on ChatGPT's visible web DOM.

If ChatGPT changes its frontend structure, update the selector configuration near the top of the userscript:

```javascript
roleSelectors: [
  '[data-message-author-role="user"]',
  '[data-message-author-role="assistant"]'
]
```

## Console warning: Failed to read localStorage

Your browser or privacy settings may block access to `localStorage`.

The script should still work for current-page collapse / expand behavior, but refresh-state recovery may not work.

## Console warning: Failed to process message

This usually means the DOM structure is different from what the script expected.

Try:

1. Refreshing the page.
2. Updating selectors.
3. Testing on another conversation.
4. Disabling other userscripts or extensions that modify ChatGPT.

## How to reset local collapse state

Clear site data for `chatgpt.com` in your browser settings.

Alternatively, open the browser console and remove keys that start with:

```text
clch:v0.1.1
clch:v0.1.0
```

Only do this if you understand browser developer tools.
