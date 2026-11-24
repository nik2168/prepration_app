import sys,io,json
sys.path.insert(0,'.');import pymupdf
from PIL import Image,ImageChops
exec(open('seg.py').read().split("if __name__")[0])
TOP,BOT=121,736
from PIL import ImageStat
import functools

def colrect(c,w,part2,x0s):
    return (x0s[c]-4,(x0s[1]-6 if c==0 else w-48))
def cut(d,p,x0,x1,top):
    # top of a question = lowest blank gap >=3.2pt within 48pt above its number
    z=3; lo=max(TOP,top-48)
    if top-lo<3: return max(TOP,top-2)
    px=d[p].get_pixmap(matrix=pymupdf.Matrix(z,z),clip=pymupdf.Rect(x0+3,lo,x1-8,top+5),colorspace=pymupdf.csGRAY)
    im=Image.frombytes('L',(px.width,px.height),px.samples).point(lambda v:255 if v<150 else 0)
    W=im.width
    # ignore vertical rules
    cols=im.resize((W,1),Image.BOX); mask=[cols.getpixel((i,0))>150 for i in range(W)]
    for i,m in enumerate(mask):
        if m: im.paste(0,(i,0,i+1,im.height))
    rows=[im.crop((0,r,W,r+1)).getbbox() is None for r in range(im.height)]
    r=int((top+2.5-lo)*z); run=0
    while r>=0:
        if rows[r]:
            run+=1
            if run>=int(3.2*z): return lo+(r+run*0.35)/z
        else: run=0
        r-=1
    return max(TOP,top-2)
def segs(y):
    d,pos=locate(y);out={};flags=[]
    w=d[1].rect.width
    b=lambda cc:(54,312) if cc==0 else (313,w-46)
    raw=dict(pos)
    head={pos[k][0]:pos[k][2]-3 for k in (1,31,46,61,91)}
    head={p:t-4 for p,t in head.items()}
    for q in range(1,151):
        pp=pos[q]; bb=b(pp[1])
        t=pp[2]-7 if q in (1,31,46,61,91) else cut(d,pp[0],bb[0],bb[1],pp[2])
        if pp[0] in head: t=max(t,head[pp[0]])
        t=min(t,pp[2]-1.5)
        pos[q]=(pp[0],pp[1],t+2,pp[3],pp[4])
    for q in range(1,151):
        pg,c,top,x,_=pos[q]; nxt=pos.get(q+1)
        if q in(30,45,60,90): nxt=None
        left=min(pos[k][3] for k in range(31,61) if pos[k][1]==0) if c==0 else 0
        def band(cc): return (54,312) if cc==0 else (313,w-46)
        rects=[]
        if nxt is None or (nxt[0],nxt[1])!=(pg,c):
            rects.append((pg,c,top-2,BOT))
            cur=(pg,c)
            if nxt:
                while True:
                    if 31<=q<=60 and cur[1]==0: cur=(cur[0],1)
                    else: cur=(cur[0]+1,0 if 31<=q<=60 else 1)
                    if cur==(nxt[0],nxt[1]):
                        TT=head.get(cur[0],TOP)
                        if nxt[2]-2-TT>6: rects.append((cur[0],cur[1],TT,nxt[2]-2))
                        break
                    rects.append((cur[0],cur[1],head.get(cur[0],TOP),BOT))
                    if len(rects)>5: raise Exception((y,q))
        else: rects.append((pg,c,top-2,nxt[2]-2))
        out[q]=[(p,band(cc)[0],a,band(cc)[1],b) for p,cc,a,b in rects]
    return d,out
def render(d,rs,z=2.2):
    ims=[]
    for p,x0,y0,x1,y1 in rs:
        px=d[p].get_pixmap(matrix=pymupdf.Matrix(z,z),clip=pymupdf.Rect(x0,y0,x1,y1),colorspace=pymupdf.csGRAY)
        im=Image.frombytes('L',(px.width,px.height),px.samples)
        # drop the vertical column rule at edges
        W,H=im.size
        dk=im.point(lambda v:255 if v<140 else 0)
        if H>14:
            col=dk.resize((W,1),Image.BOX)
            for i in list(range(0,24))+list(range(W-60,W)):
                if col.getpixel((i,0))>(110 if H>60 else 235): im.paste(255,(max(0,i-2),0,i+3,H))
        row=dk.resize((1,H),Image.BOX)
        for r in range(max(0,H-160),H):
            if row.getpixel((0,r))>225: im.paste(255,(0,max(0,r-2),W,r+3))
        bb=ImageChops.invert(im).point(lambda v:255 if v>60 else 0).getbbox()
        if not bb or bb[3]-bb[1]<8: continue
        ims.append(im.crop((0,max(0,bb[1]-4),im.width,min(im.height,bb[3]+5))))
    W=max(i.width for i in ims);H=sum(i.height for i in ims)
    o=Image.new('L',(W,H),255);yy=0
    for i in ims: o.paste(i,(0,yy));yy+=i.height
    return o
def text(d,rs): return ' '.join(' '.join(d[p].get_text(clip=pymupdf.Rect(x0,y0,x1,y1)).split()) for p,x0,y0,x1,y1 in rs)
if __name__=='__main__':
    T={}
    for y in P:
        d,o=segs(y)
        if y==2024:
            for q,w,n in ((32,r"funsZ",33),(50,r"^Direction",51)):
                rs=o[q];p0=rs[0];A=[];B=[]
                for (p,x0,a,x1,b) in rs:
                    ws=[v for v in d[p].get_text('words',clip=pymupdf.Rect(x0,a,x1,b)) if re.search(w,v[4])]
                    if B or not ws: (B if B else A).append((p,x0,a,x1,b))
                    else:
                        c=cut(d,p,x0,x1,min(v[1] for v in ws)); A.append((p,x0,a,x1,c)); B.append((p,x0,c,x1,b))
                print('passage',q,len(A),len(B)); assert B
                o[q]=A; render(d,B).save(f'crops/2024_p{n}.png')
        for q,rs in o.items():
            im=render(d,rs); im.save(f'crops/{y}_{q}.png'); t=text(d,rs); T[f'{y}_{q}']=t
            fl=[]
            if re.search(r"Direction|funsZ'k|passage|PART",t) : fl.append('DIR')
            n=len(re.findall(r'[\(\[]?[1-4][\)\]]',t))
            if not re.search(r'1[\)\]].*2[\)\]].*3[\)\]].*4[\)\]]',t): fl.append('OPT')
            if im.height>620: fl.append('TALL%d'%im.height)
            if fl: print(y,q,fl,len(rs),t[-170:] if 'DIR' in fl else t[:60])
    json.dump(T,open('text.json','w'))
