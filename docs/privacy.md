# Privacy Policy

ChatGPT Long Conversation Helper is designed as a privacy-first local browser UI enhancement.

It runs locally in your browser through Tampermonkey.

It does not use a server.

It does not use an external API.

It does not upload your conversation content.

## What the script does

The script changes how ChatGPT user questions and assistant answers are displayed in the local browser view.

It adds:

- per-message collapse / expand buttons;
- a three-line collapsed preview;
- a fade mask near the third preview line;
- global collapse / expand controls;
- a compact `LCH` launcher after hiding the full control panel;
- local collapse-state persistence.

## What the script does not do

The script does not:

- send conversation content to any server;
- upload conversation content;
- collect conversation content;
- transmit conversation content;
- call the ChatGPT API;
- automate sending messages;
- scrape or export conversations;
- read cookies;
- read account tokens;
- read payment information;
- read account settings;
- collect telemetry;
- use analytics;
- use external JavaScript dependencies;
- make `fetch` requests;
- make XHR requests.

## Code-level privacy review

The current userscript does not use:

```text
fetch
XMLHttpRequest
navigator.sendBeacon
WebSocket
eval
document.cookie
@require
remote script URLs
analytics SDKs
telemetry endpoints
```

The script mainly uses local browser APIs for UI behavior:

```text
querySelectorAll
MutationObserver
localStorage
classList
addEventListener
```

## Local storage usage

The script uses `localStorage` only to remember local UI state:

- whether a visible message is collapsed or expanded;
- whether the global control panel is hidden.

It does not store message text.

Example local state format:

```text
clch:v0.1.1:/c/example-conversation:assistant:3:collapsed = 1
clch:v0.1.1:panel:hidden = 1
```

This means:

- `clch:v0.1.1` is the script storage namespace;
- `/c/example-conversation` is the current URL path;
- `assistant:3` is an index-based message reference;
- `collapsed = 1` means the message was collapsed;
- `panel:hidden = 1` means the full control panel was hidden into the compact `LCH` launcher.

## Why localStorage is used

`localStorage` allows the browser to remember local UI state after a page refresh.

This is useful when working with long conversations.

The script does not use `localStorage` to store conversation text.

## Data sharing

No data is shared by this script.

There is no backend.

There is no cloud sync.

There is no telemetry.

There is no analytics service.

## Network access

The script does not intentionally make network requests.

It does not call:

```javascript
fetch()
XMLHttpRequest
navigator.sendBeacon()
WebSocket
```

## Scope

The userscript metadata limits execution to:

```text
https://chatgpt.com/*
```

## Third-party status

This is a third-party local userscript.

It is not an official OpenAI or ChatGPT feature.

It does not use OpenAI branding, logos, or private APIs.

## User control

You can disable or remove the userscript at any time from the Tampermonkey dashboard.

You can also clear local collapse state by clearing site data for `chatgpt.com` in your browser settings.
