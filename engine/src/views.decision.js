/* ============ DECISION VIEW — ضعف اصلی: تصمیم‌گیری ============ */

V.dec = () => {
  const s = decScore(S);
  const today = decToday(S);
  const done = S.decDrill || [];
  const PART = { scan: 'اطلاعات', option: 'گزینه‌ها', speed: 'سرعت' };

  return `<div class="c gl"><div class="ct">◈ ${L('تصمیم‌گیری', 'Decision')}<b>${s.rank}</b></div>
   <div class="cs">${L('مربی گفت «پاس به بازیکن اشتباه». این مشکل پا نیست — مشکل این است که قبل از رسیدن توپ چه دیده‌ای.',
     'Not a technique problem.')}</div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr);margin:var(--sp3) 0">
    <div class="st"><div class="sn"><span>${L('اسکن', 'Scan')}</span>
      <span class="sv">${s.scan ? fa(s.scan.avg) : '—'}</span></div>
     <div class="bar"><div class="bf" style="width:${s.scanPc}%"></div></div></div>
    <div class="st"><div class="sn"><span>${L('دقت پاس', 'Pass')}</span>
      <span class="sv">${s.acc ? fa(s.acc.pc) + '٪' : '—'}</span></div>
     <div class="bar"><div class="bf" style="width:${s.accPc}%"></div></div></div>
    <div class="st"><div class="sn"><span>${L('تمرین', 'Drills')}</span>
      <span class="sv">${fa(done.length)}/${fa(DDRILL.length)}</span></div>
     <div class="bar"><div class="bf" style="width:${s.drillPc}%"></div></div></div>
   </div>
   ${s.scan ? `<div class="hint">${L('اسکن تو ', 'Your scan ')}${fa(s.scan.avg)} ${L('بار در دقیقه است. متوسط ۲، خوب ۵، حرفه‌ای ۸. پوگبا حدود ۶ تا ۸.',
     'Average 2, good 5, pro 8.')}</div>`
   : `<div class="hint">${L('هنوز اسکن را نسنجیده‌ای. بعد از مسابقهٔ بعدی ثبت کن — این عدد مهم‌ترین شاخص توست.',
     'Log after next match.')}</div>`}</div>

  <div class="c gl nowc"><div class="ct">◉ ${L('تمرین امروز', 'Today')}
    <b>${PART[today[1]]}</b></div>
   <div class="nowbig">${today[2]}</div>
   <div class="cs">${today[3]}</div>
   <div class="hint">${today[4]}</div>
   <div class="hint" style="color:var(--dim)">${L('زمان', 'Time')}: ${fa(today[5])} ${L('دقیقه', 'min')} · ${today[6]}</div>
   <button class="bt p" style="margin-top:var(--sp3)" onclick="decDo('${today[0]}')">
    ${done.includes(today[0]) ? L('دوباره انجام دادم', 'Did it again') : L('انجام دادم', 'Done')}</button></div>

  <div class="c gl"><div class="ct">▦ ${L('بعد از مسابقه', 'After match')}</div>
   <div class="cs">${L('سه عدد. سی ثانیه وقت می‌گیرد و تنها راه دیدن پیشرفت واقعی است.', 'Three numbers.')}</div>
   <button class="bt p" onclick="decLog()">${L('ثبت مسابقه', 'Log match')}</button>
   ${(() => {
     const L2 = (S.dec || []).slice(-5).reverse();
     if (!L2.length) return `<div class="empty"><span class="ei">▦</span>${
       L('بعد از مسابقهٔ بعدی، اولین ثبت را بزن.', 'Log after next match.')}</div>`;
     return L2.map(x => `<div class="rw"><div class="ri">${fa(x.scan || 0)}</div>
      <div><div class="rt">${x.d}</div>
       <div class="rd">${L('اسکن ', 'scan ')}${fa(x.scan || 0)}${L(' در دقیقه', '/min')} ·
        ${L('پاس درست ', 'good ')}${fa(x.good || 0)} · ${L('اشتباه ', 'bad ')}${fa(x.bad || 0)}</div>
       ${x.note ? `<div class="rd" style="color:var(--dim2)">${esc(x.note)}</div>` : ''}</div></div>`).join('');
   })()}
   ${s.acc && s.acc.trend !== null ? `<div class="hint" style="color:var(--ink)">${
     s.acc.trend > 5 ? L('روند رو به بهبود: ', 'Improving: ') + '+' + fa(s.acc.trend) + '٪'
     : s.acc.trend < -5 ? L('افت نسبت به شروع: ', 'Declining: ') + fa(s.acc.trend) + '٪'
     : L('ثابت. برای جهش، روی اسکن کار کن.', 'Flat — work on scanning.')}</div>` : ''}</div>

  <div class="c gl"><div class="ct">◷ ${L('همهٔ تمرین‌ها', 'All drills')}</div>
   ${['scan', 'option', 'speed'].map(part => `
    <div class="hint" style="margin-top:var(--sp3);color:var(--dim)">${PART[part]}</div>
    ${DDRILL.filter(d => d[1] === part).map(d => `
      <div class="rw ${done.includes(d[0]) ? 'done' : ''}" onclick="decDo('${d[0]}')">
       <div class="ri">${done.includes(d[0]) ? '✓' : '○'}</div>
       <div><div class="rt">${d[2]} · ${fa(d[5])}${L('د', 'm')}</div>
        <div class="rd">${d[3]}</div></div></div>`).join('')}`).join('')}</div>

  <div class="c gl"><div class="ct">⊘ ${L('خطاهای رایج', 'Common errors')}</div>
   <div class="cs">${L('هرکدام را که در بازی خودت دیدی، بشناس. تشخیص، نصف راه است.', 'Recognise your pattern.')}</div>
   ${DERROR.map(e => `<div class="rw" onclick="decErr('${e[0]}')">
     <div class="ri">${(S.decErr || []).includes(e[0]) ? '✓' : '○'}</div>
     <div><div class="rt">${e[1]}</div><div class="rd">${e[2]}</div>
      ${(S.decErr || []).includes(e[0]) ? `<div class="rd" style="color:var(--ink);margin-top:4px">◆ ${e[3]}</div>` : ''}
     </div></div>`).join('')}</div>`;
};

/* ---------- اکشن‌ها ---------- */
window.decDo = id => {
  const d = DDRILL.find(x => x[0] === id);
  if (!d) return;
  S.decDrill = S.decDrill || [];
  if (!S.decDrill.includes(id)) S.decDrill.push(id);
  S.wo = S.wo || [];
  S.wo.push({ d: td(), t: 1, l: d[2] });
  xp(30); window.haptic(14); sv(); rd();
  tst('◈ ' + d[2]);
};

window.decErr = id => {
  S.decErr = S.decErr || [];
  const i = S.decErr.indexOf(id);
  if (i >= 0) S.decErr.splice(i, 1);
  else { S.decErr.push(id); xp(20); window.haptic(10); }
  sv(); rd();
};

window.decLog = async () => {
  const r = await ask({
    t: L('بعد از مسابقه', 'After match'),
    s: L('صادق باش. عدد دروغ، تحلیل دروغ می‌سازد.', 'Be honest.'),
    f: [{ k: 'scan', t: L('چند بار در دقیقه سر چرخاندی؟ (تخمین)', 'Scans per minute'), ty: 'num', v: '' },
        { k: 'good', t: L('پاس‌های درست', 'Good passes'), ty: 'num', v: '' },
        { k: 'bad', t: L('پاس‌های اشتباه', 'Bad passes'), ty: 'num', v: '' },
        { k: 'note', t: L('یک موقعیتی که بد تصمیم گرفتی', 'One bad decision'), ty: 'text', v: '' }]
  });
  if (!r || (r.scan === '' && r.good === '')) return;
  S.dec = S.dec || [];
  S.dec.push({
    d: jStr(), scan: +r.scan || 0, good: +r.good || 0,
    bad: +r.bad || 0, note: r.note || ''
  });
  xp(40); window.haptic(18); sv(); rd();
  const sc = scanAvg(S);
  tst('▦ ' + (sc ? L('میانگین اسکن ', 'Avg scan ') + fa(sc.avg) : L('ثبت شد', 'Logged')));
};
