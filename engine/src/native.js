/* ============================================================
   NATIVE — قابلیت‌هایی که فقط در APK هستند
   هرکدام در وب به‌آرامی تنزل می‌کند، نه اینکه بشکند.
   ============================================================ */

const N = () => { try { return window.Native || null } catch (e) { return null } };

/* ---------- ورودی صوتی ---------- */
/* در APK از تشخیص گفتار اندروید، در مرورگر از Web Speech API */
window.voiceOk = () => {
  const n = N();
  if (n && n.voiceAvailable) { try { return n.voiceAvailable() } catch (e) { return false } }
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

let _voiceCb = null;

window.voiceResult = txt => {
  const cb = _voiceCb; _voiceCb = null;
  if (cb) cb(String(txt || '').trim());
};

window.voiceAsk = prompt => new Promise(resolve => {
  const n = N();
  if (n && n.voiceStart) {
    _voiceCb = resolve;
    try { n.voiceStart(prompt || '') }
    catch (e) { _voiceCb = null; resolve('') }
    /* اگر تا ۶۰ ثانیه جواب نیامد رها کن */
    setTimeout(() => { if (_voiceCb === resolve) { _voiceCb = null; resolve('') } }, 60000);
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { resolve(''); return }
  try {
    const r = new SR();
    r.lang = 'fa-IR'; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = e => resolve((e.results[0][0].transcript || '').trim());
    r.onerror = () => resolve('');
    r.onend = () => { };
    r.start();
  } catch (e) { resolve('') }
});

/* ژورنال صوتی: بگو، ببین، ذخیره کن */
window.jrVoice = async () => {
  if (!window.voiceOk()) {
    tst(L('این دستگاه تشخیص گفتار ندارد', 'No speech recognition'));
    return;
  }
  tst('◉ ' + L('بگو…', 'Speak…'));
  const txt = await window.voiceAsk(L('امروزت چطور بود؟', 'How was today?'));
  if (!txt) { tst(L('چیزی شنیده نشد', 'Nothing heard')); return }
  const r = await ask({
    t: L('این درست است؟', 'Correct?'),
    s: L('می‌توانی قبل از ذخیره ویرایشش کنی.', 'Edit before saving.'),
    f: [{ k: 'v', ty: 'area', v: txt }]
  });
  if (!r || !r.v) return;
  const d = td();
  let j = S.jr.find(x => x.d === d);
  if (!j) { j = { d, m: '3', a: [] }; S.jr.push(j) }
  j.a = j.a || [];
  j.a[0] = (j.a[0] ? j.a[0] + ' ' : '') + r.v;
  xp(10); sv(); rd();
  tst('✎ ' + L('ثبت شد', 'Saved'));
};

/* ---------- قفل بیومتریک ---------- */
const _locks = {};

window.lockResult = (id, ok) => {
  const fn = _locks[id]; delete _locks[id];
  if (fn) fn(!!ok);
};

window.lockOk = () => {
  const n = N();
  try { return !!(n && n.lockAvailable && n.lockAvailable()) } catch (e) { return false }
};

/** اگر قفل روشن نباشد یا دستگاه پشتیبانی نکند، بی‌درنگ true */
window.lockAsk = (title, sub) => new Promise(resolve => {
  const n = N();
  if (!S.lockOn || !n || !n.lockPrompt) { resolve(true); return }
  const id = 'lk' + Date.now();
  _locks[id] = resolve;
  try { n.lockPrompt(title || L('تأیید هویت', 'Verify'), sub || '', id) }
  catch (e) { delete _locks[id]; resolve(true) }
  setTimeout(() => { if (_locks[id]) { delete _locks[id]; resolve(false) } }, 45000);
});

/** ویوهایی که محتوای خصوصی دارند */
const LOCKED_VIEWS = ['lg', 'sys_psy'];

window.lockGuard = async view => {
  if (!S.lockOn || !LOCKED_VIEWS.includes(view)) return true;
  if (S._unlocked === td()) return true;          /* یک بار در روز کافی است */
  const ok = await window.lockAsk(
    L('بخش خصوصی', 'Private'),
    L('ژورنال و بخش انضباط', 'Journal and discipline'));
  if (ok) { S._unlocked = td(); sv() }
  return ok;
};

window.tgLock = async () => {
  if (!S.lockOn && !window.lockOk()) {
    tst(L('روی این دستگاه قفل صفحه تنظیم نشده', 'No device lock set'));
    return;
  }
  S.lockOn = S.lockOn ? 0 : 1;
  if (S.lockOn) S._unlocked = td();
  sv(); rd();
  tst(S.lockOn ? L('قفل روشن شد', 'Lock on') : L('قفل خاموش شد', 'Lock off'));
};

/* ---------- Health Connect ---------- */
window.healthState = () => {
  const n = N();
  try { return (n && n.healthStatus) ? n.healthStatus() : 'web' } catch (e) { return 'web' }
};

window.healthGo = () => {
  const n = N();
  try { n && n.healthOpen && n.healthOpen() } catch (e) { }
};

/* ---------- بلاکر ---------- */
/* شناسهٔ بستهٔ اپ‌های رایج — کاربر می‌تواند دستی هم اضافه کند */
const PKGS = [
  ['com.instagram.android', 'اینستاگرام', 'block'],
  ['com.zhiliaoapp.musically', 'تیک‌تاک', 'block'],
  ['com.google.android.youtube', 'یوتیوب', 'cap'],
  ['org.telegram.messenger', 'تلگرام', 'cap'],
  ['com.twitter.android', 'ایکس', 'block'],
  ['com.snapchat.android', 'اسنپ‌چت', 'block'],
  ['com.whatsapp', 'واتساپ', 'cap']
];

window.blockerOn = () => {
  const n = N();
  try { return !!(n && n.blockerEnabled && n.blockerEnabled()) } catch (e) { return false }
};

window.blockerGo = () => {
  const n = N();
  try { n && n.blockerSettings && n.blockerSettings() } catch (e) { }
};

/** قواعد را از state به لایهٔ نیتیو می‌فرستد */
window.blockerSync = () => {
  const n = N();
  if (!n || !n.blockerSave) return false;
  const rules = {};
  PKGS.forEach(([pkg, , def]) => {
    const st = (S.blk2 && S.blk2[pkg]) || def;
    if (st === 'off') return;
    rules[pkg] = st === 'cap'
      ? { mode: 'cap', cap: pkg === 'org.telegram.messenger' ? 45 : 30 }
      : { mode: 'block' };
  });
  try { n.blockerSave(JSON.stringify(rules)); return true } catch (e) { return false }
};

window.blkCycle = pkg => {
  S.blk2 = S.blk2 || {};
  const cur = S.blk2[pkg] || (PKGS.find(p => p[0] === pkg) || [, , 'block'])[2];
  /* تلگرام هرگز کاملاً بلاک نمی‌شود — محیط کاری است */
  const order = pkg === 'org.telegram.messenger' ? ['cap', 'off'] : ['block', 'cap', 'off'];
  S.blk2[pkg] = order[(order.indexOf(cur) + 1) % order.length];
  sv(); window.blockerSync(); rd();
};

if (typeof module !== 'undefined') module.exports = { PKGS, LOCKED_VIEWS };
