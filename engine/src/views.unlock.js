/* ============ UNLOCK VIEWS ============ */

/* ---------- مسیر طلایی: کارت اصلی روزهای اول ---------- */
function goldenCard() {
  const g = goldenToday(S);
  const p = goldenProgress(S);
  if (!g) {
    if (!S.startDate || S.obOff || dayNum(S) > 30) return '';
    return `<div class="c gl"><div class="ct">★ ${L('مسیر ۳۰ روزه', '30-day path')}
      <b>${fa(p.done)}/${fa(p.total)}</b></div>
     <div class="cs">${L('کار امروز انجام شد. فردا قدم بعدی.', 'Done for today.')}</div>
     <div class="bar lg" style="margin-top:var(--sp2)"><div class="bf" style="width:${p.pc}%"></div></div></div>`;
  }
  return `<div class="c gl nowc" style="order:-20"><div class="ct">★ ${L('قدم ', 'Step ')}${fa(g.day)}
    <b>${fa(p.done)}/${fa(p.total)}</b></div>
   ${g.late ? `<div class="hint" style="margin:0 0 var(--sp2)">${
     L('از ' + fa(g.lateBy) + ' روز پیش مانده', fa(g.lateBy) + ' days behind')}</div>` : ''}
   <div class="nowbig">${g.task}</div>
   <div class="hint">${g.why}</div>
   <div class="bar" style="margin:var(--sp3) 0"><div class="bf" style="width:${p.pc}%"></div></div>
   <div class="gr" style="grid-template-columns:2fr 1fr">
    <button class="bt p" onclick="goldenGo('${g.view}',${g.day})">${L('برو انجامش بده', 'Go')}</button>
    <button class="bt" onclick="goldenDone(${g.day})">${L('انجام شد', 'Done')}</button>
   </div></div>`;
}

/* ---------- ورود انبوه مهارت ---------- */
V.batch = () => {
  const todo = batchList(S);
  const done = SKILL.length - todo.length;
  return `<div class="c gl"><div class="ct">◎ ${L('سنجش انبوه', 'Batch test')}
    <b>${fa(done)}/${fa(SKILL.length)}</b></div>
   <div class="cs">${L('تا این اعداد وارد نشوند، کارت بازیکن و مسیر تسلط فقط تزئین‌اند. یک جلسه، همه را بسنج.',
     'Without these numbers, the player card is decoration.')}</div>
   <div class="bar lg" style="margin:var(--sp2) 0"><div class="bf" style="width:${done / SKILL.length * 100}%"></div></div>

   ${todo.length ? `<div class="gr" style="grid-template-columns:1fr 1fr;margin-top:var(--sp3)">
    <button class="bt p" onclick="batchRun()">${L('شروع سنجش پشت‌سرهم', 'Start')}</button>
    <button class="bt" onclick="batchPaste()">${L('چسباندن از متن', 'Paste')}</button>
   </div>
   <button class="bt" style="margin-top:var(--sp2)" onclick="batchGuess()">
    ${L('فعلاً تخمین بزن — بعداً دقیق کن', 'Estimate for now')}</button>`
   : `<div class="hint" style="color:var(--ink)">${L('همهٔ مهارت‌ها سنجیده شده. هر ۶ هفته دوباره بسنج.',
       'All measured. Retest every 6 weeks.')}</div>`}

   ${todo.length ? `<div class="hint">${L('باقی‌مانده', 'Remaining')}:</div>
    ${todo.slice(0, 8).map(s => `<div class="rw" onclick="fbLog('${s[0]}')">
      <div class="ri">○</div><div><div class="rt">${s[1]}</div>
      <div class="rd">${s[2]}${s[4] ? ' · ' + L('کمتر بهتر', 'lower better') : ''}</div></div></div>`).join('')}
    ${todo.length > 8 ? `<div class="hint">${L('و ', 'and ')}${fa(todo.length - 8)} ${L('مورد دیگر', 'more')}</div>` : ''}` : ''}</div>

  <div class="c gl"><div class="ct">◍ ${L('چطور بسنجی', 'How to measure')}</div>
   <div class="li">${L('روپایی: تا اولین افتادن. روی چمن یا آسفالت صاف.', 'Juggling: until first drop.')}</div>
   <div class="li">${L('پای ضعیف: ۲۰ پاس به دیوار از ۵ متری. چند تا به هدف خورد.', 'Weak foot: 20 passes.')}</div>
   <div class="li">${L('اسپرینت: با گوشی کرنومتر بگیر یا از کسی بخواه. سه بار، بهترین را ثبت کن.',
     'Sprint: best of three.')}</div>
   <div class="li">${L('دوی ۱۲ دقیقه: دور حیاط یا پارک. مسافت تقریبی کافی است.', 'Cooper: approximate.')}</div>
   <div class="hint">${L('عدد تقریبی از عدد نداشتن بهتر است. بعداً دقیق می‌شود.',
     'Approximate beats nothing.')}</div></div>`;
};

/* ---------- بازخورد مربی ---------- */
V.coach = () => {
  const cf = S.coach || [];
  const gap = feedbackGap(S);
  return `<div class="c gl"><div class="ct">◈ ${L('بازخورد بیرونی', 'External feedback')}
    <b>${fa(cf.length)}</b></div>
   <div class="cs">${L('همهٔ سیستم بر پایهٔ حرف خودت بنا شده. این تنها جایی است که کس دیگری قضاوت می‌کند.',
     'The only non-self-reported data.')}</div>
   <button class="bt p" style="margin-top:var(--sp2)" onclick="coachAdd()">
    ${L('ثبت نظر مربی', 'Log coach feedback')}</button>

   ${gap ? `<div class="hint" style="color:var(--ink);margin-top:var(--sp3)">
     ${L('در ', 'In ')}${fa(gap.n)} ${L('از ', 'of ')}${fa(gap.total)} ${L('بازخورد، کلمهٔ ', 'feedbacks: ')}
     <b>${gap.word}</b> ${L('تکرار شده.', 'repeated.')}</div>
    <div class="hint">${L('این الگو از حدس خودت معتبرتر است.', 'This pattern beats your guess.')}</div>` : ''}

   ${cf.length ? cf.slice(-6).reverse().map(x => `<div class="rw">
     <div class="ri">◦</div>
     <div><div class="rt">${x.d}${x.who ? ' · ' + esc(x.who) : ''}</div>
      ${x.good ? `<div class="rd">✓ ${esc(x.good)}</div>` : ''}
      ${x.fix ? `<div class="rd" style="color:var(--ink)">◆ ${esc(x.fix)}</div>` : ''}</div></div>`).join('')
   : `<div class="empty"><span class="ei">◈</span>${
     L('بعد از تمرین بعدی، یک جمله از مربی بپرس و اینجا بنویس.', 'Ask your coach one question.')}</div>`}</div>

  <div class="c gl"><div class="ct">◉ ${L('چه بپرسی', 'What to ask')}</div>
   <div class="cs">${L('بیشتر بازیکن‌ها هرگز نمی‌پرسند. همین یک سؤال، تو را جدا می‌کند.',
     'Most players never ask.')}</div>
   ${COACH_Q.map(q => `<div class="li">${q[1]}</div>`).join('')}
   <div class="hint">${L('بعد از تمرین، نه وسطش. و فقط یکی بپرس — نه همه را با هم.',
     'After training, one question only.')}</div></div>

  <div class="c gl"><div class="ct">▣ ${L('ویدیو', 'Video')}</div>
   <div class="cs">${L('سی ثانیه ویدیو از بازیت، همهٔ حدس‌ها را جایگزین می‌کند. از علی‌اصغر بخواه ضبط کند.',
     'Thirty seconds of footage beats all guessing.')}</div>
   <div class="li">${L('فقط خودت را نگاه کن، نه توپ را', 'Watch yourself, not the ball')}</div>
   <div class="li">${L('بشمار چند بار قبل از دریافت سر چرخاندی', 'Count your scans')}</div>
   <div class="li">${L('ببین بدنت باز بود یا بسته', 'Open or closed body?')}</div>
   <button class="bt" style="margin-top:var(--sp2)" onclick="vidLog()">
    ${L('ثبت تحلیل ویدیو', 'Log video review')}</button>
   ${(S.vids || []).length ? `<div class="hint">${fa((S.vids || []).length)} ${L('تحلیل ثبت شده', 'reviews')}</div>` : ''}</div>`;
};

/* ---------- اکشن‌ها ---------- */
window.goldenGo = (view, day) => {
  S.golden = S.golden || [];
  /* رفتن به ویو؛ تیک را خود کاربر بعداً می‌زند */
  const g = GRP.find(x => x[4].some(v => v[0] === view));
  if (g) window.goSub(g[0], view);
  else rd();
};

window.goldenDone = day => {
  S.golden = S.golden || [];
  if (!S.golden.includes(day)) { S.golden.push(day); xp(40); window.haptic(16) }
  sv(); rd();
  const p = goldenProgress(S);
  tst('★ ' + fa(p.done) + '/' + fa(p.total));
};

window.batchRun = async () => {
  const todo = batchList(S);
  if (!todo.length) { tst(L('همه سنجیده شده', 'All done')); return }
  /* پشت سر هم، بدون بازگشت به فهرست */
  for (const s of todo.slice(0, 6)) {
    const marks = s[3].map((m, i) => L('س', 'T') + fa(i + 1) + ':' + fa(m)).join(' ');
    const r = await ask({
      t: s[1],
      s: s[2] + (s[4] ? ' · ' + L('کمتر بهتر', 'lower better') : '') + '\n' + marks,
      f: [{ k: 'v', ty: 'num', v: '' }],
      ok: L('بعدی', 'Next'), del: L('رد کن', 'Skip')
    });
    if (!r) break;                       /* انصراف: خروج کامل */
    if (r.__del) continue;               /* رد کردن این یکی */
    if (r.v === '' || isNaN(+r.v)) continue;
    S.fb = S.fb || {};
    S.fb[s[0]] = +r.v;
    xp(25);
  }
  sv(); rd();
  const p = player(S);
  tst('◎ ' + fa(p.tested) + '/' + fa(p.total) + ' ' + L('سنجیده', 'measured'));
};

window.batchPaste = async () => {
  const r = await ask({
    t: L('چسباندن از متن', 'Paste'),
    s: L('هرچه یادت هست بنویس. مثال: روپایی ۱۲۰، پای ضعیف ۱۴، اسپرینت ۳.۲',
         'Write what you remember.'),
    f: [{ k: 't', ty: 'area', v: '' }]
  });
  if (!r || !r.t) return;
  const found = parseSkills(r.t);
  if (!found.length) { tst(L('چیزی شناسایی نشد', 'Nothing found')); return }
  const ok = await ask({
    t: L('این‌ها درست است؟', 'Correct?'),
    f: [{ k: 'i', ty: 'info', rows: found.map(f => [f.n, String(f.v)]) }],
    ok: L('ثبت کن', 'Save')
  });
  if (!ok) return;
  S.fb = S.fb || {};
  found.forEach(f => { S.fb[f.k] = f.v });
  xp(found.length * 20); window.haptic(18); sv(); rd();
  tst('◎ ' + fa(found.length) + ' ' + L('مهارت ثبت شد', 'saved'));
};

window.batchGuess = async () => {
  const todo = batchList(S);
  if (!todo.length) return;
  const r = await ask({
    t: L('تخمین سریع', 'Quick estimate'),
    s: L('برای هر مهارت نسنجیده، یک سطح کلی بده. بعداً با سنجش واقعی جایگزین می‌شود.',
         'Rough level for each.'),
    f: [{ k: 'lv', ty: 'pick', o: [['low', L('پایین‌تر از متوسط', 'Below')],
                                    ['mid', L('متوسط', 'Average')],
                                    ['hi', L('بالاتر از متوسط', 'Above')]], v: 'mid' }]
  });
  if (!r || !r.lv) return;
  S.fb = S.fb || {};
  S.fbEst = S.fbEst || [];
  todo.forEach(s => {
    const v = estimate(s[0], r.lv);
    if (v !== null) { S.fb[s[0]] = v; if (!S.fbEst.includes(s[0])) S.fbEst.push(s[0]) }
  });
  sv(); rd();
  tst('◎ ' + fa(todo.length) + ' ' + L('تخمین ثبت شد — بعداً دقیق کن', 'estimated'));
};

window.coachAdd = async () => {
  const r = await ask({
    t: L('بازخورد مربی', 'Coach feedback'),
    s: L('عین جمله‌اش را بنویس، نه برداشت خودت.', 'His words, not your interpretation.'),
    f: [{ k: 'who', t: L('از چه کسی', 'From'), ty: 'text', v: L('مربی', 'Coach') },
        { k: 'good', t: L('چه چیزی خوب بود', 'What was good'), ty: 'text', v: '' },
        { k: 'fix', t: L('چه چیزی را درست کنم', 'What to fix'), ty: 'text', v: '' }]
  });
  if (!r || (!r.good && !r.fix)) return;
  S.coach = S.coach || [];
  S.coach.push({ d: jStr(), who: r.who || '', good: r.good || '', fix: r.fix || '' });
  xp(35); window.haptic(14); sv(); rd();
  tst('◈ ' + L('ثبت شد', 'Logged'));
};

window.vidLog = async () => {
  const r = await ask({
    t: L('تحلیل ویدیو', 'Video review'),
    f: [{ k: 'scan', t: L('چند بار سر چرخاندی (در دقیقه)', 'Scans per min'), ty: 'num', v: '' },
        { k: 'body', t: L('بدن باز بود؟', 'Open body?'), ty: 'pick',
          o: [['yes', L('بله', 'Yes')], ['some', L('گاهی', 'Sometimes')], ['no', L('نه', 'No')]] },
        { k: 'note', t: L('یک چیزی که دیدی', 'One thing you saw'), ty: 'text', v: '' }]
  });
  if (!r) return;
  S.vids = S.vids || [];
  S.vids.push({ d: jStr(), scan: +r.scan || 0, body: r.body || '', note: r.note || '' });
  /* اگر اسکن ثبت شد، به دفتر تصمیم هم برود — دادهٔ واقعی‌تر از خوداظهاری */
  if (+r.scan > 0) {
    S.dec = S.dec || [];
    S.dec.push({ d: jStr(), scan: +r.scan, good: 0, bad: 0, note: L('از ویدیو', 'from video') });
  }
  xp(45); window.haptic(18); sv(); rd();
  tst('▣ ' + L('ثبت شد', 'Logged'));
};

/* ---------- پیام قفل ---------- */
window.lockMsg = id => {
  const g = VIEW_GATE[id];
  const d = dayNum(S);
  const left = Math.max(1, g - d);
  tst('◌ ' + L('روز ' + fa(g) + ' باز می‌شود — ' + fa(left) + ' روز مانده',
               'Opens day ' + g));
};

/* ---------- ثبت آخرین بازدیدها ---------- */
window.trackView = id => {
  if (!id) return;
  S.recent = (S.recent || []).filter(x => x !== id);
  S.recent.unshift(id);
  if (S.recent.length > 6) S.recent = S.recent.slice(0, 6);
};
