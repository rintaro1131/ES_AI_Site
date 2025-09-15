// ui/toast.js - 右上トースト。role="status"
export const Toast = {
  mount(){
    if (document.querySelector('.toast-region')) return;
    const region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('role','status');
    region.setAttribute('aria-live','polite');
    document.body.appendChild(region);
  },
  show(message, ms=2000){
    const r = document.querySelector('.toast-region');
    if (!r) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    r.appendChild(el);
    setTimeout(()=> el.remove(), ms);
  }
};

