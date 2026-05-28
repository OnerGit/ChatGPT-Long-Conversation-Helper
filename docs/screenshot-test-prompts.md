# Screenshot Test Prompts

Use a fresh ChatGPT conversation for public screenshots. Do not use private or sensitive conversations.

## Screenshot conversation setup

Start a new ChatGPT conversation and use the prompts below.

### Prompt 1: project planning answer

```text
I am building a small browser productivity tool for long AI conversations. Please explain why long multi-turn technical conversations become hard to navigate, and propose a simple MVP that only changes the local browser UI without exporting or uploading any conversation content.
```

### Prompt 2: comparison table stress test

```text
Create a comparison table for three approaches to improving long AI conversations: manual scrolling, browser bookmarks, and local collapse/expand controls. Compare them across privacy, implementation cost, usability, and maintenance risk. After the table, explain the trade-offs in a few paragraphs.
```

### Prompt 3: code block stress test

```text
Write a small JavaScript example that uses MutationObserver to detect newly added message nodes on a dynamic web page. Include comments and explain how it works. Put the code inside a fenced JavaScript code block.
```

### Prompt 4: long mixed-format answer

```text
Design a manual test checklist for a Tampermonkey userscript that collapses and expands long questions and answers. Include sections for installation, single-message controls, global controls, dynamic messages, localStorage state, and privacy checks.
```

### Prompt 5: long user question screenshot material

```text
I want to test whether a long user question can be collapsed. Please treat this as a long requirements message. The tool should support long conversations, question collapse, answer collapse, three-line previews, a fade mask, global controls, a compact launcher after hiding controls, localStorage state, no external requests, no telemetry, no API calls, and clear limitations. Please summarize this requirement and propose a development plan.
```

## Required screenshots for the current README

### before.png

Take this before clicking any collapse controls.

Goal: show that the conversation is long and dense.

### single-toggle.png

Take this when a single question or answer is expanded and its collapse button is visible.

Goal: show the per-message button.

### after-collapsed.png

Click `Collapse all`, then take a screenshot.

Goal: show several messages collapsed to three-line previews.

### global-controls.png

Show the bottom-right global panel with:

- Collapse all
- Expand all
- Hide controls

### lch-launcher.png

Click `Hide controls`, then take a screenshot of the compact `LCH` launcher.

## Optional internal testing screenshots

You can use Prompt 2 or Prompt 3 to test Markdown tables and fenced code blocks.

These screenshots are useful for development QA, but they are not required for the public README.
