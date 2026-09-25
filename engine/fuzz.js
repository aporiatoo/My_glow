/* فاز تست واقع‌بینانه: داده از localStorage می‌آید و از migrate رد می‌شود */
const c=require('./harness.js');
const S=c.S;
const views=[];c.GRP.forEach(g=>g[4].forEach(v=>views.push(v[0])));
const BAD=[null,undefined,0,-1,NaN,'',[],{},'abc',1e9,[null],[{}],{a:null},[[]],'{}'];
const keys=['jr','wo','ms','ppl','inter','hts','urges','ftest','mistakes','tree','done','q',
            'streak','best','sleepLog','fb','fbiq','inf','ment','mind2','war','prof','shop',
            'grades','stLog','exams','wt','ach','photos','cook','tx','playLog','comeback',
            'mode','ramadan','protDay','fbpos','stream','boss','barber'];
let issues=[],n=0;
const snap=JSON.stringify(S);
keys.forEach(k=>{
  BAD.forEach(bad=>{
    const raw=JSON.parse(snap); raw[k]=bad;
    /* همان مسیری که اپ واقعی طی می‌کند */
    const clean=c.migrate(raw).state;
    Object.keys(S).forEach(x=>delete S[x]);
    Object.assign(S,clean);
    views.forEach(v=>{
      n++;
      try{
        const r=c.V[v]();
        if(/undefined|NaN/.test(r)) issues.push(`${v} ← S.${k}=${JSON.stringify(bad)}`);
      }catch(e){ issues.push(`${v} ← S.${k}=${JSON.stringify(bad)} : ${e.message.slice(0,60)}`); }
    });
  });
});
Object.keys(S).forEach(x=>delete S[x]); Object.assign(S,JSON.parse(snap));
const uniq=[...new Set(issues)];
console.log(`\nفاز واقع‌بینانه (با migrate): ${n} ترکیب`);
console.log(`مشکل: ${uniq.length}\n`);
uniq.slice(0,30).forEach(x=>console.log('  '+x));
if(uniq.length>30)console.log(`  … و ${uniq.length-30} مورد`);
