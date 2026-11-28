// AI help on a question or topic. Same sync key as /api/sync; the Gemini key stays on the server (GEMINI_KEY).
const {createHash,timingSafeEqual}=require('crypto');
const hash=s=>createHash('sha256').update(String(s)).digest();
const SYS='You are a tutor for the HTET PGT Computer Science exam (Haryana, India). Answer fast and short. '+
 'For an MCQ: start with the correct option letter and text, then explain in 3-5 short lines, and say why the other options are wrong only if it helps. '+
 'If an official answer is given, explain that answer; if you think it is wrong, say so in one line at the end. Plain text, **bold** allowed, no tables. '+
 'Answer in English unless the question is in Hindi.';
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const key=process.env.SYNC_KEY,got=(req.headers.authorization||'').replace(/^Bearer /,'');
 if(!key||!process.env.GEMINI_KEY)return res.status(500).json({error:'AI is not set up on the server'});
 if(!timingSafeEqual(hash(got),hash(key)))return res.status(401).json({error:'Wrong sync key'});
 const q=req.body?.q;
 if(typeof q!=='string'||!q.trim()||q.length>8000)return res.status(400).json({error:'Bad request'});
 try{const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL||'gemini-3.6-flash'}:generateContent`,{method:'POST',
   headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_KEY},signal:AbortSignal.timeout(25000),
   body:JSON.stringify({systemInstruction:{parts:[{text:SYS}]},contents:[{role:'user',parts:[{text:q}]}],generationConfig:{maxOutputTokens:1024}})}),o=await r.json();
  const text=o.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
  if(!r.ok||!text){console.error(r.status,JSON.stringify(o).slice(0,500));return res.status(502).json({error:'AI did not answer, try again'})}
  res.status(200).json({text})}
 catch(e){console.error(e);res.status(502).json({error:'AI did not answer, try again'})}};
