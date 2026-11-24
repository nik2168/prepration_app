// Router. Screens register in V (html), A (after render), act (clicks), SEL (dropdowns).
const V={},A={},act={},SEL={};let view='home',arg=null,tick=null;
function go(v,a){view=v;arg=a;clearInterval(tick);tick=null;render();scrollTo(0,0)}
const TABS=[['home','Mocks','mock'],['prog','Progress','prog'],['rep','Repeats','rep'],['data','Backup','set']];
function render(){const keep=[...document.querySelectorAll('.chips,.seg')].map(e=>e.scrollLeft),fk=document.activeElement?.dataset,h=V[view]();$('#app').className='app'+(view==='mock'?' focus':'');
$('#app').innerHTML=view==='mock'?h:`<div class="side"><div class="brand"><svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true"><rect width="38" height="38" rx="12" fill="var(--pri)"/><circle cx="13" cy="13" r="4" fill="var(--on)"/><circle cx="25" cy="13" r="3.2" fill="none" stroke="var(--on)" stroke-width="1.8"/><circle cx="13" cy="25" r="3.2" fill="none" stroke="var(--on)" stroke-width="1.8"/><circle cx="25" cy="25" r="4" fill="var(--on)"/></svg><div><b>HTET mock</b><span class="sm mut">${D.name}</span></div></div><div class="exam">${select('exam','Subject',Object.entries(X).map(([k,v])=>[k,v.pick]),U.exam)}</div><nav class="nav" aria-label="Main">${TABS.map(([k,l,i])=>`<button type="button" data-go="${k}" ${view===k||(view==='result'&&k==='prog')?'aria-current="page"':''}>${icon(i)}${l}</button>`).join('')}</nav></div><main>${h}</main>`;
document.querySelectorAll('.chips,.seg').forEach((e,i)=>e.scrollLeft=keep[i]||0);if(A[view])A[view]();
if(fk){const s=fk.sel?`[data-sel="${fk.sel}"]`:fk.act?`[data-act="${fk.act}"][data-v="${fk.v||''}"]`:fk.go?`[data-go="${fk.go}"]`:'';if(s)document.querySelector('#app '+s)?.focus({preventScroll:true})}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go],[data-act]');if(!b||b.disabled)return;if(b.dataset.go)return go(b.dataset.go);act[b.dataset.act](b.dataset.v)});
document.addEventListener('change',e=>{const k=e.target.dataset?.sel;if(k&&SEL[k])SEL[k](e.target.value)});

SEL.exam=v=>{U.exam=v;saveUI();location.reload()};
