// features/roi.js - ROI計算と簡易チャート
import { Toast } from '../ui/toast.js';

const qs = sel => document.querySelector(sel);

export function initROI(){
  const wage = qs('[data-js="wage"]');
  const before = qs('[data-js="before"]');
  const after = qs('[data-js="after"]');
  const perWeek = qs('[data-js="per-week"]');
  const perMonth = qs('[data-js="per-month"]');
  const mTime = qs('[data-js="m-time"]');
  const mCost = qs('[data-js="m-cost"]');
  const yTime = qs('[data-js="y-time"]');
  const yCost = qs('[data-js="y-cost"]');
  const share = qs('[data-js="share"]');
  const canvas = qs('[data-js="chart"]');
  if (!wage || !canvas) return;

  const ctx = canvas.getContext('2d');
  function val(n){ const v = parseFloat(n.value); return isFinite(v)? v: 0; }

  function compute(){
    const wageV = val(wage), b = val(before), a = val(after), pw = val(perWeek), pm = val(perMonth);
    const oneSave = Math.max(b - a, 0);
    const mSavedMin = oneSave * pw * pm;
    const ySavedMin = mSavedMin * 12;
    const mSavedCost = (mSavedMin/60) * wageV;
    const ySavedCost = mSavedCost * 12;
    mTime.textContent = `${mSavedMin.toFixed(0)} 分`;
    yTime.textContent = `${ySavedMin.toFixed(0)} 分`;
    mCost.textContent = `¥${Math.round(mSavedCost).toLocaleString()}`;
    yCost.textContent = `¥${Math.round(ySavedCost).toLocaleString()}`;
    draw(b,a);
  }

  function draw(b,a){
    const dpr = window.devicePixelRatio||1; const W=canvas.clientWidth, H=160;
    canvas.width = W*dpr; canvas.height = H*dpr; canvas.style.height = H+'px';
    const g = ctx; g.scale(dpr,dpr); g.clearRect(0,0,W,H);
    const max = Math.max(b,a,1);
    const bw = Math.max((b/max)* (W-60), 8), aw = Math.max((a/max)*(W-60), 8);
    const y1=40, y2=110; const r=10;
    // axes labels
    g.fillStyle='#9aa4c7'; g.font='14px system-ui'; g.fillText('Before', 10, y1+6);
    g.fillText('After', 10, y2+6);
    // bars
    g.fillStyle=getCSS('--accent'); roundRect(g, 80, y1-18, bw, 24, r); g.fill();
    g.fillStyle=getCSS('--accent-2'); roundRect(g, 80, y2-18, aw, 24, r); g.fill();
    // values
    g.fillStyle=getCSS('--text'); g.fillText(`${b.toFixed(1)} 分`, 90+bw, y1+6);
    g.fillText(`${a.toFixed(1)} 分`, 90+aw, y2+6);
  }

  function roundRect(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
  function getCSS(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  function syncQuery(){
    const params = new URLSearchParams({w:wage.value,b:before.value,a:after.value,pw:perWeek.value,pm:perMonth.value});
    history.replaceState(null,'',`?${params.toString()}`);
  }

  function loadFromQuery(){
    const p = new URLSearchParams(location.search);
    if (p.size===0) return;
    if (p.get('w')) wage.value = p.get('w');
    if (p.get('b')) before.value = p.get('b');
    if (p.get('a')) after.value = p.get('a');
    if (p.get('pw')) perWeek.value = p.get('pw');
    if (p.get('pm')) perMonth.value = p.get('pm');
  }

  [wage,before,after,perWeek,perMonth].forEach(i=> i.addEventListener('input', ()=>{ compute(); syncQuery(); }));
  share?.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(location.href);
      Toast.show('URLをコピーしました');
    }catch{ Toast.show('コピーできません。アドレスバーからコピーしてください。'); }
  });

  loadFromQuery();
  compute();
}

