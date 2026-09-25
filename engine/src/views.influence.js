/* ============ INFLUENCE VIEWS — نفوذ و دفاع ============ */

/* ---------- نمای اصلی: سپر ---------- */
V.inf = () => {
  const s = infScore(S);
  const shield = (pc) => {
    /* سپر شش‌ضلعی که با پیشرفت پر می‌شود */
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 3;
      pts.push((50 + 38 * Math.cos(a)).toFixed(1) + ',' + (50 + 38 * Math.sin(a)).toFixed(1));
    }
    const inner = [];
    const r = 38 * (pc / 100);
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 3;
      inner.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1));
    }
    return `<svg width="112" height="112" viewBox="0 0 100 100" style="display:block;margin:0 auto">
      <polygon points="${pts.join(' ')}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1.5"/>
      <polygon points="${pts.join(' ')}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"
        transform="scale(.66) translate(25.7,25.7)"/>
      <polygon points="${inner.join(' ')}" fill="rgba(255,255,255,.14)" stroke="#fff" stroke-width="2"
        style="transition:all .8s cubic-bezier(.22,1,.36,1)"/>
      <text x="50" y="55" text-anchor="middle" fill="#f4f4f5"
        font-size="19" font-family="Vazirmatn" font-weight="800">${fa(pc)}</text>
    </svg>`;
  };

  const nx = nextScen(S);

  return `<div class="c gl"><div class="ct">⛊ ${L('سپر نفوذ', 'Influence Shield')}<b>${s.rank}</b></div>
   ${shield(s.all)}
   <div class="gr" style="grid-template-columns:repeat(3,1fr);margin-top:var(--sp3)">
    <div class="st"><div class="sn"><span>${L('دفاع', 'Defense')}</span><span class="sv">${fa(s.def.pc)}٪</span></div>
     <div class="bar"><div class="bf" style="width:${s.def.pc}%"></div></div></div>
    <div class="st"><div class="sn"><span>${L('مذاکره', 'Nego')}</span><span class="sv">${fa(s.nego.pc)}٪</span></div>
     <div class="bar"><div class="bf" style="width:${s.nego.pc}%"></div></div></div>
    <div class="st"><div class="sn"><span>${L('تمرین', 'Drill')}</span><span class="sv">${fa(s.drill.pc)}٪</span></div>
     <div class="bar"><div class="bf" style="width:${s.drill.pc}%"></div></div></div>
   </div>
   <div class="hint">${L('کسی که تاکتیک‌ها را از هر دو طرف می‌شناسد، هم فریب نمی‌خورد هم واقعاً نفوذ می‌کند.',
     'Knowing both sides makes you unmanipulable and genuinely persuasive.')}</div></div>

  ${nx ? `<div class="c gl nowc"><div class="ct">◉ ${L('تمرین امروز', 'Drill')}</div>
   <div class="nowbig">${nx.txt}</div>
   ${nx.opt.map((o, i) => `<div class="rw" onclick="scenAns('${nx.id}',${i})">
     <div class="ri">${['الف', 'ب', 'ج'][i]}</div><div class="rt">${o}</div></div>`).join('')}
   <div class="hint">${L('جواب اشتباه هم ثبت می‌شود و بعداً دوباره می‌آید.', 'Wrong answers return later.')}</div></div>`
   : `<div class="c gl"><div class="ct">★ ${L('همهٔ سناریوها', 'All drills')}</div>
     <div class="cs">${L('هر ۱۲ سناریو را درست جواب دادی. حالا در دنیای واقعی تمرینشان کن.',
       'All 12 correct. Now practice in real life.')}</div>
     <button class="bt" onclick="scenReset()">${L('شروع دوباره', 'Reset')}</button></div>`}

  <div class="c gl"><div class="ct">◍ ${L('خط قرمز', 'The line')}</div>
   <div class="cs">${L('تفاوت نفوذ و دستکاری در یک سؤال است: اگر طرف مقابل بعداً همه‌چیز را بفهمد، هنوز راضی است؟',
     'If they later learn everything, would they still be fine?')}</div>
   <div class="hint">${L('نفوذ یعنی کمک به تصمیم بهتر. دستکاری یعنی گرفتن چیزی که آگاهانه نمی‌دادند. اولی اعتبار می‌سازد، دومی می‌سوزاند.',
     'Influence helps them decide. Manipulation takes what they would not knowingly give.')}</div></div>`;
};

/* ---------- کتابخانهٔ تاکتیک‌ها ---------- */
V.inf_def = () => {
  const known = (S.inf && S.inf.known) || [];
  const badge = lvl => lvl === 'خطر' ? '⛔' : lvl === 'هشدار' ? '⚠' : '◦';
  const groups = ['خطر', 'هشدار', 'توجه'];

  return `<div class="c gl"><div class="ct">⛊ ${L('تاکتیک‌های دستکاری', 'Manipulation tactics')}
   <b>${fa(known.length)}/${fa(TACTIC.length)}</b></div>
   <div class="cs">${L('هرکدام را که یاد گرفتی و توانستی در لحظه تشخیص بدهی تیک بزن. تشخیص در لحظه مهم است، نه حفظ کردن.',
     'Tick what you can spot in real time.')}</div>
   <div class="bar lg" style="margin-top:var(--sp2)">
    <div class="bf" style="width:${known.length / TACTIC.length * 100}%"></div></div></div>

  ${groups.map(g => {
    const items = TACTIC.filter(t => t[2] === g);
    return `<div class="c gl"><div class="ct">${badge(g)} ${g}
     <b>${fa(items.filter(t => known.includes(t[0])).length)}/${fa(items.length)}</b></div>
     ${items.map(t => {
       const on = known.includes(t[0]);
       return `<div class="rw ${on ? 'done' : ''}" onclick="tacTap('${t[0]}')">
        <div class="ri">${on ? '✓' : badge(g)}</div>
        <div><div class="rt">${t[1]}</div>
         <div class="rd">${t[3]}</div>
         <div class="rd" style="color:var(--dim2);margin-top:3px">«${t[4]}»</div>
         ${on ? `<div class="rd" style="color:var(--ink);margin-top:5px">◆ ${t[5]}</div>` : ''}</div></div>`;
     }).join('')}</div>`;
  }).join('')}`;
};

/* ---------- مذاکره ---------- */
V.inf_nego = () => {
  const done = (S.inf && S.inf.nego) || [];
  return `<div class="c gl"><div class="ct">◆ ${L('مذاکره', 'Negotiation')}
   <b>${fa(done.length)}/${fa(NEGO.length)}</b></div>
   <div class="cs">${L('این‌ها از مذاکرهٔ گروگان‌گیری و دیپلماسی آمده‌اند. روی پدر و مادر، معلم و هم‌تیمی هم کار می‌کنند.',
     'From hostage negotiation. Works on parents and teammates too.')}</div>
   <div class="bar lg" style="margin-top:var(--sp2)">
    <div class="bf" style="width:${done.length / NEGO.length * 100}%"></div></div></div>

  ${NEGO.map(n => {
    const on = done.includes(n[0]);
    return `<div class="c gl"><div class="ct">${on ? '✓' : '○'} ${n[1]}</div>
     <div class="cs">${n[2]}</div>
     <div class="hint" style="color:var(--dim)">${L('مثال', 'Example')}: ${n[3]}</div>
     <button class="bt ${on ? '' : 'p'}" style="margin-top:var(--sp2)" onclick="negoTap('${n[0]}')">
      ${on ? L('استفاده کردم ✓', 'Used ✓') : L('در واقعیت استفاده کردم', 'Used it')}</button></div>`;
  }).join('')}`;
};

/* ---------- اکشن‌ها ---------- */
window.tacTap = id => {
  S.inf = S.inf || {};
  S.inf.known = S.inf.known || [];
  const i = S.inf.known.indexOf(id);
  if (i >= 0) S.inf.known.splice(i, 1);
  else { S.inf.known.push(id); xp(20); window.haptic(10); }
  sv(); rd();
};

window.negoTap = id => {
  S.inf = S.inf || {};
  S.inf.nego = S.inf.nego || [];
  const i = S.inf.nego.indexOf(id);
  if (i >= 0) S.inf.nego.splice(i, 1);
  else { S.inf.nego.push(id); xp(25); window.haptic(12); }
  sv(); rd();
};

window.scenAns = async (id, pick) => {
  const sc = SCEN.find(x => x.id === id);
  if (!sc) return;
  const right = pick === sc.ans;
  S.inf = S.inf || {};
  S.inf.drill = S.inf.drill || {};
  S.inf.drill[id] = right;
  if (right) { xp(30); window.haptic(18); }
  sv();
  await ask({
    t: right ? '✓ ' + L('درست', 'Correct') : '○ ' + L('نه', 'Not quite'),
    s: right ? '' : L('جواب درست: ', 'Correct: ') + sc.opt[sc.ans],
    f: [{ k: 'i', ty: 'info', rows: [[L('چرا', 'Why'), sc.why]] }],
    ok: L('فهمیدم', 'Got it')
  });
  rd();
};

window.scenReset = () => {
  S.inf = S.inf || {};
  S.inf.drill = {};
  sv(); rd();
  tst(L('سناریوها بازنشانی شد', 'Drills reset'));
};
