// テーマトグル
const html=document.documentElement,key="theme",btn=document.querySelector('[data-js="theme"]');
const saved=localStorage.getItem(key); if(saved) html.setAttribute("data-theme", saved);
btn?.addEventListener("click",()=>{const next=html.getAttribute("data-theme")==="light"?"dark":"light";html.setAttribute("data-theme",next);localStorage.setItem(key,next);});

// 更新日
const upd=document.getElementById("updated"); if(upd){const d=new Date();upd.textContent=`最終更新: ${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;}

// FAQアコーディオン
document.querySelectorAll('[data-acc]').forEach(acc=>{
  acc.addEventListener('click', e=>{
    const p=acc.nextElementSibling; const open=acc.getAttribute('aria-expanded')==='true';
    acc.setAttribute('aria-expanded', String(!open));
    p.hidden=open;
  });
});

// コピー（テンプレ用）
document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const src=btn.previousElementSibling?.textContent||'';
    try{await navigator.clipboard.writeText(src); alert('コピーしました');}catch(e){/* noop */}
  });
});

// ROI 機能は削除（フォームがないため）
