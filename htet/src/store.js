// Saved results. The key and shape must stay as they are so earlier attempts keep loading.
let U={theme:'light'};
try{U=Object.assign(U,JSON.parse(localStorage.getItem('htetmock-ui')||'{}'))}catch(e){}
const SK='htetmock',Qm=Object.fromEntries(D.qs.map(q=>[q.i,q]));
let S={attempts:[],cur:null,pass:60,cleared:0},warned=false;
try{S=Object.assign(S,JSON.parse(localStorage.getItem(SK)||'{}'))}catch(e){}
if(!Array.isArray(S.attempts))S.attempts=[];
// results or an unfinished mock that use a removed paper (CS 2018, 2019) cannot be shown, so they are dropped
S.attempts=S.attempts.filter(t=>t.ids.every(i=>Qm[i]));if(S.cur&&!S.cur.ids.every(i=>Qm[i]))S.cur=null;
function save(){try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){if(!warned){warned=true;ask('This browser is not saving your progress. Export a backup before closing.',[['OK','p']])}}}
// Cloud sync (api/sync.js). Does nothing without a key or when opened as a local file; a failure leaves local results as they are.
let syncMsg='';
async function sync(){if(!U.key||!location.protocol.startsWith('http'))return;
 const sent=new Set(S.attempts.map(t=>t.id)),was=JSON.stringify(S.attempts);
 try{const r=await fetch('/api/sync',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+U.key},body:JSON.stringify({attempts:S.attempts,cleared:S.cleared})}),o=await r.json().catch(()=>({}));
  if(!r.ok||!Array.isArray(o.attempts))throw Error(o.error||'Server error '+r.status);
  S.cleared=Math.max(S.cleared,o.cleared);
  // keep anything finished while the request was in flight
  S.attempts=[...o.attempts,...S.attempts.filter(t=>!sent.has(t.id))].filter(t=>(t.at||t.date)>S.cleared&&t.ids.every(i=>Qm[i])).sort((a,b)=>a.date-b.date);
  save();syncMsg='Last synced '+new Date().toLocaleTimeString()}
 catch(e){syncMsg='Not synced: '+e.message}
 if(view==='data'||(view!=='mock'&&view!=='view'&&was!==JSON.stringify(S.attempts)))render()}
// also sync on returning to an open app or reconnecting; focus and visibilitychange often fire together
let autoAt=0;
function autoSync(){if(document.visibilityState==='visible'&&Date.now()-autoAt>5000){autoAt=Date.now();sync()}}
addEventListener('focus',autoSync);addEventListener('online',autoSync);document.addEventListener('visibilitychange',autoSync);
function saveUI(){try{localStorage.setItem('htetmock-ui',JSON.stringify(U))}catch(e){}}
const sub=q=>q.t.split('.')[0],tn=t=>D.top[t][0],sn=s=>D.subj[s].replace(D.mp||'',''),isCS=s=>!!D.mp&&D.subj[s].startsWith(D.mp),ys=D.papers.map(p=>p[0]);
const yl=y=>y===2024?'2024 (held July 2025)':y===2026?'July 2026':''+y,pc=x=>x==null?'–':Math.round(x)+'%',pool=f=>D.qs.filter(f),qsOf=ids=>ids.map(i=>Qm[i]),res=t=>C.score(qsOf(t.ids),t.ans,t.neg||0),mk=x=>+x.toFixed(2),full=()=>S.attempts.filter(t=>t.kind==='full');
const secF=v=>q=>v==='all'?true:v==='cs'?isCS(sub(q)):v==='noncs'?!isCS(sub(q)):sub(q)===v;
const passMark=(n=150)=>n===150?(S.pass===55?82:90):Math.round(S.pass/100*n);
// per-topic counts for the chosen papers; July 2026 has no non-CS questions so it is left out there
function stats(P){const m={},at=C.acc(D.qs,C.latest(S.attempts),q=>q.t);for(const q of D.qs)((m[q.t]=m[q.t]||{})[q.y]=(m[q.t][q.y]||0)+1);
 return Object.entries(m).map(([t,y])=>{const s=t.split('.')[0],A=ys.filter(v=>isCS(s)||v!==D.part),L=A.slice(-3),p=P.filter(v=>A.includes(v)),sum=a=>a.reduce((n,v)=>n+(y[v]||0),0);return{t,s,y,P:p,tot:sum(p),avg:p.length?sum(p)/p.length:0,seen:p.filter(v=>y[v]).length,last:sum(L)/L.length,acc:at[t]}})}
