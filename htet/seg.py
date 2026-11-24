import pymupdf,glob,re,os,sys,json
Q=os.path.expanduser('~/Downloads/HTET/Question_Papers/')
P={2018:'2018/Level3_PGT/HTET-2018-PGT-Computer-Science-SetA.pdf',2019:'2019/Level3_PGT/HTET-2019-PGT-Computer-Science-SetA.pdf',2020:'2020/Level3_PGT/HTET-2020-PGT-Computer-Science-SetA.pdf',2021:'2021/Level3_PGT/HTET-Level-III-Computer-Science-2021-Question-Paper.pdf',2022:'2022/Level3_PGT/HTET-Level-III-Computer-Science-2022-Question-Paper.pdf',2023:'2023/Level3_PGT/HTET-Level-III-Computer-Science-2023-Question-Paper.pdf',2024:'2024_held_July2025/Level3_PGT/HTET-2024-PGT-Computer-Science-SetA.pdf'}
def load(y): return pymupdf.open(Q+P[y])
def locate(y):
    d=load(y); pos={}
    cand={}
    for i in range(1,len(d)):
        w=d[i].rect.width
        for b in d[i].get_text('words'):
            m=re.fullmatch(r'(\d{1,3})\.',b[4])
            if m and 1<=int(m[1])<=150: cand.setdefault(int(m[1]),[]).append((i,int(b[0]>w*.47),b[1],b[0],b[3]))
    for q in range(1,151):
        c=cand[q]
        if not 31<=q<=60: c=[x for x in c if x[1]==1]
        prev=pos.get(q-1)
        key=(lambda x:(x[0],x[1],x[2])) if 31<=q<=60 else (lambda x:(x[0],x[2]))
        c=sorted(c,key=key)
        if prev: c=[x for x in c if (key(x)>key(prev)) or (q in(31,61) and x[0]>=prev[0])]
        pos[q]=c[0] if c else None
    return d,pos
if __name__=='__main__':
    for y in P:
        d,pos=locate(y)
        xs={}
        for q,p in pos.items():
            xs.setdefault((p[1] if p else None),[]).append(round(p[3]) if p else q)
        print(y,[q for q in pos if not pos[q]],{k:(min(v),max(v)) for k,v in xs.items()})
        for q in (30,31,45,46,60,61,90,91): print('   ',q,pos[q])
        pg=pos[95][0]; h=[(round(b[1]),b[4][:40].replace('\n',' ')) for b in d[pg].get_text('blocks')]
        print('   top/bottom',sorted(h)[:2],sorted(h)[-2:])
        ln=[dr['rect'] for dr in d[pg].get_drawings() if dr['rect'].height>300]
        print('   vlines',[(round(r.x0),round(r.y0),round(r.y1)) for r in ln])
        for p in d:
            for m in re.finditer(r'(?i)(Direction|Q\.? ?Nos?|Question Nos?)[^\n]{0,60}\d+\s*(to|-|–)\s*\d+[^\n]*',p.get_text()): print('   DIR p',p.number+1,m[0][:100])
