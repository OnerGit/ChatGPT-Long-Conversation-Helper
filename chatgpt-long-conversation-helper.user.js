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

(function () {
  'use strict';

  /**
   * ChatGPT Long Conversation Helper
   *
   * v0.1.1 scope:
   * - Collapse / expand ChatGPT user questions and assistant answers.
   * - Keep a three-line preview with a fade mask.
   * - Add global Collapse all / Expand all controls.
   * - Hide controls into a small fixed "LCH" launcher button.
   * - Store only local collapsed/expanded state and local panel visibility.
   *
   * Privacy boundaries:
   * - No external API calls.
   * - No fetch / XHR / analytics / telemetry.
   * - No conversation export.
   * - No automatic message sending.
   * - No token, cookie, account, payment, or settings access.
   */

  const CONFIG = {
    processedAttr: 'data-clch-processed',
    roleAttr: 'data-clch-role',
    collapsedAttr: 'data-clch-collapsed',
    storagePrefix: 'clch:v0.1.1',
    legacyStoragePrefix: 'clch:v0.1.0',
    scanDebounceMs: 350,
    observerThrottleMs: 500,
    previewLines: 3,

    /**
     * Selector strategy.
     * Prefer shallow role-based selectors visible in ChatGPT's DOM.
     * Keep this section easy to update when ChatGPT's frontend changes.
     */
    roleSelectors: [
      '[data-message-author-role="user"]',
      '[data-message-author-role="assistant"]'
    ],

    ignoredAncestors: 'form, textarea, input, nav, aside, header, footer, [role="dialog"]',
    minTextLengthToProcess: 1,
    panelStateKey: 'clch:v0.1.1:panel:hidden'
  };

  let scanTimer = null;
  let observerTimer = null;

  function warn(message, error) {
    console.warn(`[CLCH] ${message}`, error || '');
  }

  function safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      warn('Failed to read localStorage.', error);
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      warn('Failed to write localStorage.', error);
    }
  }

  function getConversationStoragePrefix(prefix) {
    const path = window.location.pathname || '/';
    const normalizedPath = path.replace(/\/+$/, '') || '/';
    return `${prefix}:${normalizedPath}`;
  }

  function getRole(messageNode) {
    if (!messageNode || !(messageNode instanceof HTMLElement)) {
      return null;
    }

    const role = messageNode.getAttribute('data-message-author-role');
    if (role === 'user' || role === 'assistant') {
      return role;
    }

    return messageNode.getAttribute(CONFIG.roleAttr);
  }

  function getConversationMessageNodes() {
    const found = new Set();

    CONFIG.roleSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((node) => {
          if (isLikelyConversationMessage(node)) {
            found.add(node);
          }
        });
      } catch (error) {
        warn(`Invalid selector: ${selector}`, error);
      }
    });

    return Array.from(found);
  }

  function getMessageIndex(messageNode) {
    return getConversationMessageNodes().indexOf(messageNode);
  }

  function getStorageKey(messageNode, prefix = CONFIG.storagePrefix) {
    const role = getRole(messageNode) || 'message';
    const index = getMessageIndex(messageNode);
    return `${getConversationStoragePrefix(prefix)}:${role}:${index}:collapsed`;
  }

  function isLikelyConversationMessage(node) {
    if (!node || !(node instanceof HTMLElement)) {
      return false;
    }

    if (node.closest(CONFIG.ignoredAncestors)) {
      return false;
    }

    const role = node.getAttribute('data-message-author-role');
    if (role !== 'user' && role !== 'assistant') {
      return false;
    }

    const text = (node.innerText || '').trim();
    return text.length >= CONFIG.minTextLengthToProcess;
  }

  function injectStyles() {
    if (document.getElementById('clch-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'clch-style';
    style.textContent = `
      .clch-message {
        position: relative !important;
      }

      .clch-toolbar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        margin: 6px 0 8px 0;
        pointer-events: auto;
      }

      .clch-toggle-button,
      .clch-global-button,
      .clch-launcher-button {
        border: 1px solid rgba(120, 120, 120, 0.35);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        color: #333;
        font-size: 12px;
        line-height: 1.2;
        padding: 5px 10px;
        cursor: pointer;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        user-select: none;
      }

      .clch-toggle-button:hover,
      .clch-global-button:hover,
      .clch-launcher-button:hover {
        background: rgba(245, 245, 245, 0.98);
      }

      .clch-toggle-button[data-clch-role="user"] {
        opacity: 0.88;
      }

      .clch-collapsed-message {
        max-height: calc(${CONFIG.previewLines} * 1.55em);
        overflow: hidden !important;
        position: relative !important;
      }

      .clch-collapsed-message::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1.9em;
        pointer-events: none;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--clch-fade-bg, #ffffff));
      }

      .clch-global-controls,
      .clch-launcher {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 2147483647;
      }

      .clch-global-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        border: 1px solid rgba(120, 120, 120, 0.25);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        backdrop-filter: blur(8px);
      }

      .clch-launcher {
        display: none;
      }

      .clch-launcher-button {
        min-width: 46px;
        min-height: 38px;
        font-weight: 700;
        letter-spacing: 0.3px;
      }

      .clch-global-title {
        font-size: 12px;
        color: #555;
        text-align: center;
        margin-bottom: 2px;
        white-space: nowrap;
      }

      body.clch-panel-hidden .clch-global-controls {
        display: none !important;
      }

      body.clch-panel-hidden .clch-launcher {
        display: block !important;
      }

      @media (prefers-color-scheme: dark) {
        .clch-toggle-button,
        .clch-global-button,
        .clch-launcher-button,
        .clch-global-controls {
          background: rgba(38, 38, 38, 0.92);
          color: #f1f1f1;
          border-color: rgba(220, 220, 220, 0.22);
        }

        .clch-toggle-button:hover,
        .clch-global-button:hover,
        .clch-launcher-button:hover {
          background: rgba(55, 55, 55, 0.98);
        }

        .clch-collapsed-message::after {
          background: linear-gradient(to bottom, rgba(33, 33, 33, 0), var(--clch-fade-bg, #212121));
        }

        .clch-global-title {
          color: #d0d0d0;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getToggleLabel(role, collapsed) {
    const noun = role === 'user' ? 'question' : 'answer';
    return collapsed ? `Expand ${noun}` : `Collapse ${noun}`;
  }

  function getToolbar(messageNode) {
    const previous = messageNode.previousElementSibling;
    if (previous && previous.classList.contains('clch-toolbar')) {
      return previous;
    }
    return null;
  }

  function setCollapsed(messageNode, collapsed, persist) {
    const toolbar = getToolbar(messageNode);
    const button = toolbar ? toolbar.querySelector('.clch-toggle-button') : null;
    const role = getRole(messageNode) || 'message';

    if (!button) {
      return;
    }

    messageNode.classList.toggle('clch-collapsed-message', collapsed);
    messageNode.setAttribute(CONFIG.collapsedAttr, collapsed ? 'true' : 'false');
    button.textContent = getToggleLabel(role, collapsed);
    button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');

    if (persist) {
      safeSetStorage(getStorageKey(messageNode), collapsed ? '1' : '0');
    }
  }

  function addMessageToolbar(messageNode) {
    if (getToolbar(messageNode)) {
      return;
    }

    const role = getRole(messageNode) || 'message';
    const toolbar = document.createElement('div');
    toolbar.className = 'clch-toolbar';
    toolbar.setAttribute('data-clch-toolbar-for', role);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'clch-toggle-button';
    button.textContent = getToggleLabel(role, false);
    button.setAttribute('data-clch-role', role);
    button.setAttribute('aria-label', `Collapse or expand this ${role} message`);
    button.setAttribute('aria-expanded', 'true');

    button.addEventListener('click', () => {
      const currentlyCollapsed = messageNode.getAttribute(CONFIG.collapsedAttr) === 'true';
      setCollapsed(messageNode, !currentlyCollapsed, true);
    });

    toolbar.appendChild(button);
    messageNode.parentNode.insertBefore(toolbar, messageNode);
  }

  function restoreState(messageNode) {
    const saved = safeGetStorage(getStorageKey(messageNode));
    const legacySaved = safeGetStorage(getStorageKey(messageNode, CONFIG.legacyStoragePrefix));
    setCollapsed(messageNode, saved === '1' || legacySaved === '1', false);
  }

  function processMessage(messageNode) {
    try {
      if (!messageNode || messageNode.getAttribute(CONFIG.processedAttr) === 'true') {
        return;
      }

      const role = getRole(messageNode);
      if (role !== 'user' && role !== 'assistant') {
        return;
      }

      messageNode.classList.add('clch-message');
      messageNode.setAttribute(CONFIG.processedAttr, 'true');
      messageNode.setAttribute(CONFIG.roleAttr, role);

      addMessageToolbar(messageNode);
      restoreState(messageNode);
    } catch (error) {
      warn('Failed to process message.', error);
    }
  }

  function scanMessages() {
    getConversationMessageNodes().forEach(processMessage);
  }

  function scheduleScan() {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(scanMessages, CONFIG.scanDebounceMs);
  }

  function setAllMessagesCollapsed(collapsed) {
    getConversationMessageNodes().forEach((node) => {
      if (node.getAttribute(CONFIG.processedAttr) !== 'true') {
        processMessage(node);
      }
      setCollapsed(node, collapsed, true);
    });
  }

  function setPanelHidden(hidden) {
    document.body.classList.toggle('clch-panel-hidden', hidden);
    safeSetStorage(CONFIG.panelStateKey, hidden ? '1' : '0');
  }

  function createGlobalControls() {
    if (document.getElementById('clch-global-controls')) {
      return;
    }

    const controls = document.createElement('div');
    controls.id = 'clch-global-controls';
    controls.className = 'clch-global-controls';

    const title = document.createElement('div');
    title.className = 'clch-global-title';
    title.textContent = 'Long Conversation Helper';

    const collapseAll = document.createElement('button');
    collapseAll.type = 'button';
    collapseAll.className = 'clch-global-button';
    collapseAll.textContent = 'Collapse all';
    collapseAll.addEventListener('click', () => setAllMessagesCollapsed(true));

    const expandAll = document.createElement('button');
    expandAll.type = 'button';
    expandAll.className = 'clch-global-button';
    expandAll.textContent = 'Expand all';
    expandAll.addEventListener('click', () => setAllMessagesCollapsed(false));

    const hide = document.createElement('button');
    hide.type = 'button';
    hide.className = 'clch-global-button';
    hide.textContent = 'Hide controls';
    hide.addEventListener('click', () => setPanelHidden(true));

    controls.appendChild(title);
    controls.appendChild(collapseAll);
    controls.appendChild(expandAll);
    controls.appendChild(hide);

    const launcher = document.createElement('div');
    launcher.id = 'clch-launcher';
    launcher.className = 'clch-launcher';

    const launcherButton = document.createElement('button');
    launcherButton.type = 'button';
    launcherButton.className = 'clch-launcher-button';
    launcherButton.textContent = 'LCH';
    launcherButton.setAttribute('aria-label', 'Open Long Conversation Helper controls');
    launcherButton.addEventListener('click', () => setPanelHidden(false));

    launcher.appendChild(launcherButton);

    document.body.appendChild(controls);
    document.body.appendChild(launcher);

    setPanelHidden(safeGetStorage(CONFIG.panelStateKey) === '1');
  }

  function startObserver() {
    const target = document.querySelector('main') || document.body;
    if (!target) {
      return;
    }

    const observer = new MutationObserver(() => {
      window.clearTimeout(observerTimer);
      observerTimer = window.setTimeout(scheduleScan, CONFIG.observerThrottleMs);
    });

    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    try {
      injectStyles();
      createGlobalControls();
      scanMessages();
      startObserver();
    } catch (error) {
      warn('Initialization failed.', error);
    }
  }

  init();
})();
