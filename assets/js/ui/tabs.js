// ui/tabs.js - 最小タブ実装（本プロジェクトでは使用頻度少）
export const Tabs = {
  enhance(root){
    const tabs = root.querySelectorAll('[role="tab"]');
    const panels = root.querySelectorAll('[role="tabpanel"]');
    tabs.forEach((t,i)=>{
      t.addEventListener('click', ()=> activate(i));
      t.addEventListener('keydown',(e)=>{
        if (e.key==='ArrowRight') activate((i+1)%tabs.length);
        if (e.key==='ArrowLeft') activate((i-1+tabs.length)%tabs.length);
      });
    });
    function activate(i){
      tabs.forEach((t,idx)=>{ t.setAttribute('aria-selected', String(idx===i)); t.tabIndex = idx===i?0:-1;});
      panels.forEach((p,idx)=> p.hidden = idx!==i);
      tabs[i].focus();
    }
    activate(0);
  }
};

