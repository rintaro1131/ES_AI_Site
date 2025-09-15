// ui/theme.js - テーマトグル（localStorage保持）
export const Theme = {
  init(){
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    const btn = document.querySelector('[data-js="theme-toggle"]');
    if (btn) btn.addEventListener('click', ()=> this.toggle());
    this.syncLabel();
  },
  toggle(){
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'light' ? null : 'light';
    if (next) document.documentElement.setAttribute('data-theme', next); else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', next || 'dark');
    this.syncLabel();
  },
  syncLabel(){
    const btn = document.querySelector('[data-js="theme-toggle"]');
    if (!btn) return;
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-pressed', String(light));
    btn.textContent = light ? 'ダークにする' : 'ライトにする';
  }
};

