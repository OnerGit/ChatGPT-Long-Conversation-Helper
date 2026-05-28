# FAQ

## What is ChatGPT Long Conversation Helper?

It is a local Tampermonkey userscript that adds collapse and expand controls to ChatGPT questions and answers.

It is designed for long technical conversations where scrolling back through many long messages is inefficient.

## Is this an official ChatGPT feature?

No.

This is a third-party local userscript. It is not affiliated with OpenAI and does not use OpenAI branding or private APIs.

## How do I install Tampermonkey?

Install Tampermonkey from your browser's official extension store.

After installation, click the browser extension icon and pin Tampermonkey to the toolbar so it is easy to access.

## Where is the Tampermonkey Dashboard?

Click the Tampermonkey icon in the browser toolbar and choose `Dashboard`.

In some localized browsers, this may appear as a management panel or options page.

## How do I install this script?

1. Open Tampermonkey Dashboard.
2. Create a new script.
3. Delete the default template.
4. Paste `chatgpt-long-conversation-helper.user.js`.
5. Save with `Ctrl + S`.
6. Make sure the script is enabled.
7. Open or refresh `https://chatgpt.com/`.

## Do I need to enable Allow User Scripts in Chrome?

Possibly, yes.

Some Chrome / Chromium-based browser versions require userscript execution to be explicitly allowed before Tampermonkey scripts can run.

Open:

```text
chrome://extensions/
```

Then:

1. Find `Tampermonkey`.
2. Click `Details`.
3. Enable `Allow User Scripts` if this option is shown.
4. If Chrome asks for Developer Mode before enabling userscripts, turn on Developer Mode first.
5. Refresh the ChatGPT page.

If this is not enabled, the script may look installed and enabled inside Tampermonkey, but no controls will appear on ChatGPT.

## How do I know whether the script is running?

Open `https://chatgpt.com/` and check whether the bottom-right panel appears.

You should see:

- `Long Conversation Helper`
- `Collapse all`
- `Expand all`
- `Hide controls`

The Tampermonkey toolbar icon may also show that one script is running on the current page.

## Why do I not see the controls?

Check the following:

1. The current URL starts with `https://chatgpt.com/`.
2. The script is enabled in Tampermonkey.
3. The script was saved after pasting.
4. The browser was refreshed after saving.
5. Chrome has `Allow User Scripts` enabled for Tampermonkey if your browser requires it.
6. The page contains visible user questions and assistant answers.

## How do I use it?

Use per-message buttons:

- `Collapse question`
- `Expand question`
- `Collapse answer`
- `Expand answer`

Use global controls:

- `Collapse all`
- `Expand all`
- `Hide controls`

After hiding the full panel, click the small `LCH` button to open it again.

## Why does Hide controls not remove everything?

This is intentional.

The full control panel collapses into a compact `LCH` launcher so that you can reopen the panel without refreshing the page.

## Does it upload or collect my conversations?

No.

The script does not send, upload, collect, export, or transmit conversation content.

## Does it call the ChatGPT API?

No.

It only changes the local browser view.

## What does it store in localStorage?

Only UI state, such as whether a message is collapsed and whether the control panel is hidden.

It does not store message text.

## Why can refresh-state recovery be imperfect?

The script avoids storing message text. It uses URL path, message role, and message index to restore state. If the DOM order changes, the restored state may not be perfect.

## Why did a table or code block display incorrectly in an older test?

Older versions re-wrapped ChatGPT message DOM nodes, which could disturb layout. v0.1.1 avoids re-parenting message content and applies collapsed state directly to the original message node.

## Can this become a Chrome Extension later?

Possibly, but not in the MVP stage.

The current goal is to validate the browser UI enhancement with a low-maintenance userscript first.

## What should I screenshot for GitHub?

The current recommended screenshot set is:

- `screenshots/before.png`
- `screenshots/single-toggle.png`
- `screenshots/after-collapsed.png`
- `screenshots/global-controls.png`
- `screenshots/lch-launcher.png`

Screenshots for table / code-block stress tests are useful during internal testing, but they are not required for the public README.
