// pure scoring functions (also run by test.js)
const C={
 ok:(q,a)=>q.a==='*'?true:!!a&&q.a.includes(a),          // '*' = mark to all, as in the official key
 score(qs,ans){let r={n:qs.length,c:0,w:0,s:0};for(const q of qs){const a=ans[q.i];if(C.ok(q,a))r.c++;else if(a)r.w++;else r.s++}r.pct=r.n?100*r.c/r.n:0;return r},
 avg(l){return l.length?l.reduce((a,b)=>a+b,0)/l.length:null},
 latest(attempts){const m={};for(const t of [...attempts].sort((a,b)=>a.date-b.date))for(const i in t.ans)m[i]=t.ans[i];return m},
 // accuracy on each question's latest answer; unanswered questions are not counted
 acc(qs,latest,key){const m={};for(const q of qs){const a=latest[q.i];if(!a||q.a==='*')continue;const k=key(q);(m[k]=m[k]||{n:0,c:0}).n++;if(C.ok(q,a))m[k].c++}for(const k in m)m[k].pct=100*m[k].c/m[k].n;return m},
 weak:(acc,min=5,cut=60)=>Object.entries(acc).filter(([k,v])=>v.n>=min&&v.pct<cut).sort((a,b)=>a[1].pct-b[1].pct).map(x=>x[0]),
 focus:(perPaper,acc)=>perPaper*(1-(acc&&acc.n>=3?acc.pct/100:.5))
};
