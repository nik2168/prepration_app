const assert=require('assert'),{handler,merge}=require('../api/sync.js');
const t=(id,date,x)=>({id,date,time:1,label:'m',ids:[],ans:{},...x});
const ids=r=>r.attempts.map(a=>a.id);
assert.deepStrictEqual(ids(merge({attempts:[t(1,10),t(2,20)]},{attempts:[t(2,20),t(3,15)],cleared:0})),[1,3,2]);
assert.deepStrictEqual(ids(merge({attempts:[t(1,10),t(2,30)]},{attempts:[],cleared:20})),[2]);           // delete all sticks
assert.deepStrictEqual(ids(merge({attempts:[],cleared:20},{attempts:[t(1,10,{at:25})],cleared:0})),[1]); // import after delete survives
(async()=>{
 process.env.SYNC_KEY='k';process.env.MONGOURL='x';
 const db={},col={findOne:async q=>db[q._id],replaceOne:async(q,d)=>{db[q._id]=d}};
 const call=async(body,key='k',open=async()=>col,method='POST')=>{let code,out;await handler(open)({method,headers:{authorization:'Bearer '+key},body},{status(c){code=c;return this},json(o){out=o}});return{code,out}};
 const body={attempts:[t(1,10)],cleared:0};
 assert.strictEqual((await call(body,'k',undefined,'GET')).code,405);
 assert.strictEqual((await call(body,'no')).code,401);
 assert.strictEqual((await call({...body,cleared:'x'})).code,400);
 assert.strictEqual((await call({...body,attempts:[{}]})).code,400);
 assert.deepStrictEqual(ids((await call(body)).out),[1]);
 assert.deepStrictEqual(ids((await call({...body,attempts:[t(2,20)]})).out),[1,2]);
 console.error=()=>{};assert.strictEqual((await call(body,'k',async()=>{throw Error('down')})).code,500);
 console.log('sync ok');
})().catch(e=>{process.exitCode=1;process.stdout.write(String(e.stack))});
