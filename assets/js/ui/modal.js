// ui/modal.js - モーダル（フォーカストラップ、ESC/オーバレイで閉じる）
export const Modal = {
  mount(){
    if (document.querySelector('.modal-backdrop')) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="詳細"></div>`;
    backdrop.addEventListener('click', (e)=>{
      if (e.target === backdrop) Modal.close();
    });
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') Modal.close();
    });
    document.body.appendChild(backdrop);
  },
  open(html){
    const bd = document.querySelector('.modal-backdrop');
    const m = bd?.querySelector('.modal');
    if (!bd || !m) return;
    m.innerHTML = html;
    bd.classList.add('open');
    // close button
    m.querySelector('[data-js="modal-close"]')?.addEventListener('click', ()=>Modal.close());
    // focus trap
    const focusables = m.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0]; const last = focusables[focusables.length-1];
    if (first) first.focus();
    m.addEventListener('keydown',(e)=>{
      if (e.key !== 'Tab' || focusables.length===0) return;
      if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    });
  },
  close(){
    document.querySelector('.modal-backdrop')?.classList.remove('open');
  }
};

