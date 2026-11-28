// AI help on a question or topic. Same sync key as /api/sync; the Gemini key stays on the server (GEMINI_API_KEY).
const {createHash,timingSafeEqual}=require('crypto');
const hash=s=>createHash('sha256').update(String(s)).digest();
const SYS='You are a tutor for the HTET PGT Computer Science exam (Haryana, India). Answer fast and short. '+
 'For an MCQ: start with the correct option letter and text, then explain in 3-5 short lines, and say why the other options are wrong only if it helps. '+
 'If an official answer is given, explain that answer; if you think it is wrong, say so in one line at the end. Plain text, **bold** allowed, no tables. '+
 'Answer in English unless the question is in Hindi.';
const geminiKey=()=>process.env.GEMINI_API_KEY||process.env.GEMINI_KEY; // Google's standard name, or the older one
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const key=process.env.SYNC_KEY,got=(req.headers.authorization||'').replace(/^Bearer /,'');
 if(!key||!geminiKey())return res.status(500).json({error:'AI is not set up on the server'});
 if(!timingSafeEqual(hash(got),hash(key)))return res.status(401).json({error:'Wrong sync key'});
 const q=req.body?.q;
 if(typeof q!=='string'||!q.trim()||q.length>8000)return res.status(400).json({error:'Bad request'});
 // try each model in turn: Google often answers 503 (busy) or 404 (model retired) for one model while another works
 const models=[process.env.GEMINI_MODEL,'gemini-3.5-flash-lite','gemini-3.1-flash-lite','gemini-3.8-flash'].filter((m,i,l)=>m&&l.indexOf(m)===i);
 for(const m of models){try{const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:'POST',
   headers:{'Content-Type':'application/json','x-goog-api-key':geminiKey()},signal:AbortSignal.timeout(15000),
   body:JSON.stringify({systemInstruction:{parts:[{text:SYS}]},contents:[{role:'user',parts:[{text:q}]}],generationConfig:{maxOutputTokens:1024}})}),o=await r.json().catch(()=>({}));
  const text=o.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
  if(r.ok&&text)return res.status(200).json({text});
  console.error(m,r.status,JSON.stringify(o).slice(0,300))}
 catch(e){console.error(m,e.name)}}
 res.status(502).json({error:'AI is busy, try again in a minute'})};

