(() => {
  'use strict';
  const patterns = {light: 'Forest dots', dark: 'Midnight gold', geometric: 'Windowpane'};
  const themes = {default: 'Everyday', thanksgiving: 'Thanksgiving', christmas: 'Christmas'};
  const views = {1: 'Overall room', 2: 'Textile detail', 3: 'Tabletop detail', 4: 'Pattern & download'};
  const state = {pattern: 'light', theme: 'default', view: '1'};
  const image = document.querySelector('#sample-image');
  const status = document.querySelector('#sample-status');
  const dialog = document.querySelector('#sample-dialog');
  const expand = document.querySelector('#expand-sample');
  let revision = 0;
  const path = (view) => `assets/samples/${state.pattern}-${state.theme}-${view}.webp?v=pillows4`;
  async function render() {
    const current = ++revision;
    const src = path(state.view);
    const caption = `${patterns[state.pattern]} · ${themes[state.theme]}`;
    const viewCaption = `0${state.view} / ${views[state.view]}`;
    status.textContent = 'Loading sample…';
    expand.setAttribute('aria-busy', 'true');
    for (const key of ['pattern', 'theme', 'view']) {
      document.querySelectorAll(`[data-${key}]`).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[key] === state[key])));
    }
    try {
      const preload = new Image(); preload.src = src;
      await preload.decode();
      if (current !== revision) return;
      image.src = src;
      image.alt = `${caption} · ${views[state.view]}`;
      document.querySelector('#sample-caption').textContent = caption;
      document.querySelector('#view-caption').textContent = viewCaption;
      document.querySelectorAll('[data-view]').forEach(button => { button.querySelector('img').src = path(button.dataset.view); });
      status.textContent = `${caption} · ${views[state.view]}. Pre-rendered demonstration.`;
    } catch {
      if (current === revision) status.textContent = 'This sample could not load. Select another option to try again.';
    } finally {
      if (current === revision) expand.setAttribute('aria-busy', 'false');
    }
  }
  for (const key of ['pattern', 'theme', 'view']) {
    document.querySelectorAll(`[data-${key}]`).forEach(button => button.addEventListener('click', () => {
      state[key] = button.dataset[key]; render();
    }));
  }
  expand.addEventListener('click', () => {
    document.querySelector('#large-sample').src = image.src;
    document.querySelector('#large-sample').alt = image.alt;
    document.querySelector('#large-caption').textContent = image.alt;
    dialog.showModal();
  });
  document.querySelector('#close-sample').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
})();
