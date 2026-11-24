"""Cut TGT Science / PRT papers into per-question crops + text. Run: uv run --with pymupdf --with pillow python run.py [name...]
Needs the source PDFs in ~/Downloads/HTET/Question_Papers (not committed). Output: crops/ (not committed), text/<name>.json."""
import sys,json,re
import pipe
from pipe import *
PAPERS={'tgt-sci-2021':'2021/Level2_TGT/HTET-Level-II-Science-2021-Question-Paper.pdf','tgt-sci-2022':'2022/Level2_TGT/HTET-Level-II-Science-2022-Question-Paper.pdf',
'tgt-sci-2023':'2023/Level2_TGT/HTET-Level-II-Science-2023-Question-Paper.pdf','tgt-sci-2024':'2024_held_July2025/Level2_TGT/HTET-2024-TGT-Science-SetA.pdf',
'prt-2021':'2021/Level1_PRT/HTET-2021-PRT-SetA.pdf','prt-2022':'2022/Level1_PRT/HTET-2022-PRT-SetA.pdf','prt-2023':'2023/Level1_PRT/HTET-Level-I-2023-Question-Paper.pdf','prt-2024':'2024_held_July2025/Level1_PRT/HTET-2024-PRT-SetA.pdf'}
pipe.P.update(PAPERS)
for n in (sys.argv[1:] or PAPERS):
    pipe.HEADS=(1,31,46,61,91,121) if n.startswith('prt') else (1,31,46,61,91)
    pipe.ENDS=(30,45,60,90,120) if n.startswith('prt') else (30,45,60,90)
    try: d,o=pipe.segs(n)
    except Exception as e: print(n,'FAILED',repr(e)); continue
    T={};bad=[]
    for q,rs in o.items():
        pipe.render(d,rs).save(f'crops/{n}_{q}.png'); t=pipe.text(d,rs); T[f'{n}_{q}']=t
        if not re.search(r'1[\)\]].*2[\)\]].*3[\)\]].*4[\)\]]',t): bad.append(q)
    json.dump(T,open(f'text/{n}.json','w'),ensure_ascii=False); print(n,len(T),'no-options:',bad)
