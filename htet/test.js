const fs=require('fs'),assert=require('assert');eval(fs.readFileSync(__dirname+'/src/core.js','utf8').replace('const C=','globalThis.C='));
const qs=[{i:'a',a:[1]},{i:'b',a:[2,4]},{i:'c',a:'*'},{i:'d',a:[3]}];
assert.deepStrictEqual((({n,c,w,s})=>[n,c,w,s])(C.score(qs,{a:1,b:4,d:1})),[4,3,1,0]);
assert.deepStrictEqual((({n,c,w,s})=>[n,c,w,s])(C.score(qs,{a:2})),[4,1,1,2]);
assert.strictEqual(C.avg([40,60]),50);assert.strictEqual(C.avg([]),null);
assert.deepStrictEqual(C.latest([{date:2,ans:{a:1}},{date:1,ans:{a:3,b:2}}]),{a:1,b:2});
const ac=C.acc(qs,{a:2,b:2,c:1},q=>'t');assert.deepStrictEqual(ac.t,{n:2,c:1,pct:50});
assert.deepStrictEqual(C.weak({x:{n:4,pct:0},y:{n:5,pct:40},z:{n:9,pct:80}}),['y']);
assert.strictEqual(C.focus(4,undefined),2);console.log('core ok');
