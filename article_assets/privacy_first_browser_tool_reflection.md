# Small Browser Tools for AI Workflows Should Be Privacy-First by Default

## Article purpose

Explain why small AI workflow browser tools should start with privacy-first constraints, especially when they run on pages containing sensitive prompts, research notes, business planning, or technical drafts.

Use ChatGPT Long Conversation Helper as a concrete example of a tool that improves workflow without collecting or transmitting conversation content.

## Target reader

- Developers building browser productivity tools.
- Technical writers covering AI workflows.
- AI power users who rely on long conversations.
- Engineers interested in privacy-conscious product design.

## Section headings

1. AI workflow tools often sit next to sensitive content
2. The difference between UI enhancement and data extraction
3. Why local-first is a strong default
4. Defining negative requirements early
5. Avoiding unnecessary permissions
6. Avoiding external APIs for simple UI tasks
7. Storing UI state without storing user content
8. Making privacy visible in README and docs
9. Designing for maintainability, not stealth
10. When a userscript should not become a browser extension
11. Lessons from the MVP
12. Conclusion

## Key code snippets

### Explicit page scope

```javascript
// @match https://chatgpt.com/*
```

### No external dependency

```javascript
// @grant none
```

### Store only UI state

```javascript
const value = collapsed ? '1' : '0';
localStorage.setItem(key, value);
```

### Avoid message-content storage

```javascript
// Do not hash, upload, export, or persist message text.
```

## Screenshots needed

1. README privacy section.
2. privacy.md file.
3. Userscript metadata block.
4. localStorage example showing collapse state only.
5. Collapsed UI state in the browser.

## Risks to mention

- Browser tools can easily over-collect.
- A feature that starts as convenience can become data extraction if boundaries are unclear.
- Users may not distinguish local UI enhancement from scraping.
- Documentation is part of the product trust layer.
- Privacy-first constraints may reduce features, but improve credibility.
