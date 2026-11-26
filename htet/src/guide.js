// Guide: exam facts and the 30-day plan. Static text, checked against BSEH/HPSC documents on 26 Nov 2026.
const gt=(h,rows)=>`<div class="gt"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
V.guide=()=>`<div class="stack guide"><div><h1>Exam guide</h1><p class="mut">From the official BSEH HTET-2026 bulletin and HPSC documents, checked 26 Nov 2026. Pass rates are from news reports.</p></div>
<section class="card stack tint"><h2>My application</h2><ul>
<li><b>Applied:</b> HTET-2026 Level 3, PGT Computer Science. Application no. 538037.</li>
<li><b>Fee:</b> ₹1,200 paid online on 26 Nov 2026.</li>
<li><b>Exam:</b> Sat 26 Dec 2026, 3:00–5:30 pm, centre preference Rewari. Target: 90/150.</li>
<li><b>Admit card:</b> expected mid-December on htet2026.org, downloaded with the application number.</li>
<li><b>To confirm:</b> the bulletin says PGT CS needs a "three-year" MCA, but mine is the 2-year course. Check with the BSEH helpline.</li></ul></section>
<section class="card stack"><h2>HTET-2026 key facts</h2><ul>
<li><b>Exam:</b> PGT (Level 3) on Sat 26 Dec 2026, 3:00–5:30 pm. 150 questions, 1 mark each.</li>
<li><b>Negative marking:</b> none. The bulletin (p. 16) says "There shall be no negative marking."</li>
<li><b>Form:</b> last date 27 Nov 2026, 11:59 pm. Corrections allowed 28–29 Nov.</li>
<li><b>Fee (General/BC):</b> ₹1,200 for one level, ₹2,000 for two, ₹2,600 for three.</li>
<li><b>Pass mark:</b> 90/150 (60%) for General and BC-A/BC-B. Only Haryana SC and PwD candidates get 82 (55%).</li>
<li><b>Validity:</b> the certificate is valid for life (clause 9(i)). No limit on attempts, and you can re-sit to improve your score.</li></ul></section>
<section class="card stack"><h2>HTET levels</h2>${gt(['Level','Teaches','Main qualification'],[
['1 – PRT','Classes I–V','12th with 50% + 2-year D.El.Ed (or 4-year B.El.Ed); or graduation + D.El.Ed'],
['2 – TGT','Classes VI–VIII','Graduation with 50% in that subject + B.Ed or D.El.Ed with it as a teaching subject'],
['3 – PGT','Classes IX–XII','PG / MCA / B.Tech in the subject + HTET (PGT CS: M.Sc CS, MCA or B.Tech CS/IT with 55%)']])}
<p class="sm mut">BC candidates get 5% off the qualification percentage (for example 47.5% instead of 50%), but not off the 90-mark HTET pass mark. Each level is a separate application and a separate paper, and the job needs the level that matches the post.</p></section>
<section class="card stack"><h2>Pass rates and cutoffs</h2><p>HTET's pass mark has been fixed at 90/150 every year.</p>${gt(['HTET PGT exam','Pass rate'],[['Jan 2021','4.1%'],['Dec 2021','~14.5%'],['Dec 2022','9.9%'],['Dec 2023','8.9%'],['Jul 2025','9.6%'],['Jul 2026','not found']])}
<p><b>HPSC PGT CS (the job).</b> HPSC doesn't publish cutoffs. These counts come from its official marks lists.</p>${gt(['Advt','BC-B posts','BC-B result','Effective cutoff'],[
['26/2023','82 + 4 Mewat','~430 sat; 4 passed, all 4 selected','35% minimum. 39 selected for 1,711 posts'],
['23/2026','82 + 4 Mewat','402 sat, 94 passed','35% minimum (52.5/150). ~1,068 selected for 1,672 posts']])}
<p>In both cycles fewer people passed than there were posts, so the cutoff was just the 35% minimum. For BC-B, the hard part is reaching 35% in the subject test.</p></section>
<section class="card stack"><h2>My 2024 paper: 76/150, 39 skipped</h2>${gt(['Section','Score','Weak topics'],[
['CS (Q91–150)','37/60','MS Access 0/4, Excel 3/6, Python lists/dicts 1/3, SE testing, CPU/ports'],
['Child Development & Pedagogy','16/30','Teaching methods 0/3, learning theories 1/3, growth principles 1/3'],
['Hindi','2/15','उपसर्ग-प्रत्यय, संधि, समास, वर्ण, गद्यांश'],
['English','8/15','English teaching 2/5'],
['Haryana GK','2/10','History, polity, schemes, sports (8 skipped)'],
['Quantitative Aptitude','4/10','Geometry and mensuration 0/5 (all skipped)'],
['Reasoning','7/10','–']])}
<p><b>Never skip.</b> With no negative marking, guessing the 39 blanks is worth about +10 marks on average.</p>
<p><b>30-day order:</b> Hindi grammar and Haryana GK, then pedagogy theories, then MS Access/Excel and Python, then geometry formulas. Do one full past paper each week.</p></section>
<section class="card stack"><h2>The job: PGT Computer Science</h2><ul>
<li><b>Recruiter:</b> HPSC. Screening test (100 questions, −0.25 per wrong answer, sometimes skipped), a 150-mark subject test with a 35% minimum, then an interview.</li>
<li><b>Eligibility:</b> M.Sc CS / MCA / B.Tech CS or IT with 55%, plus HTET, plus Hindi at Matric. A 2025 corrigendum added NCTE norms (PG + B.Ed); check that you meet them.</li>
<li><b>Pay:</b> Level 8, ₹47,600 basic. With 63% DA plus HRA, about ₹82–87k gross, or about ₹74–79k in hand before tax.</li>
<li><b>Pension:</b> NPS or UPS. There is no Old Pension Scheme.</li>
<li><b>Permanence:</b> a regular government post with 1–2 years of probation. The 2012 rules said "on contract" for the first 5 years; it's not confirmed whether that clause was removed, though the 2026 advertisement shows the regular pay scale. Check the current rules.</li></ul></section></div>`;
