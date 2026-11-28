// Ask AI (api/ai.js). Needs the sync key and the hosted page; answers are shown, not saved.
const aiOn=()=>!!U.key&&location.protocol.startsWith('http');
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^\s*[*-] /gm,'• ');
let aiCtx='';
function aiSheet(title,body){sheet(`<div class="stack"><div class="row bet" style="flex-wrap:nowrap;align-items:flex-start"><h2 class="grow">${esc(title)}</h2><button type="button" class="btn s" data-close>Close</button></div>${body}<div id="aiout" class="ai-out" role="status" aria-live="polite"></div></div>`)}
async function askAI(q){const o=$('#aiout');if(!o)return;o.innerHTML='<p class="mut">Thinking…</p>';
 try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+U.key},body:JSON.stringify({q})}),j=await r.json().catch(()=>({}));
  if(!r.ok||!j.text)throw Error(j.error||'Server error '+r.status);if($('#aiout')===o)o.innerHTML=`<div class="ai-txt">${md(j.text)}</div>`}
 catch(e){if($('#aiout')===o)o.innerHTML=`<p class="mut">Not answered: ${esc(e.message)}</p>`}}
const aiQ=q=>`HTET ${yl(q.y)} Q${q.n} (${sn(sub(q))}: ${tn(q.t)})\n${q.x}\n${q.o.map((o,k)=>'ABCD'[k]+') '+o).join('\n')}\n`+(q.a==='*'?'Official key: mark given to everyone (question was faulty).':'Official answer: '+q.a.map(k=>'ABCD'[k-1]).join(' or '))+(q.note?`\nNote: ${q.note}`:'');
const aiBox=ph=>`<form class="row ai-ask" data-aiform style="flex-wrap:nowrap"><input class="inp grow" id="aiq" placeholder="${esc(ph)}" autocomplete="off" enterkeyhint="send" maxlength="500">${btn('Ask','aiask','','p')}</form>`;
Object.assign(act,{
 ai(v){const q=Qm[v];aiCtx=aiQ(q);aiSheet('AI: '+yl(q.y)+' Q'+q.n,aiBox('Ask a follow-up'));askAI(aiCtx)},
 aitopic(v){const t=TM[v];aiCtx=`Topic from the HTET PGT syllabus: ${t.m.name} > ${t.name}. Official syllabus text: ${t.syl}\n`;aiSheet('AI: '+t.name,aiBox('For example: difference between TCP and UDP'));$('#aiq').focus()},
 aiask(){const v=$('#aiq').value.trim();if(!v)return;$('#aiq').value='';$('#aiq').blur();askAI(aiCtx+'\nStudent asks: '+v)}});
document.addEventListener('submit',e=>{if(e.target.matches('[data-aiform]')){e.preventDefault();act.aiask()}});
