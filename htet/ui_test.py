import sys,json
from playwright.sync_api import sync_playwright
S=sys.argv[1];U='file:///Users/nikhilkoshal/Documents/preparation_app/public/index.html'
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True);print(b.version)
    c=b.new_context(viewport={'width':1280,'height':900},accept_downloads=True);errs=[]
    def page(c):
        g=c.new_page();g.on('pageerror',lambda e:errs.append(str(e)));g.on('console',lambda m:errs.append(m.text) if m.type=='error' else None);return g
    # 1. data written by the old page
    o=page(b.new_context());o.goto('file://'+S+'/old_mock.html')
    FILL="()=>{let k=0;for(const i of S.cur.ids){const q=Qm[i];k++;if(k%10==0)continue;S.cur.ans[i]=q.a==='*'?1:(k%3==0?(q.a[0]%4)+1:q.a[0])}save()}"
    o.click('[data-act=start][data-v="2021"]');o.evaluate(FILL);o.click('[data-act=submit]');o.click('dialog button.p');o.wait_for_selector('text=By subject')
    o.click('[data-go=home]');o.click('[data-act=start][data-v="2019"]');o.click('.opts button[data-v="3"]');o.evaluate('save()')
    raw=o.evaluate("localStorage.getItem('htetmock')");old=o.evaluate('res(S.attempts[0])')
    g=page(c);g.goto(U);g.evaluate("r=>localStorage.setItem('htetmock',r)",raw);g.reload()
    assert g.evaluate('res(S.attempts[0])')==old and g.evaluate('Object.keys(S.cur.ans).length')==1 and 'Unfinished' in g.inner_text('main');print('old data kept',old)
    g.wait_for_timeout(300);g.screenshot(path=S+'/ui2/d1home.png',full_page=True)
    g.click('[data-act=resume]');assert g.evaluate('S.cur.year')==2019
    g.click('.opts button[data-v="2"]');g.keyboard.press('ArrowRight');g.keyboard.press('4');g.click('[data-act=mk]');g.select_option('[data-sel=part]',label='Haryana GK');assert g.evaluate('S.cur.pos')==80
    g.wait_for_timeout(200);g.screenshot(path=S+'/ui2/d2mock.png')
    g.click('[data-act=pause]');g.click('[data-act=resume]');g.wait_for_timeout(1300);assert g.evaluate('S.cur.el')>1
    g.evaluate(FILL);exp=g.evaluate('C.score(qsOf(S.cur.ids),S.cur.ans)');g.click('[data-act=submit]');g.click('dialog .p');g.wait_for_selector('text=Review answers')
    assert str(exp['c']) in g.inner_text('.hero');g.click('.acc summary >> nth=0');g.click('[data-act=rf][data-v=all]');g.select_option('[data-sel=rsub]','HIN');assert g.locator('article').count()==15
    g.screenshot(path=S+'/ui2/d3result.png');g.click('[data-go=prog]');g.click('.acc summary >> nth=1');g.screenshot(path=S+'/ui2/d4prog.png',full_page=True)
    g.click('[data-act=pg][data-v=HIN]');assert g.locator('.acc').count()==1;g.click('[data-act=pt][data-v=hist]');assert g.locator('.li').count()==2
    # repeats filters
    g.click('[data-go=rep]');g.screenshot(path=S+'/ui2/d5focus.png')
    for t in('topics','years','again','focus'):g.click(f'[data-act=rtab][data-v={t}]')
    g.click('[data-act=rtab][data-v=years]');g.wait_for_timeout(100);g.screenshot(path=S+'/ui2/d6years.png',full_page=True)
    assert g.locator('tbody tr').count()==7;g.click('[data-act=rdrill][data-v=cs]');g.click('[data-act=rdrill][data-v=PY]');assert g.evaluate('U.rep.area')=='PY';assert g.locator('tbody tr').count()==3
    g.click('[data-act=tsheet] >> nth=0');g.wait_for_selector('dialog[open]');g.wait_for_timeout(300);g.screenshot(path=S+'/ui2/d7sheet.png');g.click('[data-close]')
    g.click('[data-act=rclr]');g.select_option('#syl','out');g.click('[data-act=rtab][data-v=topics]');assert all('Not in' in x for x in g.locator('.li').all_inner_texts())
    g.select_option('#syl','all');g.select_option('#yrs','y2026');n=g.evaluate("stats([2026]).filter(x=>isCS(x.s)).reduce((a,x)=>a+x.tot,0)");assert n==60
    g.fill('#rq','python');assert all('Python' in x for x in g.locator('.li').all_inner_texts()) and g.locator('.li').count()==3
    g.click('[data-act=rg][data-v=HIN]');assert 'July 2026 has' in g.inner_text('#rbody');g.click('[data-act=rclr]');assert g.locator('.li').count()==14
    g.select_option('#sort','papers');g.reload();g.click('[data-go=rep]');assert g.evaluate('U.rep.g')=='HIN'
    # dropdown open
    g.click('[data-act=rg][data-v=cs]');g.click('#area');g.wait_for_timeout(350);g.screenshot(path=S+'/ui2/d8drop.png');g.keyboard.press('ArrowDown');g.keyboard.press('Enter');g.wait_for_timeout(200);print('keyboard pick',g.evaluate('U.rep.area'),'base-select',g.evaluate("CSS.supports('appearance','base-select')"))
    # mixes, redo, weak, timeout, backup
    g.click('[data-go=home]');g.select_option('#sec','PY');g.select_option('#mode','practice');g.click('[data-act=start][data-v="2026"]');assert g.evaluate('S.cur.ids.length')==8;g.click('.opts button[data-v="4"]');assert 'Answer:' in g.inner_text('.mock');g.screenshot(path=S+'/ui2/d9prac.png');g.evaluate('S.cur=null;save()')
    g.reload();assert g.input_value('#sec')=='PY';g.select_option('#sec','all');g.select_option('#mode','exam');g.click('[data-act=mix]');g.evaluate('S.cur.el=99999');g.wait_for_selector('text=Review answers',timeout=4000)
    g.click('[data-go=prog]');L=g.evaluate("(()=>{const l=C.latest(S.attempts);return D.qs.filter(q=>l[q.i]&&!C.ok(q,l[q.i])).length})()");g.click('[data-act=redo]');assert g.evaluate('S.cur.ids.length')==L;g.evaluate('S.cur=null;save()');g.reload()
    g.click('[data-go=data]');n=g.evaluate('S.attempts.length')
    with g.expect_download() as d:g.click('[data-act=exp]')
    d.value.save_as(S+'/ui2/b.json');g.click('[data-act=reset]');g.click('dialog .p');assert g.evaluate('S.attempts.length')==0
    open(S+'/ui2/bad.json','w').write('{"attempts":[{"ids":["__proto__"],"ans":{},"date":1,"id":1,"label":"x","time":1}]}');g.set_input_files('#imp',S+'/ui2/bad.json');g.wait_for_selector('text=not a valid backup');g.click('dialog .p')
    g.set_input_files('#imp',S+'/ui2/b.json');g.wait_for_selector('text=Replace current');g.click('dialog .p');g.wait_for_timeout(200);assert g.evaluate('S.attempts.length')==n
    g.evaluate("SEL.theme('dark')");g.click('[data-go=rep]');g.click('[data-act=rg][data-v=all]');g.click('[data-act=rtab][data-v=years]');g.screenshot(path=S+'/ui2/d10dark.png');g.evaluate("SEL.theme('light')")
    # widths
    bad=[]
    for w in(320,390,768,1024,1440):
        m=page(c);m.set_viewport_size({'width':w,'height':844});m.goto(U)
        def ck(n):
            s=m.evaluate('document.documentElement.scrollWidth')
            if s>w:bad.append((w,n,s))
        ck('home')
        if w==390:m.wait_for_timeout(300);m.screenshot(path=S+'/ui2/m1.png')
        for k in('prog','rep','data'):
            m.click(f'[data-go={k}]');ck(k)
            if k=='rep':
                for t in('focus','topics','years','again'):m.click(f'[data-act=rtab][data-v={t}]');ck(t);(w==390 and t=='years') and (m.wait_for_timeout(200),m.screenshot(path=S+'/ui2/m2.png',full_page=True))
            if k=='prog' and w==390:m.screenshot(path=S+'/ui2/m3.png')
        m.click('[data-go=home]');m.click('[data-act=start][data-v="2024"]');ck('mock')
        if w==390:m.screenshot(path=S+'/ui2/m4.png');m.click('[data-act=pal]');m.wait_for_timeout(350);m.screenshot(path=S+'/ui2/m5.png');m.click('[data-close]')
        sm=m.evaluate("[...document.querySelectorAll('#app button,#app select')].filter(e=>e.offsetParent&&!e.classList.contains('lnk')&&e.getBoundingClientRect().height<38).map(e=>e.textContent.slice(0,20))");sm and w==390 and print('small',sm[:5])
        m.evaluate('S.cur=null;save()');m.close()
    print('overflow',bad);print('errors',errs);b.close()
