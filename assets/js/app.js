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

// ROI 計算
function calcROI(scope){
  const get=(name)=>Number(scope.querySelector(`[name="${name}"]`)?.value||0);
  const wage=get('wage'), before=get('before'), after=get('after'), perWeek=get('perWeek'), perMonth=get('perMonth');
  const saveMin=Math.max(0,before-after)*perWeek*perMonth;
  const monthly=Math.round((saveMin/60)*wage), yearly=monthly*12;
  scope.querySelector('[data-out]').textContent=`月の削減額：${monthly.toLocaleString()} 円 / 年間：${yearly.toLocaleString()} 円`;
}
document.querySelectorAll('[data-roi]').forEach(form=>{
  form.addEventListener('input',()=>calcROI(form)); calcROI(form);
});

