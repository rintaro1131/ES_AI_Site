// app.js - 初期化（テーマ/ナビ/スキップリンク/フェードイン）とページ別の軽い描画
// ES Modules + defer

import { Theme } from './ui/theme.js';
import { Toast } from './ui/toast.js';
import { Modal } from './ui/modal.js';
import { Copy } from './ui/copy.js';
import * as Store from './store.js';

// 交差観測でフェードイン
function initObserver() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) return;
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.08 });
  els.forEach(el=>io.observe(el));
}

function initHeader() {
  const header = document.querySelector('header.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initSkipLink() {
  const link = document.querySelector('.skip-link');
  const main = document.querySelector('main');
  if (!link || !main) return;
  link.addEventListener('click', () => main.setAttribute('tabindex', '-1'));
  link.addEventListener('blur', () => main.removeAttribute('tabindex'));
}

function initFooterMeta() {
  const last = document.querySelector('[data-js="last-updated"]');
  const sha = document.querySelector('[data-js="commit-sha"]');
  if (last) last.textContent = new Date(document.lastModified).toLocaleString();
  if (sha) sha.textContent = 'dev-0000000'; // 編集ポイント: 必要なら手動で短SHAに更新
}

// Index page sections
async function renderHome() {
  const usecaseWrap = document.querySelector('[data-js="featured-usecases"]');
  const tmplWrap = document.querySelector('[data-js="popular-templates"]');
  const faqWrap = document.querySelector('[data-js="faq-excerpt"]');
  if (usecaseWrap) {
    const list = (await Store.getUsecases()).slice().sort((a,b)=> (b.popularity||0)-(a.popularity||0)).slice(0,6);
    usecaseWrap.innerHTML = list.map(u=>`
      <article class="card reveal" tabindex="0" data-id="${u.id}" role="button" aria-label="${u.title} の詳細を開く">
        <div class="title">${u.title}</div>
        <p class="muted">${u.purpose||u.category}</p>
        <div class="meta"><span class="badge">${u.category}</span><span class="badge">${u.difficulty}</span><span class="badge">${u.time}分</span></div>
      </article>`).join('');
    const openByTarget = async (target)=>{
      const card = target.closest('[data-id]');
      if (!card) return;
      const id = card.getAttribute('data-id');
      const data = (await Store.getUsecases()).find(x=>String(x.id)===String(id));
      if (data) Modal.open(renderUsecaseModal(data));
    };

    usecaseWrap.addEventListener('click', async (e)=>{
      const card = e.target.closest('[data-id]');
      if (!card) return;
      const id = card.getAttribute('data-id');
      const data = (await Store.getUsecases()).find(x=>String(x.id)===String(id));
      if (data) Modal.open(renderUsecaseModal(data));
    });
    usecaseWrap.addEventListener('keydown', async (e)=>{
      if (e.key==='Enter' || e.key===' ') {
        e.preventDefault();
        await openByTarget(e.target);
      }
    });
  }
  if (tmplWrap) {
    const list = (await Store.getTemplates()).slice().sort((a,b)=> (b.popularity||0)-(a.popularity||0)).slice(0,3);
    tmplWrap.innerHTML = list.map(t=>`
      <article class="card reveal template-item">
        <div class="title">${t.title}</div>
        <div class="meta"><span class="badge">${t.type}</span></div>
        <div class="actions" style="margin-top:8px"><button class="btn" data-copy="${encodeURIComponent(t.body)}">コピー</button></div>
      </article>`).join('');
    Copy.bind('[data-copy]');
  }
  if (faqWrap) {
    const list = (await Store.getFAQ()).slice(0,3);
    faqWrap.innerHTML = list.map(f=>`
      <div class="card reveal"><div class="title">Q. ${f.q}</div><p>${f.a}</p></div>
    `).join('');
  }
}

function renderUsecaseModal(u){
  const tags = (u.tags||[]).map(t=>`<span class="tag">${t}</span>`).join(' ');
  const steps = (u.steps||[]).map(s=>`<li>${s}</li>`).join('');
  const materials = (u.materials||[]).map(m=>`<li>${m}</li>`).join('');
  const kpis = (u.kpis||[]).map(k=>`<li>${k}</li>`).join('');
  return `
    <header><h3>${u.title}</h3><button class="btn ghost" data-js="modal-close" aria-label="閉じる">✕</button></header>
    <div class="content">
      <p class="muted">目的: ${u.purpose||''}</p>
      <p>${tags}</p>
      <h4>効果指標</h4><ul>${kpis}</ul>
      <h4>準備物</h4><ul>${materials}</ul>
      <h4>手順</h4><ol>${steps}</ol>
      ${u.prompt ? `<h4>プロンプト</h4><pre class="template-item body">${u.prompt}</pre>`:''}
      ${u.notes ? `<p class="help">注意: ${u.notes}</p>`:''}
      ${u.download? `<p><a class="link" href="${u.download}" download>ダウンロード</a></p>`:''}
    </div>`;
}

// Templates page
async function renderTemplates(){
  const wrap = document.querySelector('[data-js="templates-list"]');
  const filter = document.querySelector('[data-js="tpl-filter"]');
  if (!wrap) return;
  let all = await Store.getTemplates();
  const render = (type) => {
    const list = type && type!=='' ? all.filter(t=>t.type===type) : all;
    wrap.innerHTML = list.map(t=>`
      <article class="card reveal template-item">
        <div class="title">${t.title}</div>
        <div class="meta"><span class="badge">${t.type}</span></div>
        <div class="body" aria-label="テンプレ本文">${t.body.replace(/\n/g,'<br>')}</div>
        <div class="actions" style="margin-top:8px">
          <button class="btn" data-copy="${encodeURIComponent(t.body)}">コピー</button>
        </div>
      </article>`).join('');
    Copy.bind('[data-copy]');
  };
  render('');
  if (filter) filter.addEventListener('change', (e)=> render(e.target.value));
}

// FAQ page
async function renderFAQ(){
  const acc = document.querySelector('[data-js="faq-accordion"]');
  if (!acc) return;
  const list = await Store.getFAQ();
  acc.innerHTML = list.map((f,i)=>`
    <div class="accordion-item">
      <h3>
        <button class="accordion-header" aria-expanded="false" aria-controls="faq-${i}" id="faq-btn-${i}">
          <span class="title">${f.q}</span>
        </button>
      </h3>
      <div id="faq-${i}" class="accordion-panel" role="region" aria-labelledby="faq-btn-${i}" hidden>
        <p>${f.a}</p>
      </div>
    </div>`).join('');
  const { Accordion } = await import('./ui/accordion.js');
  Accordion.enhance(acc);
}

// Blog page
async function renderBlog(){
  const wrap = document.querySelector('[data-js="blog-list"]');
  if (!wrap) return;
  const posts = await Store.getBlog();
  wrap.innerHTML = posts.map(p=>`
    <article class="card reveal">
      <div class="title">${p.title}</div>
      <div class="meta"><span class="badge">${(p.tags||[]).join(', ')}</span><span>${p.date}</span>・<span>${p.read}分</span></div>
      <div class="body">${p.html}</div>
    </article>`).join('');
}

// Contact form
function initContact(){
  const form = document.querySelector('[data-js="contact-form"]');
  if (!form) return;
  const live = form.querySelector('[aria-live]');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!form.checkValidity()) {
      live.textContent = '未入力/形式不備の項目があります。';
      form.reportValidity();
      return;
    }
    live.textContent = '送信しました（ダミー）。追って担当よりご連絡します。';
    form.reset();
  });
}

async function bootstrap(){
  Theme.init();
  Toast.mount();
  Modal.mount();
  Copy.init();
  initHeader();
  initSkipLink();
  initObserver();
  initFooterMeta();

  await renderHome();
  await renderTemplates();
  await renderFAQ();
  await renderBlog();
  initContact();
  // Lightweight reveal for [data-reveal]
  (function(){
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }});
    }, { threshold: 0.12 });
    items.forEach(el=> io.observe(el));
  })();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  // 既に読み込み済み（遅延インポートなど）でも初期化を走らせる
  bootstrap();
}
