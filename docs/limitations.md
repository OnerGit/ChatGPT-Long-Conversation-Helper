# Limitations

ChatGPT Long Conversation Helper is a best-effort local UI enhancement.

It depends on the visible ChatGPT web page structure. It does not use an official ChatGPT extension API.

## DOM dependency

The script detects conversation messages through browser DOM selectors.

The current selector strategy prefers shallow role-based selectors such as:

```javascript
[data-message-author-role="user"]
[data-message-author-role="assistant"]
```

This is more maintainable than relying on deep class-name chains.

However, if ChatGPT changes its frontend DOM structure, the script may stop detecting messages correctly.

## Question and answer targeting

The script is designed to process visible user questions and assistant answers.

It does not intentionally process the sidebar, input box, settings, account pages, payment pages, or modal dialogs.

However, because this is a DOM-based userscript, future page changes may require selector updates.

## Streaming replies

ChatGPT replies may be generated dynamically.

The script uses `MutationObserver` to detect new content.

In some cases:

- a newly generated answer may not receive controls immediately;
- a streaming answer may be processed only after more DOM changes;
- refreshing the page may help.

## Collapse state recovery

The script stores only collapsed / expanded state in `localStorage`.

It does not store message text.

State keys are based on:

- script namespace;
- current URL path;
- message role;
- message index.

This means state recovery is best-effort.

Collapse state may not restore perfectly if:

- the conversation order changes;
- messages are deleted;
- the DOM structure changes;
- ChatGPT changes URL behavior;
- the same conversation renders differently after refresh.

## Label feature is not included yet

The project name intentionally leaves room for future workflow features such as message labels.

The first MVP does not include labels.

This keeps the first version small, testable, and easy to review.

## No data export

This project intentionally does not provide conversation export.

It is not a scraper.

It is not a data extraction tool.

It is not an automation agent.

## No API integration

The script does not call:

- ChatGPT API;
- OpenAI API;
- third-party APIs;
- analytics APIs.

## No official support

This is a third-party local userscript.

It is not affiliated with OpenAI.

It is not an official ChatGPT feature.

## Browser support

The MVP is intended for browsers that support Tampermonkey and modern browser APIs.

Manual testing should be done before relying on it for daily workflow.
