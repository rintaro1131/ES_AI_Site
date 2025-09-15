// features/search.js - カタログ検索/フィルタ/タグトグル
import * as Store from '../store.js';
import { Modal } from '../ui/modal.js';

function renderCard(u){
  const tags = (u.tags||[]).map(t=>`<button class="tag" data-tag="${t}">${t}</button>`).join(' ');
  return `<article class="card" data-id="${u.id}">
    <div class="title">${u.title}</div>
    <p class="muted">${u.purpose||u.category}</p>
    <div class="meta"><span class="badge">${u.category}</span><span>${u.time}分</span><span>${u.difficulty}</span></div>
    <div class="tags" style="margin-top:6px">${tags}</div>
  </article>`;
}

function renderModal(u){
  const steps = (u.steps||[]).map(s=>`<li>${s}</li>`).join('');
  return `
    <header><h3>${u.title}</h3><button class="btn ghost" data-js="modal-close" aria-label="閉じる">✕</button></header>
    <div class="content">
      <p class="muted">目的: ${u.purpose||''}</p>
      <p>タグ: ${(u.tags||[]).join(', ')}</p>
      <h4>手順</h4><ol>${steps}</ol>
      ${u.prompt?`<h4>プロンプト</h4><pre class="template-item body">${u.prompt}</pre>`:''}
    </div>`;
}

export async function initCatalog(){
  const q = document.querySelector('[data-js="q"]');
  const selCat = document.querySelector('[data-js="f-cat"]');
  const selDif = document.querySelector('[data-js="f-dif"]');
  const selTime = document.querySelector('[data-js="f-time"]');
  const out = document.querySelector('[data-js="results"]');
  if (!q || !out) return;
  let all = await Store.getUsecases();
  let qtags = new Set();

  const apply = () => {
    const kw = (q.value||'').trim().toLowerCase();
    const cat = selCat?.value||''; const dif = selDif?.value||''; const time = selTime?.value||'';
    let list = all.filter(u=>{
      const inTitle = u.title.toLowerCase().includes(kw);
      const inTags = (u.tags||[]).join(' ').toLowerCase().includes(kw);
      const okKw = kw==='' || inTitle || inTags;
      const okCat = !cat || u.category===cat;
      const okDif = !dif || u.difficulty===dif;
      const okTime = !time || (time==='<=5'? u.time<=5 : time==='<=10'? u.time<=10 : u.time>10);
      const okTag = qtags.size===0 || (u.tags||[]).some(t=> qtags.has(t));
      return okKw && okCat && okDif && okTime && okTag;
    });
    out.innerHTML = list.map(renderCard).join('');
  };

  apply();

  q.addEventListener('input', apply);
  selCat?.addEventListener('change', apply);
  selDif?.addEventListener('change', apply);
  selTime?.addEventListener('change', apply);

  out.addEventListener('click', (e)=>{
    const tag = e.target.closest('[data-tag]');
    if (tag){
      const t = tag.getAttribute('data-tag');
      if (qtags.has(t)) qtags.delete(t); else qtags.add(t);
      tag.classList.toggle('active');
      apply();
      return;
    }
    const card = e.target.closest('[data-id]');
    if (card){
      const id = card.getAttribute('data-id');
      const u = all.find(x=> String(x.id)===String(id));
      if (u) Modal.open(renderModal(u));
    }
  });
}

