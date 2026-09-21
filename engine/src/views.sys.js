/* ============ NEW SYSTEMS ============ */

V.sys_readiness=()=>{
  const r=readiness(S),d=td();
  const C=2*Math.PI*38;
  return `<div class="c gl" style="text-align:center"><div class="ct" style="justify-content:center">◉ ${L('شاخص آمادگی','Readiness')}</div>
   <div class="gauge"><svg width="92" height="92">
    <circle cx="46" cy="46" r="38" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="5"/>
    <circle cx="46" cy="46" r="38" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"
     stroke-dasharray="${C}" stroke-dashoffset="${C*(1-r.sc/100)}"/></svg><b>${fa(r.sc)}</b></div>
   <div class="ct" style="justify-content:center;margin-top:9px">${r.lbl}</div>
   <div class="cs" style="text-align:center">${r.msg}</div>
   <div class="gr" style="grid-template-columns:repeat(2,1fr);margin-top:9px">
    <div class="sk"><div class="skn">${fa(r.sl)}</div><div class="skl">${L('ساعت خواب','sleep')}</div></div>
    <div class="sk"><div class="skn">${fa(r.mood)}/۵</div><div class="skl">${L('حال','mood')}</div></div></div>
   <button class="bt" style="margin-top:8px" onclick="slp()">${L('ثبت خواب دیشب','Log sleep')}</button></div>`};
window.slp=async()=>{const r=await ask({t:L('خواب دیشب','Last night'),
 s:L('خواب، پایهٔ رشد و تمرکز است. کمتر از ۸ ساعت در سن تو، هم قد و هم نمره را می‌گیرد.','Sleep drives growth and focus.'),
 f:[{k:'v',t:L('ساعت','Hours'),ty:'num',v:8,st:.5,min:0,max:16,u:L('ساعت','h')},
    {k:'q',t:L('کیفیت','Quality'),ty:'rate',max:5,v:4}]});
 if(r&&r.v>0){S.sleepLog[td()]=r.v;xp(15);sv();rd();
  tst(r.v>=8?'● '+L('عالی','Great'):r.v>=7?'● '+L('قابل قبول','OK'):'○ '+L('کم است','Low'))}};
V.sys_cal=()=>{
  const inf=dayInfo(), DA=dateAdjust(S), sun=sunTimes();
  const now=new Date(); const jn=jToday();
  const off=S.calOff||0;
  let jy=jn[0], jm=jn[1]+off;
  while(jm>12){jm-=12;jy++} while(jm<1){jm+=12;jy--}
  const dim=jDaysInMonth(jy,jm);
  const g1=toGregorian(jy,jm,1);
  const firstDow=new Date(g1[0],g1[1]-1,g1[2]).getDay();
  const lead=(firstDow+1)%7;
  let cells='';for(let i=0;i<lead;i++)cells+='<i style="background:transparent"></i>';
  for(let i=1;i<=dim;i++){
    const g=toGregorian(jy,jm,i);
    const ds=`${g[0]}-${String(g[1]).padStart(2,'0')}-${String(g[2]).padStart(2,'0')}`;
    const di=dayInfo(new Date(g[0],g[1]-1,g[2]));
    const hh=(S.hist||[]).find(x=>x.d===ds);
    const op=hh?.10+hh.rate*.82:.05;
    const isT=ds===td();
    const evv=(S.ev||[]).some(e=>ds>=e.d1&&ds<=e.d2);
    const mark=di.official?'✦':di.schoolEvent?'▦':evv?'⚑':(di.j[1]===P.birth[1]&&di.j[2]===P.birth[2])?'★':'';
    cells+=`<i class="${isT?'t':''}" onclick="dayView('${ds}')"
     style="background:rgba(255,255,255,${op});color:${op>.5?'#000':(di.isFri||di.official?'rgba(255,255,255,.75)':'var(--dim2)')};
     position:relative;${di.official?'outline:.5px solid rgba(255,255,255,.35)':''}">
     ${fa(i)}${mark?`<b style="position:absolute;top:0;inset-inline-end:1px;font-size:6px;font-weight:400">${mark}</b>`:''}</i>`}
  const H=(S.hist||[]).slice(-30);
  const avg=H.length?Math.round(H.reduce((a,x)=>a+x.rate,0)/H.length*100):0;
  const up=upcoming(6);

  return `<div class="c gl"><div class="ct">${inf.season[1]} ${L('امروز','Today')}<b>${inf.dowName} ${fa(inf.j[2])} ${inf.monthName} ${fa(inf.j[0])}</b></div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr)">
    <div class="sk"><div class="skn" style="font-size:15px">${inf.season[0]}</div><div class="skl">${L('فصل','season')}</div></div>
    <div class="sk"><div class="skn" style="font-size:15px">${inf.off?L('تعطیل','Off'):L('کاری','Work')}</div><div class="skl">${inf.isFri?L('جمعه','Friday'):inf.official?L('رسمی','Official'):L('عادی','Normal')}</div></div>
    <div class="sk"><div class="skn" style="font-size:15px">${S.season==='school'?L('مدرسه','School'):L('تابستان','Summer')}</div><div class="skl">${L('حالت برنامه','mode')}</div></div></div>
   ${inf.holiday?`<div class="rw crisis" style="margin-top:8px"><div class="ri">✦</div>
    <div><div class="rt">${inf.holiday}</div><div class="rd">${inf.official?L('تعطیل رسمی','Official holiday'):L('مناسبت','Occasion')}</div></div></div>`:''}
   ${inf.schoolEvent?`<div class="rw" style="margin-top:6px"><div class="ri">▦</div>
    <div><div class="rt">${inf.schoolEvent}</div></div></div>`:''}
   <div class="hint">☀ ${L('طلوع','Sunrise')} ${hm(sun.rise)} · ${L('غروب','Sunset')} ${hm(sun.set)} · ${L('طول روز','Daylight')} ${fa(Math.floor(sun.len/60))}${L('س','h')} ${fa(sun.len%60)}${L('د','m')}</div></div>

  ${DA.adj.length?`<div class="c gl"><div class="ct">◆ ${L('تطبیق تقویمی','Calendar Adjustments')}</div>
   <div class="cs">${L('برنامه بر اساس تاریخ امروز خودکار تنظیم شد','Auto-adjusted for today')}</div>
   ${DA.adj.map(a=>`<div class="rw"><div class="ri">◦</div><div><div class="rt">${a[0]}</div>
    <div class="rd">${a[1]}</div></div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">▦ ${JM[jm-1]} ${fa(jy)}<b>${off===0?fa(avg)+'٪':''}</b></div>
   <div style="display:flex;gap:6px;margin-bottom:9px">
    <button class="bt" style="padding:6px" onclick="S.calOff=(S.calOff||0)-1;sv();rd()">‹</button>
    <button class="bt ${off===0?'p':''}" style="padding:6px" onclick="S.calOff=0;sv();rd()">${L('این ماه','This month')}</button>
    <button class="bt" style="padding:6px" onclick="S.calOff=(S.calOff||0)+1;sv();rd()">›</button></div>
   <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:5px">
    ${['ش','ی','د','س','چ','پ','ج'].map((x,i)=>`<div style="text-align:center;font-size:8px;color:${i===6?'rgba(255,255,255,.55)':'var(--dim2)'}">${x}</div>`).join('')}</div>
   <div class="cal">${cells}</div>
   <div class="hint">✦ ${L('تعطیل رسمی','Holiday')} · ▦ ${L('رویداد تحصیلی','School')} · ⚑ ${L('مسابقه','Match')} · ★ ${L('تولد','Birthday')}</div></div>

  <div class="c gl"><div class="ct">◷ ${L('رویدادهای پیش‌رو','Upcoming')}</div>
   ${up.length?up.map(u=>`<div class="rw"><div class="ri">${u.k==='hol'?'✦':u.k==='sch'?'▦':u.k==='bd'?'★':'◦'}</div>
    <div><div class="rt">${u.t}</div><div class="rd">${u.d}</div></div>
    <div class="rx">${u.in===0?L('امروز','today'):fa(u.in)+L(' روز',' d')}</div></div>`).join('')
   :`<div class="hint">${L('رویدادی در ۴۰۰ روز آینده نیست.','No events.')}</div>`}</div>

  <div class="c gl"><div class="ct">◇ ${L('مقایسهٔ فصلی','Seasonal')}</div>
   ${(()=>{const q={};(S.hist||[]).forEach(x=>{const pp=x.d.split('-').map(Number);
     const jj=toJalali(pp[0],pp[1],pp[2]);const s=jSeason(jj[1])[0];
     q[s]=q[s]||[];q[s].push(x.rate)});
    const e=Object.entries(q);
    return e.length?e.map(([k,v])=>`<div class="st" style="margin-bottom:6px">
     <div class="sn"><span>${k}</span><span class="sv">${fa(Math.round(v.reduce((a,b)=>a+b,0)/v.length*100))}٪ · ${fa(v.length)} ${L('روز','d')}</span></div>
     <div class="bar"><div class="bf" style="width:${v.reduce((a,b)=>a+b,0)/v.length*100}%"></div></div></div>`).join('')
     :`<div class="hint">${L('برای مقایسهٔ فصلی به داده بیشتری نیاز است.','Need more data.')}</div>`})()}</div>`};
window.dayView=ds=>{const hh=(S.hist||[]).find(x=>x.d===ds);
 const q=QUESTS.filter(x=>S.q[ds+'|'+x[0]]).length;
 const j=(S.jr||[]).find(x=>x.d===ds);
 const pp=ds.split('-').map(Number), di=dayInfo(new Date(pp[0],pp[1]-1,pp[2]));
 const ev=(S.ev||[]).filter(e=>ds>=e.d1&&ds<=e.d2);
 const row=(a,b)=>`<div class="rw"><div style="flex:1"><div class="rd">${a}</div></div><div class="rx">${b}</div></div>`;
 ask({t:di.dowName+' '+fa(di.j[2])+' '+di.monthName+' '+fa(di.j[0]),
  s:[di.holiday?'✦ '+di.holiday:'',di.schoolEvent?'▦ '+di.schoolEvent:'',
     ev.length?'⚑ '+ev.map(e=>EVT[e.k].t).join('، '):''].filter(Boolean).join(' · '),
  ok:L('بستن','Close'),
  f:[{k:'_',t:'',ty:'html'}]});
 setTimeout(()=>{const b=document.querySelector('#askw .askb');if(b)b.innerHTML=
  row(L('اجرای برنامه','Adherence'),hh?fa(Math.round(hh.rate*100))+'٪':'—')
 +row(L('کوئست','Quests'),fa(q))
 +row(L('خواب','Sleep'),(S.sleepLog||{})[ds]?fa(S.sleepLog[ds])+L(' ساعت',' h'):'—')
 +row(L('حال','Mood'),j?fa(j.m)+'/۵':'—')
 +((S.stLog&&Object.keys(S.stLog).length)?row(L('مطالعه','Study'),(()=>{let t=0;Object.values(S.stLog).forEach(w=>Object.values(w).forEach(v=>t+=v));return fa(Math.round(t/60))+L(' ساعت کل',' h total')})()):'')
 +(j&&j.a&&j.a[0]?`<div class="askfd"><div class="askl">${L('ژورنال','Journal')}</div><div class="rd" style="line-height:1.8">${j.a[0]}</div></div>`:'')},40)};
V.sys_health=()=>{
  const H=sysHealth(S),pb=predictBreak(S),mv=multiVar(S),ex=excuses(S);
  return `<div class="c gl" style="text-align:center"><div class="ct" style="justify-content:center">◈ ${L('سلامت سیستم','System Health')}</div>
   <div class="big" style="font-size:40px;margin:5px 0">${fa(H.total)}</div>
   <div class="cs" style="text-align:center">${H.msg}</div>
   <div style="margin-top:9px">${H.parts.map(p=>`<div class="st" style="margin-bottom:6px">
    <div class="sn"><span>${p[0]}</span><span class="sv">${fa(p[1])}٪</span></div>
    <div class="bar"><div class="bf" style="width:${p[1]}%"></div></div></div>`).join('')}</div></div>

  ${pb?`<div class="c gl"><div class="ct">⚠ ${L('پیش‌بینی نقطهٔ شکست','Break Prediction')}<b>${pb.day}</b></div>
   <div class="cs">${pb.msg}</div></div>`:''}

  <div class="c gl"><div class="ct">◆ ${L('تحلیل چندمتغیره','Multivariate')}</div>
   ${mv.map(x=>`<div class="rw"><div class="ri">◆</div><div><div class="rt">${x[0]}</div>
    <div class="rd">${x[1]}</div></div></div>`).join('')}</div>

  ${ex.length?`<div class="c gl"><div class="ct">◌ ${L('تشخیص بهانه','Excuse Detection')}</div>
   <div class="cs">${L('الگوهای تکرارشونده در رد کردن بلوک‌ها','Repeated skip patterns')}</div>
   ${ex.map(e=>`<div class="rw"><div class="ri">${fa(e[2])}</div><div><div class="rt">${e[0]} — «${e[1]}»</div>
    <div class="rd">${e[3]}</div></div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">▭ ${L('گزارش','Report')}</div>
   <button class="bt" onclick="rep()">${L('گزارش ماهانه (متن قابل ذخیره)','Monthly report')}</button>
   <button class="bt" style="margin-top:7px" onclick="ex2()">${L('خروجی کامل JSON','Full export')}</button>
   <button class="bt" style="margin-top:7px" onclick="imprt()">${L('بازگرداندن از فایل','Import from file')}</button>
   ${(()=>{let b=null;try{b=JSON.parse(localStorage.getItem(K+'.bk'))}catch(e){}
     return b?`<button class="bt" style="margin-top:7px" onclick="restore()">${L('بازیابی پشتیبان خودکار','Restore autosave')} <span style="opacity:.5;font-size:9px">${fa(new Date(b.t).toLocaleDateString('fa-IR'))}</span></button>`:''})()}
   <div class="hint">${L('فرمت باز و ساده — ده سال دیگر هم قابل خواندن است. پشتیبان خودکار هر ۲ دقیقه و هنگام بستن اپ ذخیره می‌شود.','Open format. Autosaves every 2 min.')}</div></div>

  <div class="c gl"><div class="ct">◈ ${L('نصب روی گوشی','Install')}</div>
   <div class="cs">${L('اپ را روی صفحهٔ اصلی نصب کن تا بدون مرورگر، تمام‌صفحه و کاملاً آفلاین باز شود. هیچ داده‌ای از گوشی تو خارج نمی‌شود.','Install to home screen — fullscreen, fully offline.')}</div>
   <button class="bt p" id="instb" onclick="inst()">${L('نصب اپ','Install app')}</button>
   <div class="hint">${L('اگر دکمه کار نکرد: منوی مرورگر ← «افزودن به صفحهٔ اصلی».','Or use browser menu.')}</div></div>`};

window.imprt=()=>{const i=document.createElement('input');i.type='file';i.accept='.json,application/json';
 i.onchange=()=>{const f=i.files[0];if(!f)return;const rd2=new FileReader();
  rd2.onload=async()=>{try{const d=JSON.parse(rd2.result);const o=d.state||d;
   if(typeof o!=='object')throw 0;
   if(await askYes(L('داده‌های فعلی جایگزین شوند؟','Replace current data?'),
     L('محتوای فایل روی اپ نوشته می‌شود. قبلش یک خروجی بگیر.','File contents overwrite the app.'),L('بازگردان','Restore'))){
    localStorage.setItem(K+'.bk',JSON.stringify({t:Date.now(),d:S}));
    S=Object.assign(JSON.parse(JSON.stringify(DEF)),o);sv();location.reload()}
  }catch(e){tst(L('فایل معتبر نیست','Invalid file'))}};
  rd2.readAsText(f)};i.click()};
window.restore=async()=>{let b=null;try{b=JSON.parse(localStorage.getItem(K+'.bk'))}catch(e){}
 if(!b)return tst(L('پشتیبانی موجود نیست','No backup'));
 if(await askYes(L('بازگشت به پشتیبان؟','Restore backup?'),
   new Date(b.t).toLocaleString('fa-IR'),L('بازگردان','Restore'))){
  S=Object.assign(JSON.parse(JSON.stringify(DEF)),b.d);sv();location.reload()}};
window.rep=()=>{
 const H=sysHealth(S),r=readiness(S),c=chapters(S);
 const t=`ASCEND — ${L('گزارش','Report')} ${jStr()}
${'='.repeat(34)}
${L('سطح','Level')}: ${lvl(S.xp)}   XP: ${S.xp}
${L('سلامت سیستم','Health')}: ${H.total}%
${L('آمادگی امروز','Readiness')}: ${r.sc}%
${c.cur?c.cur[1]:''} — ${L('روز','day')} ${c.days}
${'-'.repeat(34)}
${H.parts.map(p=>p[0].padEnd(16)+p[1]+'%').join('\n')}
${'-'.repeat(34)}
${L('استریک پاکی','Clean streak')}: ${S.streak.clean||0} (${L('رکورد','best')} ${S.best.clean||0})
${L('جلسات تمرین','Workouts')}: ${(S.wo||[]).length}
${L('مسابقات','Matches')}: ${(S.ms||[]).length}
${L('غذاهای یادگرفته','Dishes')}: ${(S.cook||[]).length}/12
${L('ژورنال','Journal')}: ${(S.jr||[]).length}
${L('وزن','Weight')}: ${S.wt[S.wt.length-1]}kg
${L('دستاوردها','Achievements')}: ${S.ach.length}/${ACH.length}`;
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));
 a.download='ascend-report.txt';a.click();tst('▭ ✓')};
window.ex2=()=>{const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));
 a.download='ascend-full.json';a.click();tst('✓')};

V.sys_foot2=()=>{
  const zc=S.zones||{};
  const pos=((S.ms||[]).length&&S.ms[S.ms.length-1].pos)||'CDM';
  const B=POS_BENCH[pos]||POS_BENCH.CDM;
  const my=(S.ms||[]).slice(-5);
  const avg=k=>my.length?Math.round(my.reduce((a,m)=>a+ +(m[k]||0),0)/my.length):0;
  const foot=S.footUse||{l:0,r:0};const tf=foot.l+foot.r||1;
  return `<div class="c gl"><div class="ct">◎ ${L('تست‌های دوره‌ای','Fitness Tests')}${ftDue(S)?`<b>${L('موعد رسیده','Due')}</b>`:''}</div>
   <div class="cs">${L('هر ۶ هفته. آینه دروغ می‌گوید، عدد نه.','Every 6 weeks.')}</div>
   ${FTEST.map(f=>{const d=ftDelta(S,f[0]),l=ftLast(S,f[0]).last;
    return `<div class="rw" onclick="ftLog('${f[0]}')"><div class="ri">◦</div>
     <div><div class="rt">${f[1]}</div><div class="rd">${l?fa(l.v)+' '+f[2]+' · '+l.d:L('ثبت نشده','Not logged')}</div></div>
     <div class="rx">${d?(d.better?'▲':'▼')+fa(d.pc)+'٪':'+'}</div></div>`}).join('')}</div>

  <div class="c gl"><div class="ct">● ${L('بدهی خواب','Sleep Debt')}</div>
   <div class="cs">${L('یک شب کم‌خوابی تا سه روز اثر دارد. هدف ۸.۵ ساعت.','One bad night lingers 3 days.')}</div>
   ${(()=>{const d=sleepDebt(S);
     if(!d)return `<div class="empty"><span class="ei">●</span>${L('خواب سه شب را ثبت کن تا بدهی محاسبه شود','Log 3 nights')}</div>`;
     return `<div class="gr" style="grid-template-columns:repeat(3,1fr);margin:9px 0">
      <div class="st"><div class="sn"><span>${L('میانگین','Avg')}</span><span class="sv">${fa(d.avg)}h</span></div></div>
      <div class="st"><div class="sn"><span>${L('بدهی','Debt')}</span><span class="sv">${fa(d.debt)}h</span></div></div>
      <div class="st"><div class="sn"><span>${L('شب','Nights')}</span><span class="sv">${fa(d.nights)}</span></div></div></div>
      ${d.bad?`<div class="hint" style="color:var(--ink)">${L('بدهی بالاست. امشب ','High debt. Sleep ')}${fa(sleepTarget(S,false))}${L(' دقیقه زودتر بخواب.',' min earlier.')}</div>`
        :`<div class="hint">${L('در محدودهٔ سالم.','Healthy range.')}</div>`}`})()}
   <button class="bt" style="margin-top:8px" onclick="slLog()">${L('ثبت خواب دیشب','Log last night')}</button></div>

  <div class="c gl"><div class="ct">▦ ${L('نقشهٔ حضور','Heat Map')}</div>
   <div class="cs">${L('بعد از بازی، مناطقی که بیشتر بودی را بزن','Tap zones after a match')}</div>
   <div class="pitch">${ZONES.map(z=>`<b class="${zc[z[0]]?'on':''}" onclick="zn('${z[0]}')">${z[0]}<br><span style="font-size:6.5px">${z[1]}</span></b>`).join('')}</div>
   <div class="hint">${L('پست‌های تو: CB, RB, LB, CM, CDM, CAM','Your positions')}</div></div>

  <div class="c gl"><div class="ct">◇ ${L('مقایسه با معیار پست','Benchmark')}<b>${pos}</b></div>
   <div class="cs">${B.note}</div>
   ${[['pass','پاس موفق ٪',B.pass],['tack','توپ‌گیری',B.tack],['duel','دوئل برنده ٪',B.duel]]
    .map(x=>{const v=avg(x[0]);const pc=Math.min(100,v/x[2]*100);
     return `<div class="st" style="margin-bottom:6px"><div class="sn"><span>${x[1]}</span>
     <span class="sv">${fa(v)} / ${fa(x[2])}</span></div>
     <div class="bar"><div class="bf" style="width:${pc}%"></div></div></div>`}).join('')}
   <div class="hint">${L('معیار تقریبی یک بازیکن خوب ۱۴–۱۵ ساله در این پست است، نه حرفه‌ای بزرگسال.','Age-appropriate benchmark.')}</div></div>

  <div class="c gl"><div class="ct">⇄ ${L('پای ضعیف','Weak Foot')}<b>${fa(Math.round(foot.l/tf*100))}٪ ${L('چپ','left')}</b></div>
   <div class="bar" style="height:6px"><div class="bf" style="width:${foot.l/tf*100}%"></div></div>
   <div class="hint">${foot.l/tf<0.35?L('تمرین پای چپ کم است. مدافع تک‌پا در سطح بالا قابل پیش‌بینی است. هدف: ۴۰٪.','Train weak foot more.'):L('تعادل خوبی داری.','Good balance.')}</div>
   <div style="display:flex;gap:6px;margin-top:8px">
    <button class="bt" onclick="ft2('r')">${L('تمرین پای راست','Right')}</button>
    <button class="bt p" onclick="ft2('l')">${L('تمرین پای چپ','Left')}</button></div></div>

  <div class="c gl"><div class="ct">◉ ${L('دفترچهٔ حریف','Opponent Notes')}</div>
   <button class="bt" onclick="opn()">${L('افزودن یادداشت','Add note')}</button>
   ${(S.opp||[]).slice(-5).reverse().map((o,i)=>`<div class="rw"><div class="ri">◦</div>
    <div><div class="rt">${o.t}</div><div class="rd">${o.n}</div></div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">▦ ${L('تقویم فصل','Season Phases')}</div>
   ${SEASON_PHASES.map(p=>`<div class="rw"><div class="ri">◦</div><div><div class="rt">${p[0]} <span style="color:var(--dim2);font-size:9px">· ${p[1]}</span></div>
    <div class="rd">${p[2]}</div></div></div>`).join('')}</div>`};
window.zn=z=>{S.zones=S.zones||{};S.zones[z]=!S.zones[z];sv();rd()};
window.ft2=f=>{S.footUse=S.footUse||{l:0,r:0};S.footUse[f]++;xp(10);sv();rd();tst('⇄ +'+fa(10))};
window.opn=async()=>{const r=await ask({t:L('یادداشت حریف','Opponent note'),
 f:[{k:'t',t:L('تیم یا بازیکن','Team/player'),ty:'text',ph:''},
    {k:'n',t:L('نکته','Note'),ty:'area',ph:L('نقطه‌ضعف، پای برتر، سرعت…','Weakness, strong foot…')}]});
 if(!r||!r.t)return;S.opp=S.opp||[];S.opp.push({t:r.t,n:r.n||''});sv();rd();tst('✓')};
V.sys_look2=()=>`<div class="c gl"><div class="ct">◈ ${COLOR_ME.t}</div>
  <div class="cs">${COLOR_ME.d}</div>
  <div class="sec">${L('بهترین رنگ‌ها','Best')}</div>
  <div>${COLOR_ME.best.map(c=>`<span class="pill">${c}</span>`).join('')}</div>
  <div class="sec">${L('پرهیز کن','Avoid')}</div>
  <div>${COLOR_ME.avoid.map(c=>`<span class="pill" style="opacity:.45">${c}</span>`).join('')}</div>
  <div class="hint">${COLOR_ME.why}</div></div>

 <div class="c gl"><div class="ct">✂ ${L('ردیاب مدل مو','Haircut Log')}<b>${fa((S.hair||[]).length)}</b></div>
  <div class="cs">${L('بعد از هر آرایشگاه ثبت کن. بعد یک سال می‌دانی چه مدلی به تو می‌آید.','Log each cut.')}</div>
  <button class="bt" onclick="hr()">${L('ثبت مدل امروز','Log today')}</button>
  ${(S.hair||[]).slice(-6).reverse().map(x=>`<div class="rw"><div class="ri">${x.g>=4?'▲':x.g>=3?'◈':'▽'}</div>
   <div><div class="rt">${x.n}</div><div class="rd">${x.d} · ${L('امتیاز','rating')} ${fa(x.g)}/۵</div></div></div>`).join('')}</div>

 <div class="c gl"><div class="ct">◌ ${L('چک‌لیست پیش از خروج','Exit Check')}</div>
  <div class="cs">${L('۱۰ ثانیه قبل از بیرون رفتن','10 seconds before leaving')}</div>
  ${EXITCHK.map((x,i)=>`<div class="rw ${S.exit[td()+'|'+i]?'done':''}" onclick="exc(${i})">
   <div class="ri">◦</div><div class="rt">${x}</div></div>`).join('')}
  <button class="bt" style="margin-top:7px" onclick="S.exit={};sv();rd()">${L('پاک کردن','Reset')}</button></div>

 <div class="c gl"><div class="ct">↑ ${L('پوسچر','Posture')}</div>
  ${POSTURE.map(p=>`<div class="rw"><div class="ri">↑</div><div><div class="rt">${p[1]}</div>
   <div class="rd">${p[2]}</div></div></div>`).join('')}
  <div class="hint">${L('عکس نیم‌رخ ماهانه بگیر و مقایسه کن. پوسچر بیشتر از هر لباسی، حضور می‌سازد.','Monthly side photo.')}</div></div>

 <div class="c gl"><div class="ct">◉ ${L('ردیاب تأثیر','Impact Log')}</div>
  <div class="cs">${L('بعد از هر تغییر ظاهری، بازخوردی که گرفتی را ثبت کن','Log feedback after changes')}</div>
  <button class="bt" onclick="imp()">${L('ثبت بازخورد','Log feedback')}</button>
  ${(S.impact||[]).slice(-5).reverse().map(x=>`<div class="rw"><div class="ri">◦</div>
   <div><div class="rt">${x.c}</div><div class="rd">${x.f}</div></div></div>`).join('')}</div>`;
window.hr=async()=>{const r=await ask({t:L('ثبت آرایشگاه','Log haircut'),
 f:[{k:'n',t:L('مدل مو','Style'),ty:'text',ph:''},
    {k:'g',t:L('چقدر راضی بودی؟','Satisfaction'),ty:'rate',max:5,v:4},
    {k:'nt',t:L('برای دفعهٔ بعد','For next time'),hint:L('اختیاری','optional'),ty:'text',ph:L('چه بگویم؟','What to ask for')}]});
 if(!r||!r.n)return;S.hair=S.hair||[];S.hair.push({n:r.n,g:r.g||3,nt:r.nt||'',d:jStr()});
 S.barber=new Date().toISOString();xp(15);sv();rd();tst('✓')};
window.exc=i=>{const k=td()+'|'+i;S.exit[k]=!S.exit[k];sv();rd()};
window.imp=async()=>{const r=await ask({t:L('ثبت تغییر','Log change'),
 f:[{k:'c',t:L('چه تغییری دادی؟','What changed?'),ty:'text',ph:''},
    {k:'f',t:L('چه بازخوردی گرفتی؟','Feedback?'),ty:'area',ph:''}]});
 if(!r||!r.c)return;S.impact=S.impact||[];S.impact.push({c:r.c,f:r.f||'',d:jStr()});sv();rd();tst('✓')};
V.sys_mind2=()=>{
  const due=srsDue(S);
  return `<div class="c gl"><div class="ct">◆ ${L('مرور فاصله‌دار','Spaced Repetition')}<b>${fa(due.length)} ${L('سررسید','due')}</b></div>
   <div class="cs">${L('فواصل ۱، ۳، ۷، ۱۶، ۳۵، ۹۰ روز. مؤثرترین روش حفظ بلندمدت.','1,3,7,16,35,90 days')}</div>
   ${due.length?due.slice(0,1).map(c=>`<div class="c gl" style="padding:13px;margin:0 0 8px">
    <div class="rt">${c.q}</div>
    <div class="hint">${S.showA?c.a:L('برای دیدن پاسخ بزن','Tap to reveal')}</div>
    ${S.showA?`<div style="display:flex;gap:6px;margin-top:8px">
      <button class="bt" onclick="srsAns('${c.id}',0)">${L('بلد نبودم','Again')}</button>
      <button class="bt p" onclick="srsAns('${c.id}',1)">${L('بلد بودم','Good')}</button></div>`
     :`<button class="bt" style="margin-top:8px" onclick="S.showA=1;sv();rd()">${L('نمایش پاسخ','Reveal')}</button>`}
    </div>`).join(''):`<div class="hint">${L('کارت سررسیدی نداری.','Nothing due.')}</div>`}
   <button class="bt" onclick="srsAdd()">${L('افزودن کارت','Add card')}</button>
   <div class="hint">${L('مجموع کارت‌ها','Total')}: ${fa((S.srs||[]).length)}</div></div>

  <div class="c gl"><div class="ct">◌ ${L('بانک اشتباهات','Mistake Bank')}<b>${fa((S.mistakes||[]).length)}</b></div>
   <div class="cs">${L('هر سؤالی که غلط زدی اینجا بماند و دوره‌ای برگردد','Every wrong answer')}</div>
   <button class="bt" onclick="mkAdd()">${L('ثبت اشتباه','Add mistake')}</button>
   ${(()=>{const M=S.mistakes||[]; if(M.length<4)return M.length?`<div class="hint">${L('بعد از ۴ ثبت، الگوی اشتباهاتت اینجا ظاهر می‌شود.','Pattern appears after 4 entries.')}</div>`:'';
     /* الگوی علت */
     const byW={}; M.forEach(x=>{const k=x.w||L('نامشخص','?'); byW[k]=(byW[k]||0)+1});
     const wTop=Object.entries(byW).sort((a,b)=>b[1]-a[1]);
     const byS={}; M.forEach(x=>{if(x.s)byS[x.s]=(byS[x.s]||0)+1});
     const sTop=Object.entries(byS).sort((a,b)=>b[1]-a[1])[0];
     const pc=Math.round(wTop[0][1]/M.length*100);
     const advice={};
     advice[L('بی‌دقتی','Careless')]=L('قبل از تحویل، فقط سؤال‌های محاسباتی را دوباره نگاه کن. ۲ دقیقه کافی است.','Recheck computations.');
     advice[L('بلد نبودم','Didn\'t know')]=L('این یعنی شکاف مفهومی، نه کم‌کاری. آن فصل را از اول بخوان نه اینکه تست بزنی.','Concept gap — reread.');
     advice[L('کمبود وقت','Time')]=L('تمرین با تایمر. سؤال سخت را رد کن و آخر برگرد.','Practice timed.');
     advice[L('بدفهمی صورت سؤال','Misread')]=L('صورت سؤال را با مداد خط بکش و خواسته را دور بگیر.','Underline the question.');
     return `<div class="gr" style="grid-template-columns:repeat(2,1fr);margin:9px 0">
      ${wTop.slice(0,4).map(w=>`<div class="st"><div class="sn"><span>${w[0]}</span><span class="sv">${fa(w[1])}</span></div></div>`).join('')}</div>
      <div class="hint" style="color:var(--ink)">${L('بیشترین علت: ','Top cause: ')}<b>${wTop[0][0]}</b> (${fa(pc)}٪)${sTop?L(' · ضعیف‌ترین درس: ','  weakest: ')+(SUBJ.find(x=>x[0]===sTop[0])||['','?'])[1]:''}</div>
      <div class="hint">${advice[wTop[0][0]]||L('روند را زیر نظر بگیر.','Keep tracking.')}</div>`})()}
   ${(S.mistakes||[]).slice(-6).reverse().map((x,i)=>`<div class="rw"><div class="ri">◦</div>
    <div><div class="rt">${x.q}</div><div class="rd">${(SUBJ.find(y=>y[0]===x.s)||['',x.s])[1]} · ${x.d}${x.w?' · '+x.w:''}</div></div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◇ ${L('ردیاب تمرکز','Focus Tracker')}</div>
   <div class="cs">${L('در هر بلوک عمیق، چند بار حواست پرت شد؟','Distractions per deep block')}</div>
   ${(()=>{const f=Object.entries(S.focus||{}).slice(-10);
    return f.length?`<div style="display:flex;gap:3px;align-items:flex-end;height:38px;margin-bottom:8px">
     ${f.map(([k,v])=>`<div style="flex:1;height:${Math.min(100,v*14)}%;background:rgba(255,255,255,.5);border-radius:2px"></div>`).join('')}</div>
     <div class="hint">${L('میانگین','Avg')}: ${fa((f.reduce((a,x)=>a+x[1],0)/f.length).toFixed(1))} ${L('بار در بلوک','per block')}</div>`
    :`<div class="empty"><span class="ei">◇</span>${L('اولین بلوک تمرکز را ثبت کن','Log your first focus block')}</div>`})()}
   <button class="bt" onclick="fcs()">${L('ثبت بلوک تمرکز','Log focus block')}</button></div>

  <div class="c gl"><div class="ct">◷ ${L('شمارش معکوس امتحان','Exam Countdown')}</div>
   <button class="bt" onclick="exm()">${L('افزودن امتحان','Add exam')}</button>
   ${(S.exams||[]).filter(e=>e.d>=td()).sort((a,b)=>a.d<b.d?-1:1).map(e=>{
    const dd=Math.ceil((new Date(e.d)-Date.now())/864e5);
    return `<div class="rw"><div class="ri">${fa(dd)}</div><div><div class="rt">${e.t}</div>
    <div class="rd">${L('برنامهٔ برگشتی: روزی ','Plan: ')}${fa(Math.ceil((e.ch||10)/Math.max(1,dd)))} ${L('فصل','ch/day')}</div></div></div>`}).join('')}</div>

  <div class="c gl"><div class="ct">◈ ${L('پروژهٔ سالانه','Annual Project')}</div>
   ${S.proj?`<div class="rt">${S.proj.t}</div>
    <div class="bar" style="margin:8px 0"><div class="bf" style="width:${S.proj.p}%"></div></div>
    <div class="hint">${fa(S.proj.p)}٪</div>
    <div style="display:flex;gap:6px;margin-top:7px">
     <button class="bt p" onclick="S.proj.p=Math.min(100,S.proj.p+5);xp(25);sv();rd()">+۵٪</button>
     <button class="bt" onclick="S.proj=null;sv();rd()">${L('حذف','Remove')}</button></div>`
   :`<div class="cs">${L('یک چیز بزرگ که کل سال رویش کار کنی.','One big thing for the year.')}</div>
    <button class="bt" onclick="prj()">${L('تعریف پروژه','Define')}</button>`}</div>`};
window.srsAdd=async()=>{const r=await ask({t:L('کارت مرور جدید','New card'),
 s:L('سؤال را طوری بنویس که پاسخش یک چیز مشخص باشد.','Make the answer specific.'),
 f:[{k:'q',t:L('سؤال','Question'),ty:'area',ph:L('مثلاً فرمول محیط دایره؟','e.g. Circle circumference?')},
    {k:'a',t:L('پاسخ','Answer'),ty:'area',ph:''},
    {k:'s',t:L('درس','Subject'),hint:L('اختیاری','optional'),ty:'pick',o:SUBJ.map(s=>[s[0],s[2]+' '+s[1]]),v:''}]});
 if(!r||!r.q)return;S.srs=S.srs||[];S.srs.push({id:Date.now()+'',q:r.q,a:r.a||'',s:r.s||'',lvl:0,next:Date.now()});
 sv();rd();tst('◍ ✓')};
window.srsAns=(id,ok)=>{const c=S.srs.find(x=>x.id===id);if(c)srsNext(c,ok);
 S.showA=0;if(ok)xp(10);sv();rd()};
window.mkAdd=async()=>{const r=await ask({t:L('ثبت اشتباه','Log mistake'),
 s:L('هر اشتباه خودکار به کارت مرور تبدیل می‌شود و فردا برمی‌گردد.','Becomes a review card automatically.'),
 f:[{k:'q',t:L('سؤال یا اشتباه','Mistake'),ty:'area',ph:''},
    {k:'a',t:L('پاسخ درست','Correct answer'),hint:L('اختیاری','optional'),ty:'area',ph:''},
    {k:'s',t:L('درس','Subject'),ty:'pick',o:SUBJ.map(s=>[s[0],s[2]+' '+s[1]]),v:'math'},
    {k:'w',t:L('چرا اشتباه شد؟','Why?'),ty:'chips',o:[L('بلد نبودم','Didn\'t know'),L('بی‌دقتی','Careless'),L('کمبود وقت','Time'),L('بدفهمی صورت سؤال','Misread')]}]});
 if(!r||!r.q)return;S.mistakes=S.mistakes||[];S.mistakes.push({q:r.q,s:r.s,w:r.w||'',d:jStr()});
 S.srs=S.srs||[];S.srs.push({id:Date.now()+'',q:r.q,a:r.a||L('از بانک اشتباهات','From mistake bank'),s:r.s,lvl:0,next:Date.now()+864e5});
 xp(10);sv();rd();tst('✓')};
window.fcs=async()=>{const r=await ask({t:L('ثبت تمرکز','Log focus'),
 f:[{k:'v',t:L('چند بار حواست پرت شد؟','Distractions?'),ty:'num',v:3,st:1,min:0,max:60}]});
 if(r&&r.v>=0){S.focus[Date.now()]=r.v;xp(15);sv();rd();tst('◇ ✓')}};
window.exm=async()=>{const r=await ask({t:L('افزودن امتحان','Add exam'),
 s:L('برنامهٔ برگشتی خودکار ساخته می‌شود.','A reverse plan is generated.'),
 f:[{k:'t',t:L('عنوان','Title'),ty:'text',ph:L('مثلاً ریاضی میان‌ترم','e.g. Math midterm')},
    {k:'s',t:L('درس','Subject'),ty:'pick',o:SUBJ.map(s=>[s[0],s[2]+' '+s[1]]),v:'math'},
    {k:'d',t:L('تاریخ','Date'),ty:'date',v:td()},
    {k:'ch',t:L('چند فصل','Chapters'),ty:'num',v:10,st:1,min:1,max:60}]});
 if(!r||!r.t)return;S.exams=S.exams||[];S.exams.push({t:r.t,s:r.s,d:r.d||td(),ch:r.ch||10});sv();rd();tst('✓')};
window.prj=async()=>{const r=await ask({t:L('پروژهٔ امسال','This year\'s project'),
 s:L('یک چیز که تا آخر سال بسازی یا یاد بگیری.','One thing to build or learn this year.'),
 f:[{k:'t',ty:'text',v:(S.proj||{}).t||'',ph:''}]});
 if(r&&r.t){S.proj={t:r.t,p:(S.proj||{}).p||0};sv();rd();tst('✓')}};
V.sys_psy=()=>{
  const c=chapters(S);
  return `<div class="c gl"><div class="ct">▲ ${L('نقشهٔ وسوسه','Urge Map')}<b>${fa((S.urges||[]).length)}</b></div>
   <div class="cs">${L('هر وسوسه را ثبت کن — چه مقاومت کردی چه نه. هدف پیدا کردن الگوست، نه قضاوت.','Log every urge.')}</div>
   <button class="bt" style="margin-top:8px" onclick="urgeLog()">${L('ثبت وسوسه','Log urge')}</button>
   ${(()=>{const a=trgAnalyze(S);
     if(!a)return `<div class="hint">${L('بعد از ۵ ثبت، ساعت خطر و محرک غالبت اینجا ظاهر می‌شود.','Pattern after 5 logs.')}</div>`;
     return `<div class="gr" style="grid-template-columns:repeat(3,1fr);margin-top:9px">
      <div class="st"><div class="sn"><span>${L('ثبت','Logs')}</span><span class="sv">${fa(a.n)}</span></div></div>
      <div class="st"><div class="sn"><span>${L('مقاومت','Resisted')}</span><span class="sv">${fa(a.rate)}٪</span></div></div>
      <div class="st"><div class="sn"><span>${L('ساعت خطر','Peak')}</span><span class="sv">${fa(a.hour)}–${fa(a.hour+3)}</span></div></div></div>
      <div class="hint" style="color:var(--ink)">${L('محرک غالب: ','Top: ')}<b>${TRG_MAP[a.trg]||'—'}</b> (${fa(a.trgPc)}٪)</div>
      <div class="hint">${trgFix(a.trg)}</div>`})()}</div>

  <div class="c gl"><div class="ct">◆ ${L('قرارداد با خودت','Contract')}</div>
   ${S.contract?`<div style="font-size:11px;line-height:1.95;white-space:pre-line;color:var(--dim)">${S.contract}</div>
    <div class="hint">${L('امضا شده در','Signed')} ${S.contractD||jStr()}</div>
    <button class="bt" style="margin-top:8px" onclick="ctr()">${L('ویرایش','Edit')}</button>`
   :`<div class="cs">${L('یک قرارداد با خودت بنویس و امضا کن. موقع لغزش نشانت داده می‌شود.','Write and sign.')}</div>
    <button class="bt p" onclick="ctr()">${L('نوشتن قرارداد','Write contract')}</button>`}</div>

  <div class="c gl"><div class="ct">◉ ${L('هزینهٔ از دست رفته','Sunk Cost')}</div>
   <div class="big" style="font-size:36px">${fa(S.streak.clean)}</div>
   <div class="cs" style="text-align:center">${L(`${fa(S.streak.clean||0)} روز ساخته‌ای. یک تصمیم، همه‌اش را صفر می‌کند. رکورد تو ${fa(S.best.clean||0)} روز است.`,'Days built.')}</div></div>

  <div class="c gl"><div class="ct">◇ ${L('شبیه‌ساز پشیمانی','Regret Simulator')}</div>
   <div class="cs">${L('قبل از تصمیم اشتباه، این‌ها را بخوان','Read before deciding')}</div>
   ${REGRET_Q.map(q=>`<div class="rw"><div class="ri">?</div><div class="rt">${q}</div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">✉ ${L('نامه از خودِ دیروز','Letter from Yesterday')}</div>
   ${(()=>{const y=dstr(new Date(Date.now()-864e5));
    const n=(S.notes||{})[y];
    return n?`<div class="big" style="font-size:13px;line-height:1.8;text-align:right">${n}</div>`
     :`<div class="hint">${L('دیروز پیامی ننوشتی.','Nothing from yesterday.')}</div>`})()}
   <button class="bt" style="margin-top:8px" onclick="ntm()">${L('پیام برای فردای خودت','Note to tomorrow')}</button></div>

  <div class="c gl"><div class="ct">◈ ${L('بازتعریف زبان','Reframe')}</div>
   <div class="cs">${L('تفاوت زبانی، تفاوت رفتاری می‌سازد','Language shapes behavior')}</div>
   ${Object.entries(REFRAME).map(([a,b])=>`<div class="rw"><div class="ri">→</div>
    <div class="rt"><span style="opacity:.4;text-decoration:line-through">${a}</span> &nbsp;→&nbsp; ${b}</div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◉ ${L('جشن','Celebrate')}</div>
   <div class="cs">${L('بعد از هر دستاورد بزرگ، عمداً جشن بگیر. مغز باید تلاش را به پاداش وصل کند.','Deliberate reward')}</div>
   ${CELEBRATE.map(x=>`<div class="rw"><div class="ri">◦</div><div class="rt">${x}</div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">▦ ${L('حالت روایی','Narrative')}<b>${L('روز','day')} ${fa(c.days)}</b></div>
   <div class="big" style="font-size:16px;margin:6px 0">${c.cur?c.cur[1]:''}</div>
   <div class="cs" style="text-align:center">${c.cur?c.cur[2]:''}</div>
   ${c.nxt?`<div class="hint">${L('فصل بعد در ','Next chapter in ')}${fa(c.nxt[0]-c.days)} ${L('روز','days')}: ${c.nxt[1]}</div>`:''}</div>

  <div class="c gl"><div class="ct">◌ ${L('پیش‌بینی مانع','Obstacle Planning')}</div>
   <div class="cs">${L('برای هر هدف، از قبل مانعش را پیش‌بینی کن','If-then planning')}</div>
   <button class="bt" onclick="obs()">${L('افزودن نقشهٔ اگر-آنگاه','Add if-then')}</button>
   ${(S.obs||[]).map((o,i)=>`<div class="rw"><div class="ri">◦</div>
    <div><div class="rt">${L('اگر','If')}: ${o.i}</div><div class="rd">${L('آنگاه','Then')}: ${o.t}</div></div></div>`).join('')}</div>`};
window.ctr=async()=>{const r=await ask({t:L('قرارداد با خودت','Self contract'),
 f:[{k:'v',ty:'area',v:S.contract||CONTRACT_T,ph:''}]});
 if(r&&r.v){S.contract=r.v;S.contractD=jStr();sv();rd();tst('◆ ✓')}};
window.ntm=async()=>{const r=await ask({t:L('پیام به فردای خودت','Note to tomorrow'),
 s:L('فردا صبح اولین چیزی است که می‌بینی.','First thing you see tomorrow.'),
 f:[{k:'v',ty:'area',ph:''}]});
 if(r&&r.v){S.notes=S.notes||{};S.notes[td()]=r.v;sv();rd();tst('✉ ✓')}};
window.obs=async()=>{const r=await ask({t:L('نقشهٔ اگر–آنگاه','If-then plan'),
 s:L('از قبل تصمیم بگیر. در لحظه، مغز تو تصمیم‌گیر خوبی نیست.','Decide in advance.'),
 f:[{k:'i',t:L('اگر…','If…'),ty:'text',ph:L('اگر بعد از مدرسه خسته بودم','If I am tired after school')},
    {k:'t',t:L('آنگاه…','Then…'),ty:'text',ph:L('آنگاه ۲۰ دقیقه چرت، بعد درس','Then 20-min nap, then study')}]});
 if(!r||!r.i)return;S.obs=S.obs||[];S.obs.push({i:r.i,t:r.t||''});sv();rd();tst('✓')};
