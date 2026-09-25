/* ============ VIEWS ============ */
const V={};

V.day=()=>{
  const EV=evToday();
  let h='';
  /* مسیر طلایی: در ۳۰ روز اول، تنها چیزی که مهم است */
  if(typeof goldenCard==='function') h+=goldenCard();

  /* ---- یک جمله، مهم‌ترین چیز همین لحظه ---- */
  {const _tr=(()=>{try{return plan().some(x=>x.c==='body')}catch(e){return false}})();
   const _b=brief(S,{hour:new Date().getHours(),training:_tr});
   if(_b) h+=`<div class="c gl nowc" style="order:-15">
    <div class="ct">${_b.ic} ${L('امروز','Today')}</div>
    <div class="nowbig">${_b.t}</div></div>`;}
  /* تنفس سریع */
  h+=`<div class="c gl"><div class="ct">◍ ${L('آرام‌سازی سریع','Quick calm')}</div>
   <div class="cs">${L('چهار چرخهٔ ۴-۷-۸ — کمتر از دو دقیقه. قبل امتحان، مسابقه، یا وقتی وسوسه آمد.','Four 4-7-8 cycles.')}</div>
   <button class="bt" style="margin-top:8px" onclick="brStart()">${L('شروع تنفس','Start breathing')}</button></div>`;
  /* شروع تدریجی و فصل */
  {const _ob=!!S.startDate&&!S.obOff&&obWeek(S)<=6;
   if(!S.startDate){
     h+=`<div class="c gl" style="border-color:var(--br2)"><div class="ct">◆ ${L('هنوز شروع نکرده‌ای','Not started')}</div>
      <div class="cs">${L('عادت‌ها هفته‌به‌هفته باز می‌شوند. هفتهٔ اول فقط سه تا — خواب، آب، ژورنال.','Habits unlock weekly.')}</div>
      <button class="bt p" style="margin-top:8px" onclick="obStart()">${L('امروز شروع می‌کنم','Start today')}</button>
      <div class="hint" onclick="obSkip()" style="cursor:pointer">${L('یا همهٔ عادت‌ها را یکجا باز کن','Or unlock all')}</div></div>`;
   }else if(_ob){
     const w=obWeek(S), cur=ONBOARD.find(x=>x.w===w), nx=obNext(S);
     h+=`<div class="c gl"><div class="ct">◆ ${L('هفتهٔ ','Week ')}${fa(w)} ${L('از ۶','of 6')}<b>${cur?cur.t:''}</b></div>
      <div class="bar" style="margin:8px 0"><div class="bf" style="width:${Math.min(100,w/6*100)}%"></div></div>
      ${cur?`<div class="cs">${cur.d}</div>`:''}
      ${nx?`<div class="hint">${L('هفتهٔ بعد باز می‌شود: ','Next week: ')}${nx.t} — ${nx.d}</div>`:''}</div>`;
   }
   const _se=seasonNow(S);
   if(_se&&!_ob){
     h+=`<div class="c gl"><div class="ct">◈ ${L('فصل ','Season ')}${fa(_se.n)}<b>${L('روز ','Day ')}${fa(_se.day)}/${fa(SEASON_LEN)}</b></div>
      <div class="bar" style="margin:8px 0"><div class="bf" style="width:${_se.pc}%"></div></div>
      <div class="hint">${L('هفتهٔ ','Week ')}${fa(_se.week)} · ${fa(_se.left)} ${L('روز تا پایان فصل و ارزیابی کامل','days to season review')}</div></div>`;
   }}
  /* نوار رمضان */
  {const _ra=(S.ramadan&&S.ramadan.start&&td()>=S.ramadan.start&&
     td()<=dstr(new Date(new Date(S.ramadan.start).getTime()+29*864e5)));
   if(_ra){const st=sunTimes(),sa=Math.max(0,st.rise-80),ef=st.set,m=mn();
     const dn=Math.floor((new Date(td())-new Date(S.ramadan.start))/864e5)+1;
     const left=ef-m;
     h+=`<div class="c gl" style="background:rgba(255,255,255,.1);border-color:var(--br2)">
      <div class="ct">☾ ${L('رمضان','Ramadan')}<b>${L('روز ','Day ')}${fa(dn)}</b></div>
      <div class="gr" style="grid-template-columns:1fr 1fr;margin-top:6px">
       <div class="st"><div class="sn"><span>${L('سحری تا','Sahar')}</span><span class="sv">${hm(sa)}</span></div></div>
       <div class="st"><div class="sn"><span>${L('افطار','Eftar')}</span><span class="sv">${hm(ef)}</span></div></div></div>
      ${(m<ef&&m>sa)?`<div class="hint">${L('تا افطار ','Until eftar ')}${fa(Math.floor(left/60))}:${fa(left%60).padStart(2,'۰')}</div>`:''}
      <div class="hint">${L('تمرین فقط بعد از افطار. آب بین افطار تا سحر جبران شود.','Train after eftar only.')}</div></div>`;
   }}
  /* نوار حالت خرابی */
  {const _m=(S.mode&&S.mode.d===td()&&MODES[S.mode.k])?S.mode.k:'';
   if(_m){const M=MODES[_m];
     h+=`<div class="c gl" style="background:rgba(255,255,255,.1);border-color:var(--br2)">
      <div class="ct">${M.ic} ${L(M.fa,M.en)}<b onclick="setMode('')" style="cursor:pointer">${L('پایان','End')}</b></div>
      <div class="cs">${L(M.d,M.d)}</div>
      <div class="hint">${L('استریک امروز محافظت می‌شود. فردا خودکار به حالت عادی برمی‌گردی.','Streak protected today.')}</div></div>`;
   }else{
     h+=`<div class="c gl"><div class="ct">◌ ${L('امروز سخت است؟','Rough day?')}</div>
      <div class="gr" style="grid-template-columns:repeat(2,1fr);margin-top:8px">
       ${Object.keys(MODES).map(k=>`<button class="bt" onclick="setMode('${k}')">${MODES[k].ic} ${L(MODES[k].fa,MODES[k].en)}</button>`).join('')}
      </div>
      <div class="hint">${L('به‌جای رها کردن کل روز، حالت مناسب را بزن. استریک نمی‌شکند.','Pick a mode instead of quitting.')}</div></div>`;
   }}
  if(S.crisis) h+=`<div class="c gl crisis"><div class="ct">⛨ ${L('حالت بحران فعال','Crisis Mode')}</div>
   <div class="cs">${L('فقط سه کار. بقیه امروز مهم نیست.','Three things only.')}</div>
   ${CRISIS_MIN.map(c=>`<div class="rw"><div class="ri">${c[0]}</div><div class="rt">${c[1]}</div></div>`).join('')}
   <button class="bt" style="margin-top:7px" onclick="S.crisis=0;sv();rd()">${L('خروج','Exit')}</button></div>`;
  h+=`<div style="display:flex;gap:7px;margin-bottom:11px">
   <button class="bt" onclick="go('cr')">⛨ ${L('پانیک','Panic')}</button>
   <button class="bt" onclick="go('iq')">◈ ${L('آینه','Mirror')}</button>
   <button class="bt" onclick="go('gy')">⚽ ${L('تمرین','Train')}</button></div>`;
  if(EV.length) h+=EV.map(e=>`<div class="c gl" style="background:rgba(255,255,255,.14);border-color:var(--br2)">
    <div class="ct">${EVT[e.k].ic} ${EVT[e.k].t}${e.n?' — '+e.n:''}<b>${e.st} · ${fa(e.dur)}h</b></div>
    <div class="cs">${CLUB} · ${EVT[e.k].rule}</div>
    ${EVT[e.k].pre.map(x=>`<div class="rw"><div class="rx" style="margin:0">${x[0]}</div><div class="rt">${x[1]}</div></div>`).join('')}
    <button class="bt" style="margin-top:7px" onclick="evDel('${e.id}')">${L('حذف رویداد','Remove')}</button></div>`).join('');

  const p=plan(),m=mn(),d=td();
  const dn=p.filter(x=>S.done[d+'|'+x.id]).length;
  const inB=x=>x.e<x.s?(m>=x.s||m<x.e):(m>=x.s&&m<x.e);
  const cur=p.find(inB);
  const nxt=p.find(x=>x.s>m);

  /* ---- کارت «الان» با پیشرفت زنده ---- */
  if(cur){
    const en=cur.e<cur.s?cur.e+1440:cur.e, mm=m<cur.s?m+1440:m;
    const pc=Math.round((mm-cur.s)/(en-cur.s)*100);
    const R=routFor(cur.t);
    const el=mm-cur.s;
    h+=`<div class="c gl nowc">
     <div class="ct">${cur.ic} ${cur.t}<b>${fa(en-mm)} ${L('دقیقه مانده','min left')}</b></div>
     <div class="cs">${cur.d||''}</div>
     <div class="bar" style="height:5px"><div class="bf" style="width:${pc}%"></div></div>
     <div class="hint">${hm(cur.s)} – ${hm(cur.e)} · ${fa(pc)}٪ · ${L('انرژی بدن','energy')} ${fa(energyAt(m))}٪</div>
     ${R?`<div class="sec">${R.t}</div>
       ${R.steps.map((s,i)=>{const nx=R.steps[i+1];
        const on=el>=s[0]&&(!nx||el<nx[0]), pass=nx&&el>=nx[0];
        return `<div class="rstep ${on?'on':''} ${pass?'pass':''}"><b>${on?'▸':pass?'✓':''}${fa(s[0])}'</b>
        <div><div class="rt">${s[1]}</div>${s[2]?`<div class="rd">${s[2]}</div>`:''}</div></div>`}).join('')}
       <div class="hint">${R.why}</div>
       ${GUIDE[R.k]?`<div class="gbtn" onclick="event.stopPropagation();gd('${R.k}','${R.t}')">◫ ${L('مثال و راهنمای تصویری','Example & visual guide')}</div>`:''}`:''}
     <button class="bt ${S.done[d+'|'+cur.id]?'':'p'}" style="margin-top:9px" onclick="tg('${cur.id}')">
      ${S.done[d+'|'+cur.id]?L('✓ انجام شد','✓ Done'):L('انجام شد','Mark done')}</button></div>`;
  } else if(nxt){
    h+=`<div class="c gl"><div class="ct">◷ ${L('بلوک بعدی','Next')}<b>${fa(nxt.s-m)} ${L('دقیقه','min')}</b></div>
     <div class="rw"><div class="ri">${nxt.ic}</div><div><div class="rt">${nxt.t}</div>
      <div class="rd">${hm(nxt.s)} – ${hm(nxt.e)}</div></div></div></div>`;
  }

  /* ---- نمودار انرژی روز ---- */
  const bars=[];for(let i=0;i<48;i++)bars.push(energyAt(i*30));
  h+=`<div class="c gl"><div class="ct">◇ ${L('انرژی روز','Energy Curve')}<b>${L('اکنون','now')} ${fa(energyAt(m))}٪</b></div>
   <div class="egy">${bars.map((v,i)=>`<i class="${Math.floor(m/30)===i?'n':''}" style="height:${v}%"></i>`).join('')}</div>
   <div class="hint">${L('اوج تمرکز صبح و اوایل عصر. افت بعدازظهر طبیعی است — کارهای سبک را آنجا بگذار.','Peak focus: morning and early evening.')}</div></div>`;

  /* ---- تایم‌لاین هوشمند ---- */
  h+=`<div class="c gl"><div class="ct">◷ ${L('تایم‌لاین','Timeline')}<b>${fa(dn)}/${fa(p.length)} · ${jStr()}</b></div>
   <div class="bar" style="margin-bottom:11px"><div class="bf" style="width:${p.length?dn/p.length*100:0}%"></div></div>
   <div class="tl">`;
  let shown=false;
  p.forEach((x,i)=>{
    const k=d+'|'+x.id, D=!!S.done[k], ov=inB(x);
    const cl=D?'done':ov?'live':(m>=x.e&&x.e>x.s?'miss':'');
    /* خط اکنون بین بلوک‌ها */
    if(!shown&&!cur&&x.s>m){h+=`<div class="nowbar"><b>${hm(m)}</b></div>`;shown=true}
    /* فاصلهٔ خالی */
    const pv=p[i-1];
    if(pv&&pv.e<x.s&&x.s-pv.e>=30&&pv.e>pv.s)
      h+=`<div class="gap">${L('فاصلهٔ آزاد','free')} · ${fa(x.s-pv.e)} ${L('دقیقه','min')}</div>`;
    const R=routFor(x.t), warn=fitCheck(x);
    let pstyle='';
    if(ov){const en=x.e<x.s?x.e+1440:x.e,mm=m<x.s?m+1440:m;
      pstyle=`--p:${Math.round((mm-x.s)/(en-x.s)*100)}%`}
    h+=`<div class="sl ${cl}" style="${pstyle}" onclick="tg('${x.id}')">
     ${ov?'<div class="prog"></div>':''}
     <div class="tm">${hm(x.s)}<i>${hm(x.e)}</i></div>
     <div class="sr"><div class="si">${x.ic}</div>
      <div style="flex:1"><div class="t">${x.t}</div>
       ${x.d?`<div class="d">${x.d}</div>`:''}
       <div style="margin-top:4px">
        ${R?`<span class="pill" onclick="event.stopPropagation();rt('${x.id}')">◷ ${fa(R.steps.length)} ${L('گام','steps')}</span>`:''}
        ${R&&GUIDE[R.k]?`<span class="pill" onclick="event.stopPropagation();gd('${R.k}','${R.t}')">◫ ${L('راهنما','guide')}</span>`:''}
        ${warn?`<span class="pill">⚠ ${warn[0]}</span>`:''}
       </div></div>
      <div class="ck">✓</div></div>`;
    if(S.open===x.id&&R)
      h+=`<div style="padding:9px 11px 3px">${R.steps.map(s=>`<div class="rstep">
       <b>${fa(s[0])}'</b><div><div class="rt">${s[1]}</div>${s[2]?`<div class="rd">${s[2]}</div>`:''}</div></div>`).join('')}
       <div class="hint">${R.why}</div></div>`;
    h+=`</div>`;
  });
  if(!shown&&!cur)h+=`<div class="nowbar"><b>${hm(m)}</b></div>`;
  h+=`</div></div>`;

  /* ---- تعادل دسته‌ها ---- */
  const cat={};p.forEach(x=>{const dur=(x.e<x.s?x.e+1440:x.e)-x.s;cat[x.c]=(cat[x.c]||0)+dur});
  const tot=Object.values(cat).reduce((a,b)=>a+b,0);
  h+=`<div class="c gl"><div class="ct">◈ ${L('توزیع امروز','Distribution')}</div>
   ${Object.entries(cat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="st" style="margin-bottom:6px">
    <div class="sn"><span>${(CATN[k]||[k])[0]}</span><span class="sv">${fa(Math.round(v/60))}${L('س','h')} ${fa(v%60)}${L('د','m')}</span></div>
    <div class="bar"><div class="bf" style="width:${v/tot*100}%"></div></div></div>`).join('')}</div>`;

  /* ---- وضعیت ---- */
  const age=ageNow(),bd=daysToBirthday();
  h+=`<div class="c gl"><div class="ct">◆ ${L('وضعیت','Status')}<b>${S.season==='summer'?L('تابستان','Summer'):L('مدرسه','School')}</b></div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr)">
    <div class="sk"><div class="skn">${fa(age)}</div><div class="skl">${L('سال','years')}</div></div>
    <div class="sk"><div class="skn">${fa(P.h)}</div><div class="skl">${L('قد cm','height')}</div></div>
    <div class="sk"><div class="skn">${fa(S.wt[S.wt.length-1])}</div><div class="skl">${L('وزن kg','weight')}</div></div>
   </div>
   <div class="hint">${L(`${fa(bd)} روز تا ${fa(age+1)} سالگی. در پنجرهٔ رشد قد هستی — خواب و پروتئین بالاترین اولویت‌اند.`,`${bd} days to birthday.`)}</div></div>

  <div class="c gl"><div class="ct">▲ ${L('سه کار حیاتی امروز','Top 3')}</div>
   <div class="cs">${L('اگر فقط همین‌ها انجام شوند، روز موفق بوده','If only these, the day succeeded')}</div>
   ${[['●',L('۸ ساعت خواب — قبل ۲۱:۰۰ در تخت','8h sleep')],
      ['■',L('۱۱۰ گرم پروتئین','110g protein')],
      ['▲',L('استریک پاکی حفظ شود','Keep the streak')]]
    .map(x=>`<div class="rw"><div class="ri">${x[0]}</div><div class="rt">${x[1]}</div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">⚑ ${L('رویداد باشگاه','Club Event')}<b>${CLUB}</b></div>
   <div class="cs">${L('مسابقه یا تورنمنت اعلام شد؟ ثبتش کن تا برنامه بازنویسی شود.','Log a match/tournament.')}</div>
   <div style="display:flex;gap:6px;flex-wrap:wrap">
   ${Object.keys(EVT).map(k=>`<button class="bt" style="width:auto;flex:1;min-width:76px;padding:8px 6px;font-size:10px" onclick="evAdd('${k}')">${EVT[k].ic} ${EVT[k].t}</button>`).join('')}</div>
   ${S.ev.length?`<div class="hint">${L('رویدادهای آینده','Upcoming')}: ${S.ev.filter(e=>e.d2>=td()).map(e=>EVT[e.k].ic+' '+e.d1).join(' · ')||L('ندارد','none')}</div>`:''}</div>

  <div class="c gl"><div class="ct">✂ ${L('آرایشگاه','Barber')}<b>${S.barber?(barberDue()?fa(barberDue())+L(' روز مانده',' d left'):L('سررسید شده','DUE')):L('ثبت نشده','not set')}</b></div>
   <div class="cs">${L('هر ۳ هفته — موهای تو زودرشت‌اند.','Every 3 weeks.')}</div>
   <button class="bt ${S.barber&&!barberDue()?'p':''}" onclick="bb()">${L('امروز رفتم','Went today')}</button></div>`;

  return h};

window.evAdd=async k=>{const r=await ask({t:EVT[k].ic+' '+EVT[k].t,
 s:L('برنامهٔ آن روز خودکار بازنویسی می‌شود.','The day plan rewrites itself.'),
 f:[{k:'d1',t:L('تاریخ شروع','Start date'),ty:'date',v:td()},
    {k:'dd',t:L('چند روز','Days'),ty:'num',v:k==='tour'?3:1,st:1,min:1,max:30},
    {k:'st',t:L('ساعت شروع','Start time'),ty:'time',v:'15:00'},
    {k:'dur',t:L('مدت','Duration'),ty:'num',v:EVT[k].def,st:.5,min:.5,max:12,u:L('ساعت','h')},
    {k:'n',t:L('توضیح','Note'),hint:L('اختیاری','optional'),ty:'text',ph:''}]});
 if(!r||!r.d1)return;
 const t=new Date(r.d1);t.setDate(t.getDate()+(r.dd||1)-1);
 S.ev.push({id:Date.now()+'',k,d1:r.d1,d2:dstr(t),st:r.st||'15:00',dur:r.dur||EVT[k].def,n:r.n||''});
 sv();rd();tst(EVT[k].ic+' '+L('ثبت شد','added'))};
window.evDel=i=>{S.ev=S.ev.filter(e=>e.id!==i);sv();rd()};
window.bb=()=>{S.barber=new Date().toISOString();xp(15);sv();rd();tst('✂ ✓')};
window.rt=i=>{S.open=S.open===i?null:i;sv();rd()};
window.tg=async i=>{const k=td()+'|'+i;
 if(S.done[k]){delete S.done[k];xp(-12);sv();rd();return}
 const p=plan(),x=p.find(b=>b.id===i),m=mn();
 if(x&&m>=x.e&&x.e>x.s&&!S.done[k]){
   const r=await ask({t:x.t,s:L('این بلوک گذشته است. انجامش دادی؟','This block has passed. Did you do it?'),
    ok:L('انجام شد','Done'),f:[]});
   if(!r){window.skipAsk(i,x.t);return}
 }
 S.done[k]=1;xp(12);tst('+'+fa(12)+' XP');sv();rd()};
window.skipAsk=async(id,title)=>{
 const r=await ask({t:L('چرا انجام نشد؟','Why skipped?'),s:title,
  ok:L('ثبت','Log'),f:[{k:'r',ty:'pick',o:SKIPR.map(x=>[x[0],x[1]]),v:SKIPR[0][0]}]});
 if(!r||!r.r)return;
 S.skips.push({blk:title,r:r.r,d:td()});sv();rd();
 const n=S.skips.filter(s=>s.blk===title&&s.r===r.r).length;
 tst(n>=3?L('الگو تشخیص داده شد — به تب سلامت برو','Pattern detected'):L('ثبت شد','Logged'))};
V.q=()=>{
  const d=td(),got=QUESTS.filter(q=>S.q[d+'|'+q[0]]).reduce((a,q)=>a+q[4],0);
  const tot=QUESTS.reduce((a,q)=>a+q[4],0);
  return `<div class="c gl"><div class="ct">⚔ ${L('کوئست روزانه','Daily')}<b>${fa(got)}/${fa(tot)} XP</b></div>
  <div class="bar" style="margin-bottom:11px"><div class="bf" style="width:${got/tot*100}%"></div></div>
  ${QUESTS.map(q=>{const _lk=!obOpen(S,q[0]);
   const _done=S.q[d+'|'+q[0]];
   const _inner=`<div class="rw ${_done?'done':''}" style="${_lk?'opacity:.32':''}" onclick="${_lk?`tst('${L('هفتهٔ بعد باز می‌شود','Unlocks later')}')`:`qq('${q[0]}',${q[4]})`}">
   <div class="ri">${q[1]}</div><div><div class="rt">${q[2]}</div>${q[3]?`<div class="rd">${q[3]}</div>`:''}</div>
   ${GUIDE['q_'+q[0]]?`<div class="gbtn" onclick="event.stopPropagation();gd('q_${q[0]}','${q[2]}')">◫</div>`:''}
   <div class="rx">${_lk?'◌':'+'+fa(q[4])}</div></div>`;
   return _lk?_inner:window.swipeRow(_inner,
     `qq('${q[0]}',${q[4]})`,
     GUIDE['q_'+q[0]]?`gd('q_${q[0]}','${String(q[2]).replace(/'/g,"")}')`:'',
     _done?'↺':'✓', '◫');
  }).join('')}</div>

  <div class="c gl"><div class="ct">◈ ${L('هفتگی','Weekly')}</div>
  ${[[L('۳ جلسه فوتبال','3 football'),'⚽',110],[L('۳ جلسه باشگاه','3 gym'),'▤',110],
     [L('۷ شب خواب کامل','7 nights sleep'),'●',140],[L('۲ غذای جدید پختن','2 new dishes'),'◉',90],
     [L('۷ روز پاکی','7 days clean'),'▲',200]]
   .map(w=>`<div class="rw"><div class="ri">${w[1]}</div><div class="rt">${w[0]}</div><div class="rx">+${fa(w[2])}</div></div>`).join('')}</div>`};
window.qq=(i,x)=>{const k=td()+'|'+i;
 if(S.q[k]){delete S.q[k];xp(-x)}
 else{S.q[k]=1;xp(x);window.haptic(12);tst('+'+fa(x)+' XP')}
 sv();rd()};

/* لرزش کوتاه — در APK از Vibrator، در وب از Vibration API */
window.haptic=(ms)=>{
  try{
    if(window.Native&&window.Native.buzz){window.Native.buzz(ms||10);return}
    if(navigator.vibrate)navigator.vibrate(ms||10);
  }catch(e){}
};

V.st=()=>{
  /* نقشهٔ حرارتی ۱۸ هفتهٔ اخیر: هر روز = مجموع فعالیت ثبت‌شده */
  const _heat=(()=>{
    const DAYS=126, cell=[];
    const score=d=>{let n=0;
      if(S.done)Object.keys(S.done).forEach(k=>{if(k.startsWith(d+'|'))n++});
      if(S.q)Object.keys(S.q).forEach(k=>{if(k.startsWith(d+'|'))n++});
      if(Array.isArray(S.jr)&&S.jr.some(x=>x.d===d))n+=2;
      if(Array.isArray(S.wo)&&S.wo.some(x=>x.d===d))n+=2;
      return n};
    let max=1;
    for(let i=DAYS-1;i>=0;i--){
      const dt=dstr(new Date(Date.now()-i*864e5));
      const v=score(dt); if(v>max)max=v; cell.push([dt,v]);}
    const cols=Math.ceil(DAYS/7);
    let sq='';
    for(let c2=0;c2<cols;c2++)for(let r=0;r<7;r++){
      const idx=c2*7+r; if(idx>=cell.length)continue;
      const v=cell[idx][1], op=v===0?0.05:0.15+0.85*Math.min(1,v/max);
      sq+=`<rect x="${c2*7.6}" y="${r*7.6}" width="6.2" height="6.2" rx="1.6" fill="rgba(255,255,255,${op.toFixed(2)})"/>`;}
    const active=cell.filter(x=>x[1]>0).length;
    return `<div class="c gl"><div class="ct">▦ ${L('نقشهٔ فعالیت','Activity Map')}<b>${fa(active)}/${fa(DAYS)} ${L('روز','days')}</b></div>
     <div class="cs">${L('هجده هفتهٔ اخیر. هر خانه یک روز — روشن‌تر یعنی فعال‌تر.','Last 18 weeks.')}</div>
     <svg width="100%" height="58" viewBox="0 0 ${cols*7.6} 53" preserveAspectRatio="xMidYMid meet" style="margin-top:8px">${sq}</svg>
     <div class="hint">${L('پیوستگی از شدت مهم‌تر است. خانه‌های خالی طبیعی‌اند؛ ردیف‌های خالی نه.','Consistency beats intensity.')}</div></div>`})();
  const _cb=S.comeback?`<div class="c gl" style="border-color:var(--br2)">
   <div class="ct">↩ ${L('پروتکل بازگشت','Comeback')}<b>${fa(S.comeback.n||0)}/۳</b></div>
   <div class="cs">${L('رکورد قبلی: '+fa(S.comeback.from||0)+' روز. سه روز پشت‌سرهم و دوباره در مسیری.','Previous: '+(S.comeback.from||0)+' days')}</div>
   <div class="bar" style="margin:9px 0"><div class="bf" style="width:${Math.min(100,(S.comeback.n||0)/3*100)}%"></div></div>
   <button class="bt p" onclick="cbTick()">${L('امروز انجام شد','Done today')}</button></div>`:'';
  const ks=Object.keys(S.stat),n=ks.length,cx=104,cy=100,R=72;
  const pt=(i,r)=>[cx+r*Math.cos(-Math.PI/2+i*2*Math.PI/n),cy+r*Math.sin(-Math.PI/2+i*2*Math.PI/n)];
  let g='';[.25,.5,.75,1].forEach(f=>g+=`<polygon points="${ks.map((_,i)=>pt(i,R*f).join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width=".7"/>`);
  const po=ks.map((k,i)=>pt(i,R*S.stat[k]/100).join(',')).join(' ');
  const lb=ks.map((k,i)=>{const[x,y]=pt(i,R+15);
   return `<text x="${x}" y="${y}" fill="#8a8a93" font-size="8.5" font-family="Vazirmatn" text-anchor="middle" dominant-baseline="middle">${STATS[k][0]}</text>`}).join('');
  const av=Math.round(ks.reduce((a,k)=>a+S.stat[k],0)/n);
  return _heat+_cb+`<div class="c gl" style="text-align:center"><div class="ct" style="justify-content:center">◇ ${L('نمای شخصیت','Character')}</div>
  <div class="cs">${L('میانگین','Avg')} ${fa(av)}٪ · LVL ${fa(lvl(S.xp))}</div>
  <svg width="208" height="200" viewBox="0 0 208 200">${g}
   ${ks.map((_,i)=>{const[x,y]=pt(i,R);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,.08)" stroke-width=".7"/>`}).join('')}
   <polygon points="${po}" fill="rgba(255,255,255,.28)" stroke="#fff" stroke-width="1.4"/>
   ${ks.map((k,i)=>{const[x,y]=pt(i,R*S.stat[k]/100);return `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`}).join('')}
   ${lb}</svg></div>

  <div class="c gl"><div class="ct">${L('ویژگی‌ها','Attributes')}</div>
  <div class="gr">${ks.map(k=>`<div class="st">
   <div class="sn"><span>${STATS[k][0]}</span><span class="sv">${fa(S.stat[k])}</span></div>
   <div class="bar"><div class="bf" style="width:${S.stat[k]}%"></div></div></div>`).join('')}</div></div>

  <div class="c gl"><div class="ct">◉ ${L('استریک','Streaks')}</div>
  <div class="gr">${[['clean',L('پاکی','Clean')],['train',L('تمرین','Train')],['sleep',L('خواب','Sleep')],['screen',L('کم‌مصرفی','Screen')]]
   .map(s=>`<div class="sk"><div class="skn">${fa(S.streak[s[0]]||0)}</div>
    <div class="skl">${s[1]} · ${L('رکورد','best')} ${fa(S.best[s[0]]||0)}</div>
    <div style="display:flex;gap:4px;margin-top:8px">
     <button class="bt p" style="padding:5px;font-size:9px" onclick="sk('${s[0]}',1)">+۱</button>
     <button class="bt" style="padding:5px;font-size:9px" onclick="sk('${s[0]}',0)">↺</button></div></div>`).join('')}</div></div>

  <div class="c gl"><div class="ct">◐ ${L('وزن','Weight')}<b>${fa(S.wt[S.wt.length-1])} kg</b></div>
  <button class="bt" onclick="wt()">${L('ثبت وزن امروز','Log weight')}</button>
  <div class="hint">${L('هدف: افزایش تدریجی وزن با پروتئین و تمرین. در سن تو کاهش وزن توصیه نمی‌شود.','Goal: gradual gain.')}</div></div>`};
window.sk=async(k,v)=>{
  if(v){S.streak[k]++;S.best[k]=Math.max(S.best[k],S.streak[k]);xp(20);tst('◉ '+fa(S.streak[k]));sv();rd();return}
  /* محافظت: در حالت خرابی استریک نمی‌شکند */
  const _m=(S.mode&&S.mode.d===td()&&MODES[S.mode.k])?S.mode.k:'';
  if(_m){tst(MODES[_m].ic+' '+L('حالت محافظت فعال است — استریک نشکست','Protected — streak kept'));return}
  const had=S.streak[k]||0;
  if(had>=7){
    const ok=await ask({t:L('استریک '+fa(had)+' روزه','Streak of '+had),
      s:L('مطمئنی؟ رکوردت ثبت می‌ماند و یک پروتکل بازگشت ۳ روزه شروع می‌شود.','Record is kept; a 3-day comeback starts.'),
      ok:L('بله، ثبت کن','Yes, reset')});
    if(!ok)return;
  }
  S.best[k]=Math.max(S.best[k]||0,had);
  S.streak[k]=0;
  if(had>=7){S.comeback={k,from:had,d:td(),n:0}; tst('↺ '+L('پروتکل بازگشت ۳ روزه شروع شد','3-day comeback started'))}
  else tst('↺ '+L('ریست','reset'));
  sv();rd()};

/* پیشرفت پروتکل بازگشت */
window.cbTick=()=>{
  const cb=S.comeback; if(!cb)return;
  if(cb.last===td())return;
  cb.n=(cb.n||0)+1; cb.last=td();
  if(cb.n>=3){tst('◆ '+L('بازگشتی. پروتکل تمام شد.','You are back.'));xp(80);S.comeback=null}
  else tst('◷ '+L('روز '+fa(cb.n)+' از ۳','Day '+cb.n+' of 3'));
  sv();rd()};
window.wt=async()=>{const last=S.wt[S.wt.length-1];
 const r=await ask({t:L('وزن امروز','Weight today'),s:L('صبح، ناشتا، بعد از دستشویی — همیشه در یک شرایط.','Morning, fasted — same conditions.'),
  f:[{k:'v',ty:'num',v:last,st:.1,min:20,max:200,u:'kg'}]});
 if(r&&r.v>0){S.wt.push(r.v);sv();rd();
  const d=Math.round((r.v-last)*10)/10;tst('✓ '+(d?(d>0?'+':'')+fa(d)+' kg':L('بدون تغییر','no change')))}};
V.sh=()=>`<div class="c gl"><div class="ct">⊘ ${L('بلاکر اپ‌ها','App Blocker')}
  <b>${window.blockerOn&&window.blockerOn()?L('فعال','on'):L('خاموش','off')}</b></div>
 ${(()=>{
   if(!window.isNative||!window.isNative())
     return `<div class="hint">${L('این قابلیت فقط در نسخهٔ اندروید کار می‌کند.','Android only.')}</div>`;
   if(!window.blockerOn())
     return `<div class="cs">${L('برای فعال شدن، Ascend را در تنظیمات دسترس‌پذیری روشن کن. هیچ محتوایی خوانده یا ذخیره نمی‌شود — فقط نام اپ جلوی چشم بررسی می‌شود.','Enable in Accessibility settings.')}</div>
      <button class="bt p" onclick="blockerGo()">${L('باز کردن تنظیمات','Open settings')}</button>`;
   return `<div class="cs">${L('روی هر اپ بزن تا حالتش عوض شود: مسدود، سقف زمانی، یا آزاد.','Tap to change mode.')}</div>
    ${PKGS.map(([pkg,name,def])=>{const st=(S.blk2&&S.blk2[pkg])||def;
      const lbl=st==='block'?L('مسدود','blocked'):st==='cap'?L('سقف زمانی','capped'):L('آزاد','free');
      const ic=st==='block'?'⊘':st==='cap'?'◷':'○';
      return `<div class="rw" onclick="blkCycle('${pkg}')"><div class="ri">${ic}</div>
       <div><div class="rt">${name}</div><div class="rd">${lbl}</div></div></div>`}).join('')}
    <div class="hint">${L('تلگرام هرگز کاملاً مسدود نمی‌شود — محیط کاری توست. فقط سقف ۴۵ دقیقه.','Telegram is capped, never blocked.')}</div>`})()}</div>

 <div class="c gl"><div class="ct">◉ ${L('قفل بخش‌های خصوصی','Private Lock')}
  <b>${S.lockOn?L('روشن','on'):L('خاموش','off')}</b></div>
  <div class="cs">${L('ژورنال و بخش انضباط با اثر انگشت یا رمز گوشی باز شوند. روزی یک بار پرسیده می‌شود.','Fingerprint for journal and discipline.')}</div>
  ${(window.isNative&&window.isNative())
    ? `<button class="bt ${S.lockOn?'':'p'}" onclick="tgLock()">${S.lockOn?L('خاموش کن','Turn off'):L('روشن کن','Turn on')}</button>`
    : `<div class="hint">${L('فقط در نسخهٔ اندروید','Android only')}</div>`}</div>

 <div class="c gl"><div class="ct">◐ ${L('اتصال سلامت','Health Connect')}</div>
  ${(()=>{const st=window.healthState?window.healthState():'web';
   if(st==='web')return `<div class="hint">${L('فقط در نسخهٔ اندروید','Android only')}</div>`;
   if(st==='unsupported')return `<div class="hint">${L('اندروید این گوشی قدیمی‌تر از نیاز است','Needs Android 9+')}</div>`;
   if(st==='missing')return `<div class="cs">${L('اگر Health Connect را نصب کنی، بعداً خواب و قدم خودکار خوانده می‌شوند.','Install to sync sleep and steps later.')}</div>
     <button class="bt" onclick="healthGo()">${L('نصب Health Connect','Install')}</button>`;
   return `<div class="cs">${L('نصب است. فعلاً خواب را دستی ثبت کن — اتصال خودکار در نسخهٔ بعد.','Installed. Manual logging for now.')}</div>
     <button class="bt" onclick="healthGo()">${L('باز کردن','Open')}</button>`})()}</div>

 <div class="c gl"><div class="ct">⊘ ${L('سپر دیجیتال','Shield')}</div>
 <div class="cs">${L('در نسخهٔ اندروید: VpnService محلی + Accessibility. بدون روت، ترافیک از دستگاه خارج نمی‌شود.','Local VpnService + Accessibility.')}</div>
 ${BLOCKS.map(b=>`<div class="rw" ${b[0]!=='adult'?`onclick="bl('${b[0]}')"`:''}>
  <div class="ri">${b[1]}</div><div><div class="rt">${b[2]}</div><div class="rd">${b[3]}</div></div>
  <div class="sw ${S.blk[b[0]]?'on':''} ${b[0]==='adult'?'lk':''}"></div></div>`).join('')}
 <div class="hint">${L('قفل سخت: محتوای بزرگسال با Device Admin محافظت می‌شود و با حذف اپ هم غیرفعال نمی‌شود.','Hard lock via Device Admin.')}</div></div>

 <div class="c gl"><div class="ct">◌ ${L('حالت رهبانیت','Monk Mode')}</div>
 <div class="cs">${L('بلوک‌های بدون گوشی — خودکار','Auto phone-free blocks')}</div>
 <div>${MONK.map(m=>`<span class="tg">${hm(tM(m[0]))}–${hm(tM(m[1]))} · ${m[2]}</span>`).join('')}</div>
 <button class="bt p" style="margin-top:10px" onclick="tst('${L('در نسخهٔ APK','In APK')}')">${L('شروع فوری ۹۰ دقیقه','Start 90 min')}</button></div>

 <div class="c gl"><div class="ct">◈ ${L('مداخلهٔ هوشمند','Smart Intervention')}</div>
 <div class="cs">${L('الگوی الهام‌گرفته از Crucix — رصد مداوم، مداخله در لحظهٔ خطر','Crucix-style monitoring')}</div>
 ${[['◐',L('باز کردن گوشی بعد ۲۱:۰۰','Phone after 21:00'),L('صفحه خاکستری + تنفس اجباری ۶۰ ثانیه','Grayscale + 60s breathing')],
    ['◍',L('باز کردن مکرر یک اپ','Repeated app opens'),L('قفل ۲۰ دقیقه‌ای','20 min lock')],
    ['⊘',L('کلیدواژهٔ محرک','Trigger keyword'),L('قطع فوری + ۱۰ برپی','Cut + 10 burpees')],
    ['○',L('بی‌حرکتی بیش از ۹۰ دقیقه','90 min idle'),L('یادآور حرکت و آب','Move + water')],
    ['▲',L('لغزش ثبت شد','Slip logged'),L('بدون سرزنش — تحلیل الگو و اصلاح شرایط','No shame — pattern analysis')]]
  .map(x=>`<div class="rw"><div class="ri">${x[0]}</div><div><div class="rt">${x[1]}</div><div class="rd">→ ${x[2]}</div></div></div>`).join('')}
 <button class="bt" style="margin-top:9px" onclick="lg()">${L('ثبت لغزش (بدون قضاوت)','Log slip')}</button></div>`;
window.bl=k=>{S.blk[k]=S.blk[k]?0:1;sv();rd()};
window.lg=async()=>{const r=await ask({t:L('ثبت لغزش','Log relapse'),
 s:L('فقط داده، بدون قضاوت. هدف پیدا کردن الگو است، نه سرزنش.','Data, not judgment.'),
 f:[{k:'w',t:L('چه اتفاقی افتاد؟','What happened?'),ty:'area',ph:''},
    {k:'tr',t:L('محرک','Trigger'),ty:'chips',o:[L('تنهایی','Alone'),L('شب‌بیداری','Late night'),L('گوشی در تخت','Phone in bed'),L('بی‌حوصلگی','Bored'),L('استرس','Stress')]}]});
 if(r&&r.w){S.logs.push({d:new Date().toISOString(),w:r.w,tr:r.tr||''});S.streak.clean=0;sv();rd();
  tst(L('ثبت شد. ادامه بده.','Logged.'))}};
V.pr=()=>`<div class="c gl"><div class="ct">◆ ${L('پروتکل‌های شخصی','Protocols')}</div>
 <div class="cs">${L('شخصی‌سازی‌شده بر اساس پروفایل و ارزیابی تصویر','Personalized from your profile')}</div></div>
 ${PROTOCOLS.map((p,i)=>`<div class="c gl" style="padding:0">
  <div class="pw" onclick="ac(${i})"><div class="ri">${p.ic}</div>
   <div><div class="rt">${p.t}</div><div class="rd">${p.d}</div></div><div class="ar" id="ar${i}">▼</div></div>
  <div class="acc" id="ac${i}"><div style="padding:0 12px 12px">
   ${p.steps.map(s=>`<div class="li">${s}</div>`).join('')}
   ${GUIDE[p.id]?`<div class="gbtn" style="margin-top:9px" onclick="gd('${p.id}','${p.t}')">◫ ${L('مثال و راهنمای تصویری','Example & visual guide')}</div>`:''}
   </div></div></div>`).join('')}`;
/* ============ GUIDE SHEET: مثال + چطور + ویدیو + اینفوگرافیک ============ */
/* منبع تصویر: در APK فایل جدا (لود تنبل و سریع‌تر)، در وب base64 درون‌خط */
window.imgSrc=k=>{
  try{ if(window.isNative&&window.isNative()) return 'https://ascend.local/assets/ig/'+k+'.webp'; }catch(e){}
  return IMG[k]||'';
};

window.gd=(k,title)=>{
  const g=GUIDE[k]; if(!g){tst(L('راهنما موجود نیست','No guide'));return}
  const img=IMG[g.ig];
  const yt='https://www.youtube.com/results?search_query='+encodeURIComponent(g.yt);
  document.getElementById('gdb').innerHTML=`
   <div class="gdx" onclick="gdc()"></div>
   <div class="gds">
    <div class="gdh"><div class="gdt">${title||k}</div>
     <div class="gdcl" onclick="gdc()">✕</div></div>
    <div class="gdc">
     ${img?`<img class="gdi" src="${imgSrc(g.ig)}" loading="lazy" alt="">`
          :`<div class="gdph">◫<div>${L('اینفوگرافیک این مورد هنوز ساخته نشده','Infographic pending')}</div></div>`}
     <div class="gsec">◉ ${L('مثال','Example')}</div>
     <div class="gex">${g.ex}</div>
     <div class="gsec">▸ ${L('چطور انجام شود','How to do it')}</div>
     ${g.how.map((s,i)=>`<div class="gstep"><b>${fa(i+1)}</b><div>${s}</div></div>`).join('')}
     <div class="gsec">▶ ${L('نمونهٔ ویدیویی','Video example')}</div>
     <a class="gyt" href="${yt}" target="_blank" rel="noopener">
      <div class="gyi">▶</div>
      <div><div class="rt">${L('تماشای نمونه در یوتیوب','Watch on YouTube')}</div>
       <div class="rd">${g.yt}</div></div></a>
    </div></div>`;
  document.getElementById('gdb').classList.add('op')};
window.gdc=()=>document.getElementById('gdb').classList.remove('op');

window.ac=i=>{document.getElementById('ac'+i).classList.toggle('op');
 document.getElementById('ar'+i).classList.toggle('op')};

V.me=()=>`<div class="c gl"><div class="ct">◎ ${L('پروفایل','Profile')}</div>
 <div class="gr" style="grid-template-columns:repeat(2,1fr)">
  ${[[L('تولد','Born'),fa(P.birth[2])+' '+JM[P.birth[1]-1]+' '+fa(P.birth[0])],
     [L('سن','Age'),fa(ageNow())+L(' سال',' y')],
     [L('قد','Height'),fa(P.h)+' cm'],[L('وزن','Weight'),fa(S.wt[S.wt.length-1])+' kg'],
     [L('بیداری','Wake'),hm(tM(P.wake))],[L('خواب','Sleep'),hm(tM(P.sleep))]]
  .map(x=>`<div class="st"><div class="sn"><span>${x[0]}</span><span class="sv">${x[1]}</span></div></div>`).join('')}</div>
 <div class="hint">${L('ساعت بیداری از ۰۴:۰۰ به ۰۵:۰۰ تغییر داده شد. در ۱۴ سالگی کمتر از ۸ ساعت خواب مستقیماً روی رشد قد، تستوسترون و تمرکز اثر منفی دارد. ۰۵:۰۰ همچنان تو را جزو زودخیزترین‌ها قرار می‌دهد.','Wake moved 04:00 → 05:00 for growth-window sleep.')}</div></div>

 <div class="c gl"><div class="ct">☾ ${L('رمضان','Ramadan')}</div>
 <div class="cs">${L('تاریخ شروع را ثبت کن تا برنامه برای ۳۰ روز بازنویسی شود: سحری، افطار، تمرین بعد افطار، چرت جبرانی.','Set the first fasting day.')}</div>
 <button class="bt ${S.ramadan?'':'p'}" style="margin-top:8px" onclick="ramSet()">
  ${S.ramadan?L('تغییر یا خاموش کردن','Change or disable'):L('فعال کردن حالت رمضان','Enable Ramadan')}</button>
 ${(S.ramadan&&S.ramadan.start)?`<div class="hint">${L('شروع: ','Start: ')}${S.ramadan.start}</div>`:''}</div>

 <div class="c gl"><div class="ct">◱ ${L('پشتیبان‌گیری','Backup')}</div>
 <div class="cs">${L('دادهٔ اپ فقط روی همین گوشی است. اگر اپ پاک شود یا گوشی عوض شود، همه‌چیز از بین می‌رود.','Data lives only on this device.')}</div>
 <div class="gr" style="grid-template-columns:1fr 1fr;margin-top:9px">
  <button class="bt p" onclick="bkExport()">${L('ساخت فایل پشتیبان','Export')}</button>
  <button class="bt" onclick="bkImport()">${L('بازیابی از فایل','Restore')}</button>
 </div>
 <div class="rw" onclick="bkRestoreAuto()"><div class="ri">◷</div>
  <div><div class="rt">${L('پشتیبان خودکار هفتگی','Weekly auto backup')}</div>
  <div class="rd">${(()=>{try{const a=JSON.parse(localStorage.getItem(K+'.auto')||'null');
   return a&&a.at?L('آخرین: ','Last: ')+String(a.at).slice(0,10):L('هنوز ساخته نشده','Not yet')}catch(e){return '—'}})()}</div></div></div>
 ${(()=>{try{return localStorage.getItem(K+'.prev')?`<div class="rw" onclick="bkUndo()"><div class="ri">↩</div>
  <div><div class="rt">${L('برگشت آخرین بازیابی','Undo last restore')}</div></div></div>`:''}catch(e){return ''}})()}
 <div class="hint">${L('فایل پشتیبان را در تلگرام سیوشده یا ایمیل خودت نگه دار.','Keep the file somewhere safe.')}</div></div>

 <div class="c gl"><div class="ct">⌕ ${L('جستجو','Search')}</div>
 <button class="bt" onclick="srch()">${L('جستجو در کل سیستم','Search everything')}</button></div>

 <div class="c gl"><div class="ct">◍ ${L('نمایش','Display')}</div>
 ${(window.isNative&&window.isNative())?`<div class="rw" onclick="tgNotif()"><div class="ri">${S.notif?'◉':'◎'}</div>
  <div><div class="rt">${L('یادآور بلوک‌ها','Block reminders')}</div>
  <div class="rd">${L('سر هر بلوک برنامه اعلان بیاید، حتی وقتی اپ بسته است','Notify at each block')}</div></div></div>`:''}
 <div class="rw" onclick="tgl('flat')"><div class="ri">${S.flat?'☰':'▤'}</div>
  <div><div class="rt">${L('حالت طولانی','Long-scroll mode')}</div><div class="rd">${L('همهٔ بخش‌ها در یک صفحه، بدون فهرست','All sections on one page')}</div></div>
  <div class="sw ${S.flat?'on':''}"></div></div>
 <div class="rw" onclick="tgl('compact')"><div class="ri">${S.compact?'◧':'◫'}</div>
  <div><div class="rt">${L('حالت فشرده','Compact mode')}</div><div class="rd">${L('فقط ضروریات','Essentials only')}</div></div>
  <div class="sw ${S.compact?'on':''}"></div></div>
 <div class="rw" onclick="tgl('amoled')"><div class="ri">◐</div>
  <div><div class="rt">${L('سیاه مطلق','AMOLED black')}</div><div class="rd">${L('مصرف باتری کمتر','Less battery')}</div></div>
  <div class="sw ${S.amoled?'on':''}"></div></div>
 <div class="rw"><div class="ri">A</div><div><div class="rt">${L('اندازهٔ فونت','Font size')}</div>
  <div class="rd">${fa(14+(S.fsz||0))}px</div></div>
  <div style="display:flex;gap:5px;margin-inline-start:auto">
   <button class="bt" style="width:auto;padding:5px 11px" onclick="event.stopPropagation();fsz(-1)">−</button>
   <button class="bt" style="width:auto;padding:5px 11px" onclick="event.stopPropagation();fsz(1)">+</button></div></div></div>

 <div class="c gl"><div class="ct">◍ ${L('تنظیمات','Settings')}</div>
 <div class="rw" onclick="sn()"><div class="ri">${S.season==='summer'?'☀':'▦'}</div>
  <div><div class="rt">${L('حالت برنامه','Schedule mode')}</div>
  <div class="rd">${S.season==='summer'?L('تابستان — تغییر به مدرسه','Summer'):L('مدرسه — تغییر به تابستان','School')}</div></div></div>
 <div class="rw" onclick="lang()"><div class="ri">⇄</div>
  <div><div class="rt">${L('زبان','Language')}</div><div class="rd">${S.lang==='fa'?'فارسی → English':'English → فارسی'}</div></div></div></div>

 <div class="c gl"><div class="ct">◈ ${L('مربی هوشمند','AI Coach')}</div>
 <div class="hint">${L('با اتصال کلید API: بازنویسی خودکار برنامه بر اساس عملکرد واقعی، گزارش تحلیلی شبانه، و مداخلهٔ گفتگویی در لحظهٔ وسوسه. داده‌ها روی دستگاه می‌مانند.','Connect an API key for adaptive planning.')}</div>
 <button class="bt" style="margin-top:9px" onclick="tst('${L('فاز بعد','Next phase')}')">${L('افزودن کلید API','Add API key')}</button></div>

 <div class="c gl"><div class="ct">◇ ${L('داده','Data')}</div>
 <button class="bt" onclick="ex()">${L('خروجی JSON','Export')}</button>
 <button class="bt" style="margin-top:7px" onclick="wipe()">${L('پاک کردن کامل','Erase')}</button>
 <div class="hint">${L('۱۰۰٪ محلی. هیچ داده‌ای از دستگاه خارج نمی‌شود.','100% local.')}</div></div>`;
window.sn=()=>{S.season=S.season==='summer'?'school':'summer';sv();rd()};
window.wipe=async()=>{if(await askYes(L('همه‌چیز پاک شود؟','Erase everything?'),
 L('تمام نمرات، ثبت‌ها، استریک‌ها و XP برای همیشه حذف می‌شوند. این کار برگشت‌پذیر نیست.','All data is permanently deleted.'),
 L('بله، پاک کن','Erase')))window.rs()};
window.srch=async()=>{const r=await ask({t:L('جستجو در سیستم','Search'),
 f:[{k:'q',ty:'text',ph:L('نام تب، پروتکل یا روتین','Tab, protocol or routine')}]});
 if(!r||!r.q)return;const q=r.q;
 const hits=[];GRP.forEach(g=>g[4].forEach(s=>{if(s[1].includes(q)||s[2].toLowerCase().includes(q.toLowerCase()))hits.push([g[0],s[0],s[1]])}));
 PROTOCOLS.forEach(x=>{if(x.t.includes(q))hits.push(['self','pr',x.t])});
 Object.values(ROUT).forEach(x=>{if(x.t.includes(q))hits.push(['now','day',x.t])});
 if(!hits.length)return tst(L('چیزی پیدا نشد','Not found'));
 const r2=await ask({t:L('نتایج','Results'),s:fa(hits.length)+L(' مورد',' found'),
  f:[{k:'i',ty:'pick',o:hits.map((x,j)=>[String(j),x[2]]),v:'0'}]});
 if(r2&&hits[+r2.i])window.goSub(hits[+r2.i][0],hits[+r2.i][1])};
window.isNative=()=>{try{const N=window.Native;return !!(N&&typeof N.isNative==='function'&&N.isNative())}catch(e){return false}};
/* ============ مرحلهٔ ۱: پشتیبان‌گیری و بازیابی ============ */
window.bkExport=()=>{
  try{
    const payload={__ascend:1,v:2,at:new Date().toISOString(),data:S};
    const txt=JSON.stringify(payload);
    const name='ascend-backup-'+td()+'.json';
    /* مسیر ۱: دانلود در مرورگر */
    try{
      const b=new Blob([txt],{type:'application/json'});
      const u=URL.createObjectURL(b), a=document.createElement('a');
      a.href=u; a.download=name; document.body.appendChild(a); a.click();
      setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},400);
      tst(L('فایل پشتیبان ساخته شد','Backup saved'));
      return true;
    }catch(e){}
    /* مسیر ۲: نمایش متن برای کپی دستی */
    ask({t:L('پشتیبان','Backup'),s:L('این متن را کپی و جایی ذخیره کن','Copy this text'),
      f:[{k:'j',ty:'area',v:txt}],ok:L('بستن','Close')});
    return true;
  }catch(e){tst(L('خطا در ساخت پشتیبان','Backup failed'));return false}
};

window.bkStats=o=>{
  const d=o&&o.data?o.data:o;
  const n=x=>Array.isArray(d[x])?d[x].length:0;
  return [[L('XP','XP'),fa(d.xp||0)],
   [L('ژورنال','Journal'),fa(n('jr'))],
   [L('تمرین','Workouts'),fa(n('wo'))],
   [L('مسابقه','Matches'),fa(n('ms'))],
   [L('افراد','People'),fa(n('ppl'))],
   [L('نمره','Grades'),fa(Object.keys(d.grades||{}).length)],
   [L('تاریخ','Date'),(o&&o.at?String(o.at).slice(0,10):'—')]];
};

window.bkImport=async()=>{
  const r=await ask({t:L('بازیابی از پشتیبان','Restore'),
    s:L('متن فایل پشتیبان را اینجا بچسبان. دادهٔ فعلی جایگزین می‌شود.','Paste backup JSON'),
    f:[{k:'j',ty:'area',v:''}],ok:L('بررسی','Check')});
  if(!r||!r.j||!String(r.j).trim())return;
  let o;
  try{o=JSON.parse(String(r.j).trim())}
  catch(e){tst(L('فایل معتبر نیست','Invalid JSON'));return}
  const d=o&&o.data?o.data:o;
  if(!d||typeof d!=='object'||Array.isArray(d)){tst(L('ساختار ناشناخته','Bad structure'));return}
  if(d.xp===undefined&&d.done===undefined&&d.jr===undefined){
    tst(L('این فایل پشتیبان Ascend نیست','Not an Ascend backup'));return}
  const ok=await ask({t:L('تأیید بازیابی','Confirm restore'),
    s:L('دادهٔ فعلی کاملاً جایگزین می‌شود. برگشت‌پذیر نیست.','Current data will be replaced.'),
    f:[{k:'i',ty:'info',rows:window.bkStats(o)}],ok:L('بازیابی کن','Restore')});
  if(!ok)return;
  try{
    localStorage.setItem(K+'.prev',JSON.stringify(S));   /* یک قدم برگشت */
    localStorage.setItem(K,JSON.stringify(d));
    tst(L('بازیابی شد. در حال بارگذاری…','Restored. Reloading…'));
    setTimeout(()=>location.reload(),700);
  }catch(e){tst(L('خطا در ذخیره','Save failed'))}
};

window.bkUndo=async()=>{
  let prev=null;
  try{prev=localStorage.getItem(K+'.prev')}catch(e){}
  if(!prev){tst(L('نسخهٔ قبلی موجود نیست','No previous version'));return}
  const ok=await ask({t:L('برگشت به قبل از بازیابی','Undo restore'),
    s:L('به وضعیت پیش از آخرین بازیابی برمی‌گردی.','Revert to pre-restore state.'),
    ok:L('برگرد','Revert')});
  if(!ok)return;
  try{
    localStorage.setItem(K,prev);
    localStorage.removeItem(K+'.prev');
    setTimeout(()=>location.reload(),500);
  }catch(e){tst(L('خطا','Failed'))}
};

/* پشتیبان خودکار هفتگی در خود دستگاه */
window.bkAuto=()=>{
  try{
    const wk=Math.floor(Date.now()/6048e5);
    if(S.bkWk===wk)return false;
    localStorage.setItem(K+'.auto',JSON.stringify({__ascend:1,v:2,at:new Date().toISOString(),data:S}));
    S.bkWk=wk; sv(); return true;
  }catch(e){return false}
};

window.bkRestoreAuto=async()=>{
  let a=null;
  try{a=JSON.parse(localStorage.getItem(K+'.auto')||'null')}catch(e){}
  if(!a){tst(L('پشتیبان خودکار موجود نیست','No auto backup'));return}
  const ok=await ask({t:L('بازیابی پشتیبان خودکار','Restore auto backup'),
    f:[{k:'i',ty:'info',rows:window.bkStats(a)}],ok:L('بازیابی','Restore')});
  if(!ok)return;
  try{
    localStorage.setItem(K+'.prev',JSON.stringify(S));
    localStorage.setItem(K,JSON.stringify(a.data));
    setTimeout(()=>location.reload(),500);
  }catch(e){tst(L('خطا','Failed'))}
};

/* ============ مرحلهٔ ۶ ============ */
/* شروع سیستم */
window.obStart=async()=>{
  const r=await ask({t:L('شروع سیستم','Start'),
    s:L('از امروز عادت‌ها هفته‌به‌هفته باز می‌شوند. هفتهٔ اول فقط سه تا. سیستم کامل از روز اول یعنی رها کردن در هفتهٔ دوم.','Habits unlock weekly.'),
    ok:L('امروز شروع می‌کنم','Start today')});
  if(!r)return;
  S.startDate=td(); S.obOff=0; sv(); rd();
  tst('◆ '+L('شروع شد. هفتهٔ اول: خواب، آب، ژورنال.','Week 1 started.'))};
window.obSkip=()=>{S.obOff=1;sv();rd();tst(L('همهٔ عادت‌ها باز شد','All unlocked'))};

/* محرک لغزش */
window.urgeLog=async()=>{
  const r=await ask({t:L('ثبت وسوسه','Log urge'),
    s:L('چه مقاومت کردی چه نه، ثبت کن. هدف پیدا کردن الگوست نه قضاوت.','Pattern, not judgement.'),
    f:[{k:'t',t:L('قبلش چه حسی داشتی؟','Feeling'),ty:'pick',o:TRIGGERS.map(x=>[x[0],x[1]])},
       {k:'r',t:L('نتیجه','Result'),ty:'pick',o:[['1',L('مقاومت کردم','Resisted')],['0',L('نه','No')]],v:'1'}]});
  if(!r||!r.t)return;
  S.urges=S.urges||[];
  S.urges.push({h:new Date().getHours(),t:r.t,r:r.r==='1'?1:0,d:td()});
  if(r.r==='1')xp(15);
  sv();rd();
  tst(r.r==='1'?'▲ '+L('ثبت شد. مقاومت هم داده است.','Logged.'):L('ثبت شد. فردا روز جدید است.','Logged.'))};

/* تست بدنی */
window.ftLog=async k=>{
  const f=FT_MAP[k]; if(!f)return;
  const r=await ask({t:f[1],s:f[4],
    f:[{k:'v',t:f[2],ty:'num',v:''}]});
  if(!r||r.v===''||isNaN(+r.v))return;
  S.ftest=S.ftest||[];
  S.ftest.push({k,v:+r.v,d:td()});
  xp(30); sv(); rd();
  const d=ftDelta(S,k);
  tst(d?(d.better?'▲ ':'▼ ')+L('نسبت به قبل ','vs prev ')+fa(d.pc)+'٪':'✓ '+L('اولین ثبت','First'));};

/* خواب */
window.slLog=async()=>{
  const r=await ask({t:L('خواب دیشب','Last night'),
    s:L('چند ساعت خوابیدی؟ هدف در ۱۴ سالگی ۸.۵ ساعت است.','Target 8.5h'),
    f:[{k:'h',ty:'num',v:''}]});
  if(!r||r.h===''||isNaN(+r.h))return;
  S.sleepLog=S.sleepLog||{};
  S.sleepLog[td()]=+r.h;
  if(+r.h>=8)xp(20);
  sv();rd();tst('●  '+fa(r.h)+L(' ساعت',' h'))};

/* خرید */
window.shopTg=id=>{S.shop=S.shop||{};S.shop[id]=!S.shop[id];sv();rd()};
window.shopClear=()=>{S.shop={};sv();rd();tst(L('لیست پاک شد','Cleared'))};

/* ============ مرحلهٔ ۷ ============ */
window.htLog=async()=>{
  const cur=(S.hts&&S.hts.length)?S.hts[S.hts.length-1].v:P.h;
  const r=await ask({t:L('ثبت قد','Log height'),
    s:L('صبح بعد از بیدار شدن، بدون کفش، پشت به دیوار. ماهی یک بار کافی است.','Morning, no shoes, against wall.'),
    f:[{k:'v',t:'cm',ty:'num',v:String(cur)}]});
  if(!r||isNaN(+r.v)||+r.v<80||+r.v>250)return;
  htAdd(S,+r.v); P.h=+r.v; xp(25); sv(); rd();
  const st=htStats(S);
  tst(st&&st.grown>0?'▲ '+fa(st.grown)+L(' سانت از اولین ثبت',' cm total'):'✓');};

/* تنفس ۴-۷-۸ */
window.brStart=()=>{
  let cyc=0,phase=0,left=BREATH[0][1];
  const box=document.getElementById('gdb');
  const draw=()=>{
    const [k,sec,label]=BREATH[phase];
    const pc=Math.round((1-left/sec)*100);
    box.innerHTML=`<div class="gdx"></div><div class="gds" style="max-height:auto">
     <div class="gdh"><div class="gdt">◍ ${L('تنفس ۴-۷-۸','Breathing')}</div>
      <div class="gdcl" onclick="brStop()">✕</div></div>
     <div class="gdc" style="text-align:center;padding:30px 16px 40px">
      <div style="font-size:52px;font-weight:200;line-height:1">${fa(left)}</div>
      <div style="font-size:15px;margin-top:10px">${label}</div>
      <div class="bar" style="margin:18px 0"><div class="bf" style="width:${pc}%"></div></div>
      <div class="hint">${L('چرخهٔ ','Cycle ')}${fa(cyc+1)} ${L('از ۴','of 4')}</div>
      <div class="hint">${L('این تمرین ضربان قلب را پایین می‌آورد. قبل امتحان و مسابقه.','Lowers heart rate.')}</div>
     </div></div>`;
    box.classList.add('op');};
  draw();
  if(window.__br)clearInterval(window.__br);
  window.__br=setInterval(()=>{
    left--;
    if(left<=0){phase++;
      if(phase>=BREATH.length){phase=0;cyc++;
        if(cyc>=4){window.brStop();xp(20);tst('◍ '+L('تمام شد','Done'));return}}
      left=BREATH[phase][1];}
    draw();},1000);};
window.brStop=()=>{if(window.__br){clearInterval(window.__br);window.__br=null}
  const b=document.getElementById('gdb');if(b){b.classList.remove('op');b.innerHTML=''}};

/* خانواده */
window.famTg=k=>{famLog(S,k);xp(20);sv();rd();tst('◈ '+L('ثبت شد','Logged'))};

window.tgl=k=>{S[k]=S[k]?0:1;sv();rd()};
/* ---- همگام‌سازی یادآورها با لایهٔ نیتیو (فقط در APK) ---- */
/* خلاصهٔ کامل برای ویجت‌ها — ویجت نمی‌تواند JS اجرا کند،
   پس هر چیزی که لازم دارد از قبل محاسبه و ذخیره می‌شود. */
window.syncWidget=()=>{
  const N=window.Native;
  if(!N||!N.saveWidget)return false;
  try{
    const d=td();
    const q=QUESTS.filter(x=>obOpen(S,x[0])).map(x=>({
      id:x[0], t:x[2], xp:x[4], done:!!S.q[d+'|'+x[0]]
    }));
    const m=(typeof masteryScore==='function')?masteryScore(S):{mind:0,body:0,look:0,all:0};
    const sl=(typeof sleepPlan==='function')?sleepPlan(S):null;
    const pl=(typeof player==='function')?player(S):{overall:0,tested:0};
    const st=S.streak||{};
    /* روز تمرین بعدی */
    let nextTrain=null;
    for(let i=0;i<7;i++){
      const dow=(new Date().getDay()+i)%7;
      if((ME.clubDays||[]).includes(dow)){
        nextTrain={in:i,dow};break;
      }
    }
    N.saveWidget(JSON.stringify({
      quests:q,
      xp:S.xp||0, lvl:lvl(S.xp||0),
      mastery:{mind:m.mind,body:m.body,look:m.look,all:m.all},
      sleep:sl?{target:sl.targetStr,day:sl.day,pc:Math.round(sl.shiftMin/270*100)}:null,
      football:{overall:pl.overall,tested:pl.tested,total:15,
                next:nextTrain?nextTrain.in:null},
      streak:{clean:st.clean||0,train:st.train||0,sleep:st.sleep||0},
      prot:(typeof protToday==='function')?protToday(S):null
    }));
    return true;
  }catch(e){return false}
};

window.syncNotif=()=>{
  if(!window.isNative||!window.isNative())return false;
  try{
    const N=window.Native;
    const p=JSON.stringify(plan().filter(x=>x.e>x.s)
      .map(x=>({s:x.s,e:x.e,t:x.t,d:x.d||'',ic:x.ic||''})));
    /* ویجت همیشه برنامه را می‌گیرد؛ آلارم فقط وقتی روشن است */
    if(!S.notif){N.cancelAll();N.planOnly(p);window.syncWidget();return true}
    N.schedule(p);
    window.syncWidget();
    return true;
  }catch(e){return false}
};
/* کارهایی که از روی اعلان تیک خورده‌اند را اعمال کن */
window.drainPending=()=>{
  if(!window.isNative||!window.isNative())return 0;
  let raw='';
  try{raw=window.Native.takePending?window.Native.takePending():''}catch(e){return 0}
  if(!raw)return 0;
  const names=raw.split('|').filter(Boolean);
  const d=td(), p=plan(); let n=0;
  names.forEach(nm=>{
    const blk=p.find(x=>x.t===nm);
    if(blk&&!S.done[d+'|'+blk.id]){S.done[d+'|'+blk.id]=1;xp(15);n++}
  });
  if(n){sv();rd();tst('✓ '+fa(n)+L(' مورد از اعلان ثبت شد',' from notifications'))}
  return n;
};

window.tgNotif=()=>{S.notif=S.notif?0:1;sv();window.syncNotif();rd();
  tst(S.notif?L('یادآورها روشن شد','Reminders on'):L('یادآورها خاموش شد','Reminders off'))};
window.fsz=d=>{S.fsz=Math.max(-2,Math.min(4,(S.fsz||0)+d));sv();rd()};
window.lang=()=>{S.lang=S.lang==='fa'?'en':'fa';document.documentElement.dir=S.lang==='fa'?'rtl':'ltr';sv();rd()};
window.ex=()=>{const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));
 a.download='ascend.json';a.click();tst('✓')};
window.rs=()=>{localStorage.removeItem(K);S=JSON.parse(JSON.stringify(DEF));rd()};


