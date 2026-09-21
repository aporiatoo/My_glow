/* ============================================================
   INTERACT — کاهش اصطکاک
   کشیدن انگشت، نگه داشتن، برگرداندن، ورودی سریع.
   همه با pointer events تا روی لمس و ماوس یکسان کار کند.
   ============================================================ */

/* ---------- برگرداندن ----------
   هر عمل برگشت‌پذیر یک عکس فوری از state می‌گیرد.
   پنج ثانیه فرصت، بعد پاک می‌شود. */
let _undo = null, _undoT = null;

window.undoPush = (label, snapshot) => {
  _undo = { label, snap: snapshot || JSON.stringify(S) };
  const el = document.getElementById('undo');
  if (!el) return;
  el.innerHTML = `<span>${label}</span><b onclick="undoRun()">${L('برگردان', 'Undo')}</b>`;
  el.classList.add('on');
  clearTimeout(_undoT);
  _undoT = setTimeout(() => el.classList.remove('on'), 5000);
};

window.undoRun = () => {
  if (!_undo) return;
  try {
    const prev = JSON.parse(_undo.snap);
    Object.keys(S).forEach(k => { delete S[k]; });
    Object.assign(S, prev);
    sv(); rd();
    tst('↩ ' + L('برگشت', 'Undone'));
  } catch (e) { tst(L('برگرداندن ممکن نشد', 'Undo failed')); }
  _undo = null;
  const el = document.getElementById('undo');
  if (el) el.classList.remove('on');
};

/* ---------- کشیدن روی ردیف ----------
   راست = انجام شد، چپ = رد کردن.
   آستانهٔ ۷۲ پیکسل تا با اسکرول عمودی تداخل نکند. */
const SWIPE_MIN = 72;

window.swipeRow = (html, onRight, onLeft, rightLabel, leftLabel) => {
  const id = 'sw' + Math.random().toString(36).slice(2, 8);
  return `<div class="sw" id="${id}"
    data-r="${onRight || ''}" data-l="${onLeft || ''}"
    onpointerdown="swStart(event,'${id}')">
    <div class="swi r">${rightLabel || '✓'}</div>
    <div class="swi l">${leftLabel || '↷'}</div>
    <div class="swc">${html}</div></div>`;
};

let _sw = null;

window.swStart = (e, id) => {
  const box = document.getElementById(id);
  if (!box) return;
  _sw = { id, x: e.clientX, y: e.clientY, box, moved: false, locked: null };
  box.setPointerCapture && box.setPointerCapture(e.pointerId);
};

window.swMove = e => {
  if (!_sw) return;
  const dx = e.clientX - _sw.x, dy = e.clientY - _sw.y;

  /* تا جهت مشخص نشده تصمیم نگیر — وگرنه اسکرول عمودی می‌شکند */
  if (!_sw.locked) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    _sw.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (_sw.locked === 'x') _sw.box.classList.add('drag');
  }
  if (_sw.locked !== 'x') return;

  e.preventDefault();
  _sw.moved = true;
  const card = _sw.box.querySelector('.swc');
  const clamped = Math.max(-140, Math.min(140, dx));
  if (card) card.style.transform = `translateX(${clamped}px)`;
  _sw.box.classList.toggle('act', Math.abs(clamped) > 24);
};

window.swEnd = e => {
  if (!_sw) return;
  const box = _sw.box, card = box.querySelector('.swc');
  const dx = e.clientX - _sw.x;
  box.classList.remove('drag', 'act');
  if (card) card.style.transform = '';

  if (_sw.locked === 'x' && Math.abs(dx) >= SWIPE_MIN) {
    const fn = dx > 0 ? box.dataset.r : box.dataset.l;
    if (fn) {
      window.haptic(dx > 0 ? 14 : 8);
      try { new Function(fn)(); } catch (err) { }
    }
  }
  _sw = null;
};

/* ---------- نگه داشتن انگشت ---------- */
let _lpT = null;

window.lpStart = (e, fn) => {
  clearTimeout(_lpT);
  _lpT = setTimeout(() => {
    window.haptic(18);
    try { new Function(fn)(); } catch (err) { }
  }, 480);
};
window.lpEnd = () => clearTimeout(_lpT);

/* ---------- ورودی سریع ----------
   پرتکرارترین ثبت‌ها، یک ضربه فاصله، بدون تغییر صفحه. */
const QUICK = [
  ['◐', 'خواب', 'Sleep', 'slLog'],
  ['◈', 'حال', 'Mood', 'qsMood'],
  ['▲', 'وسوسه', 'Urge', 'urgeLog'],
  ['◉', 'وزن', 'Weight', 'wt'],
  ['↥', 'قد', 'Height', 'htLog'],
  ['✎', 'ژورنال', 'Journal', 'qsJournal'],
  ['◍', 'تنفس', 'Breathe', 'brStart'],
  ['⌕', 'جستجو', 'Search', 'srch']
];

window.qsOpen = () => {
  const el = document.getElementById('qs');
  if (!el) return;
  el.innerHTML = `<div class="qx" onclick="qsClose()"></div>
   <div class="qp">
    <div class="qgrab"></div>
    <div class="qgrid">
     ${QUICK.map(q => `<button class="qi" onclick="qsRun('${q[3]}')">
       <span class="qic">${q[0]}</span>
       <span class="qil">${L(q[1], q[2])}</span></button>`).join('')}
    </div></div>`;
  el.classList.add('op');
  window.haptic(8);
};

window.qsClose = () => {
  const el = document.getElementById('qs');
  if (el) { el.classList.remove('op'); el.innerHTML = ''; }
};

window.qsRun = fn => {
  qsClose();
  setTimeout(() => { try { window[fn] && window[fn](); } catch (e) { } }, 120);
};

/* حال: مستقیم بدون رفتن به صفحهٔ دیگر */
window.qsMood = async () => {
  const r = await ask({
    t: L('حال امروز', 'Mood today'),
    f: [{ k: 'm', ty: 'pick', o: MOODS.map(m => [m[0], m[1] + ' ' + m[2]]) },
        { k: 'e', t: L('انرژی بدنی', 'Energy'), ty: 'pick',
          o: [1, 2, 3, 4, 5].map(n => [String(n), fa(n)]), v: '3' }]
  });
  if (!r || !r.m) return;
  window.md(r.m);
  if (r.e) window.mdEn(+r.e);
  tst('◈ ' + L('ثبت شد', 'Logged'));
};

/* ژورنال: یک سؤال، نه یک فرم */
window.qsJournal = async () => {
  const r = await ask({
    t: L('یک خط برای امروز', 'One line'),
    s: L('همین یک خط کافی است. بعداً می‌توانی کامل‌ترش کنی.', 'One line is enough.'),
    f: [{ k: 'v', ty: 'area', v: '' }]
  });
  if (!r || !r.v) return;
  const d = td();
  let j = S.jr.find(x => x.d === d);
  if (!j) { j = { d, m: '3', a: [] }; S.jr.push(j); }
  j.a = j.a || [];
  j.a[0] = r.v;
  xp(10); sv(); rd();
  tst('✎ ' + L('ثبت شد', 'Saved'));
};

if (typeof module !== 'undefined') module.exports = { QUICK, SWIPE_MIN };
