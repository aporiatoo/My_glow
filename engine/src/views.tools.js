/* ============ TOOLS VIEWS ============ */

/* ---------- لاین‌آپ ---------- */
V.lineup = () => {
  const kind = S.luKind || 'football';
  const forms = kind === 'futsal' ? FORM5 : FORM11;
  const form = (forms[S.luForm] ? S.luForm : Object.keys(forms)[0]);
  const names = (S.luNames && S.luNames[kind]) || [];
  const pl = lineup(kind, form, names);
  const note = FORM_NOTE[form] || ['', '', ''];

  /* زمین: فوتسال کوتاه‌تر و پهن‌تر */
  const H = kind === 'futsal' ? 150 : 190;

  return `<div class="c gl"><div class="ct">▦ ${L('لاین‌آپ', 'Lineup')}<b>${form}</b></div>
   <div class="gr" style="grid-template-columns:1fr 1fr;margin-bottom:var(--sp3)">
    <button class="bt ${kind === 'football' ? 'p' : ''}" onclick="luKind('football')">
     ${L('فوتبال ۱۱', 'Football')}</button>
    <button class="bt ${kind === 'futsal' ? 'p' : ''}" onclick="luKind('futsal')">
     ${L('فوتسال ۵', 'Futsal')}</button>
   </div>

   <svg width="100%" height="${H * 1.15}" viewBox="0 0 100 ${H}"
     style="max-width:320px;display:block;margin:0 auto" preserveAspectRatio="xMidYMid meet">
    <rect x="2" y="2" width="96" height="${H - 4}" rx="2" fill="rgba(255,255,255,.035)"
      stroke="rgba(255,255,255,.18)" stroke-width=".7"/>
    <line x1="2" y1="${H / 2}" x2="98" y2="${H / 2}" stroke="rgba(255,255,255,.14)" stroke-width=".6"/>
    <circle cx="50" cy="${H / 2}" r="${H * 0.08}" fill="none" stroke="rgba(255,255,255,.14)" stroke-width=".6"/>
    <rect x="30" y="2" width="40" height="${H * 0.1}" fill="none" stroke="rgba(255,255,255,.14)" stroke-width=".6"/>
    <rect x="30" y="${H - 2 - H * 0.1}" width="40" height="${H * 0.1}" fill="none"
      stroke="rgba(255,255,255,.14)" stroke-width=".6"/>
    ${pl.map((p, i) => {
      /* y در داده از دروازهٔ خودی است؛ در SVG از بالا */
      const cy = H - 4 - (p.y / 100) * (H - 12);
      const cx = p.x;
      return `<g onclick="luName(${i})" style="cursor:pointer">
        <circle cx="${cx}" cy="${cy}" r="6.5" fill="rgba(255,255,255,.92)"
          stroke="#000" stroke-width=".5"/>
        <text x="${cx}" y="${cy + 1.8}" text-anchor="middle" fill="#000"
          font-size="4.6" font-family="Vazirmatn" font-weight="800">${p.pos}</text>
        ${p.name ? `<text x="${cx}" y="${cy + 11}" text-anchor="middle" fill="#f4f4f5"
          font-size="4" font-family="Vazirmatn">${esc(p.name).slice(0, 8)}</text>` : ''}
      </g>`;
    }).join('')}
   </svg>

   <div class="hint" style="text-align:center">${L('روی هر مهره بزن تا اسم بگذاری', 'Tap to name')}</div>

   <div class="gr" style="grid-template-columns:repeat(3,1fr);margin-top:var(--sp3)">
    ${Object.keys(forms).map(f => `<button class="bt ${f === form ? 'p' : ''}"
      style="font-size:var(--t1)" onclick="luForm('${f}')">${f}</button>`).join('')}
   </div>

   <div class="hint" style="color:var(--ink);margin-top:var(--sp3)">${note[0]}</div>
   <div class="li">${L('قوت', 'Strength')}: ${note[1]}</div>
   <div class="li">${L('ضعف', 'Weakness')}: ${note[2]}</div>

   <div class="gr" style="grid-template-columns:1fr 1fr;margin-top:var(--sp3)">
    <button class="bt" onclick="luSave()">${L('ذخیره', 'Save')}</button>
    <button class="bt" onclick="luClear()">${L('پاک کردن اسم‌ها', 'Clear')}</button>
   </div>
   ${(S.lineups || []).length ? `<div class="hint">${L('ذخیره‌شده', 'Saved')}: ${
     (S.lineups || []).slice(-3).map(x => x.form).join(' · ')}</div>` : ''}</div>

  <div class="c gl"><div class="ct">◉ ${L('نقش تو', 'Your role')}</div>
   ${(() => {
     const my = (POS.some(p => p[0] === S.fbpos) ? S.fbpos : null) || 'CM';
     const p = POS.find(x => x[0] === my);
     return `<div class="nowbig">${p[1]}</div>
      <div class="cs">${L('صفات کلیدی این پست', 'Key attributes')}:</div>
      ${p[2].map(a => `<div class="li">${ATTR[a] || a}</div>`).join('')}`;
   })()}</div>`;
};

/* ---------- هماهنگی تیمی ---------- */
V.team = () => `<div class="c gl"><div class="ct">◈ ${L('هماهنگی تیمی', 'Team')}</div>
  <div class="cs">${L('پیام آماده بساز و کپی کن. نوشتن پیام نباید مانع هماهنگی شود.',
    'Build and copy a message.')}</div>
  ${MSG.map(m => `<div class="rw" onclick="msgMake('${m[0]}')">
    <div class="ri">◦</div><div><div class="rt">${m[1]}</div>
    <div class="rd">${m[2].replace(/\{(\w+)\}/g, '___')}</div></div></div>`).join('')}</div>

 <div class="c gl"><div class="ct">◇ ${L('هم‌تیمی‌ها', 'Teammates')}</div>
  ${(ME.teammates || []).map(n => `<div class="rw"><div class="ri">⚽</div>
    <div class="rt">${esc(n)}</div></div>`).join('')}
  <div class="hint">${L('برای افزودن یا ثبت تعامل، به بخش حلقه برو.', 'Manage in Circle.')}</div></div>

 <div class="c gl"><div class="ct">◍ ${L('چطور با هم‌تیمی کار کنی', 'Working with teammates')}</div>
  <div class="li">${L('قبل از بازی، با کسی که کنارت بازی می‌کند یک جملهٔ هماهنگی بگو: «اگه رفتی بالا، من پوشش می‌دم.»',
    'One line of coordination before kickoff.')}</div>
  <div class="li">${L('بعد از پاس اشتباه، دست بالا ببر. این ساده‌ترین راه نگه داشتن اعتماد تیم است.',
    'Own your mistakes visibly.')}</div>
  <div class="li">${L('اسم صدا بزن نه «هی». بازیکنی که اسمش را می‌شنود سریع‌تر واکنش نشان می‌دهد.',
    'Call names, not "hey".')}</div>
  <div class="li">${L('به ضعیف‌ترین بازیکن هم پاس بده. اگر فقط به قوی‌ها پاس بدهی، حریف می‌فهمد.',
    'Pass to everyone.')}</div>
  <div class="li">${L('از مربی یک بار بپرس دقیقاً چه می‌خواهد از پست تو. اکثر بازیکن‌ها هرگز نمی‌پرسند.',
    'Ask your coach what he wants.')}</div></div>`;

/* ---------- ماشین‌حساب‌ها ---------- */
V.calc = () => {
  const pr = protToday(S);
  const b = bodyCalc(ME.height, (S.wt && S.wt[S.wt.length - 1]) || ME.weight, 14);

  return `<div class="c gl"><div class="ct">▲ ${L('پروتئین امروز', 'Protein')}
    <b>${fa(pr.got)}/${fa(pr.target)}g</b></div>
   <div class="bar lg" style="margin:var(--sp2) 0"><div class="bf" style="width:${pr.pc}%"></div></div>
   ${pr.left ? `<div class="hint">${fa(pr.left)} ${L('گرم مانده', 'g left')} —
     ${L('یعنی حدوداً ', 'about ')}${fa(Math.ceil(pr.left / 6))} ${L('تخم‌مرغ یا ', 'eggs or ')}${
     fa(Math.ceil(pr.left / 31))} ${L('سینهٔ مرغ', 'chicken breast')}</div>`
   : `<div class="hint" style="color:var(--ink)">${L('به هدف رسیدی.', 'Target reached.')}</div>`}
   <button class="bt p" style="margin-top:var(--sp2)" onclick="protAdd()">${L('افزودن غذا', 'Add food')}</button>
   ${pr.items.length ? pr.items.map((x, i) => `<div class="rw" onclick="protDel(${i})">
     <div class="ri">◦</div><div><div class="rt">${esc(x.n)}</div></div>
     <div class="rx">${fa(x.g)}g</div></div>`).join('') : ''}</div>

  <div class="c gl"><div class="ct">◐ ${L('ترکیب بدن', 'Body')}</div>
   ${b ? `<div class="gr" style="grid-template-columns:repeat(3,1fr)">
    <div class="sk"><div class="skn">${fa(b.bmi)}</div><div class="skl">BMI · ${b.state}</div></div>
    <div class="sk"><div class="skn">${fa(b.idealMin)}–${fa(b.idealMax)}</div><div class="skl">${L('بازهٔ سالم', 'Healthy')}</div></div>
    <div class="sk"><div class="skn">${fa(b.protMin)}–${fa(b.protMax)}</div><div class="skl">${L('پروتئین g', 'Protein')}</div></div>
   </div>
   <div class="hint">${b.state === 'کم'
     ? L('وزنت پایین‌تر از بازهٔ سالم است. در دورهٔ رشد این یعنی کالری کافی نمی‌گیری — صبحانه نخوردن بزرگ‌ترین شکاف است.',
         'Below healthy range.')
     : L('در بازهٔ سالم. تمرکز روی ترکیب بدن، نه عدد ترازو.', 'In range.')}</div>` : ''}</div>

  <div class="c gl"><div class="ct">▦ ${L('چه نمره‌ای لازم دارم', 'Grade needed')}</div>
   <div class="cs">${L('معدل فعلی و هدفت را بده تا بگویم در امتحانات باقی‌مانده چه نمره‌ای لازم داری.',
     'What average you need on remaining exams.')}</div>
   <button class="bt p" onclick="gpaCalc()">${L('محاسبه', 'Calculate')}</button>
   ${S.gpaCalc ? `<div class="gr" style="grid-template-columns:1fr 1fr;margin-top:var(--sp3)">
     <div class="sk"><div class="skn">${fa(S.gpaCalc.cur)}</div><div class="skl">${L('فعلی', 'Current')}</div></div>
     <div class="sk"><div class="skn">${fa(S.gpaCalc.need)}</div><div class="skl">${L('لازم', 'Needed')}</div></div>
    </div>
    <div class="hint" style="color:var(--ink)">${
      S.gpaCalc.impossible ? L('با این نمرات، هدف در دسترس نیست. هدف را واقعی‌تر کن.', 'Not reachable.')
      : S.gpaCalc.comfortable ? L('قابل دسترس است.', 'Comfortable.')
      : L('سخت ولی ممکن. باید روی درس‌های ضریب‌بالا تمرکز کنی.', 'Hard but possible.')}</div>` : ''}</div>

  <div class="c gl"><div class="ct">⇄ ${L('تبدیل', 'Convert')}</div>
   <div class="cs">${L('اسپرینت ۲۰ متر به سرعت، و دوی کوپر به VO₂max', 'Sprint to speed, Cooper to VO2')}</div>
   <div class="gr" style="grid-template-columns:1fr 1fr">
    <button class="bt" onclick="cvt('sprint20')">${L('اسپرینت → km/h', 'Sprint')}</button>
    <button class="bt" onclick="cvt('cooper→vo2')">${L('کوپر → VO₂', 'Cooper')}</button>
   </div></div>`;
};

/* ---------- آماده‌سازی مسابقه ---------- */
V.prep = () => `<div class="c gl"><div class="ct">⚑ ${L('آماده‌سازی مسابقه', 'Match prep')}</div>
  <div class="cs">${L('ساعت‌شمار معکوس از شب قبل تا فردای بازی.', 'Countdown from the night before.')}</div>
  ${MATCHPREP.map(m => `<div class="rw"><div class="ri" style="font-size:var(--t1)">${
    m[0] < 0 ? '−' : m[0] === 0 ? '▶' : '+'}</div>
   <div><div class="rt">${m[1]}</div><div class="rd">${m[2]}</div></div></div>`).join('')}
  <div class="hint">${L('مهم‌ترین سطر، اولی است. خواب شب قبل از هر گرم‌کردنی مؤثرتر است.',
    'Sleep matters most.')}</div></div>

 <div class="c gl"><div class="ct">◈ ${L('سه هدف بازی', 'Three goals')}</div>
  <div class="cs">${L('قبل از هر بازی، سه چیز مشخص تعیین کن. نه «خوب بازی کنم» — چیز قابل شمارش.',
    'Countable, not vague.')}</div>
  <div class="li">${L('مثال: ۸ بار اسکن در هر دقیقه', 'Example: 8 scans per minute')}</div>
  <div class="li">${L('مثال: سه پاس رو به جلو', 'Three forward passes')}</div>
  <div class="li">${L('مثال: صفر پاس زیر فشار بی‌هدف', 'Zero panic clearances')}</div>
  <button class="bt p" style="margin-top:var(--sp2)" onclick="goalsSet()">${L('تعیین اهداف امروز', 'Set goals')}</button>
  ${(S.matchGoals && S.matchGoals.d === td()) ? S.matchGoals.g.map((x, i) =>
    `<div class="rw ${(S.matchGoals.done || []).includes(i) ? 'done' : ''}" onclick="goalTick(${i})">
     <div class="ri">${(S.matchGoals.done || []).includes(i) ? '✓' : '○'}</div>
     <div class="rt">${esc(x)}</div></div>`).join('') : ''}</div>`;

/* ---------- اکشن‌ها ---------- */
window.luKind = k => { S.luKind = k; S.luForm = null; sv(); rd() };
window.luForm = f => { S.luForm = f; sv(); rd(); window.haptic(8) };

window.luName = async i => {
  const kind = S.luKind || 'football';
  S.luNames = S.luNames || {};
  S.luNames[kind] = S.luNames[kind] || [];
  const r = await ask({ t: L('نام بازیکن', 'Player name'),
    f: [{ k: 'n', ty: 'text', v: S.luNames[kind][i] || '' }] });
  if (!r) return;
  S.luNames[kind][i] = r.n || '';
  sv(); rd();
};

window.luClear = () => {
  const kind = S.luKind || 'football';
  S.luNames = S.luNames || {};
  S.luNames[kind] = [];
  sv(); rd(); tst(L('پاک شد', 'Cleared'));
};

window.luSave = () => {
  const kind = S.luKind || 'football';
  const forms = kind === 'futsal' ? FORM5 : FORM11;
  const form = forms[S.luForm] ? S.luForm : Object.keys(forms)[0];
  S.lineups = S.lineups || [];
  S.lineups.push({ d: td(), kind, form, names: ((S.luNames || {})[kind] || []).slice() });
  if (S.lineups.length > 10) S.lineups = S.lineups.slice(-10);
  sv(); rd(); window.haptic(12);
  tst('▦ ' + L('ذخیره شد', 'Saved'));
};

window.msgMake = async id => {
  const m = MSG.find(x => x[0] === id);
  if (!m) return;
  const vars = [...m[2].matchAll(/\{(\w+)\}/g)].map(x => x[1]);
  const LBL = { time: 'ساعت', who: 'کی', day: 'روز', hour: 'چند ساعت',
                min: 'چند دقیقه', note: 'نکته', what: 'بابت چه' };
  const r = await ask({ t: m[1],
    f: vars.map(v => ({ k: v, t: LBL[v] || v, ty: 'text', v: '' })) });
  if (!r) return;
  const txt = msgFill(m[2], r);
  await ask({ t: L('آماده — کپی کن', 'Ready'),
    f: [{ k: 'out', ty: 'area', v: txt }], ok: L('بستن', 'Close') });
};

window.protAdd = async () => {
  const r = await ask({ t: L('افزودن غذا', 'Add food'),
    f: [{ k: 'f', ty: 'pick', o: PROT.map((p, i) => [String(i), p[0] + ' · ' + p[1] + 'g']) }] });
  if (!r || r.f === '') return;
  const p = PROT[+r.f];
  if (!p) return;
  const d = td();
  if (!S.protLog || S.protLog.d !== d) S.protLog = { d, items: [] };
  S.protLog.items.push({ n: p[0], g: p[1] });
  xp(5); window.haptic(8); sv(); rd();
  const t2 = protToday(S);
  tst('▲ ' + fa(t2.got) + '/' + fa(t2.target) + 'g');
};

window.protDel = i => {
  if (!S.protLog || !S.protLog.items) return;
  S.protLog.items.splice(i, 1);
  sv(); rd();
};

window.gpaCalc = async () => {
  const r = await ask({ t: L('محاسبهٔ معدل', 'GPA'),
    s: L('معدل فعلی، هدف، و چند درس باقی مانده', 'Current, goal, remaining'),
    f: [{ k: 'cur', t: L('معدل فعلی', 'Current'), ty: 'num', v: String(ME.lastGPA) },
        { k: 'n', t: L('تعداد درس گذشته', 'Done'), ty: 'num', v: '11' },
        { k: 'goal', t: L('معدل هدف', 'Goal'), ty: 'num', v: String(ME.goalGPA) },
        { k: 'left', t: L('تعداد درس باقی‌مانده', 'Remaining'), ty: 'num', v: '11' }] });
  if (!r || isNaN(+r.cur)) return;
  const res = gpaNeed(
    [{ score: +r.cur, weight: +r.n || 1 }], +r.goal || 20,
    Array.from({ length: +r.left || 1 }, () => ({ weight: 1 })));
  S.gpaCalc = res; sv(); rd();
  tst(res.impossible ? L('هدف در دسترس نیست', 'Not reachable')
    : '▦ ' + L('لازم: ', 'Need: ') + fa(res.need));
};

window.cvt = async type => {
  const LBL = { 'sprint20': L('زمان ۲۰ متر (ثانیه)', '20m time'),
                'cooper→vo2': L('متر در ۱۲ دقیقه', 'Cooper metres') };
  const r = await ask({ t: LBL[type], f: [{ k: 'v', ty: 'num', v: '' }] });
  if (!r || isNaN(+r.v)) return;
  const out = convert(+r.v, type);
  const unit = type === 'sprint20' ? ' km/h' : ' VO₂max';
  tst('⇄ ' + fa(out) + unit);
};

window.goalsSet = async () => {
  const r = await ask({ t: L('سه هدف این بازی', 'Three goals'),
    s: L('قابل شمارش بنویس', 'Make them countable'),
    f: [{ k: 'a', t: '۱', ty: 'text', v: '' },
        { k: 'b', t: '۲', ty: 'text', v: '' },
        { k: 'c', t: '۳', ty: 'text', v: '' }] });
  if (!r) return;
  const g = [r.a, r.b, r.c].filter(Boolean);
  if (!g.length) return;
  S.matchGoals = { d: td(), g, done: [] };
  sv(); rd(); tst('◈ ' + fa(g.length) + ' ' + L('هدف', 'goals'));
};

window.goalTick = i => {
  if (!S.matchGoals) return;
  S.matchGoals.done = S.matchGoals.done || [];
  const k = S.matchGoals.done.indexOf(i);
  if (k >= 0) S.matchGoals.done.splice(k, 1);
  else { S.matchGoals.done.push(i); xp(20); window.haptic(12) }
  sv(); rd();
};
