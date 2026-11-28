// Cloud sync of finished mocks. One user, one shared key; one MongoDB document.
const {createHash,timingSafeEqual}=require('crypto');
const ID='cs',MAX=5000;
const num=Number.isFinite,hash=s=>createHash('sha256').update(String(s)).digest();
const good=t=>!!t&&num(t.id)&&num(t.date)&&num(t.time)&&typeof t.label==='string'&&Array.isArray(t.ids)&&!!t.ans&&typeof t.ans==='object';
// union by id; anything saved (or imported: t.at) before the latest "delete all" stays deleted
// Revise ticks: {topic: +time done / -time undone}, the newer one wins
const goodDone=d=>d===undefined||(!!d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length<=500&&Object.entries(d).every(([k,v])=>k.length<=64&&num(v)));
function mergeDone(a={},b={}){const o={...a};for(const k in b)if(Math.abs(b[k])>Math.abs(o[k]||0))o[k]=b[k];return o}
function merge(a,b){const cleared=Math.max(a.cleared||0,b.cleared||0),m=new Map();
 for(const t of [...a.attempts,...b.attempts])if((t.at||t.date)>cleared&&!(m.get(t.id)?.at>(t.at||0)))m.set(t.id,t);
 return{cleared,attempts:[...m.values()].sort((x,y)=>x.date-y.date),done:mergeDone(a.done,b.done)}}
let client; // reused while the function instance is warm
async function mongo(){const {MongoClient}=require('mongodb');
 client=client||new MongoClient(process.env.MONGOURL,{serverSelectionTimeoutMS:8000}).connect().catch(e=>{client=null;throw e});
 return (await client).db(process.env.MONGODB_DB||'htet').collection('state')}
const handler=open=>async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const key=process.env.SYNC_KEY,got=(req.headers.authorization||'').replace(/^Bearer /,'');
 if(!key||!process.env.MONGOURL)return res.status(500).json({error:'Sync is not set up on the server'});
 if(!timingSafeEqual(hash(got),hash(key)))return res.status(401).json({error:'Wrong sync key'});
 let b;try{b=req.body}catch(e){}
 if(!b||!Array.isArray(b.attempts)||b.attempts.length>MAX||!b.attempts.every(good)||!num(b.cleared)||!goodDone(b.done))return res.status(400).json({error:'Bad request'});
 try{const col=await open(),old=await col.findOne({_id:ID}),out=merge(old||{attempts:[]},b);
  await col.replaceOne({_id:ID},out,{upsert:true});res.status(200).json(out)}
 // ponytail: read then write, no lock; a lost write is re-sent by that device on its next sync
 catch(e){console.error(e);res.status(500).json({error:'Database error'})}};
module.exports=handler(mongo);
Object.assign(module.exports,{handler,merge});
