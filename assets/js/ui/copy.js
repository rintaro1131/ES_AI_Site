// ui/copy.js - 1クリックコピー。失敗時は選択して案内
import { Toast } from './toast.js';

export const Copy = {
  init(){
    this.bind('[data-copy]');
  },
  bind(selector){
    document.querySelectorAll(selector).forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const text = decodeURIComponent(btn.getAttribute('data-copy')||'');
        try{
          await navigator.clipboard.writeText(text);
          Toast.show('コピーしました');
        }catch(err){
          // fallback: 選択状態にして案内
          const ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
          Toast.show('コピーできない環境です。選択してコピーしてください。');
        }
      });
    });
  }
};

