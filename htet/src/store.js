// Saved results. The key and shape must stay as they are so earlier attempts keep loading.
const Qm=Object.fromEntries(D.qs.map(q=>[q.i,q]));
let S={attempts:[],cur:null,pass:60},U={theme:'light'},warned=false;
try{S=Object.assign(S,JSON.parse(localStorage.getItem('htetmock')||'{}'))}catch(e){}
try{U=Object.assign(U,JSON.parse(localStorage.getItem('htetmock-ui')||'{}'))}catch(e){}
if(!Array.isArray(S.attempts))S.attempts=[];
function save(){try{localStorage.setItem('htetmock',JSON.stringify(S))}catch(e){if(!warned){warned=true;ask('This browser is not saving your progress. Export a backup before closing.',[['OK','p']])}}}
function saveUI(){try{localStorage.setItem('htetmock-ui',JSON.stringify(U))}catch(e){}}
const sub=q=>q.t.split('.')[0],tn=t=>D.top[t][0],sn=s=>D.subj[s].replace('CS: ',''),isCS=s=>D.subj[s].startsWith('CS:'),ys=D.papers.map(p=>p[0]);
const yl=y=>y===2024?'2024 (held July 2025)':y===2026?'July 2026':''+y,pc=x=>x==null?'–':Math.round(x)+'%',pool=f=>D.qs.filter(f),qsOf=ids=>ids.map(i=>Qm[i]),res=t=>C.score(qsOf(t.ids),t.ans),full=()=>S.attempts.filter(t=>t.kind==='full');
const secF=v=>q=>v==='all'?true:v==='cs'?isCS(sub(q)):v==='noncs'?!isCS(sub(q)):sub(q)===v;
const passMark=()=>S.pass===55?82:90;
// per-topic counts for the chosen papers; July 2026 has no non-CS questions so it is left out there
function stats(P){const m={},at=C.acc(D.qs,C.latest(S.attempts),q=>q.t);for(const q of D.qs)((m[q.t]=m[q.t]||{})[q.y]=(m[q.t][q.y]||0)+1);
 return Object.entries(m).map(([t,y])=>{const s=t.split('.')[0],A=ys.filter(v=>isCS(s)||v!==2026),L=A.slice(-3),p=P.filter(v=>A.includes(v)),sum=a=>a.reduce((n,v)=>n+(y[v]||0),0);return{t,s,y,P:p,tot:sum(p),avg:p.length?sum(p)/p.length:0,seen:p.filter(v=>y[v]).length,last:sum(L)/L.length,acc:at[t]}})}
