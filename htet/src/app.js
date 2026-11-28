// Router. Screens register in V (html), A (after render), act (clicks), SEL (dropdowns).
const V={},A={},act={},SEL={};let view='home',arg=null,tick=null;
function go(v,a){view=v;arg=a;clearInterval(tick);tick=null;render();scrollTo(0,0)}
const TABS=[['home','Mocks','mock'],['prog','Progress','prog'],['rep','Repeats','rep'],['guide','Guide','info'],['data','Backup','set']];
function render(){const keep=[...document.querySelectorAll('.chips,.seg')].map(e=>e.scrollLeft),fk=document.activeElement?.dataset,h=V[view]();$('#app').className='app'+((view==='mock'||view==='view')?' focus':'');
$('#app').innerHTML=(view==='mock'||view==='view')?h:`<div class="side"><div class="brand"><svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true"><rect width="38" height="38" rx="12" fill="var(--pri)"/><path d="M8 11c4-1.5 8-.8 11 1.6 3-2.4 7-3.1 11-1.6v16c-4-1.2-8-.5-11 1.8-3-2.3-7-3-11-1.8z" fill="var(--on)"/><path d="M19 12.6v16.2" stroke="var(--pri)" stroke-width="1.8"/><path d="M11 15.5c2-.3 3.800 0 5.300.9M11 19.500c2-.3 3.800 0 5.300.9M27 15.500c-2-.3-3.800 0-5.300.9M27 19.500c-2-.3-3.800 0-5.300.9" fill="none" stroke="var(--pri)" stroke-width="1.400" stroke-linecap="round"/></svg><div><b>HTET mock</b><span class="sm mut">${D.name}</span></div></div><nav class="nav" aria-label="Main">${TABS.map(([k,l,i])=>`<button type="button" data-go="${k}" ${view===k||(view==='result'&&k==='prog')?'aria-current="page"':''}>${icon(i)}${l}</button>`).join('')}</nav></div><main>${h}</main>`;
document.querySelectorAll('.chips,.seg').forEach((e,i)=>e.scrollLeft=keep[i]||0);if(A[view])A[view]();
if(fk){const s=fk.sel?`[data-sel="${fk.sel}"]`:fk.act?`[data-act="${fk.act}"][data-v="${fk.v||''}"]`:fk.go?`[data-go="${fk.go}"]`:'';if(s)document.querySelector('#app '+s)?.focus({preventScroll:true})}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go],[data-act]');if(!b||b.disabled)return;if(b.dataset.go)return go(b.dataset.go);act[b.dataset.act](b.dataset.v)});
document.addEventListener('change',e=>{const k=e.target.dataset?.sel;if(k&&SEL[k])SEL[k](e.target.value)});

