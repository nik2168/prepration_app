"""Rebuild the page from questions, keys and tags. Run: uv run --with pillow python build.py   (needs crops/, keys.json, text.json, tags.py, 2026_questions.txt, page.html, core.js)"""
import json,io,base64,re,difflib,os
from tags import tags,TOP,SUBJ
K=json.load(open('keys.json'))
T=json.load(open('text.json')); notes26={98:'Doubtful: D is also arguable.',103:'COUNTA also counts errors, so no option fits exactly.',104:'A1-INT(A1) gives the same value, so A looks valid too.',105:'Doubtful: loosely worded.',113:'Doubtful.',114:'Doubtful: A is arguable.',136:'Current Chrome and Safari also support subgrid.',143:'As printed A is wrong too; C is clearly intended.',144:'The instructor says no option fits, so any answer counts as correct here.',147:'The implicit destructor is inline public, so D is also valid.',150:'The instructor says A, but a destructor cannot be static (C). Both are accepted here.'}
QS=[];FX={}
import glob
for f in glob.glob('fixed/*.json'):FX.update(json.load(open(f)))
def txt(i):
    if i in FX:return FX[i]['s'].strip(),[o.strip() for o in FX[i]['o']]
    t=re.sub(r'^\d+\.\s*','',T[i]);m=re.split(r'\s*[\(\[]?\b([1-4])[\)\]]\s+',t)
    assert len(m)==9 and m[1::2]==['1','2','3','4'],i
    return m[0].strip(),[x.strip() for x in m[2::2]]
for y in range(2018,2025):
    assert len(K[str(y)])==150
    for q,t in tags(y).items():
        i=f'{y}_{q}'; a=K[str(y)][str(q)]
        assert a=='*' or (a and all(1<=x<=4 for x in a)),i
        x,op=txt(i)
        if y==2024 and 51<=q<=60:x=json.load(open('passages.json'))['2024_51-60']+'\n\nQuestion: '+x
        o=dict(i=i,y=y,n=q,t=t,a=a,x=x,o=op)
        QS.append(o)
tg=tags(2026)
for l in open('2026_questions.txt'):
    r=l.rstrip('\n').split('|'); q=int(r[0])
    a='*' if q==144 else [1,3] if q==150 else ['ABCD'.index(r[6])+1]
    o=dict(i=f'2026_{q}',y=2026,n=q,t=tg[q],a=a,x=r[1],o=r[2:6])
    if q in notes26:o['note']=notes26[q]
    QS.append(o); T[o['i']]=' '.join(r[1:6])
assert len(QS)==1110 and len({q['i'] for q in QS})==1110
def repeats(QS,T,MAN='',DROP=()):
    def stem(i):
        s=re.sub(r'^\d+\.\s*','',T[i]); s=re.split(r'[\(\[]?1[\)\]]',s)[0]+' '+s
        return re.findall(r'[a-z0-9+#]+',s.lower())
    W={q['i']:stem(q['i']) for q in QS if not(q['t'].startswith('HIN'))}
    ids=list(W);sets={i:set(W[i]) for i in ids};par={i:i for i in ids};cand=[]
    def f(i):
        while par[i]!=i:i=par[i]
        return i
    for a in range(len(ids)):
        for b in range(a+1,len(ids)):
            x,z=ids[a],ids[b]
            if x[:4]==z[:4]:continue
            j=len(sets[x]&sets[z])/max(1,len(sets[x]|sets[z]))
            if j>.5 and difflib.SequenceMatcher(None,W[x],W[z]).ratio()>.66: cand.append((x,z)); par[f(x)]=f(z)
    # reviewed by hand: same question or same fact asked again
    for g in MAN.split('|') if MAN else []:
        g=g.split()
        for x in g[1:]: par[f(x)]=f(g[0])
    G={}
    for i in ids:G.setdefault(f(i),[]).append(i)
    REP=sorted([sorted(g) for g in G.values() if len(g)>1 and set(g) not in DROP],key=lambda g:(-len(g),g))

    return REP
MAN_CS="2020_93 2023_147|2022_68 2023_72|2019_72 2022_61|2020_76 2023_61|2020_119 2021_119 2026_121|2018_91 2022_149|2019_101 2023_95 2024_97|2019_141 2022_102|2021_95 2023_105 2024_133|2023_130 2024_127|2023_143 2024_148|2023_100 2024_142|2019_109 2024_111|2019_137 2020_138|2018_149 2019_107|2020_144 2024_140|2020_21 2022_6|2018_103 2021_111|2022_12 2024_30|2020_100 2020_122 2021_122|2023_140 2024_102|2018_144 2019_93|2018_147 2019_94 2022_114"
DROP_CS=[{'2018_142','2019_116'},{'2019_98','2020_134'}]
REP=repeats(QS,T,MAN_CS,DROP_CS)
json.dump(dict(qs=QS,rep=REP),open('questions.json','w'),ensure_ascii=False)
ABOUT_CS="2019 and 2021 to 2024 use BSEH final keys. 2018 and 2020 use BSEH draft keys. July 2026 uses a video instructor's answers, and doubtful ones carry a note. All papers are Set A."
D_CS=dict(qs=QS,subj=SUBJ,top=TOP,rep=REP,papers=[[2018,'3321','draft'],[2019,'4321','final'],[2020,'9221','draft'],[2021,'321','final'],[2022,'921','final'],[2023,'1321','final'],[2024,'5321','final'],[2026,'7319','unofficial']])
D_CS.update(name='PGT Computer Science',lvl='PGT',pick='Computer Science (PGT)',mp='CS: ',ml='Computer Science',ms='CS',mn=60,part=2026,syl=True,date=[2026,11,26,15],when='Level 3 is on 26 December 2026, 3:00 to 5:30 pm.',about=ABOUT_CS)
# TGT Science and PRT: text in exams/text (PDF) overridden by exams/fixed (checked), tags in exams/tags, official keys in exams/keys_raw
TOPN={l.split(' ',1)[0]:l.split(' ',1)[1] for l in open('exams/TOPICS.txt',encoding='utf8').read().split('\n') if l and l[0]!='#'}
def exam(pre,kn,papers,subj,**meta):
    QSx=[];Tx={};skipped=[]
    for y,code,key in papers:
        nm=f'{pre}-{y}';tx=json.load(open(f'exams/text/{nm}.json'));fx=json.load(open(f'exams/fixed/{nm}.json'));tg=json.load(open(f'exams/tags/{nm}.json'));ky=json.load(open(f'exams/keys_raw/{kn}_{y}.json'))
        assert len(ky)==150 and len(tg)==150,nm
        for q in range(1,151):
            e=fx.get(f'{nm}_{q}')
            if e and e.get('skip'):skipped.append(f'{y}_{q}');continue
            if e:x,op=e['s'].strip(),[o.strip() for o in e['o']]
            else:
                t=re.sub(r'^\d+\.\s*','',tx[f'{nm}_{q}']);m=re.split(r'\s*[\(\[]?\b([1-4])[\)\]]\s+',t)
                assert len(m)==9 and m[1::2]==['1','2','3','4'],(nm,q)
                x,op=m[0].strip(),[z.strip() for z in m[2::2]]
            assert x and len(op)==4 and all(op),(nm,q)
            a=ky[str(q)]
            if isinstance(a,int):a=[a]
            assert a=='*' or (a and all(1<=z<=4 for z in a)),(nm,q)
            t=tg[str(q)];assert t in TOPN,(nm,q,t)
            QSx.append(dict(i=f'{y}_{q}',y=y,n=q,t=t,a=a,x=x,o=op));Tx[f'{y}_{q}']=x+' '+' '.join(op)
    used={q['t'].split('.')[0] for q in QSx}
    sj={k:v for k,v in {**SUBJ,**subj}.items() if k in used};tp={t:[TOPN[t],False] for t in {q['t'] for q in QSx}}
    return dict(qs=QSx,subj=sj,top=tp,rep=repeats(QSx,Tx),papers=[[y,c,k] for y,c,k in papers],skipped=skipped,part=0,syl=False,**meta)
D_SCI=exam('tgt-sci','tgt_science',[(2021,'211','final'),(2022,'811','final'),(2023,'1211','final'),(2024,'5211','final')],{'PHY':'Science: Physics','CHE':'Science: Chemistry','BIO':'Science: Biology','SCI':'Science: Teaching science'},
 name='TGT Science',lvl='TGT',pick='Science (TGT)',mp='Science: ',ml='Science',ms='Sci',mn=60,date=None,when='Level 2 paper, Science.',about="All papers use BSEH final keys, Set A. Topic labels are our own reading. Questions that need a diagram are left out and listed on the paper card.")
D_PRT=exam('prt','prt',[(2021,'101','final'),(2022,'701','final'),(2023,'1101','final'),(2024,'5101','final')],{'MTH':'Mathematics','EVS':'Environmental Studies'},
 name='PRT (Primary)',lvl='PRT',pick='Primary (PRT)',mp='',ml='',ms='',mn=0,date=None,when='Level 1 paper.',about="All papers use BSEH final keys, Set A. Topic labels are our own reading. Questions that need a diagram are left out and listed on the paper card.")
X=dict(cs=D_CS,sci=D_SCI,prt=D_PRT)
js=lambda o:json.dumps(o,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
if os.path.exists('page.html'):
    rd=lambda n:open('src/'+n,encoding='utf8').read()
    font='data:font/woff2;base64,'+base64.b64encode(open('src/lexend-latin.woff2','rb').read()).decode()
    ORDER=['core.js','store.js','app.js','ui.js','home.js','mock.js','view.js','result.js','progress.js','repeats.js','data.js']
    h=rd('../page.html').replace('/*CSS*/',rd('styles.css').replace('__LEXEND__',font)).replace('/*JS*/','\n'.join(rd(n) for n in ORDER)).replace('/*DATA*/','const X='+js(X)+';')
    open('../public/index.html','w').write(h); print('page MB',len(h.encode())/1e6)
print('questions',len(QS),'repeat groups',len(REP))
if __name__=='__main__' and os.environ.get('SHOW'):
    for g in REP: print(g,'|',' || '.join(T[i][:95] for i in g))
