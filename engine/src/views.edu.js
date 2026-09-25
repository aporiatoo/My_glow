/* ============ ACADEMIC ============ */
V.st_plan=()=>{
  const P=studyPlan(S);
  const tot=P.reduce((a,x)=>a+x.target,0), got=P.reduce((a,x)=>a+x.got,0);
  return `<div class="c gl"><div class="ct">◆ ${L('برنامهٔ درسی هفته','Weekly Study')}<b>${fa(Math.round(got/60))}/${fa(Math.round(tot/60))} ${L('ساعت','h')}</b></div>
   <div class="cs">${GRADE_NAME} · ${L('زمان پیشنهادی بر اساس ضریب و سختی هر درس','By coefficient and difficulty')}</div>
   <div class="bar" style="height:5px;margin-bottom:11px"><div class="bf" style="width:${tot?got/tot*100:0}%"></div></div>
   ${P.map(s=>`<div class="rw" onclick="stAdd('${s.k}')">
    <div class="ri">${s.ic}</div>
    <div style="flex:1"><div class="rt">${s.t} <span style="color:var(--dim2);font-size:9px">· ${L('ضریب','coef')} ${fa(s.coef)} · ${s.diff}</span></div>
     <div class="bar" style="margin-top:5px"><div class="bf" style="width:${s.pc}%"></div></div>
     <div class="rd" style="margin-top:3px">${fa(s.got)} / ${fa(s.target)} ${L('دقیقه','min')}</div></div>
    <div class="rx">${fa(s.pc)}٪</div></div>`).join('')}
   <div class="hint">${L('روی هر درس بزن تا زمان مطالعه ثبت کنی.','Tap to log study time.')}</div></div>

  <div class="c gl"><div class="ct">◷ ${L('جلسهٔ مطالعه','Study Session')}</div>
   <div class="cs">${STUDY_ROUT.why}</div>
   ${STUDY_ROUT.steps.map(s=>`<div class="rstep"><b>${fa(s[0])}'</b>
    <div><div class="rt">${s[1]}</div><div class="rd">${s[2]}</div></div></div>`).join('')}
   <div style="display:flex;gap:6px;margin-top:10px">
    ${Object.entries(TDEF).map(([k,d])=>`<button class="bt${k==='study'?' p':''}" style="margin:0;flex:1;padding:10px 4px;font-size:10px" onclick="fzStart('${k}')">
     ${L(d.t,d.te)}<br><span style="font-size:9px;opacity:.6">${fa(d.m)}${L('د','m')}</span></button>`).join('')}</div>
   <div class="hint">${L('تایمر با ثبت خودکار زمان، درس و حواس‌پرتی‌ها.','Timer auto-logs time, subject and distractions.')}</div></div>

  ${(S.hw||[]).filter(x=>!x.done).length?`<div class="c gl"><div class="ct">▣ ${L('تکالیف','Homework')}<b>${fa(S.hw.filter(x=>!x.done).length)}</b></div>
   ${S.hw.filter(x=>!x.done).sort((a,b)=>a.d<b.d?-1:1).map(x=>{
     const dd=Math.ceil((new Date(x.d)-Date.now())/864e5);
     return `<div class="rw" onclick="hwD(${S.hw.indexOf(x)})"><div class="ri">${(SUBJ.find(s=>s[0]===x.s)||['','','◦'])[2]}</div>
     <div><div class="rt">${x.t}</div><div class="rd">${(SUBJ.find(s=>s[0]===x.s)||['','?'])[1]}</div></div>
     <div class="rx" ${dd<=1?'style="background:#fff;color:#000"':''}>${dd<=0?L('امروز','today'):fa(dd)+L(' روز',' d')}</div></div>`}).join('')}
   </div>`:''}
  <div class="c gl"><div class="ct">▣ ${L('تکالیف','Homework')}</div>
   <button class="bt" onclick="hwAdd()">${L('افزودن تکلیف','Add homework')}</button>
   ${(S.hw||[]).filter(x=>x.done).length?`<div class="hint">${L('انجام‌شده','Done')}: ${fa(S.hw.filter(x=>x.done).length)}</div>`:''}</div>`};
window.stAdd=async k=>{const s=SUBJ.find(x=>x[0]===k)||['','?'];
 const r=await ask({t:L('ثبت مطالعه — '+s[1],'Log study — '+s[1]),s:L('فقط زمان تمرکز واقعی را بشمار، نه زمان نشستن پشت میز.','Count focused minutes only.'),
  f:[{k:'v',t:L('دقیقه','Minutes'),ty:'num',v:50,st:5,min:0,max:600,u:L('دقیقه','min')},
     {k:'q',t:L('کیفیت تمرکز','Focus quality'),ty:'rate',max:5,v:4}]});
 if(!r||!(r.v>0))return;const wk=weekKey();S.stLog[wk]=S.stLog[wk]||{};
 S.stLog[wk][k]=(S.stLog[wk][k]||0)+r.v;
 const g=Math.round(r.v/2*(r.q>=4?1.2:r.q<=2?.7:1));
 xp(g);sv();rd();tst('+'+fa(g)+' XP')};
window.stSess=async()=>{const r=await ask({t:L('پایان جلسهٔ مطالعه','End session'),
 s:L('صادق باش — این عدد فقط برای خودت است و الگوی تمرکزت را می‌سازد.','Be honest; this builds your focus pattern.'),
 f:[{k:'f',t:L('چند بار حواست پرت شد؟','Distractions?'),ty:'num',v:2,st:1,min:0,max:60},
    {k:'n',t:L('یادداشت','Note'),hint:L('اختیاری','optional'),ty:'text',ph:L('چه چیزی حواست را پرت کرد؟','What distracted you?')}]});
 if(!r)return;S.stSess.push({d:td(),f:r.f||0,n:r.n||'',t:Date.now()});S.focus[Date.now()]=r.f||0;
 xp(30);sv();rd();tst('◷ +'+fa(30))};
window.hwAdd=async()=>{const r=await ask({t:L('افزودن تکلیف','Add homework'),
 f:[{k:'t',t:L('عنوان','Title'),ty:'text',ph:L('مثلاً تمرین صفحهٔ ۴۵','e.g. p.45 exercises')},
    {k:'s',t:L('درس','Subject'),ty:'pick',o:SUBJ.map(s=>[s[0],s[2]+' '+s[1]]),v:'math'},
    {k:'d',t:L('موعد','Due'),ty:'date',v:td()}]});
 if(!r||!r.t)return;S.hw=S.hw||[];S.hw.push({t:r.t,s:r.s,d:r.d||td(),done:0});sv();rd();tst('✓')};
window.hwD=i=>{if(S.hw[i]){S.hw[i].done=1;xp(20);sv();rd();tst('▣ +'+fa(20))}};

V.st_grade=()=>{
  const G=gpa(S);
  const c=G.avg>=18?L('عالی','Excellent'):G.avg>=16?L('خوب','Good'):G.avg>=14?L('متوسط','Average'):G.avg>0?L('نیاز به تقویت','Needs work'):'—';
  return `<div class="c gl" style="text-align:center"><div class="ct" style="justify-content:center">▦ ${L('معدل','GPA')}</div>
   <div class="big" style="font-size:42px;margin:6px 0">${G.avg?fa(G.avg):'—'}</div>
   <div class="cs" style="text-align:center">${c} · ${L('میانگین وزنی بر اساس ضریب','Weighted average')}</div>
   <button class="bt p" style="margin-top:9px" onclick="grAdd()">${L('ثبت نمرهٔ جدید','Add grade')}</button></div>

  ${G.list.length?`<div class="c gl"><div class="ct">${L('نمرات — از ضعیف‌ترین','Weakest first')}</div>
   ${G.list.map(x=>`<div class="rw" onclick="grAdd('${x.k}')"><div class="ri">${x.ic}</div>
    <div style="flex:1"><div class="rt">${x.t} ${x.trend?`<span style="font-size:9px;color:var(--dim2)">${x.trend>0?'▲ +'+fa(x.trend):'▽ '+fa(x.trend)}</span>`:''}</div>
     <div class="bar" style="margin-top:5px"><div class="bf" style="width:${x.av/20*100}%"></div></div>
     <div class="rd" style="margin-top:3px">${fa(x.n)} ${L('نمره','grades')} · ${L('ضریب','coef')} ${fa(x.coef)}</div></div>
    <div class="rx" ${x.av<15?'style="background:#fff;color:#000"':''}>${fa(x.av)}</div></div>`).join('')}
   <div class="hint">${G.list[0]&&G.list[0].av<16?L('ضعیف‌ترین درس تو '+G.list[0].t+' است. بیشترین بازدهِ وقت تو در تقویت همین درس است، نه در رساندن ۱۸ به ۱۹.','Focus on the weakest subject.'):L('توزیع نمرات متعادل است.','Balanced distribution.')}</div></div>`
  :`<div class="c gl"><div class="hint">${L('هنوز نمره‌ای ثبت نشده. بعد از هر امتحان ثبت کن تا تحلیل رشته فعال شود.','No grades yet.')}</div></div>`}

  <div class="c gl"><div class="ct">◷ ${L('امتحانات','Exams')}</div>
   <button class="bt" onclick="exm()">${L('افزودن امتحان','Add exam')}</button>
   ${(S.exams||[]).filter(e=>e.d>=td()).sort((a,b)=>a.d<b.d?-1:1).map(e=>{
    const dd=Math.max(0,Math.ceil((new Date(e.d)-Date.now())/864e5));
    return `<div style="margin-top:9px;padding:11px;border-radius:13px;background:rgba(255,255,255,.05);border:.5px solid var(--br)">
     <div class="ct">${e.t}<b>${dd===0?L('امروز','today'):fa(dd)+L(' روز',' d')}</b></div>
     ${examPlan(e).map(s=>`<div class="rstep"><b>◦</b><div><div class="rt">${s[0]}</div>
      <div class="rd">${s[1]}</div></div></div>`).join('')}</div>`}).join('')}</div>`};
window.grAdd=async pre=>{const r=await ask({t:L('ثبت نمره','Add grade'),
 s:L('هر نمره را ثبت کن، حتی کلاسی. تحلیل رشته به همین داده‌ها وابسته است.','Log every grade — stream analysis depends on it.'),
 f:[{k:'s',t:L('درس','Subject'),ty:'pick',o:SUBJ.map(s=>[s[0],s[2]+' '+s[1]]),v:pre||'math'},
    {k:'v',t:L('نمره','Grade'),hint:L('از ۲۰','of 20'),ty:'num',v:18,st:.25,min:0,max:20},
    {k:'n',t:L('بابت','For'),hint:L('اختیاری','optional'),ty:'chips',o:[L('میان‌ترم','Midterm'),L('پایان‌ترم','Final'),L('کلاسی','Class'),L('آزمونک','Quiz'),L('پروژه','Project')]}]});
 if(!r||!(r.v>=0&&r.v<=20))return;
 S.grades[r.s]=S.grades[r.s]||[];S.grades[r.s].push({v:r.v,n:r.n||'',d:jStr()});
 const g=r.v>=18?40:r.v>=15?25:15;xp(g);sv();rd();
 tst((r.v>=18?'▦ ':'◦ ')+L('ثبت شد','Saved')+' +'+fa(g))};

V.st_stream=()=>{
  const A=streamAdvice(S), G=gpa(S);
  const toKhordad=(()=>{let n=0,t=new Date();
    while(n<400){const jj=jToday(t);if(jj[1]===3&&jj[2]===31)return n;t.setDate(t.getDate()+1);n++}return 0})();
  return `<div class="c gl"><div class="ct">◈ ${L('هدایت تحصیلی','Stream Guidance')}<b>${fa(toKhordad)} ${L('روز','days')}</b></div>
   <div class="cs">${L('پایان پایهٔ نهم، رشتهٔ دبیرستان تو تعیین می‌شود. این مهم‌ترین تصمیم تحصیلی امسال است و مستقیماً به نمرات همین سال وابسته است.','End of grade 9 sets your high-school stream.')}</div>
   ${G.avg?'':`<div class="hint">${L('برای تحلیل دقیق، نمراتت را در تب نمرات ثبت کن.','Add grades for analysis.')}</div>`}</div>

  ${A.map(s=>`<div class="c gl${s.fit>=100?' crisis':''}">
   <div class="ct">${s.ic} ${s.t}${s.fit!==null?`<b>${fa(s.fit)}٪ ${L('تناسب','fit')}</b>`:''}</div>
   <div class="cs">${s.d}</div>
   ${s.fit!==null?`<div class="bar" style="height:5px"><div class="bf" style="width:${Math.min(100,s.fit)}%"></div></div>`:''}
   <div class="hint">${L('مسیرهای شغلی','Careers')}: ${s.jobs}</div>
   <div class="hint">${L('نمرات لازم','Required')}: ${Object.entries(s.need).map(([k,v])=>((SUBJ.find(x=>x[0]===k)||[])[1]||k)+' '+fa(v)).join(' · ')}</div>
   ${s.gaps.length?`<div class="hint" style="color:var(--ink)">${L('فاصله تا هدف','Gap')}: ${s.gaps.join(' · ')}</div>`:''}
   </div>`).join('')}

  <div class="c gl"><div class="ct">◆ ${L('هدف تو','Your Target')}</div>
   ${S.stream?`<div class="big" style="font-size:18px">${(STREAMS.find(x=>x.k===S.stream)||{}).t||''}</div>
    <div class="hint">${L('هدف تعیین شد. درس‌های کلیدی این رشته در برنامهٔ مطالعه اولویت می‌گیرند.','Target set.')}</div>
    <button class="bt" style="margin-top:8px" onclick="S.stream=null;sv();rd()">${L('تغییر هدف','Change')}</button>`
   :`<div class="cs">${L('یک رشته را به‌عنوان هدف انتخاب کن.','Pick a target stream.')}</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${STREAMS.map(s=>`<button class="bt" style="width:auto;flex:1;min-width:84px;padding:9px 6px;font-size:10px" onclick="S.stream='${s.k}';sv();rd()">${s.ic} ${s.t}</button>`).join('')}</div>`}</div>`};

V.st_tech=()=>`<div class="c gl"><div class="ct">◆ ${L('تکنیک‌های مطالعه','Techniques')}</div>
  <div class="cs">${L('بر پایهٔ پژوهش — از مؤثرترین به کم‌اثرترین','Evidence-based, ranked')}</div>
  ${TECHS.map(t=>`<div class="rw"><div class="ri">${t[2]}</div>
   <div style="flex:1"><div class="rt">${t[1]}</div><div class="rd">${t[4]}</div></div>
   <div class="rx"${t[3]>=5?' style="background:#fff;color:#000"':t[3]<=1?' style="opacity:.4"':''}>${'★'.repeat(t[3])}</div></div>`).join('')}</div>

 <div class="c gl"><div class="ct">⊘ ${L('دام‌های مطالعه','Traps')}</div>
  <div class="cs">${L('چیزهایی که حس یادگیری می‌دهند بدون یادگیری','Feel productive, teach nothing')}</div>
  ${STUDY_TRAPS.map(t=>`<div class="li">${t}</div>`).join('')}</div>

 <div class="c gl"><div class="ct">◍ ${L('مرور فاصله‌دار','Spaced Repetition')}<b>${fa(srsDue(S).length)} ${L('سررسید','due')}</b></div>
  <div class="cs">${L('کارت‌های درسی با فواصل ۱، ۳، ۷، ۱۶، ۳۵، ۹۰ روز','1,3,7,16,35,90 days')}</div>
  <button class="bt p" onclick="goto('sys_mind2')">${L('رفتن به کارت‌ها','Open cards')}</button></div>

 <div class="c gl"><div class="ct">◇ ${L('تمرکز','Focus')}</div>
  ${(()=>{const f=(S.stSess||[]).slice(-10);
   if(!f.length)return `<div class="hint">${L('هنوز جلسه‌ای ثبت نشده','No sessions yet')}</div>`;
   const av=(f.reduce((a,x)=>a+x.f,0)/f.length).toFixed(1);
   return `<div style="display:flex;gap:3px;align-items:flex-end;height:38px;margin-bottom:8px">
    ${f.map(x=>`<div style="flex:1;height:${Math.max(6,Math.min(100,x.f*18))}%;background:rgba(255,255,255,.5);border-radius:2px"></div>`).join('')}</div>
    <div class="hint">${L('میانگین حواس‌پرتی','Avg')}: ${fa(av)} ${L('بار در جلسه','per session')} · ${fa(f.length)} ${L('جلسه','sessions')}${+av>4?'<br>'+L('بالاست. گوشی را از اتاق بیرون بگذار و بلوک را به ۲۵ دقیقه کوتاه کن.','High — shorten blocks.'):''}</div>`})()}</div>`;


/* ============ QUICK ACCESS ============ */
function lkHost(u){u=String(u||'');
  const pk=u.match(/package=([\w.]+)/); if(pk)return pk[1].split('.').pop();
  let s=u.replace(/^[a-z][\w+.-]*:\/\//i,'').replace(/^www\./i,'');
  s=s.split(/[\/#?]/)[0];
  return s||u.slice(0,24)}
function lkOpen(id,list){
  const L2=(S[list]||[]),i=L2.findIndex(x=>x.id===id),it=L2[i];if(!it)return;
  const d=td();S.playLog=S.playLog||{};S.playLog[d]=S.playLog[d]||{};
  it.last=Date.now(); it.hits=(it.hits||0)+1; sv();
  try{window.open(it.u,'_blank','noopener,noreferrer')}catch(e){location.href=it.u}
  rd();
}
window.lkGo=async(id,list)=>{
  const it=(S[list]||[]).find(x=>x.id===id);if(!it)return;
  const used=playToday(S,id), cap=it.cap||0;
  /* بازی: اگر تمرین یا درس امروز مانده، اول یادآوری */
  if(list==='games'){
    const g=gameMin(S), over=g>=PLAY_CAP;
    const pl=studyPlan(S), left=pl.reduce((a,x)=>a+Math.max(0,x.target-x.got),0);
    const r=await ask({t:it.ic+' '+it.n,
     s:(over?L('امروز '+fa(g)+' دقیقه بازی کرده‌ای — از سقف ۶۰ دقیقه گذشته‌ای.','Over the 60-min cap.')
        :g?L('امروز '+fa(g)+' دقیقه بازی کرده‌ای.','Played '+g+' min today.')
        :L('سقف پیشنهادی روزانه ۶۰ دقیقه است.','Suggested cap: 60 min/day.'))
       +(left>60?L(' · این هفته '+fa(Math.round(left/60))+' ساعت مطالعهٔ باقی‌مانده داری.',''):''),
     ok:L('بازی کن','Play'),
     f:[{k:'m',t:L('چند دقیقه؟','How long?'),ty:'pick',
         o:[['15','۱۵'],['30','۳۰'],['45','۴۵'],['60','۶۰']],v:'30'}]});
    if(!r)return;
    S.playPend={id,m:+r.m,t:Date.now()};
    lkOpen(id,list); tst(it.ic+' '+fa(r.m)+L(' دقیقه — وقت تمام شد ثبت کن',' min'));
    return;
  }
  if(cap&&used>=cap){
    if(!await askYes(L('سقف '+it.n+' پر شده','Cap reached'),
      L('امروز '+fa(used)+' دقیقه استفاده کرده‌ای. سقف تو '+fa(cap)+' دقیقه است.','Used '+used+' of '+cap+' min.'),
      L('بازکن','Open anyway')))return;
  }
  lkOpen(id,list);
};
window.lkAdd=async list=>{
  const isG=list==='games';
  const r=await ask({t:isG?L('افزودن بازی','Add game'):L('افزودن میان‌بر','Add shortcut'),
   s:L('نشانی سایت یا لینک اپ. مثال: https://example.com','Website or app link.'),
   f:[{k:'n',t:L('نام','Name'),ty:'text',ph:''},
      {k:'u',t:L('نشانی','Link'),ty:'text',ph:'https://'},
      {k:'ic',t:L('نشان','Icon'),ty:'chips',o:isG?['⚽','◍','▣','◆','♞','◈','▤','✦']:['◈','◉','◆','◇','▦','▤','✉','☎','♪','✦'],v:isG?'⚽':'◈'},
      ...(isG?[]:[{k:'c',t:L('دسته','Category'),ty:'pick',o:LCAT.filter(x=>x[0]!=='game').map(x=>[x[0],x[1]+' '+L(x[2],x[3])]),v:'work'}]),
      {k:'cap',t:L('سقف روزانه','Daily cap'),hint:L('۰ یعنی بدون سقف','0 = none'),ty:'num',v:isG?45:0,st:5,min:0,max:300,u:L('دقیقه','min')}]});
  if(!r||!r.n||!r.u)return;
  let u=r.u.trim();
  if(!/^[a-z]+:/i.test(u))u='https://'+u;
  S[list]=S[list]||[];
  S[list].push({id:'u'+Date.now(),n:r.n,ic:r.ic||(isG?'⚽':'◈'),u,c:isG?'game':(r.c||'other'),cap:r.cap||0});
  sv();rd();tst('✓')};
window.lkEd=async(id,list)=>{
  const L2=S[list]||[],i=L2.findIndex(x=>x.id===id),it=L2[i];if(!it)return;
  const r=await ask({t:it.n,s:lkHost(it.u),del:L('حذف','Delete'),
   f:[{k:'n',t:L('نام','Name'),ty:'text',v:it.n},
      {k:'u',t:L('نشانی','Link'),ty:'text',v:it.u},
      {k:'cap',t:L('سقف روزانه','Daily cap'),hint:L('۰ یعنی بدون سقف','0 = none'),ty:'num',v:it.cap||0,st:5,min:0,max:300,u:L('دقیقه','min')}]});
  if(!r)return;
  if(r.__del){L2.splice(i,1);sv();rd();return tst(L('حذف شد','Deleted'))}
  it.n=r.n||it.n; it.u=r.u||it.u; it.cap=r.cap||0; sv();rd();tst('✓')};
/* ثبت زمان بازی بعد از برگشت */
window.playLog=async id=>{
  const it=(S.games||[]).find(x=>x.id===id);if(!it)return;
  const p=S.playPend&&S.playPend.id===id?Math.round((Date.now()-S.playPend.t)/60000):30;
  const r=await ask({t:L('چقدر بازی کردی؟','How long?'),s:it.n,
   f:[{k:'m',ty:'num',v:Math.min(180,Math.max(5,p)),st:5,min:0,max:300,u:L('دقیقه','min')}]});
  if(!r)return;
  const d=td();S.playLog=S.playLog||{};S.playLog[d]=S.playLog[d]||{};
  S.playLog[d][id]=(S.playLog[d][id]||0)+(r.m||0);
  S.playPend=null;sv();rd();
  const g=gameMin(S);
  tst(g>PLAY_CAP?L('از سقف گذشتی — '+fa(g)+' دقیقه','Over cap'):'✓ '+fa(g)+L(' دقیقه امروز',' min today'))};

V.qa=()=>{
  const ls=S.links||[];
  const by=LCAT.filter(c=>c[0]!=='game').map(c=>[c,ls.filter(x=>x.c===c[0])]).filter(x=>x[1].length);
  const recent=ls.filter(x=>x.last).sort((a,b)=>b.last-a.last).slice(0,4);
  return `<div class="c gl"><div class="ct">◈ ${L('دسترسی سریع','Quick Access')}<b>${fa(ls.length)}</b></div>
   <div class="cs">${L('میان‌برهای خودت. با یک ضربه باز می‌شوند — بدون جست‌وجو، بدون پرسه زدن در گوشی.','Your shortcuts — one tap, no wandering.')}</div>
   ${recent.length?`<div class="hint" style="margin-bottom:7px">${L('اخیر','Recent')}</div>
    <div class="qg">${recent.map(x=>qaTile(x,'links')).join('')}</div>
    <div style="height:9px"></div>`:''}
   ${by.map(([c,items])=>`<div class="hint" style="margin-bottom:7px">${c[1]} ${L(c[2],c[3])}</div>
    <div class="qg">${items.map(x=>qaTile(x,'links')).join('')}</div><div style="height:9px"></div>`).join('')}
   ${ls.length?'':`<div class="hint">${L('هنوز میان‌بری نداری.','No shortcuts yet.')}</div>`}
   <button class="bt p" onclick="lkAdd('links')">${L('افزودن میان‌بر','Add shortcut')}</button>
   <div class="hint">${L('نگه‌داشتن روی هر کاشی: ویرایش یا حذف. سقف روزانه فقط یادآوری است، نه قفل.','Long-press to edit. Caps are reminders, not locks.')}</div></div>

  ${(()=>{const capped=ls.filter(x=>x.cap);if(!capped.length)return '';
   return `<div class="c gl"><div class="ct">◷ ${L('مصرف امروز','Usage today')}</div>
    ${capped.map(x=>{const u=playToday(S,x.id),pc=Math.min(100,u/x.cap*100);
     return `<div class="rw"><div class="ri">${x.ic}</div>
      <div style="flex:1"><div class="rt">${esc(x.n)}</div>
       <div class="bar" style="margin-top:5px"><div class="bf" style="width:${pc}%"></div></div></div>
      <div class="rx"${u>=x.cap?' style="background:#fff;color:#000"':''}>${fa(u)}/${fa(x.cap)}</div></div>`}).join('')}
    <div class="hint">${L('زمان را خودت بعد از استفاده ثبت می‌کنی. در نسخهٔ اندروید خودکار می‌شود.','Manual now; automatic in the Android build.')}</div></div>`})()}`};

function qaTile(x,list){
  const u=playToday(S,x.id),over=x.cap&&u>=x.cap;
  return `<button class="qt${over?' ov':''}" onclick="lkGo('${x.id}','${list}')"
   oncontextmenu="event.preventDefault();lkEd('${x.id}','${list}')">
   <div class="qi">${x.ic}</div><div class="qn">${esc(x.n)}</div>
   <div class="qh">${x.cap?fa(u)+'/'+fa(x.cap)+L('د','m'):lkHost(x.u)}</div></button>`}

V.play=()=>{
  const gs=S.games||[], g=gameMin(S), pc=Math.min(100,g/PLAY_CAP*100);
  const pend=S.playPend&&gs.find(x=>x.id===S.playPend.id);
  const wk=(()=>{let t=0;for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);
    const k=dstr(d),o=(S.playLog||{})[k]||{};
    gs.forEach(x=>t+=(o[x.id]||0))}return t})();
  return `${pend?`<div class="c gl crisis"><div class="ct">◷ ${L('بازی ثبت‌نشده','Unlogged session')}</div>
   <div class="cs">${pend.n} — ${L('چقدر طول کشید؟','How long?')}</div>
   <button class="bt p" onclick="playLog('${pend.id}')">${L('ثبت زمان','Log time')}</button></div>`:''}

  <div class="c gl"><div class="ct">◍ ${L('سرگرمی','Play')}<b>${fa(g)}/${fa(PLAY_CAP)} ${L('دقیقه','min')}</b></div>
   <div class="cs">${L('بازی بخشی از زندگی است، نه دشمن آن. فقط باید بعد از کار بیاید، نه به‌جای آن.','Play is fine — after the work, not instead of it.')}</div>
   <div class="bar" style="height:5px;margin-bottom:${g>PLAY_CAP?'7px':'11px'}"><div class="bf" style="width:${pc}%"></div></div>
   ${g>PLAY_CAP?`<div class="hint" style="color:var(--ink);margin-bottom:9px">${L('امروز از سقف ۶۰ دقیقه گذشته‌ای — '+fa(g)+' دقیقه. تصمیم با خودت است، اما داده این است.','Over the 60-min cap today.')}</div>`:''}
   <div class="qg">${gs.map(x=>qaTile(x,'games')).join('')}</div>
   ${gs.length?'':`<div class="hint">${L('هنوز بازی‌ای اضافه نکرده‌ای.','No games yet.')}</div>`}
   <button class="bt p" style="margin-top:9px" onclick="lkAdd('games')">${L('افزودن بازی','Add game')}</button>
   ${gs.map(x=>`<button class="bt" style="margin-top:6px" onclick="playLog('${x.id}')">${x.ic} ${L('ثبت زمان','Log time')} — ${x.n}</button>`).join('')}</div>

  <div class="c gl"><div class="ct">◷ ${L('این هفته','This week')}<b>${fa(Math.round(wk/60*10)/10)} ${L('ساعت','h')}</b></div>
   ${(()=>{const rows=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);
     const k=dstr(d),o=(S.playLog||{})[k]||{};
     let t=0;gs.forEach(x=>t+=(o[x.id]||0));rows.push([dayInfo(d).dowName,t])}
    const mx=Math.max(PLAY_CAP,...rows.map(r=>r[1]));
    return `<div style="display:flex;gap:4px;align-items:flex-end;height:54px;margin-bottom:8px">
     ${rows.map(r=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
      <div style="height:${Math.max(3,r[1]/mx*100)}%;background:${r[1]>PLAY_CAP?'#fff':'rgba(255,255,255,.4)'};border-radius:3px"></div></div>`).join('')}</div>
     <div style="display:flex;gap:4px">${rows.map(r=>`<div style="flex:1;text-align:center;font-size:8px;color:var(--dim2)">${r[0].slice(0,1)}</div>`).join('')}</div>`})()}
   <div class="hint">${wk/60>10?L('بیش از ۱۰ ساعت در هفته. این زمان، معادل کل مطالعهٔ ریاضی و علوم توست.','Over 10 h/week.'):L('در محدودهٔ معقول.','Reasonable range.')}</div></div>

  <div class="c gl"><div class="ct">◆ ${L('قاعده','The rule')}</div>
   ${[[L('بعد از تکالیف و تمرین، نه قبل از آن','After homework and training, not before'),''],
      [L('نه در یک ساعت پیش از خواب — بازی رقابتی، خواب را به تعویق می‌اندازد','Not within an hour of sleep'),''],
      [L('اگر بعد از باخت عصبانی شدی، همان‌جا ببند','If a loss makes you angry, stop there'),''],
      [L('ایفوتبال جای تمرین واقعی را نمی‌گیرد — یکشنبه، سه‌شنبه، پنجشنبه سر زمین باش','Not a substitute for real training'),'']]
    .map(x=>`<div class="li">${x[0]}</div>`).join('')}</div>`};

/* ============ SECTION ROUTER — split long tabs into index + focused pages ============ */
/* یک ویو را به کارت‌های سطح‌اول می‌شکند، بدون آنکه ویوها بازنویسی شوند */
function splitCards(html){
  const out=[]; let i=0, n=html.length;
  while(i<n){
    const s=html.indexOf('<div class="c ',i);
    if(s<0){const rest=html.slice(i); if(rest)out.push({pre:rest,ws:!rest.trim()}); break}
    const pre=html.slice(i,s); if(pre)out.push({pre,ws:!pre.trim()});
    /* عمق‌شماری تگ‌های div تا بسته شدن کارت */
    let d=0,j=s;
    while(j<n){
      const o=html.indexOf('<div',j), c=html.indexOf('</div>',j);
      if(c<0)break;
      if(o>=0&&o<c){d++;j=o+4} else {d--;j=c+6; if(d===0)break}
    }
    out.push({card:html.slice(s,j)}); i=j;
  }
  return out;
}
/* عنوان، نشان و مقدار کنار عنوان را از کارت بیرون می‌کشد */
/* متن ساده از HTML: تگ‌ها به فاصله تبدیل می‌شوند تا کلمات به هم نچسبند */
function deTag(h){return String(h||'')
  .replace(/<br\s*\/?>/gi,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/&nbsp;/g,' ')
  .replace(/\s*\u200c\s*/g,'\u200c')
  .replace(/\s+/g,' ')
  .replace(/\s+([.،؛:!؟%٪])/g,'$1')
  .trim()}
function cardMeta(c){
  const m=c.match(/<div class="ct"[^>]*>([\s\S]*?)<\/div>/);
  let ic='◦', t='', b='';
  if(m){
    let raw=m[1];
    const bm=raw.match(/<b>([\s\S]*?)<\/b>/);
    if(bm){b=deTag(bm[1]); raw=raw.replace(bm[0],' ')}
    raw=deTag(raw);
    const im=raw.match(/^([^\w\u0600-\u06FF\s]+)\s*/);
    if(im){ic=im[1].trim();raw=raw.slice(im[0].length)}
    t=raw.trim();
  }
  const sm=c.match(/<div class="cs"[^>]*>([\s\S]*?)<\/div>/);
  let s=sm?deTag(sm[1]):'';
  /* کارت بدون عنوان: از اولین متن معنادار عنوان بساز */
  if(!t){
    const hm2=c.match(/<div class="(?:hint|big|rt)"[^>]*>([\s\S]*?)<\/div>/);
    const bm2=c.match(/<button[^>]*>([\s\S]*?)<\/button>/);
    let cand=(hm2?hm2[1]:'')||(bm2?bm2[1]:'')||s;
    cand=deTag(cand);
    t=cand.length>42?cand.slice(0,42).replace(/\s+\S*$/,'')+'…':cand;
    if(s===cand)s='';
  }
  if(!t)t=L('بخش','Section');
  return {ic,t,b,s};
}
/* آیا این ویو باید فهرست شود؟ */
const SPLIT_MIN=3;
function renderView(v){
  const html=V[v]?V[v]():'';
  const parts=splitCards(html);
  const cards=parts.filter(p=>p.card);
  if(cards.length<SPLIT_MIN||S.flat) return html;
  const key=v, sec=S.sec&&S.sec.v===key?S.sec.i:null;
  /* صفحهٔ متمرکز */
  if(sec!==null&&cards[sec]){
    const m=cardMeta(cards[sec].card);
    return `<div class="pgh"><button class="pgb" onclick="secBack()">‹</button>
      <div class="pgt"><div class="pgi">${m.ic}</div><div><div class="pgn">${m.t}</div>
      ${m.b?`<div class="pgs">${m.b}</div>`:''}</div></div></div>
      ${cards[sec].card}
      ${cards.length>1?`<div class="pgnav">
        ${sec>0?`<button class="bt" onclick="secGo(${sec-1})">‹ ${cardMeta(cards[sec-1].card).t}</button>`:''}
        ${sec<cards.length-1?`<button class="bt" onclick="secGo(${sec+1})">${cardMeta(cards[sec+1].card).t} ›</button>`:''}
      </div>`:''}`;
  }
  /* فهرست */
  const lead=parts.filter(p=>p.pre&&!p.ws).map(p=>p.pre).join('');
  return lead+`<div class="idx">${cards.map((c,i)=>{
    const m=cardMeta(c.card);
    return `<button class="ix" onclick="secGo(${i})">
      <div class="ixi">${m.ic}</div>
      <div class="ixm"><div class="ixt">${m.t}</div>${m.s?`<div class="ixs">${m.s}</div>`:''}</div>
      ${m.b?`<div class="ixb">${m.b}</div>`:''}
      <div class="ixc">›</div></button>`}).join('')}</div>`;
}
window.secGo=i=>{S.sec={v:curSub(),i};sv();rd();
  const s=document.getElementById('vw');if(s)s.scrollTop=0;window.scrollTo(0,0)};
window.secBack=()=>{S.sec=null;sv();rd();window.scrollTo(0,0)};
/* ---- دکمهٔ بازگشت سخت‌افزاری اندروید ---- */
window.goBackApp=()=>{
  const g=document.getElementById('gdb');
  if(g&&g.classList.contains('op')){gdc();return true}        /* شیت راهنما */
  const a=document.getElementById('ask');
  if(a&&a.innerHTML.trim()){a.innerHTML='';return true}        /* دیالوگ ask */
  if(S.sec){secBack();return true}                             /* زیرصفحه */
  return false;                                                /* خروج از اپ */
};

/* ============ SKILL TREE VIEW ============ */
function treeSVG(bk){
  const ns=NODES.filter(n=>n.b===bk);
  const tiers={};ns.forEach(n=>{(tiers[n.tier]=tiers[n.tier]||[]).push(n)});
  const tks=Object.keys(tiers).map(Number).sort((a,b)=>a-b);
  const W=286, ROW=64, PAD=30;
  const H=PAD*2+(tks.length-1)*ROW;
  const pos={};
  tks.forEach((tk,ti)=>{const row=tiers[tk], y=PAD+ti*ROW;
    row.forEach((n,i)=>{pos[n.id]={x:W/2+(i-(row.length-1)/2)*Math.min(96,W/(row.length+.3)), y}})});
  let g='';
  /* خطوط پیش‌نیاز */
  ns.forEach(n=>n.pre.forEach(p=>{const a=pos[p],b=pos[n.id];if(!a||!b)return;
    const un=(S.tree||[]).includes(n.id), open=(S.tree||[]).includes(p);
    const my=(a.y+b.y)/2;
    g+=`<path d="M${a.x} ${a.y+13} C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y-13}"
      fill="none" stroke="#fff" stroke-opacity="${un?.75:open?.3:.11}"
      stroke-width="${un?1.6:1}" ${un?'':'stroke-dasharray="2.5 3"'}/>`}));
  /* گره‌ها */
  ns.forEach(n=>{const p=pos[n.id],st=nodeState(S,n);
    const R=13;
    const fill=st.un?'#fff':st.can?'rgba(255,255,255,.2)':'rgba(255,255,255,.055)';
    const stroke=st.un?'#fff':st.can?'rgba(255,255,255,.85)':st.pre?'rgba(255,255,255,.3)':'rgba(255,255,255,.14)';
    g+=`<g style="cursor:pointer" onclick="tnode('${n.id}')">`;
    if(st.can)g+=`<circle cx="${p.x}" cy="${p.y}" r="${R+5}" fill="#fff" opacity=".1"/>`;
    /* حلقهٔ پیشرفت */
    if(!st.un&&st.pc>0){const C=2*Math.PI*(R+3.5);
      g+=`<circle cx="${p.x}" cy="${p.y}" r="${R+3.5}" fill="none" stroke="#fff" stroke-opacity=".5"
        stroke-width="1.6" stroke-dasharray="${C*st.pc/100} ${C}" stroke-linecap="round"
        transform="rotate(-90 ${p.x} ${p.y})"/>`}
    g+=`<circle cx="${p.x}" cy="${p.y}" r="${R}" fill="${fill}" stroke="${stroke}" stroke-width="${st.un?0:1}"/>`;
    g+=`<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central"
      font-size="${st.un?12:10}" font-family="Vazirmatn" fill="${st.un?'#000':'#f4f4f5'}"
      opacity="${st.pre?1:.45}">${st.un?'✓':st.pre?(st.met?'◆':fa(st.pc)):'⬤'}</text>`;
    g+=`<text x="${p.x}" y="${p.y+R+9}" text-anchor="middle" font-size="7" font-family="Vazirmatn"
      fill="${st.un?'#f4f4f5':'#8a8a93'}">${n.t}</text>`;
    if(!st.un)g+=`<text x="${p.x+R-1}" y="${p.y-R+2}" text-anchor="middle" font-size="6.5"
      font-family="Vazirmatn" fill="#8a8a93">${fa(n.cost)}</text>`;
    g+='</g>';
  });
  return `<svg width="100%" viewBox="0 0 ${W} ${H}" style="display:block">${g}</svg>`;
}
V.tree=()=>{
  const sp=skillPoints(S), rk=treeRank(S), un=(S.tree||[]).length;
  const bk=S.tbr||'body', B=BMAP[bk];
  const bp=branchProgress(S,bk), nx=nextNodes(S);
  return `<div class="c gl" style="text-align:center">
   <div class="ct" style="justify-content:center">◇ ${L('درخت مهارت','Skill Tree')}<b>${fa(un)}/${fa(NODES.length)}</b></div>
   <div class="big" style="font-size:26px;margin:4px 0">${L(rk[0],rk[1])}</div>
   <div class="tpts"><div class="tpn">${fa(sp.free)}</div>
    <div class="tpl">${L('امتیاز آزاد','free points')}</div></div>
   <div class="cs" style="text-align:center">${L('هر ۲ سطح، یک امتیاز مهارت. گره‌ها با دادهٔ واقعی تو باز می‌شوند، نه با کلیک.','Nodes unlock from real data.')}</div>
   <div class="bar" style="height:5px;margin-top:9px"><div class="bf" style="width:${un/NODES.length*100}%"></div></div></div>

  <div class="c gl">
   <div class="tbr">${BRANCH.map(b=>{const p=branchProgress(S,b[0]);
     return `<button class="tbb ${b[0]===bk?'on':''}" onclick="S.tbr='${b[0]}';sv();rd()">
      <div class="tbi">${b[1]}</div><div class="tbn">${L(b[2],b[3])}</div>
      <div class="tbp">${fa(p.un)}/${fa(p.total)}</div></button>`}).join('')}</div>
   <div class="ct" style="margin-top:11px">${B[1]} ${L(B[2],B[3])}<b>${fa(bp.pc)}٪</b></div>
   <div class="cs">${B[4]}</div>
   ${treeSVG(bk)}
   <div class="tlg">
    <span><i class="tdo u"></i>${L('باز','unlocked')}</span>
    <span><i class="tdo c"></i>${L('آمادهٔ باز شدن','ready')}</span>
    <span><i class="tdo p"></i>${L('در حال پیشرفت','in progress')}</span>
    <span><i class="tdo l"></i>${L('قفل','locked')}</span></div>
   <div class="hint">${L('عدد کوچک بالای هر گره، هزینهٔ امتیاز آن است. روی گره بزن.','Small number = point cost.')}</div></div>

  ${nx.length?`<div class="c gl"><div class="ct">◷ ${L('نزدیک‌ترین اهداف','Closest Goals')}</div>
   ${nx.map(({n,st})=>`<div class="rw" onclick="tnode('${n.id}')">
    <div class="ri">${BMAP[n.b][1]}</div>
    <div style="flex:1"><div class="rt">${n.t} <span style="font-size:9px;color:var(--dim2)">· ${n.d}</span></div>
     <div class="bar" style="margin-top:5px"><div class="bf" style="width:${st.pc}%"></div></div>
     <div class="rd" style="margin-top:3px">${fa(Math.round(st.r.have*10)/10)} / ${fa(st.r.need)} ${st.r.u}</div></div>
    <div class="rx"${st.can?' style="background:#fff;color:#000"':''}>${st.can?L('باز کن','unlock'):fa(st.pc)+'٪'}</div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">◆ ${L('مزایای باز شده','Unlocked Perks')}<b>${fa(un)}</b></div>
   ${un?NODES.filter(n=>(S.tree||[]).includes(n.id)).map(n=>`<div class="rw">
     <div class="ri">${BMAP[n.b][1]}</div><div><div class="rt">${n.t}</div>
     <div class="rd">${n.perk}</div></div></div>`).join('')
   :`<div class="hint">${L('هنوز گره‌ای باز نشده. از تیر اول هر شاخه شروع کن.','Start with tier-0 nodes.')}</div>`}</div>`};

window.tnode=async id=>{
  const n=NMAP[id];if(!n)return;
  const st=nodeState(S,n), sp=skillPoints(S);
  const preTxt=n.pre.length?n.pre.map(p=>(NMAP[p]||{t:p}).t+((S.tree||[]).includes(p)?' ✓':' ✗')).join(' · '):L('ندارد','none');
  const lines=[
    [L('شاخه','Branch'), BMAP[n.b][1]+' '+L(BMAP[n.b][2],BMAP[n.b][3])],
    [L('شرط','Requirement'), n.d],
    [L('پیشرفت','Progress'), fa(Math.round(st.r.have*10)/10)+' / '+fa(st.r.need)+' '+st.r.u+' ('+fa(st.pc)+'٪)'],
    [L('پیش‌نیاز','Prerequisite'), preTxt],
    [L('هزینه','Cost'), fa(n.cost)+' '+L('امتیاز','pt')+' · '+L('آزاد','free')+': '+fa(sp.free)],
    [L('مزیت','Perk'), n.perk]
  ];
  if(st.un){
    await ask({t:'✓ '+n.t, s:n.perk, ok:L('بستن','Close'),
      f:[{k:'i',ty:'info',rows:lines}]});
    return;
  }
  const why = !st.pre?L('اول پیش‌نیازها را باز کن.','Unlock prerequisites first.')
    : !st.met?L('هنوز به شرط داده‌ای نرسیده‌ای. این عدد از فعالیت واقعی تو می‌آید.','Requirement not met yet.')
    : !st.afford?L('امتیاز کافی نداری. با بالا رفتن سطح، امتیاز می‌گیری.','Not enough points.')
    : L('آمادهٔ باز شدن است.','Ready to unlock.');
  const r=await ask({t:n.t, s:why, ok:st.can?L('باز کن','Unlock'):L('بستن','Close'),
    f:[{k:'i',ty:'info',rows:lines}]});
  if(r&&st.can){
    S.tree=S.tree||[];S.tree.push(n.id);xp(60);sv();rd();
    tst('✓ '+n.t+' — '+L('باز شد','unlocked')+' +'+fa(60)+' XP');
  }
};

/* ============ NAV: 5 groups ============ */
const GRP=[
 ['now','◷','امروز','Today',[['day','تایم‌لاین','Timeline'],['q','کوئست','Quests'],
   ['slfix','خواب','Sleep'],['sys_readiness','آمادگی','Readiness'],['cr','بحران','Crisis']]],
 ['body','⚽','بدن','Body',[['fb','کارت','Card'],['batch','سنجش','Measure'],['coach','بازخورد','Feedback'],['dec','تصمیم','Decision'],['lineup','لاین‌آپ','Lineup'],['team','تیم','Team'],['prep','مسابقه','Match'],['fb_skill','مهارت','Skills'],
   ['fb_iq','هوش بازی','Game IQ'],['gy','تمرین','Training'],['sys_foot2','فوتبال','Football'],
   ['nu','تغذیه','Food'],['lg','پیشرفت','Progress']]],
 ['edu','▦','درس','Study',[['st_plan','برنامه','Plan'],['st_grade','نمرات','Grades'],
   ['st_stream','رشته','Stream'],['st_tech','تکنیک','Method']]],
 ['self','◈','خود','Self',[['wd','استایل','Style'],['sys_look2','ظاهر','Looks'],
   ['sys_mind2','ذهن','Mind'],['pr','پروتکل','Protocols'],['sys_psy','روان','Psych']]],
 ['mast','★','تسلط','Mastery',[['learn','یادگیری','Learn'],['learn_t','رشته','Track'],['mini','ریزمهارت','Micro'],['mx','مسیر','Path'],['mx_mind','ذهن','Mind'],
   ['mx_body','بدن','Body'],['mx_look','ظاهر','Look'],
   ['inf','سپر','Shield'],['inf_def','تاکتیک','Tactics'],['inf_nego','مذاکره','Nego'],
   ['mt','منتالیست','Mentalist'],['mt_learn','ستون‌ها','Pillars']]],
 ['sysm','◆','سیستم',"System",[['ai','هوشمند','Smart'],['iq','بینش','Insight'],['sys_health','سلامت','Health'],
   ['sys_cal','تقویم','Calendar'],['ad','تطبیق','Adapt'],['st','آمار','Stats'],['tree','درخت','Tree'],['ac','دستاورد','Awards']]],
 ['more','◎','من','Me',[['pf','پروفایل','Profile'],['calc','ابزار','Tools'],['honest','صداقت','Honesty'],['buy','تدارکات','Gear'],['qa','میان‌بر','Quick'],['play','سرگرمی','Play'],['sh','سپر','Shield'],
   ['mn','مالی','Money'],['so','حلقه','Circle'],['nt','نیتیو','Native'],['me','تنظیمات','Settings']]]
];
let grp='now';
function curSub(){
  const want=S.sub[grp]||GRP.find(g=>g[0]===grp)[4][0][0];
  /* اگر ویو ذخیره‌شده هنوز قفل است، به اولین ویوی باز برگرد */
  if(typeof viewOpen==='function'&&!viewOpen(S,want)){
    const open=GRP.find(g=>g[0]===grp)[4].find(v=>viewOpen(S,v[0]));
    return open?open[0]:want;
  }
  return want;
}
window.go=g=>{grp=g;S.sec=null;sv();rd();document.getElementById('vw').scrollTop=0;window.scrollTo(0,0)};
window.goSub=async(g,t)=>{
  /* بخش خصوصی: قبل از نمایش، تأیید هویت */
  if(window.lockGuard&&!(await window.lockGuard(t))){
    tst(L('تأیید نشد','Not verified'));return}
  _goSub(g,t)};
window._goSub=(g,t)=>{grp=g;S.sub[g]=t;S.sec=null;sv();rd();document.getElementById('vw').scrollTop=0;window.scrollTo(0,0)};
window.goto=t=>{const g=GRP.find(x=>x[4].some(s=>s[0]===t));if(g)goSub(g[0],t)};

/* --- adaptive home: پیشنهاد محتوا بر اساس ساعت --- */
function homeHint(){
  const m=mn();
  if(m<7*60)  return ['day', L('صبح — روتین بیدارباش','Morning')];
  if(m<13*60) return ['day', L('بلوک ذهنی','Deep work')];
  if(m<18*60) return ['gy',  L('زمان تمرین','Training time')];
  if(m<20*60) return ['nu',  L('تغذیه و ریکاوری','Nutrition')];
  return ['lg', L('شب — ژورنال و بستن روز','Evening journal')];
}

function rd(){
  fzPaint();
  const G=GRP.find(x=>x[0]===grp), t=curSub();
  /* حالت‌های نمایش به‌صورت کلاس روی body — CSS بقیه را می‌چیند */
  document.body.classList.toggle('amoled',!!S.amoled);
  document.body.classList.toggle('compact',!!S.compact);
  document.documentElement.style.fontSize=(13+(S.fsz||0))+'px';
  document.getElementById('nv').innerHTML=GRP.map(x=>
   `<button class="nb ${x[0]===grp?'on':''}" onclick="go('${x[0]}')"><span>${x[1]}</span>${L(x[2],x[3])}</button>`).join('');
  let head='';
  if(G[4].length>1) head=`<div class="sub">${G[4].map(s=>{
    const _lk=(typeof viewOpen==='function')&&!viewOpen(S,s[0]);
    return `<button class="sb ${s[0]===t?'on':''}" style="${_lk?'opacity:.3':''}"
      onclick="${_lk?`lockMsg('${s[0]}')`:`goSub('${grp}','${s[0]}')`}">${_lk?'◌ ':''}${L(s[1],s[2])}</button>`}).join('')}</div>`;
  /* دستور روز فقط در تب امروز/تایم‌لاین */
  let dir='';
  if(grp==='now'&&t==='day'){
    const D=directive(S), hh=homeHint();
    dir=`<div class="dir"><div class="dl">${L('دستور امروز','DIRECTIVE')}</div>
     <div class="dt">${D[1]}</div><div class="dd">${D[2]}</div></div>
     ${hh[0]!=='day'?`<button class="bt" style="margin-bottom:11px" onclick="goto('${hh[0]}')">◷ ${hh[1]} →</button>`:''}`;
  }
  /* آخرین بازدیدها — با ۵۵ ویو، برگشت سریع لازم است */
  if(typeof trackView==='function')trackView(t);
  let rct='';
  if((S.recent||[]).length>2){
    rct=`<div class="rct">${S.recent.slice(1,6).map(id=>{
      let nm='',gid='';
      GRP.forEach(g=>g[4].forEach(v=>{if(v[0]===id){nm=L(v[1],v[2]);gid=g[0]}}));
      if(!nm||!viewOpen(S,id))return '';
      return `<button onclick="goSub('${gid}','${id}')">${nm}</button>`;
    }).join('')}</div>`;
  }
  document.getElementById('vw').innerHTML=head+rct+(S.sec&&S.sec.v===t?'':dir)+renderView(t);
  hd();
  if(typeof bumpNumbers==='function')setTimeout(bumpNumbers,0);
}

/* ============ INDEPENDENCE: install, offline, autosave, recovery ============ */
(()=>{
 /* inline manifest so the app installs to home screen with no external file */
 try{
  const ic=s=>"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="#000"/><text x="${s/2}" y="${s*.68}" font-size="${s*.54}" text-anchor="middle" fill="#fff">◈</text></svg>`);
  const mf={name:"ASCEND",short_name:"ASCEND",start_url:".",scope:".",display:"standalone",
   orientation:"portrait",background_color:"#000000",theme_color:"#000000",lang:"fa",dir:"rtl",
   icons:[192,512].map(s=>({src:ic(s),sizes:s+"x"+s,type:"image/svg+xml",purpose:"any maskable"}))};
  const l=document.createElement('link');l.rel='manifest';
  l.href=URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'}));
  document.head.appendChild(l);
 }catch(e){}
 /* service worker: cache this very document so it opens with zero network, forever */
 try{
  if('serviceWorker' in navigator && location.protocol!=='file:'){
   const sw=`self.addEventListener('install',e=>self.skipWaiting());
    self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
    self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
     e.respondWith(caches.open('ascend').then(c=>c.match(e.request).then(r=>r||
      fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}).catch(()=>r))))});`;
   navigator.serviceWorker.register(URL.createObjectURL(new Blob([sw],{type:'text/javascript'})))
    .then(()=>caches.open('ascend').then(c=>c.add(location.pathname))).catch(()=>{});
  }
 }catch(e){}
 /* never lose data: save on hide, and keep a rolling backup slot */
 const bk=()=>{try{localStorage.setItem(K+'.bk',JSON.stringify({t:Date.now(),d:S}))}catch(e){}};
 document.addEventListener('visibilitychange',()=>{
   /* انیمیشن پس‌زمینه در حالت مخفی متوقف شود — باتری */
   document.body.classList.toggle('bgpause',document.hidden);
   if(document.hidden){sv();bk();fzPaint()}else{fzTick();rd()}
 });
 window.addEventListener('pagehide',()=>{sv();bk()});
 setInterval(bk,120000);
 /* resume a running focus timer after the app was closed */
 if(S.tmr){ if(Date.now()>S.tmr.end+3600000){S.tmr=null;sv()} else fzTick() }
 /* install prompt */
 let _ip=null;
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();_ip=e;
  const b=document.getElementById('instb');if(b)b.style.display='block'});
 window.inst=async()=>{ if(_ip){_ip.prompt();_ip=null;document.getElementById('instb').style.display='none'}
  else tst(L('از منوی مرورگر: افزودن به صفحهٔ اصلی','Use browser menu: Add to Home Screen'))};
 /* keyboard: Enter confirms dialog, Esc cancels */
 document.addEventListener('keydown',e=>{ if(!document.getElementById('askw').classList.contains('on'))return;
  if(e.key==='Escape'){e.preventDefault();askX(0)}
  if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();askX(1)} });
 /* back button closes dialog instead of leaving the app */
 history.replaceState({a:1},'');
 window.addEventListener('popstate',()=>{history.pushState({a:1},'');
  if(document.getElementById('askw').classList.contains('on'))askX(0);
  else if(S.sec)secBack();
  else if(grp!=='now')go('now')});
 history.pushState({a:1},'');
})();

/* ---- انیمیشن اعداد: وقتی عددی عوض شد، یک تپش کوتاه ----
   به‌جای اینکه هر نقطهٔ تغییر را دستی صدا بزنیم، مقدار قبلی را
   نگه می‌داریم و بعد از هر رندر مقایسه می‌کنیم. */
const _numPrev=new Map();
function bumpNumbers(){
  try{
    document.querySelectorAll('.skn,.sv').forEach((el,i)=>{
      const key=(el.className||'')+'#'+i, val=el.textContent;
      const old=_numPrev.get(key);
      if(old!==undefined&&old!==val){
        el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');
      }
      _numPrev.set(key,val);
    });
  }catch(e){}
}

/* دکمهٔ ورودی سریع */
{const _qb=document.createElement('button');
 _qb.id='qb'; _qb.innerHTML='+'; _qb.setAttribute('aria-label','ثبت سریع');
 _qb.onclick=()=>window.qsOpen();
 document.body.appendChild(_qb);}

/* کشیدن: شنودگر سراسری تا هر ردیف جدید هم کار کند */
document.addEventListener('pointermove',e=>window.swMove(e),{passive:false});
document.addEventListener('pointerup',e=>window.swEnd(e));
document.addEventListener('pointercancel',e=>window.swEnd(e));

rd();
/* اولین رندر تمام شد — صفحهٔ راه‌انداز کنار برود */
{const _sp=document.getElementById('splash'); if(_sp)setTimeout(()=>_sp.classList.add('gone'),60);}
setInterval(()=>curSub()==='day'?rd():hd(),30000);
/* یادآورها: یک بار سر بارگذاری، و هر بار که روز عوض شد دوباره چیده شود */
(()=>{ if(!window.isNative||!window.isNative())return;
  drainPending();
  if(window.syncWidget)window.syncWidget();   /* ویجت‌ها مستقل از اعلان */
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)drainPending()});
  syncNotif();
  let last=td();
  setInterval(()=>{const now=td(); if(now!==last){last=now; syncNotif()}}, 60000);
})();
