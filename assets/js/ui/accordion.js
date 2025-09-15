// ui/accordion.js - アコーディオン（キーボード可、aria）
export const Accordion = {
  enhance(root){
    root.classList.add('accordion');
    root.querySelectorAll('.accordion-header').forEach(btn=>{
      const panel = root.querySelector('#'+btn.getAttribute('aria-controls'));
      btn.addEventListener('click', ()=> toggle(btn, panel));
      btn.addEventListener('keydown', (e)=>{
        if (e.key==='ArrowDown') focusNext(btn);
        if (e.key==='ArrowUp') focusPrev(btn);
      });
    });
    function toggle(btn,panel){
      const expanded = btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    }
    function focusNext(btn){
      const items=[...root.querySelectorAll('.accordion-header')];
      const i=items.indexOf(btn); const n=items[(i+1)%items.length]; n?.focus();
    }
    function focusPrev(btn){
      const items=[...root.querySelectorAll('.accordion-header')];
      const i=items.indexOf(btn); const p=items[(i-1+items.length)%items.length]; p?.focus();
    }
  }
};

