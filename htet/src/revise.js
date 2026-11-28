// Revise: one module per subject from the official syllabus (htet/syllabus.json), a notes page per topic (htet/revise/<id>.html).
// S.done[id]: +time = marked done, -time = unmarked; the newer one wins when syncing.
const TM={};for(const m of D.mods)for(const u of m.units)for(const t of u.topics)TM[t.id]={...t,m};
const isDone=id=>(S.done[id]||0)>0,tq=t=>pool(q=>t.tags.includes(q.t)),mtop=m=>m.units.flatMap(u=>u.topics);
const tick_=(id,l)=>`<button type="button" class="tick" data-act="tdone" data-v="${id}" aria-pressed="${isDone(id)}" aria-label="${isDone(id)?'Done':'Mark done'}: ${esc(l)}">${isDone(id)?'✓':''}</button>`;
V.rev=()=>`<div class="stack"><div><h1>Revise</h1><p class="mut" style="margin-top:4px">${esc(D.sylsrc)}</p></div>
<div class="grid">${D.mods.map(m=>{const L=mtop(m),d=L.filter(t=>isDone(t.id)).length;return `<button type="button" class="card paper" data-act="mod" data-v="${m.id}"><span><b>${esc(m.name)}</b><span class="sm mut">${m.marks} marks, ${L.length} topics</span></span>${bar(100*d/L.length)}<span class="sm mut num">${d} of ${L.length} done</span></button>`}).join('')}</div>
<div class="grid"><button type="button" class="card paper tint" data-go="guide"><b>Exam guide</b><span class="sm">Dates, pass marks, cutoffs and the 30-day plan.</span></button><button type="button" class="card paper tint" data-go="rep"><b>What repeats</b><span class="sm">Which topics gave the most marks in past papers.</span></button></div></div>`;
V.revs=()=>{const m=D.mods.find(x=>x.id===arg);return `<div class="stack"><div>${btn('Revise','rev','','l s')}</div><h1>${esc(m.name)}</h1>
${m.units.map(u=>`<section class="card"><h2 style="margin-bottom:4px">${esc(u.name)}</h2>${u.topics.map(t=>{const n=tq(t).length;return `<div class="li">${tick_(t.id,t.name)}<div class="grow"><button type="button" class="lnk" data-act="topen" data-v="${t.id}">${esc(t.name)}</button><p class="sm mut">${n?n+' past question'+(n===1?'':'s'):'Not asked yet'}${D.notes[t.id]?'':', notes coming'}</p></div></div>`}).join('')}</section>`).join('')}</div>`};
V.revt=()=>{const t=TM[arg],Q=tq(t),G=D.rep.map((g,i)=>[g,i]).filter(([g])=>t.tags.includes(Qm[g[0]].t));
return `<div class="stack notes-page"><div class="row">${btn(esc(t.m.name),'mod',t.m.id,'l s')}</div><div class="row bet" style="flex-wrap:nowrap;align-items:flex-start"><h1 class="grow">${esc(t.name)}</h1>${tick_(t.id,t.name)}</div>
<section class="card tint"><p class="sm"><b>Syllabus:</b> ${esc(t.syl)}</p></section>
<article class="card notes">${D.notes[t.id]||'<p class="mut">Notes for this topic are coming. Practise its past questions meanwhile.</p>'}</article>
<div class="row">${btn(`Practise ${Q.length} past question${Q.length===1?'':'s'}`,'tprac',t.id,'p',!Q.length)}${aiOn()?btn('Ask AI about this topic','aitopic',t.id):''}</div>
${G.length?`<section class="card"><h2>Asked again</h2>${G.map(([g,i])=>`<div class="li"><span class="b y" style="width:40px;height:40px">${g.length}×</span><p class="grow sm num">${g.map(x=>Qm[x].y+' Q'+Qm[x].n).join(', ')}</p>${btn('Try','grp',i,'s')}</div>`).join('')}</section>`:''}</div>`};
Object.assign(act,{rev(){go('rev')},mod(v){go('revs',v)},topen(v){go('revt',v)},
tdone(v){S.done[v]=isDone(v)?-Date.now():Date.now();save();render();sync()},
tprac(v){const t=TM[v];prac(shuf(tq(t)).map(q=>q.i),'Practice: '+t.name)}});
