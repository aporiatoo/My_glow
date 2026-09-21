/* ============ MONEY ============ */
V.mn=()=>{
  const inn=S.tx.filter(t=>t.c==='in').reduce((a,t)=>a+t.a,0);
  const out=S.tx.filter(t=>t.c!=='in'&&t.c!=='save').reduce((a,t)=>a+t.a,0);
  const sav=S.tx.filter(t=>t.c==='save').reduce((a,t)=>a+t.a,0);
  const bal=inn-out-sav;
  const m={};S.tx.filter(t=>t.c!=='in').forEach(t=>m[t.c]=(m[t.c]||0)+t.a);
  const mx=Math.max(1,...Object.values(m));
  const g=MGOALS[S.goal];
  const fm=n=>fa(n.toLocaleString('en-US'));
  return `<div class="c gl"><div class="ct">◉ ${L('خزانه','Treasury')}<b>${L('تومان','Toman')}</b></div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr)">
    <div class="sk"><div class="skn" style="font-size:15px">${fm(inn)}</div><div class="skl">${L('درآمد','In')}</div></div>
    <div class="sk"><div class="skn" style="font-size:15px">${fm(out)}</div><div class="skl">${L('خرج','Out')}</div></div>
    <div class="sk"><div class="skn" style="font-size:15px">${fm(sav)}</div><div class="skl">${L('پس‌انداز','Saved')}</div></div></div>
   <div class="hint">${L('مانده','Balance')}: ${fm(bal)}</div>
   <div style="display:flex;gap:6px;margin-top:9px">
    <button class="bt p" onclick="tx('in')">${L('+ درآمد','+ Income')}</button>
    <button class="bt" onclick="tx('out')">${L('− خرج','- Expense')}</button></div></div>

  <div class="c gl"><div class="ct">◈ ${L('هدف مالی','Goal')}<b>${fm(g.a)}</b></div>
   <div class="cs">${g.t}</div>
   <div class="bar"><div class="bf" style="width:${Math.min(100,sav/g.a*100)}%"></div></div>
   <div class="hint">${fm(sav)} / ${fm(g.a)} · ${fa(Math.round(Math.min(100,sav/g.a*100)))}٪</div>
   <button class="bt" style="margin-top:8px" onclick="S.goal=(S.goal+1)%MGOALS.length;sv();rd()">${L('هدف بعدی','Next goal')}</button></div>

  ${Object.keys(m).length?`<div class="c gl"><div class="ct">${L('تفکیک خرج','Breakdown')}</div>
   ${Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{const c=MCAT.find(x=>x[0]===k)||['','◦',k];
    return `<div class="st" style="margin-bottom:6px"><div class="sn"><span>${c[1]} ${c[2]}</span><span class="sv">${fm(v)}</span></div>
    <div class="bar"><div class="bf" style="width:${v/mx*100}%"></div></div></div>`}).join('')}</div>`:''}

  <div class="c gl"><div class="ct">◆ ${L('قوانین پول','Money Rules')}</div>
   ${MONEY_RULES.map(r=>`<div class="li">${r}</div>`).join('')}</div>

  ${S.tx.length?`<div class="c gl"><div class="ct">${L('تراکنش‌های اخیر','Recent')}<b>${fa(S.tx.length)}</b></div>
   ${S.tx.slice(-8).reverse().map(t=>{const c=MCAT.find(x=>x[0]===t.c)||['','◦',t.c];
    return `<div class="rw"><div class="ri">${c[1]}</div><div><div class="rt">${t.n||c[2]}</div>
    <div class="rd">${t.d}</div></div><div class="rx">${t.c==='in'?'+':'−'}${fm(t.a)}</div></div>`}).join('')}</div>`:''}`};
window.tx=async k=>{const o=k==='out'?MCAT.filter(x=>x[0]!=='in'):[MCAT.find(x=>x[0]==='in')];
 const r=await ask({t:k==='out'?L('ثبت خرج','Add expense'):L('ثبت درآمد','Add income'),
  f:[{k:'c',t:L('دسته','Category'),ty:'pick',o:o.map(x=>[x[0],x[2]]),v:o[0][0]},
     {k:'a',t:L('مبلغ','Amount'),ty:'num',v:'',st:10000,min:0,u:L('تومان','T')},
     {k:'n',t:L('بابت','For'),hint:L('اختیاری','optional'),ty:'text',ph:''}]});
 if(!r||!(r.a>0))return;S.tx.push({c:r.c,a:r.a,n:r.n||'',d:jStr()});sv();rd();tst('✓')};
/* ============ SOCIAL CIRCLE ============ */
/* ============ SOCIAL VIEW ============ */
function soOrbit(){
  const cx=124,cy=124,P=S.ppl||[];
  let g=`<defs><radialGradient id="soc" cx="50%" cy="50%"><stop offset="0%" stop-color="#fff" stop-opacity=".22"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
  g+=`<circle cx="${cx}" cy="${cy}" r="112" fill="url(#soc)"/>`;
  RINGS.slice().reverse().forEach(r=>{
    const n=P.filter(p=>p.r===r.k).length, cap=RING_CAP[r.k];
    const full=cap<900&&n>cap;
    g+=`<circle cx="${cx}" cy="${cy}" r="${r.r}" fill="none"
      stroke="rgba(255,255,255,${full?.34:.14})" stroke-width="${full?1.1:.7}"
      ${full?'':'stroke-dasharray="1.5 3.5"'}/>`;
    g+=`<text x="${cx}" y="${cy-r.r+9}" fill="#5c5c66" font-size="6" font-family="Vazirmatn" text-anchor="middle">${r.t}</text>`;
  });
  /* چیدمان در هر حلقه: توزیع یکنواخت */
  RINGS.forEach(R=>{
    const grp=P.filter(p=>p.r===R.k);
    grp.forEach((p,i)=>{
      const rr=R.r-14, an=((i/Math.max(1,grp.length))*360-90)*Math.PI/180;
      const x=cx+rr*Math.cos(an), y=cy+rr*Math.sin(an);
      const w=warmth(S,p), od=overdue(S,p).due;
      const rad=4.5+w/100*3.5;
      const op=.25+w/100*.75;
      const idx=P.indexOf(p);
      g+=`<g style="cursor:pointer" onclick="soPerson(${idx})">`;
      if(w>55)g+=`<circle cx="${x}" cy="${y}" r="${rad+4}" fill="#fff" opacity="${(w-55)/45*.16}"/>`;
      g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#fff" stroke-opacity="${.05+w/100*.22}" stroke-width="${.4+w/100*1}"/>`;
      g+=`<circle cx="${x}" cy="${y}" r="${rad}" fill="${p.e<0?'none':'#fff'}" fill-opacity="${p.e<0?0:op}"
        stroke="#fff" stroke-opacity="${p.e<0?.5:.85}" stroke-width="${p.e<0?1.1:.5}"/>`;
      if(od)g+=`<circle cx="${x+rad+2.5}" cy="${y-rad-1}" r="2" fill="#fff"/>`;
      g+=`<text x="${x}" y="${y+rad+7.5}" fill="#8a8a93" font-size="6.2" font-family="Vazirmatn" text-anchor="middle">${p.n.slice(0,8)}</text></g>`;
    });
  });
  g+=`<circle cx="${cx}" cy="${cy}" r="14" fill="#fff"/>
   <text x="${cx}" y="${cy}" fill="#000" font-size="8.5" font-family="Vazirmatn" font-weight="800" text-anchor="middle" dominant-baseline="central">${L('تو','You')}</text>`;
  return `<svg width="100%" viewBox="0 0 248 248" style="max-width:300px">${g}</svg>`;
}
V.so=()=>{
  const P=S.ppl||[], H=socialHealth(S), mv=socialMoves(S), ins=socialInsight(S), tr=socialTrend(S);
  const lbl=H.score>=75?L('قوی','Strong'):H.score>=50?L('متعادل','Balanced'):H.score>=25?L('ضعیف','Weak'):L('نیازمند توجه','Needs work');
  return `<div class="c gl"><div class="ct">◈ ${L('خانواده','Family')}</div>
   <div class="cs">${L('ساده‌ترین کار با بیشترین اثر. یک تماس کوتاه کافی است.','Small effort, large effect.')}</div>
   ${famDue(S).map(f=>`<div class="rw ${f.due?'':'done'}" onclick="famTg('${f.k}')">
    <div class="ri">${f.due?'○':'✓'}</div>
    <div><div class="rt">${f.t}</div>
     <div class="rd">${f.last?L('آخرین: ','Last: ')+f.last+' · '+fa(f.days)+L(' روز پیش',' days ago'):L('هنوز ثبت نشده','Not yet')}</div></div>
    <div class="rx">${f.due?L('موعد','due'):''}</div></div>`).join('')}
   ${(()=>{const iso=isolationDays(S);
     return (iso!==null&&iso>=5)?`<div class="hint" style="color:var(--ink)">${L('پنج روز است هیچ تعامل حضوری ثبت نشده. انزوا تدریجی است و خودت متوجهش نمی‌شوی.','5 days without in-person contact.')}</div>`:''})()}</div>

  <div class="c gl" style="text-align:center">
   <div class="ct" style="justify-content:center">◍ ${L('حلقهٔ اجتماعی','Social Circle')}<b>${fa(H.n)} ${L('نفر','people')}</b></div>
   ${soOrbit()}
   <div class="solg">
    <span><i class="sod f"></i>${L('گرم','Warm')}</span>
    <span><i class="sod h"></i>${L('سرد','Cold')}</span>
    <span><i class="sod o"></i>${L('انرژی‌گیر','Drain')}</span>
    <span><i class="sod d"></i>${L('سررسید تماس','Overdue')}</span></div>
   <div class="hint">${L('اندازه و روشنایی هر نقطه، گرمای رابطه است. روی هرکس بزن.','Size and brightness show relationship warmth.')}</div>
   ${S.ppl&&S.ppl.length?`<button class="bt p" style="margin-top:8px" onclick="soQuick()">${L('ثبت سریع تعامل','Quick log')}</button>`:''}</div>

  <div class="c gl"><div class="ct">◆ ${L('سلامت شبکه','Network Health')}<b>${fa(H.score)}/۱۰۰ · ${lbl}</b></div>
   <div class="bar" style="height:6px;margin-bottom:11px"><div class="bf" style="width:${H.score}%"></div></div>
   <div class="sogrid">
    ${[[fa(H.inner),L('هستهٔ درونی','Inner')],[fa(H.warm),L('گرمای میانگین','Avg warmth')],
       [fa(H.od),L('سررسید تماس','Overdue')],[fa(H.drain),L('فرساینده','Draining')]]
     .map(x=>`<div class="sob"><div class="sobn">${x[0]}</div><div class="sobl">${x[1]}</div></div>`).join('')}</div>
   ${(()=>{const mx=Math.max(1,...tr);
    return `<div class="hint" style="margin:9px 0 5px">${L('تعامل در ۸ هفتهٔ گذشته','Interactions, last 8 weeks')}</div>
    <div style="display:flex;gap:3px;align-items:flex-end;height:40px">
     ${tr.map((v,i)=>`<div style="flex:1;height:${Math.max(4,v/mx*100)}%;border-radius:3px;
      background:${i===tr.length-1?'#fff':'rgba(255,255,255,.32)'}"></div>`).join('')}</div>`})()}</div>

  ${mv.length?`<div class="c gl"><div class="ct">◷ ${L('حرکت‌های امروز','Today\u2019s Moves')}<b>${fa(mv.length)}</b></div>
   <div class="cs">${L('اقدام مشخص، نه توصیهٔ کلی','Specific actions')}</div>
   ${mv.map(m=>`<div class="somv s${m.sev}" onclick="soLog('${m.p.id}')">
    <div class="somi">${m.ic}</div>
    <div style="flex:1"><div class="rt">${m.p.n} — ${m.t}</div><div class="rd">${m.d}</div></div>
    <div class="rx">${m.act}</div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">◍ ${L('حلقه‌ها','Rings')}</div>
   ${RINGS.map(r=>{const n=P.filter(p=>p.r===r.k).length, cap=RING_CAP[r.k];
    const pc=cap<900?Math.min(100,n/cap*100):Math.min(100,n*8);
    return `<div class="rw" onclick="addP('${r.k}')">
     <div class="ri">${fa(n)}</div>
     <div style="flex:1"><div class="rt">${r.t} <span style="color:var(--dim2);font-size:9px">· ${L('هر','every')} ${fa(RING_CAD[r.k])} ${L('روز تماس','d')}</span></div>
      <div class="bar" style="margin-top:5px"><div class="bf" style="width:${pc}%"></div></div>
      <div class="rd" style="margin-top:3px">${r.d}</div></div>
     <div class="rx">+</div></div>`}).join('')}</div>

  ${P.length?`<div class="c gl"><div class="ct">${L('افراد','People')}<b>${fa(P.length)}</b></div>
   ${P.map((p,i)=>{const w=warmth(S,p), o=overdue(S,p), R=RMAP[p.role];
    return `<div class="rw" onclick="soPerson(${i})">
     <div class="soav" style="opacity:${.35+w/100*.65}">${p.n.slice(0,1)}</div>
     <div style="flex:1"><div class="rt">${p.n} ${R?`<span style="font-size:9px;color:var(--dim2)">· ${R[2]}</span>`:''}</div>
      <div class="sowb"><div class="sowf" style="width:${w}%"></div></div>
      <div class="rd" style="margin-top:3px">${(RINGS.find(x=>x.k===p.r)||{}).t}${o.d!==undefined?' · '+(o.d===0?L('امروز','today'):fa(o.d)+L(' روز پیش',' d ago')):' · '+L('بدون تعامل','no contact')}</div></div>
     <div class="rx"${o.due?' style="background:#fff;color:#000"':''}>${o.due?L('تماس','due'):fa(w)}</div></div>`}).join('')}
   <button class="bt" style="margin-top:8px" onclick="addP('close')">${L('افزودن شخص','Add person')}</button></div>`
  :`<div class="c gl"><div class="cs">${L('هنوز کسی ثبت نشده. با هستهٔ درونی شروع کن — سه تا پنج نفری که واقعاً مهم‌اند.','Start with your inner circle.')}</div>
    <button class="bt p" onclick="addP('core')">${L('افزودن اولین نفر','Add first person')}</button></div>`}

  ${ins.length?`<div class="c gl"><div class="ct">◈ ${L('بینش','Insight')}</div>
   ${ins.map(x=>`<div class="rw"><div class="ri">${x[0]}</div>
    <div><div class="rt">${x[1]}</div><div class="rd">${x[2]}</div></div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">⚔ ${L('کوئست اجتماعی','Social Quests')}</div>
   ${SOCIAL_QUESTS.map(q=>`<div class="rw"><div class="ri">${q[0]}</div>
    <div><div class="rt">${q[1]}</div><div class="rd">${q[2]}</div></div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◆ ${L('قوانین اجتماعی','Social Rules')}</div>
   ${SOCIAL_RULES.map(r=>`<div class="li">${r}</div>`).join('')}</div>`};

/* --- کارت جزئیات یک نفر --- */
window.soPerson=async i=>{
  const p=S.ppl[i];if(!p)return;
  const w=warmth(S,p), o=overdue(S,p), b=balance(S,p.id);
  const ls=(S.inter||[]).filter(x=>x.p===p.id).sort((a,b2)=>dnum(b2.d)-dnum(a.d)).slice(0,6);
  const R=RMAP[p.role];
  const r=await ask({t:p.n,
   s:(RINGS.find(x=>x.k===p.r)||{}).t+(R?' · '+R[2]:'')+' · '+L('گرما','warmth')+' '+fa(w)+'/۱۰۰'
     +(o.d!==undefined?' · '+(o.d===0?L('امروز','today'):fa(o.d)+L(' روز پیش',' d ago')):''),
   ok:L('ثبت تعامل','Log interaction'), del:L('ویرایش','Edit'),
   f:[{k:'_',ty:'text',t:'',v:''}]});
  setTimeout(()=>{},0);
  if(r&&r.__del)return window.soEdit(i);
  if(r)return window.soLog(p.id);
};
window.soQuick=async()=>{
  const P=S.ppl||[];if(!P.length)return;
  const r=await ask({t:L('با چه کسی؟','With whom?'),
   f:[{k:'p',ty:'pick',o:P.map(x=>[x.id,x.n]),v:P[0].id}]});
  if(r&&r.p)window.soLog(r.p)};
window.soLog=async id=>{
  const p=(S.ppl||[]).find(x=>x.id===id)||S.ppl[0];if(!p)return;
  const r=await ask({t:L('ثبت تعامل','Log interaction'),s:p.n,
   f:[{k:'k',t:L('چه نوع؟','Type'),ty:'pick',o:INTER.map(x=>[x[0],x[1]+' '+L(x[2],x[3])]),v:'text'},
      {k:'d',t:L('کی؟','When'),ty:'date',v:td()},
      {k:'n',t:L('یادداشت','Note'),hint:L('اختیاری','optional'),ty:'text',ph:L('چه چیزی یاد گرفتی یا فهمیدی؟','What came out of it?')}]});
  if(!r)return;
  S.inter=S.inter||[];
  S.inter.push({id:'i'+Date.now(),p:p.id,k:r.k,d:r.d||td(),n:r.n||''});
  const g=r.k==='conf'?5:r.k==='deep'||r.k==='meet'?20:10;
  xp(g);sv();rd();tst((IMAP[r.k]||['','◦'])[1]+' +'+fa(g)+' XP')};
window.soEdit=async i=>{
  const p=S.ppl[i];if(!p)return;
  const r=await ask({t:L('ویرایش','Edit')+' — '+p.n, del:L('حذف','Delete'),
   f:[{k:'n',t:L('نام','Name'),ty:'text',v:p.n},
      {k:'r',t:L('حلقه','Ring'),ty:'pick',o:RINGS.map(x=>[x.k,x.t]),v:p.r},
      {k:'role',t:L('نقش در زندگی تو','Role'),ty:'pick',o:ROLES.map(x=>[x[0],x[1]+' '+L(x[2],x[3])]),v:p.role||'peer'},
      {k:'e',t:L('اثر انرژی','Energy'),ty:'pick',o:[['1',L('بالابر','Lifts')],['0',L('خنثی','Neutral')],['-1',L('فرساینده','Drains')]],v:String(p.e||0)}]});
  if(!r)return;
  if(r.__del){S.ppl.splice(i,1);S.inter=(S.inter||[]).filter(x=>x.p!==p.id);sv();rd();return tst(L('حذف شد','Deleted'))}
  p.n=r.n||p.n;p.r=r.r;p.role=r.role;p.e=parseInt(r.e)||0;sv();rd();tst('✓')};

window.addP=async r0=>{const r=await ask({t:L('افزودن شخص','Add person'),
 s:L('فقط کسانی را اضافه کن که واقعاً در مسیر تو نقش دارند.','Only people who actually matter.'),
 f:[{k:'n',t:L('نام','Name'),ty:'text',ph:''},
    {k:'r',t:L('حلقه','Ring'),ty:'pick',o:RINGS.map(x=>[x.k,x.t]),v:r0||'close'},
    {k:'t',t:L('نسبت','Relation'),ty:'chips',o:[L('هم‌تیمی','Teammate'),L('هم‌کلاسی','Classmate'),L('خانواده','Family'),L('دوست','Friend'),L('مربی','Coach')]},
    {k:'role',t:L('نقش در زندگی تو','Role'),ty:'pick',o:ROLES.map(x=>[x[0],x[1]+' '+L(x[2],x[3])]),v:'peer'},
    {k:'e',t:L('بعد از بودن با او، انرژی‌ات…','After being with them…'),ty:'pick',
     o:[['1',L('بیشتر می‌شود','Higher')],['0',L('خنثی','Neutral')],['-1',L('کمتر می‌شود','Lower')]],v:'1'}]});
 if(!r||!r.n)return;
 S.ppl.push({id:'p'+Date.now(),n:r.n,r:r.r||r0||'close',t:r.t||'',role:r.role||'peer',e:parseInt(r.e)||0});
 xp(15);sv();rd();tst('✓ +'+fa(15))};
window.edP=i=>window.soEdit(i);
/* ============ PROGRESS / PHOTOS / JOURNAL ============ */
V.lg=()=>{
  const d=td(),j=S.jr.find(x=>x.d===d);
  const _ht=(()=>{const st=htStats(S),H2=46,W2=200;
    const L2=(S.hts||[]);
    let chart='';
    if(L2.length>1){const vs=L2.map(x=>x.v),mn3=Math.min(...vs),mx3=Math.max(...vs),rg3=Math.max(1,mx3-mn3);
      const pts=L2.map((x,i)=>`${8+i*(W2-16)/Math.max(1,L2.length-1)},${H2-6-((x.v-mn3)/rg3)*(H2-14)}`).join(' ');
      chart=`<svg width="100%" height="${H2}" viewBox="0 0 ${W2} ${H2}" preserveAspectRatio="none">
       <polyline points="${pts}" fill="none" stroke="#fff" stroke-width="1.4"/>
       ${L2.map((x,i)=>`<circle cx="${8+i*(W2-16)/Math.max(1,L2.length-1)}" cy="${H2-6-((x.v-mn3)/rg3)*(H2-14)}" r="1.8" fill="#fff"/>`).join('')}</svg>`;}
    return `<div class="c gl"><div class="ct">↥ ${L('منحنی قد','Height')}<b>${st?fa(st.last)+' cm':'—'}</b></div>
     ${chart||`<div class="empty"><span class="ei">↥</span>${L('دو بار قد را ثبت کن تا منحنی رشد ظاهر شود','Log height twice')}</div>`}
     ${st&&st.perYear!==null?`<div class="gr" style="grid-template-columns:repeat(2,1fr);margin-top:8px">
      <div class="st"><div class="sn"><span>${L('رشد کل','Total')}</span><span class="sv">+${fa(st.grown)} cm</span></div></div>
      <div class="st"><div class="sn"><span>${L('نرخ سالانه','Per year')}</span><span class="sv">${fa(st.perYear)} cm</span></div></div></div>
      ${st.spurt?`<div class="hint" style="color:var(--ink)">${L('در جهش رشدی. خواب و پروتئین الان بیشترین اثر عمرت را دارند.','Growth spurt — sleep and protein matter most now.')}</div>`
        :`<div class="hint">${L('خواب ۸.۵ ساعت و پروتئین کافی، بیشترین چیزی است که در کنترل توست.','Sleep and protein are what you control.')}</div>`}`:''}
     <button class="bt" style="margin-top:8px" onclick="htLog()">${L('ثبت قد','Log height')}</button></div>

  `})();
  const _ya=(()=>{const y=yearAgo(S)||memoryBack(S,90)||memoryBack(S,30);
    if(!y||!y.jr)return '';
    const lbl=y.days?L(fa(y.days)+' روز پیش',y.days+' days ago'):L('یک سال پیش امروز','One year ago today');
    const txt=(y.jr.a&&y.jr.a.filter(Boolean)[0])||'';
    return `<div class="c gl"><div class="ct">◷ ${lbl}</div>
     ${txt?`<div class="cs">«${txt}»</div>`:''}
     <div class="hint">${y.date}${y.jr.m?' · '+L('حال آن روز: ','Mood: ')+fa(y.jr.m)+'/۵':''}</div></div>

  `})();
  const last=S.photos[S.photos.length-1];
  const wl=S.wt.slice(-14),mn2=Math.min(...wl),mx2=Math.max(...wl),rg=Math.max(1,mx2-mn2);
  const W=200,H=54;
  const pts=wl.map((v,i)=>`${8+i*(W-16)/Math.max(1,wl.length-1)},${H-6-((v-mn2)/rg)*(H-16)}`).join(' ');
  const mood7=S.jr.slice(-7);
  return _ya+_ht+`<div class="c gl"><div class="ct">◐ ${L('روند وزن','Weight')}<b>${fa(S.wt[S.wt.length-1])} kg</b></div>
   ${wl.length>1?`<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>
    ${wl.map((v,i)=>`<circle cx="${8+i*(W-16)/Math.max(1,wl.length-1)}" cy="${H-6-((v-mn2)/rg)*(H-16)}" r="1.8" fill="#fff"/>`).join('')}
   </svg>`:`<div class="empty"><span class="ei">◐</span>${L('دو بار وزن را ثبت کن تا روند دیده شود','Log weight twice')}</div>`}
   <button class="bt" style="margin-top:7px" onclick="wt()">${L('ثبت وزن','Log weight')}</button></div>

  <div class="c gl"><div class="ct">▣ ${L('عکس پیشرفت','Progress Photos')}<b>${L('ماهانه','Monthly')}</b></div>
   <div class="cs">${L('همان نور، همان ساعت، همان زاویه. مقایسه فقط با فاصلهٔ ۴ هفته معنا دارد.','Same light, same angle.')}</div>
   ${PHOTO_SLOTS.map(p=>`<div class="rw"><div class="ri">▣</div>
    <div><div class="rt">${p[1]}</div><div class="rd">${p[2]}</div></div></div>`).join('')}
   <button class="bt" style="margin-top:7px" onclick="ph()">${L('ثبت جلسهٔ عکس امروز','Log photo session')}</button>
   <div class="hint">${last?L('آخرین جلسه: ','Last: ')+last.d+' · '+L('مجموع ','total ')+fa(S.photos.length):L('هنوز ثبت نشده. امروز شروع کن — این پایهٔ مقایسه است.','Not started.')}</div>
   <div class="hint">${L('عکس‌ها در گالری خودت می‌مانند؛ اپ فقط تاریخ را ثبت می‌کند. در نسخهٔ اندروید داخل حافظهٔ رمزگذاری‌شدهٔ اپ ذخیره می‌شوند.','Dates only in web version.')}</div></div>

  <div class="c gl"><div class="ct">◈ ${L('حال امروز','Mood')}</div>
   <div style="display:flex;gap:5px">${MOODS.map(m=>`<button class="bt ${j&&j.m===m[0]?'p':''}" style="flex:1;padding:9px 2px;font-size:9.5px" onclick="md('${m[0]}')">
    <div style="font-size:14px">${m[1]}</div>${m[2]}</button>`).join('')}</div>
   <div class="hint" style="margin-top:9px">${L('انرژی بدنی امروز','Physical energy')}</div>
   <div style="display:flex;gap:5px;margin-top:5px">${[1,2,3,4,5].map(n=>`<button class="bt ${j&&+j.en===n?'p':''}" style="flex:1;padding:8px 2px;font-size:11px" onclick="mdEn(${n})">${fa(n)}</button>`).join('')}</div>
   ${mood7.length?`<div style="display:flex;gap:3px;margin-top:10px;align-items:flex-end;height:34px">
    ${mood7.map(x=>`<div style="flex:1;height:${x.m*20}%;background:rgba(255,255,255,.55);border-radius:3px"></div>`).join('')}</div>
    <div class="hint">${L('خلق — هفت روز اخیر','Mood — last 7')}</div>`:''}
   ${(()=>{const e7=S.jr.slice(-7).filter(x=>x.en);
     return e7.length>1?`<div style="display:flex;gap:3px;margin-top:8px;align-items:flex-end;height:26px">
      ${e7.map(x=>`<div style="flex:1;height:${x.en*20}%;background:rgba(255,255,255,.28);border-radius:3px"></div>`).join('')}</div>
      <div class="hint">${L('انرژی — هفت روز اخیر','Energy — last 7')}</div>`:''})()}
   ${(()=>{/* تشخیص روند نزولی پایدار */
     const last7=S.jr.slice(-7).filter(x=>x.m);
     if(last7.length<5)return '';
     const avg=last7.reduce((a,x)=>a+(+x.m||3),0)/last7.length;
     const low=last7.filter(x=>+x.m<=2).length;
     if(low>=5||avg<=2){
       return `<div class="c gl" style="margin-top:10px;border-color:var(--br2);background:rgba(255,255,255,.07)">
        <div class="ct">◈ ${L('یک نکته','A note')}</div>
        <div class="cs">${L('پنج روز از هفت روز گذشته حالت پایین بوده. این یک عدد است، نه قضاوت.','Low mood 5 of 7 days.')}</div>
        <div class="hint">${L('اگر بیش از دو هفته ادامه داشت، با یک بزرگ‌تر که بهش اعتماد داری حرف بزن — پدر، مادر، یا مشاور مدرسه. این نشانهٔ ضعف نیست؛ مثل درد زانوست که به فیزیوتراپ می‌گویی.','If this lasts 2+ weeks, talk to a trusted adult.')}</div>
        <div class="hint">${L('چیزهایی که کوتاه‌مدت کمک می‌کنند: نور آفتاب صبح، حرکت بدنی، خواب منظم، و حرف زدن با یک نفر.','Short-term: morning light, movement, sleep, talking.')}</div></div>`}
     return ''})()}</div>

  <div class="c gl"><div class="ct">✎ ${L('ژورنال','Journal')}<b>${fa(S.jr.length)} ${L('ثبت','entries')}</b></div>
   ${JPROMPTS.map((p,i)=>`<div class="rw" onclick="jw(${i})"><div class="ri">${fa(i+1)}</div>
    <div class="rt">${p}</div><div class="rx">${j&&j.a&&j.a[i]?'✓':'+'}</div></div>`).join('')}
   ${j&&j.a?`<div class="hint">${j.a.filter(Boolean).map((x,i)=>'— '+x).join('<br>')}</div>`:''}</div>

  <div class="c gl"><div class="ct">◉ ${L('نردبان آشپزی','Cooking Ladder')}<b>${fa(S.cook.length)}/${fa(COOK.length)}</b></div>
   <div class="bar" style="margin-bottom:10px"><div class="bf" style="width:${S.cook.length/COOK.length*100}%"></div></div>
   ${COOK.map((c,i)=>`<div class="rw ${S.cook.includes(i)?'done':''}" onclick="ck(${i})">
    <div class="ri">${'◦'.repeat(1)}</div><div><div class="rt">${c[0]}</div>${c[1]?`<div class="rd">${c[1]}</div>`:''}</div>
    <div class="rx">${L('سطح','L')} ${fa(c[2])}</div></div>`).join('')}</div>`};
window.ph=()=>{S.photos.push({d:jStr()});xp(25);sv();rd();tst('▣ ✓')};
window.md=m=>{const d=td();let j=S.jr.find(x=>x.d===d);
 if(!j){j={d,m,a:[]};S.jr.push(j)}else j.m=m;sv();rd()};
window.mdEn=n=>{const d=td();let j=S.jr.find(x=>x.d===d);
 if(!j){j={d,m:'3',en:n,a:[]};S.jr.push(j)}else j.en=n;sv();rd()};
window.jw=async i=>{const d=td();let j=S.jr.find(x=>x.d===d);
 if(!j){j={d,m:'3',a:[]};S.jr.push(j)}
 const r=await ask({t:L('ژورنال','Journal'),s:JPROMPTS[i],f:[{k:'v',ty:'area',v:(j.a&&j.a[i])||'',ph:''}]});
 if(r){j.a=j.a||[];j.a[i]=r.v;if(r.v)xp(10);sv();rd()}};
window.ck=i=>{const x=S.cook.indexOf(i);
 if(x>-1){S.cook.splice(x,1);xp(-30)}else{S.cook.push(i);xp(30);tst('◉ +'+fa(30))}sv();rd()};

/* ============ ADAPTIVE ============ */
V.ad=()=>{
  const p=plan(),d=td();
  const rate=p.length?p.filter(x=>S.done[d+'|'+x.id]).length/p.length:0;
  if(!S.hist.find(x=>x.d===d))S.hist.push({d,rate});
  else S.hist.find(x=>x.d===d).rate=rate;
  if(S.hist.length>60)S.hist=S.hist.slice(-60);sv();
  const h14=S.hist.slice(-14);
  const sug=adapt(S.hist);
  const qd=QUESTS.filter(q=>S.q[d+'|'+q[0]]).length;
  return `<div class="c gl"><div class="ct">◆ ${L('موتور تطبیق','Adaptive Engine')}<b>${fa(Math.round(rate*100))}٪ ${L('امروز','today')}</b></div>
   <div class="cs">${L('برنامه بر اساس عملکرد واقعی تو بازنویسی می‌شود، نه بر اساس فرض اولیه.','Rewrites from real data.')}</div>
   ${h14.length>1?`<div style="display:flex;gap:2.5px;align-items:flex-end;height:44px;margin-bottom:9px">
    ${h14.map(x=>`<div style="flex:1;height:${Math.max(5,x.rate*100)}%;background:rgba(255,255,255,${.25+x.rate*.7});border-radius:2px"></div>`).join('')}</div>
    <div class="hint">${L('۱۴ روز اخیر','Last 14 days')}</div>`:''}
   ${sug.map(s=>`<div class="rw"><div class="ri">◆</div><div><div class="rt">${s[0]}</div><div class="rd">${s[1]}</div></div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◇ ${L('خلاصهٔ امروز','Today')}</div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr)">
    <div class="sk"><div class="skn">${fa(qd)}</div><div class="skl">${L('کوئست','quests')}</div></div>
    <div class="sk"><div class="skn">${fa(S.streak.clean||0)}</div><div class="skl">${L('پاکی','clean')}</div></div>
    <div class="sk"><div class="skn">${fa(S.xp)}</div><div class="skl">XP</div></div></div></div>

  <div class="c gl"><div class="ct">◈ ${L('مربی هوشمند','AI Coach')}</div>
   <div class="hint">${L('با اتصال کلید API، این موتور از قوانین ثابت به تحلیل واقعی ارتقا می‌یابد: بازنویسی خودکار بلوک‌ها، گزارش شبانه، و مداخلهٔ گفتگویی. داده روی دستگاه می‌ماند.','Connect API key to upgrade.')}</div>
   <button class="bt" style="margin-top:8px" onclick="tst('${L('فاز نیتیو','Native phase')}')">${L('افزودن کلید API','Add API key')}</button></div>`};


/* ============ TRAINING ============ */
V.gy=()=>{
  const d=td(), dow=new Date().getDay();
  const isFoot=[0,2,4].includes(dow) && !(S.season==='school'&&dow===2);
  const hk = dow===1?'up':dow===3?'low':dow===6?'full':null;
  const H = hk?HOME[hk]:null;
  const LIST = S.gymMode? GYM_LIFTS : LIFTS;
  const sug=l=>overload(S.lifts[l]||[], !S.gymMode);
  const load=S.wo.filter(w=>(Date.now()-new Date(w.t))/864e5<=7).length;
  const avg=S.wo.length?S.wo.length/Math.max(1,Math.ceil((Date.now()-new Date(S.wo[0].t))/6048e5)):0;
  const risk=avg>0&&load>avg*1.4;
  return `<div class="c gl"><div class="ct">⚽ ${L('امروز','Today')}<b>${CLUB}</b></div>
   ${isFoot?`<div class="rw crisis"><div class="ri">⚽</div><div><div class="rt">${L('باشگاه فوتبال','Football practice')}</div>
     <div class="rd">۱۴:۰۰–۱۵:۳۰ · ${L('گاهی تا ۱۷:۳۰','sometimes to 17:30')}</div></div></div>`
   :H?`<div class="rw"><div class="ri">◈</div><div><div class="rt">${L('تمرین خانگی','Home workout')} — ${H.t}</div>
     <div class="rd">۱۷:۰۰–۱۷:۴۰</div></div></div>`
   :`<div class="rw"><div class="ri">◇</div><div><div class="rt">${L('روز ریکاوری','Recovery day')}</div>
     <div class="rd">${L('پیاده‌روی، کشش، خواب','Walk, stretch, sleep')}</div></div></div>`}
   ${risk?`<div class="rw crisis" style="margin-top:6px"><div class="ri">⚠</div><div><div class="rt">${L('بار تمرینی بالا','High load')}</div>
    <div class="rd">${L('این هفته بیش از ۴۰٪ فراتر از میانگین. یک جلسه سبک کن.','40% above average.')}</div></div></div>`:''}
   <div class="hint">${L('برنامهٔ هفته: یکشنبه، سه‌شنبه، پنجشنبه فوتبال · دوشنبه، چهارشنبه، شنبه تمرین خانگی · جمعه ریکاوری','Weekly split')}</div></div>

  ${H?`<div class="c gl"><div class="ct">◈ ${L('تمرین خانگی','Home Workout')} — ${H.t}</div>
   <div class="cs">${HOME_NOTE}</div>
   ${H.ex.map((e,i)=>`<div class="rw ${S.ft.includes(d+'|h'+i)?'done':''}" onclick="dr('h${i}')">
    <div class="ri">◦</div><div class="rt">${e[0]}</div><div class="rx">${e[1]}</div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">▤ ${L('دفترچهٔ تمرین','Training Log')}
   <b>${S.gymMode?L('وزنه','Weights'):L('وزن بدن','Bodyweight')}</b></div>
   <div class="cs">${S.gymMode?L('حالت باشگاه بدن‌سازی','Gym mode'):L('اضافه‌بار از راه تکرار و ست — در سن تو ایمن‌تر از وزنهٔ سنگین است.','Overload via reps and sets.')}</div>
   ${LIST.map(l=>{const hh=S.lifts[l[0]]||[],s=sug(l[0]),last=hh[hh.length-1];
    return `<div class="rw" onclick="wlog('${l[0]}')"><div class="ri">${hh.length?fa(hh.length):'+'}</div>
     <div><div class="rt">${l[1]}</div><div class="rd">${last?
       L('آخرین: ','last: ')+(S.gymMode?fa(last.w)+'kg × ':'')+fa(last.r)+(s?' → '+L('هدف: ','next: ')+(S.gymMode?fa(s.w)+'kg × ':'')+fa(s.r)+(s.s?L(' × '+fa(s.s)+' ست',''):''):'')
       :L('هنوز ثبت نشده','not logged')}</div></div>
     <div class="rx">${last?(S.gymMode?fa(last.w)+'kg':fa(last.r)+'×'):'—'}</div></div>`}).join('')}
   <button class="bt" style="margin-top:7px" onclick="S.gymMode=S.gymMode?0:1;sv();rd()">
    ${S.gymMode?L('برگشت به وزن بدن','Back to bodyweight'):L('اگر بعداً باشگاه بدن‌سازی رفتی، اینجا بزن','Enable gym mode')}</button></div>

  <div class="c gl"><div class="ct">⚽ ${L('تمرین انفرادی فوتبال','Solo Drills')}</div>
   <div class="cs">${L('برای پست‌های تو — با یک دیوار و یک توپ','For your positions')}</div>
   ${DRILLS.map((x,i)=>`<div class="rw ${S.ft.includes(d+'|'+i)?'done':''}" onclick="dr(${i})">
    <div class="ri">◦</div><div><div class="rt">${x[0]}</div><div class="rd">${x[1]}</div></div>
    <div class="rx">${x[2]}</div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◇ ${L('تست‌های دوره‌ای','Fitness Tests')}<b>${L('هر ۶ هفته','every 6w')}</b></div>
   ${FTESTS.map(t=>{const hh=(S.fit||[]).filter(x=>x.k===t[0]);const last=hh[hh.length-1],prev=hh[hh.length-2];
    const dl=last&&prev?(last.v-prev.v):null;
    return `<div class="rw" onclick="ftl('${t[0]}','${t[1]}','${t[2]}')"><div class="ri">◇</div>
     <div><div class="rt">${t[1]}</div><div class="rd">${t[3]}</div></div>
     <div class="rx">${last?fa(last.v)+' '+t[2]+(dl?(dl>0?' ▲':' ▽'):''):'+'}</div></div>`}).join('')}</div>

  <div class="c gl"><div class="ct">⚑ ${L('آمار مسابقه','Match Stats')}<b>${fa(S.ms.length)}</b></div>
   <button class="bt p" onclick="mlog()">${L('ثبت مسابقهٔ جدید','Log a match')}</button>
   ${S.ms.length?`<div style="margin-top:9px">${S.ms.slice(-5).reverse().map(m=>`<div class="rw">
    <div class="ri">${m.rate>=7?'▲':m.rate>=5?'◈':'▽'}</div><div><div class="rt">${m.date} · ${m.pos||''}</div>
    <div class="rd">${fa(m.min||0)}${L(' دقیقه',' min')} · ${L('پاس','pass')} ${fa(m.pass||0)}٪ · ${L('توپ‌گیری','tackles')} ${fa(m.tack||0)}</div></div>
    <div class="rx">${fa(m.rate||0)}/۱۰</div></div>`).join('')}
    <div class="hint">${L('میانگین امتیاز','Avg rating')}: ${fa((S.ms.reduce((a,m)=>a+ +(m.rate||0),0)/S.ms.length).toFixed(1))}</div></div>`:''}</div>`};
window.wlog=async l=>{const f=[];
 if(S.gymMode)f.push({k:'w',t:L('وزنه','Weight'),ty:'num',v:0,st:2.5,min:0,u:'kg'});
 f.push({k:'r',t:L('تکرار (یا ثانیه)','Reps or seconds'),ty:'num',v:12,st:1,min:1,max:300});
 f.push({k:'s',t:L('چند ست','Sets'),ty:'num',v:3,st:1,min:1,max:12});
 const r=await ask({t:l,s:L('آخرین رکورد را بزن یا یکی بالاتر برو.','Match or beat your last set.'),f});
 if(!r||!(r.r>0))return;
 S.lifts[l]=S.lifts[l]||[];S.lifts[l].push({w:r.w||0,r:r.r,s:r.s||3,t:Date.now()});
 S.wo.push({d:td(),t:Date.now(),l});xp(20);sv();rd();tst('▤ +'+fa(20))};
window.dr=i=>{const k=td()+'|'+i;const x=S.ft.indexOf(k);
 if(x>-1){S.ft.splice(x,1);xp(-10)}else{S.ft.push(k);xp(10)}sv();rd()};
window.ftl=async(k,n,u)=>{const r=await ask({t:n,s:L('واحد','Unit')+': '+u,
 f:[{k:'v',ty:'num',v:'',st:.5,min:0,u}]});
 if(!r||!(r.v>0))return;S.fit=S.fit||[];S.fit.push({k,v:r.v,d:jStr()});
 if(k==='height')P.h=r.v;
 xp(30);sv();rd();tst('◇ +'+fa(30))};
window.mlog=async()=>{const r=await ask({t:L('ثبت بازی','Log match'),
 s:L('بعد از هر بازی، هرچه تازه است ثبت کن.','Log right after the match.'),
 f:[{k:'pos',t:L('پست','Position'),ty:'chips',o:['GK','CB','LB','RB','CDM','CM','CAM','LW','RW','ST'],v:'CDM'},
    {k:'min',t:L('دقیقهٔ بازی','Minutes'),ty:'num',v:90,st:5,min:0,max:120},
    {k:'pass',t:L('پاس موفق','Pass accuracy'),ty:'num',v:80,st:5,min:0,max:100,u:'٪'},
    {k:'tack',t:L('توپ‌گیری','Tackles'),ty:'num',v:0,st:1,min:0,max:50},
    {k:'goal',t:L('گل','Goals'),ty:'num',v:0,st:1,min:0,max:20},
    {k:'asst',t:L('پاس گل','Assists'),ty:'num',v:0,st:1,min:0,max:20},
    {k:'rate',t:L('امتیاز به خودت','Self rating'),ty:'num',v:6,st:.5,min:1,max:10}]});
 if(!r)return;S.ms.push({date:jStr(),...r});xp(40);sv();rd();tst('⚑ +'+fa(40))};
/* ============ NUTRITION ============ */
V.nu=()=>{
  const d=td();
  const tp=(S.prot[d]||[]).reduce((a,x)=>a+x.p,0);
  const tc=(S.prot[d]||[]).reduce((a,x)=>a+x.c,0);
  return `<div class="c gl"><div class="ct">◱ ${L('لیست خرید','Shopping')}<b>${fa(shopCount(S).got)}/${fa(shopCount(S).total)}</b></div>
   <div class="cs">${L('دسته‌بندی بر اساس قفسهٔ فروشگاه تا دوبار نچرخی.','Grouped by aisle.')}</div>
   ${Object.keys(SHOP).map(cat=>`<div class="hint" style="margin-top:9px;color:var(--dim)">${cat}</div>
    ${shopList(S).filter(x=>x.cat===cat).map(x=>`<div class="rw ${x.on?'done':''}" onclick="shopTg('${x.id}')">
      <div class="ri">${x.on?'✓':'○'}</div><div class="rt">${x.t}</div></div>`).join('')}`).join('')}
   <button class="bt" style="margin-top:9px" onclick="shopClear()">${L('پاک کردن تیک‌ها','Clear')}</button>
   <div class="hint">${L('کدو و بادمجان هرگز در این فهرست نمی‌آید.','Never listed: zucchini, eggplant.')}</div></div>

  <div class="c gl"><div class="ct">■ ${L('پروتئین امروز','Protein')}<b>${fa(tp)} / ${fa(PROTEIN_TARGET)} g</b></div>
   <div class="cs">${L('کالری نمی‌شماریم — در سن تو وسواس‌آور است. فقط پروتئین.','No calorie counting at your age.')}</div>
   <div class="bar" style="height:6px"><div class="bf" style="width:${Math.min(100,tp/PROTEIN_TARGET*100)}%"></div></div>
   <div class="hint">${tp>=PROTEIN_TARGET?L('هدف زده شد.','Target hit.'):L('باقی‌مانده: ','Remaining: ')+fa(PROTEIN_TARGET-tp)+'g · '+fa(tc)+L(' کالری',' kcal')}</div></div>

  <div class="c gl"><div class="ct">${L('افزودن غذا','Add food')}</div>
   ${FOODDB.map((f,i)=>`<div class="rw" onclick="fd(${i})"><div class="ri">■</div>
    <div><div class="rt">${f[0]}</div><div class="rd">${fa(f[2])} ${L('کالری','kcal')}</div></div>
    <div class="rx">${fa(f[1])}g</div></div>`).join('')}</div>

  ${(S.prot[d]||[]).length?`<div class="c gl"><div class="ct">${L('امروز خوردی','Eaten today')}</div>
   ${S.prot[d].map((x,i)=>`<div class="rw" onclick="fdd(${i})"><div class="ri">◦</div>
    <div class="rt">${x.n}</div><div class="rx">${fa(x.p)}g</div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">◉ ${L('لیست خرید','Shopping List')}</div>
   <div class="cs">${L('بر اساس نردبان آشپزی و نیاز پروتئینی','From your cooking ladder')}</div>
   ${['تخم‌مرغ (۲ شانه)','سینهٔ مرغ (۲ کیلو)','ماست و پنیر','عدس و لوبیا','برنج و نان سبوس‌دار',
      'موز، خرما، گردو','سبزیجات تازه برای سالاد','شیر (۶ پاکت)']
    .map(x=>`<div class="rw"><div class="ri">◦</div><div class="rt">${x}</div></div>`).join('')}</div>`};
window.fd=i=>{const d=td(),f=FOODDB[i];S.prot[d]=S.prot[d]||[];
 S.prot[d].push({n:f[0],p:f[1],c:f[2]});sv();rd()};
window.fdd=i=>{const d=td();S.prot[d].splice(i,1);sv();rd()};

/* ============ WARDROBE ============ */
V.wd=()=>{
  const byc={};(S.wr||[]).forEach(w=>{byc[w.c]=byc[w.c]||[];byc[w.c].push(w)});
  const pick=()=>{const t=(byc.top||[]),b=(byc.bot||[]),s=(byc.shoe||[]);
   if(!t.length||!b.length)return null;
   const r=n=>n[Math.floor(Math.random()*n.length)];
   return [r(t),r(b),s.length?r(s):null].filter(Boolean)};
  const o=pick();
  return `<div class="c gl"><div class="ct">▭ ${L('ست امروز','Outfit')}<b>${L('کلاسیک','Classic')}</b></div>
   ${o?`${o.map(x=>`<div class="rw"><div class="ri">▭</div><div><div class="rt">${x.n}</div>
    <div class="rd">${x.col} · ${(WCAT.find(c=>c[0]===x.c)||[])[1]}</div></div></div>`).join('')}
    <button class="bt" style="margin-top:7px" onclick="rd()">${L('پیشنهاد دیگر','Another')}</button>`
   :`<div class="hint">${L('برای پیشنهاد ست، حداقل یک بالاتنه و یک پایین‌تنه اضافه کن.','Add items first.')}</div>`}</div>

  <div class="c gl"><div class="ct">◫ ${L('کمد دیجیتال','Wardrobe')}<b>${fa((S.wr||[]).length)}</b></div>
   ${WCAT.map(c=>`<div class="rw" onclick="wadd('${c[0]}')"><div class="ri">${fa((byc[c[0]]||[]).length)}</div>
    <div class="rt">${c[1]}</div><div class="rx">+</div></div>`).join('')}
   ${(S.wr||[]).length?`<div style="margin-top:8px">${S.wr.map((w,i)=>`<div class="rw" onclick="wdel(${i})">
    <div class="ri">▭</div><div><div class="rt">${w.n}</div><div class="rd">${w.col}</div></div>
    <div class="rx">×</div></div>`).join('')}</div>`:''}</div>

  <div class="c gl"><div class="ct">◆ ${L('قوانین ست','Outfit Rules')}</div>
   ${OUTFIT_RULES.map(r=>`<div class="li">${r}</div>`).join('')}</div>

  <div class="c gl"><div class="ct">◈ ${L('محصولات پوست','Skincare')}</div>
   <div class="cs">${L('پوست خشک — مرطوب‌کننده اولویت اول','Dry skin')}</div>
   ${SKINP.map((p,i)=>{const b=(S.sk||{})[i];const left=b?Math.max(0,p[2]-Math.floor((Date.now()-b)/864e5)):null;
    return `<div class="rw" onclick="skb(${i})"><div class="ri">◈</div>
    <div><div class="rt">${p[0]}</div><div class="rd">${p[1]}</div></div>
    <div class="rx">${left!==null?(left?fa(left)+L(' روز',' d'):L('تمام','out')):L('ثبت','set')}</div></div>`}).join('')}</div>`};
window.wadd=async c=>{const r=await ask({t:L('افزودن قطعه','Add item'),
 f:[{k:'n',t:L('نام قطعه','Item'),ty:'text',ph:''},
    {k:'col',t:L('رنگ','Color'),ty:'pick',o:WCOLORS,v:WCOLORS[0]}]});
 if(!r||!r.n)return;S.wr=S.wr||[];S.wr.push({c,n:r.n,col:r.col||WCOLORS[0]});sv();rd();tst('✓')};
window.wdel=async i=>{const it=S.wr[i];if(!it)return;
 if(await askYes(L('حذف «'+it.n+'»؟','Delete?'),'',L('حذف','Delete'))){S.wr.splice(i,1);sv();rd()}};
window.skb=i=>{S.sk=S.sk||{};S.sk[i]=Date.now();sv();rd();tst('✓')};

/* ============ ACHIEVEMENTS / BOSS / TREE ============ */
V.ac=()=>{
  ACH.forEach(a=>{if(!S.ach.includes(a[0])&&a[4](S)){S.ach.push(a[0]);sv()}});
  const b=S.boss!==null&&S.boss!==undefined?BOSS[S.boss]:null;
  const y=new Array(365).fill(0);
  Object.keys(S.done).forEach(k=>{const dd=Math.floor((Date.now()-new Date(k.split('|')[0]))/864e5);
   if(dd>=0&&dd<365)y[364-dd]++});
  const mxy=Math.max(1,...y);
  return `<div class="c gl"><div class="ct">★ ${L('دستاوردها','Achievements')}<b>${fa(S.ach.length)}/${fa(ACH.length)}</b></div>
   <div class="bar" style="margin-bottom:10px"><div class="bf" style="width:${S.ach.length/ACH.length*100}%"></div></div>
   <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
   ${ACH.map(a=>{const g=S.ach.includes(a[0]);
    return `<div class="ach ${g?'got':''}" title="${a[3]}"><i>${g?a[1]:'○'}</i><b>${g?a[2]:'؟'}</b></div>`}).join('')}</div>
   <div class="hint">${L('نشان‌های قفل با انجام کارهای خاص باز می‌شوند.','Locked badges unlock automatically.')}</div></div>

  <div class="c gl"><div class="ct">⛊ ${L('باس‌فایت ماهانه','Monthly Boss')}</div>
   ${b?`<div class="big">${b.t}</div><div class="cs" style="text-align:center;margin-top:7px">${b.d}</div>
    <div class="hint" style="text-align:center">+${fa(b.xp)} XP · ${fa(b.days)} ${L('روز','days')}</div>
    <div style="display:flex;gap:6px;margin-top:9px">
     <button class="bt p" onclick="bossWin()">${L('شکستش دادم','Defeated')}</button>
     <button class="bt" onclick="S.boss=null;sv();rd()">${L('انصراف','Abandon')}</button></div>`
   :`<div class="cs">${L('یک باس انتخاب کن. یک ماه وقت داری.','Pick one. 30 days.')}</div>
    ${BOSS.map((x,i)=>`<div class="rw" onclick="S.boss=${i};sv();rd()"><div class="ri">⛊</div>
     <div><div class="rt">${x.t}</div><div class="rd">${x.d}</div></div><div class="rx">+${fa(x.xp)}</div></div>`).join('')}`}</div>

  <div class="c gl"><div class="ct">▦ ${L('سال تو','Your Year')}<b>${fa(Object.keys(S.done).length)} ${L('بلوک','blocks')}</b></div>
   <div class="yr">${y.map(v=>`<i style="background:rgba(255,255,255,${v?.15+Math.min(.8,v/mxy*.8):.05})"></i>`).join('')}</div>
   <div class="hint">${L('هر خانه یک روز. هرچه روشن‌تر، پرکارتر. زنجیره را نشکن.','Each cell is a day.')}</div></div>

  <div class="c gl"><div class="ct">✉ ${L('کپسول زمان','Time Capsule')}</div>
   <div class="cs">${L('به خودت در ۱۸ سالگی بنویس. در ۱۱ مهر '+fa(P.birth[0]+18)+' باز می‌شود.','Letter to your 18-year-old self.')}</div>
   <button class="bt" onclick="tc()">${S.cap?L('نامه ثبت شده — ویرایش','Edit letter'):L('نوشتن نامه','Write')}</button>
   ${S.cap?`<div class="hint">${L('نوشته شده در','Written')} ${S.capd||jStr()}</div>`:''}</div>`};
window.tn=i=>{const x=S.tree.indexOf(i);
 if(x>-1){S.tree.splice(x,1);xp(-60)}else{S.tree.push(i);xp(60);tst('◇ +'+fa(60))}sv();rd()};
window.bossWin=()=>{const b=BOSS[S.boss];if(!b)return;xp(b.xp);tst('⛊ +'+fa(b.xp));S.boss=null;sv();rd()};
window.tc=async()=>{const r=await ask({t:L('کپسول زمان','Time capsule'),
 s:L('این نامه در ۱۱ مهر ۱۴۰۸ باز می‌شود — روز ۱۸ سالگی تو.','Opens on your 18th birthday.'),
 f:[{k:'v',ty:'area',v:S.cap||'',ph:L('به خودت در ۱۸ سالگی چه می‌گویی؟','What do you tell your 18-year-old self?')}]});
 if(r&&r.v){S.cap=r.v;S.capd=jStr();sv();rd();tst('✉ ✓')}};
/* ============ INSIGHT / SIMULATOR / MIRROR ============ */
V.iq=()=>{
  const pt=patterns(S),sm=simulate(S);
  const d=td();const mq=MIRROR[new Date().getDate()%MIRROR.length];
  return `<div class="c gl"><div class="ct">◈ ${L('آینه','Mirror')}<b>${L('صبح','morning')}</b></div>
   <div class="big" style="font-size:14px;line-height:1.7;text-align:right">${mq}</div>
   <button class="bt" style="margin-top:9px" onclick="mir()">${S.mir[d]?L('پاسخ ثبت شد — ویرایش','Answered'):L('پاسخ بده','Answer')}</button>
   ${S.mir[d]?`<div class="hint">${S.mir[d]}</div>`:''}</div>

  <div class="c gl"><div class="ct">◆ ${L('الگوهای کشف‌شده','Patterns')}</div>
   <div class="cs">${L('اپ داده‌های تو را تحلیل می‌کند، نه پند می‌دهد.','Analysis, not advice.')}</div>
   ${pt.map(p=>`<div class="rw"><div class="ri">◆</div><div><div class="rt">${p[0]}</div>
    <div class="rd">${p[1]}</div></div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◇ ${L('شبیه‌ساز مسیر','Trajectory')}</div>
   <div class="cs">${L('بر اساس نرخ تکمیل واقعی تو در ۱۴ روز اخیر','From your real completion rate')}</div>
   ${sm.map(s=>`<div class="rw"><div class="ri">${fa(s.y)}${L('س','y')}</div>
    <div><div class="rt">${fa(s.age)} ${L('سالگی','yrs')} · ~${fa(s.h)}cm · ~${fa(s.w)}kg · LVL ${fa(s.lv)}</div>
    <div class="rd">${s.d}</div></div></div>`).join('')}
   <div class="hint">${L('این پیش‌بینی تقریبی است، نه قطعی. متغیر اصلی ژنتیک است — ولی تنها متغیری که کنترل می‌کنی رفتار توست.','Estimate only.')}</div></div>

  <div class="c gl"><div class="ct">◉ ${L('خودت در برابر ماه پیش','You vs Last Month')}</div>
   ${(()=>{const now=S.hist.slice(-30),prev=S.hist.slice(-60,-30);
    const a=now.length?now.reduce((x,y)=>x+y.rate,0)/now.length:0;
    const b=prev.length?prev.reduce((x,y)=>x+y.rate,0)/prev.length:0;
    const dl=Math.round((a-b)*100);
    return `<div class="gr" style="grid-template-columns:repeat(2,1fr)">
     <div class="sk"><div class="skn">${fa(Math.round(a*100))}٪</div><div class="skl">${L('این ماه','this month')}</div></div>
     <div class="sk"><div class="skn">${fa(Math.round(b*100))}٪</div><div class="skl">${L('ماه پیش','last month')}</div></div></div>
     <div class="hint">${b?(dl>0?L('▲ '+fa(dl)+'٪ بهتر از ماه پیش. تنها رقیب سالم، خودت هستی.','Better'):dl<0?L('▽ '+fa(Math.abs(dl))+'٪ افت. چه چیزی عوض شد؟','Down'):L('بدون تغییر','Same')):L('برای مقایسه به دو ماه داده نیاز است.','Need 2 months.')}</div>`})()}</div>

  <div class="c gl"><div class="ct">◔ ${L('گزارش شبانه','Nightly Report')}<b>۲۰:۴۵</b></div>
   ${(()=>{const p=plan(),r=p.length?p.filter(x=>S.done[d+'|'+x.id]).length/p.length:0;
    const qd=QUESTS.filter(q=>S.q[d+'|'+q[0]]).length;
    return `<div class="gr" style="grid-template-columns:repeat(3,1fr)">
     <div class="sk"><div class="skn">${fa(Math.round(r*100))}٪</div><div class="skl">${L('بلوک','blocks')}</div></div>
     <div class="sk"><div class="skn">${fa(qd)}</div><div class="skl">${L('کوئست','quests')}</div></div>
     <div class="sk"><div class="skn">${fa(S.streak.clean)}</div><div class="skl">${L('پاکی','clean')}</div></div></div>
     <div class="hint">${r>=.8?L('روز قوی. همین را تکرار کن.','Strong day.'):r>=.5?L('روز متوسط. یک بلوک بیشتر، فردا فرق می‌کند.','Average.'):L('روز ضعیف. فردا فقط سه کار حیاتی را بزن.','Weak day — reset tomorrow.')}</div>`})()}</div>`};
window.mir=async()=>{const d=td();const q=MIRROR[new Date().getDate()%MIRROR.length];
 const r=await ask({t:L('آینه','Mirror'),s:q,f:[{k:'v',ty:'area',v:S.mir[d]||'',ph:''}]});
 if(r&&r.v){S.mir[d]=r.v;xp(10);sv();rd();tst('◈ ✓')}};
/* ============ CRISIS / PANIC ============ */
V.cr=()=>`<div class="c gl ${S.crisis?'crisis':''}"><div class="ct">⛨ ${L('حالت بحران','Crisis Mode')}</div>
  <div class="cs">${L('برای روزهایی که همه‌چیز خراب است. کل برنامه به سه کار حداقلی کاهش می‌یابد. این شکست نیست — این بقا است.','Reduces everything to 3 essentials.')}</div>
  ${S.crisis?`${CRISIS_MIN.map(c=>`<div class="rw"><div class="ri">${c[0]}</div>
   <div><div class="rt">${c[1]}</div><div class="rd">${c[2]}</div></div></div>`).join('')}
   <button class="bt" style="margin-top:8px" onclick="S.crisis=0;sv();rd()">${L('برگشت به برنامهٔ عادی','Exit crisis mode')}</button>`
  :`<button class="bt" onclick="S.crisis=1;sv();rd();tst('⛨')">${L('فعال‌سازی','Activate')}</button>`}
  <div class="hint">${L('بدون این حالت، یک روز بد کل سیستم را می‌شکند. استریک‌ها در حالت بحران متوقف می‌شوند نه صفر.','Streaks pause, not reset.')}</div></div>

 <div class="c gl"><div class="ct">▲ ${L('دکمهٔ پانیک','Panic Button')}</div>
  <div class="cs">${L('لحظهٔ وسوسه. به ترتیب انجام بده. از بالا.','In the moment. In order.')}</div>
  ${PANIC.map(p=>`<div class="pan"><b>${fa(p[0])}</b>${p[1]}
   <div class="rd" style="margin-top:3px">${p[2]}</div></div>`).join('')}
  <button class="bt p" onclick="pt0()">${L('شروع تایمر ۱۰ دقیقه','Start 10 min timer')}</button>
  <div id="ptm" class="big" style="margin-top:10px"></div></div>

 <div class="c gl"><div class="ct">◆ ${L('دلیل تو','Your Why')}</div>
  <div class="big" style="font-size:13px;line-height:1.85;text-align:right">${S.why||WHY}</div>
  <button class="bt" style="margin-top:9px" onclick="wy()">${L('ویرایش','Edit')}</button></div>

 <div class="c gl"><div class="ct">◈ ${L('شریک پاسخگو','Accountability')}</div>
  <div class="cs">${L('قوی‌ترین مکانیزم موجود. اختیاری.','Strongest mechanism. Optional.')}</div>
  <div class="hint">${L('در نسخهٔ اندروید: گزارش هفتگی خودکار به یک نفر مورد اعتماد. فقط آمار کلی، بدون جزئیات خصوصی.','Weekly summary to a trusted person.')}</div></div>`;
window.pt0=()=>{let t=600;const e=document.getElementById('ptm');
 const i=setInterval(()=>{t--;if(e)e.textContent=fa(Math.floor(t/60))+':'+fa(String(t%60).padStart(2,'0'));
  if(t<=0){clearInterval(i);if(e)e.textContent='✓';tst(L('گذشت. قوی‌تر شدی.','You made it.'))}},1000)};
window.wy=async()=>{const r=await ask({t:L('دلیل تو','Your why'),
 s:L('وقتی انگیزه نیست، این جمله کار را انجام می‌دهد.','When motivation is gone, this does the work.'),
 f:[{k:'v',ty:'area',v:S.why||WHY,ph:''}]});
 if(r&&r.v){S.why=r.v;sv();rd();tst('✓')}};
/* ============ NATIVE ROADMAP ============ */
V.nt=()=>`<div class="c gl"><div class="ct">◫ ${L('قابلیت‌های نسخهٔ اندروید','Native Features')}</div>
 <div class="cs">${L('این‌ها در مرورگر ممکن نیستند و در فاز APK پیاده می‌شوند.','Require the native app.')}</div>
 ${NATIVE.map(n=>`<div class="rw"><div class="ri">${n[0]}</div>
  <div><div class="rt">${n[1]}</div><div class="rd">${n[2]}</div></div></div>`).join('')}
 <div class="hint">${L('نسخهٔ فعلی وب، منطق و داده را کامل پیاده کرده است. فاز بعد: Kotlin + Compose با شیشهٔ Kyant0، و بیلد APK با GitHub Actions.','Next: Kotlin + Compose.')}</div></div>`;


