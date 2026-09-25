/* ============================================================
   UNLOCK — قفل تدریجی و مسیر طلایی
   ۵۳ ویو در روز اول یعنی هیچ ویو.
   هر چیزی که باز می‌شود، با یک دلیل باز می‌شود.
   ============================================================ */

/* ---------- مسیر طلایی: ۳۰ روز اول، بدون انتخاب ----------
   هر روز یک کار. نه بیشتر. */
const GOLDEN = [
  [1,  'خواب دیشب را ثبت کن',      'slfix',  'تنها عددی که بقیه را تعیین می‌کند'],
  [2,  'حال و انرژی امروز',         'lg',     'دو ثانیه. بعداً الگویش را می‌بینی'],
  [3,  'اولین مهارت را بسنج: روپایی','fb_skill','نقطهٔ شروع باید عدد باشد نه حس'],
  [4,  'یک کوئست را تیک بزن',       'q',      'کوچک‌ترین برد ممکن'],
  [5,  'وزنت را ثبت کن',            'lg',     'ماهی یک بار کافی است'],
  [6,  'پای ضعیف را بسنج',          'fb_skill','اینجاست که از بقیه جلو می‌زنی'],
  [7,  'اولین ژورنال',              'lg',     'یک خط کافی است'],
  [8,  'اسپرینت ۲۰ متر',            'fb_skill','با گوشی کرنومتر بگیر'],
  [9,  'یک تمرین تصمیم',            'dec',    'ضعف اعلام‌شدهٔ خودت'],
  [10, 'قدت را ثبت کن',             'lg',     'صبح، بدون کفش، پشت به دیوار'],
  [12, 'اولین حدس در دفتر منتالیست','mt',     'حدس بزن، بعداً بسنج'],
  [14, 'لمس اول را بسنج',           'fb_skill','از ۲۰ توپ چند تا تمیز'],
  [16, 'یک تاکتیک دستکاری یاد بگیر','inf_def','تشخیص، نصف دفاع است'],
  [18, 'بعد از مسابقه، اسکن را ثبت کن','dec', 'مهم‌ترین عدد فوتبالت'],
  [21, 'پروتکل پوست را شروع کن',    'pr',     'پوست خشک + هیچ محصولی = شکاف'],
  [24, 'دو مهارت دیگر بسنج',        'fb_skill','هرچه بیشتر، کارت دقیق‌تر'],
  [27, 'یک تمرین میدانی منتالیست',  'mt',     'در دنیای واقعی، نه در ذهن'],
  [30, 'مرور ماه اول',              'st',     'ببین از کجا شروع کردی']
];

/* ---------- قفل ویوها ----------
   هر ویو یا از روز اول باز است، یا شرط دارد. */
const VIEW_GATE = {
  /* همیشه باز — هستهٔ روزانه */
  day: 0, q: 0, slfix: 0, lg: 0, me: 0, pf: 0,

  /* هفتهٔ اول */
  fb_skill: 3, dec: 5, calc: 5, buy: 2,

  /* هفتهٔ دوم */
  fb: 8, st: 7, gy: 7, nu: 7, honest: 10, mt: 12,

  /* هفتهٔ سوم */
  inf: 14, inf_def: 14, mx: 15, sys_readiness: 12,
  st_plan: 10, st_grade: 10, prep: 12, lineup: 14, team: 14,

  /* ماه دوم */
  mx_mind: 20, mx_body: 20, mx_look: 20, inf_nego: 22, mt_learn: 20,
  fb_iq: 18, sys_mind2: 20, sys_look2: 20, sys_psy: 24, pr: 21,
  st_stream: 25, st_tech: 18, ai: 20, tree: 25, ac: 25,

  /* بعداً */
  so: 30, mn: 30, wd: 28, sh: 26, iq: 35, ad: 35,
  sys_health: 30, sys_cal: 28, sys_foot2: 28, cr: 0,
  qa: 30, play: 30, nt: 40
};

/** روز چندم از شروع */
function dayNum(S) {
  if (!S || !S.startDate) return 999;          /* بدون شروع، همه باز */
  return Math.max(1, Math.floor((Date.now() - new Date(S.startDate)) / 864e5) + 1);
}

/** آیا این ویو باز است؟ */
function viewOpen(S, id) {
  if (!S || !S.startDate || S.obOff) return true;
  const gate = VIEW_GATE[id];
  if (gate === undefined) return true;          /* ویوی ناشناخته: باز */
  return dayNum(S) >= gate;
}

/** چند ویو قفل است */
function lockedCount(S) {
  if (!S || !S.startDate || S.obOff) return 0;
  const d = dayNum(S);
  return Object.values(VIEW_GATE).filter(g => g > d).length;
}

/** کار امروز از مسیر طلایی */
function goldenToday(S) {
  if (!S || !S.startDate || S.obOff) return null;
  const d = dayNum(S);
  if (d > 30) return null;
  const done = S.golden || [];
  /* دقیقاً کار امروز، یا نزدیک‌ترین کار عقب‌افتاده */
  /* عقب‌افتاده اول — مسیر ترتیبی است و پریدن از قدم، حلقه را می‌شکند */
  const behind = GOLDEN.filter(g => g[0] < d && !done.includes(g[0]));
  if (behind.length) return { ...gObj(behind[0]), late: true, lateBy: d - behind[0][0] };
  const exact = GOLDEN.find(g => g[0] === d && !done.includes(g[0]));
  if (exact) return { ...gObj(exact), late: false };
  return null;
}
function gObj(g) { return { day: g[0], task: g[1], view: g[2], why: g[3] }; }

/** پیشرفت مسیر طلایی */
function goldenProgress(S) {
  const done = (S && S.golden) || [];
  const d = dayNum(S);
  const due = GOLDEN.filter(g => g[0] <= d).length;
  return {
    done: done.length, total: GOLDEN.length, due,
    pc: Math.round(done.length / GOLDEN.length * 100),
    onTrack: done.length >= due - 1
  };
}

/* ============================================================
   ورود انبوه — یک جلسه، همهٔ مهارت‌ها
   ============================================================ */

/** مهارت‌های نسنجیده به ترتیب اهمیت برای پست کاربر */
function batchList(S) {
  const log = (S && S.fb) || {};
  const my = (S && S.fbpos) || 'CM';
  const todo = SKILL.filter(s => log[s[0]] === undefined);
  /* مهارت‌های کلیدی پست اول */
  return todo.sort((a, b) => {
    const ak = a[5].includes('all') || a[5].includes(my) ? 0 : 1;
    const bk = b[5].includes('all') || b[5].includes(my) ? 0 : 1;
    return ak - bk;
  });
}

/**
 * تخمین سریع: کم / متوسط / زیاد → عدد اولیه
 * بهتر از خالی ماندن. بعداً با سنجش واقعی جایگزین می‌شود.
 */
function estimate(key, level) {
  const s = SK_MAP[key];
  if (!s) return null;
  const m = s[3];
  const idx = level === 'low' ? 0 : level === 'mid' ? 2 : 3;
  return m[idx];
}

/** پارس متن آزاد: «روپایی ۵۰، پای ضعیف ۱۲» */
function parseSkills(txt) {
  if (!txt) return [];
  const out = [];
  const norm = String(txt).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  /* کلیدواژهٔ یکتای هر مهارت — نام کامل همیشه در متن آزاد نوشته نمی‌شود */
  const KEY = {
    juggle: ['روپایی'], weak: ['پای ضعیف', 'پای چپ'], first: ['لمس اول', 'کنترل اول'],
    shortp: ['پاس کوتاه'], longp: ['پاس بلند'], cone: ['دریبل', 'مخروط'],
    oneone: ['یک به یک', 'یک‌به‌یک'], finish: ['فینیش', 'گلزنی', 'شوت'],
    head: ['سر ', 'هوایی'], cross: ['سانتر'], sprint: ['اسپرینت', 'سرعت'],
    agil: ['چابکی', 'شاتل'], cooper: ['کوپر', 'دوی ۱۲', 'دوی 12'],
    vjump: ['پرش'], scan: ['اسکن']
  };
  const used = [];
  /* کلیدواژهٔ طولانی‌تر اول تا «پای ضعیف» پیش از «پای» بگیرد */
  const pairs = [];
  SKILL.forEach(s => (KEY[s[0]] || [s[1]]).forEach(k => pairs.push([s, k])));
  pairs.sort((a, b) => b[1].length - a[1].length);

  pairs.forEach(([s, kw]) => {
    if (out.some(o => o.k === s[0])) return;         /* هر مهارت یک بار */
    const i = norm.indexOf(kw);
    if (i < 0) return;
    if (used.some(([a, b]) => i < b && i + kw.length > a)) return;
    const after = norm.slice(i + kw.length, i + kw.length + 14);
    const m = after.match(/(\d+\.?\d*)/);
    if (!m) return;
    used.push([i, i + kw.length + m.index + m[1].length]);
    out.push({ k: s[0], n: s[1], v: +m[1] });
  });
  return out;
}

/* ============================================================
   بازخورد بیرونی — تنها دادهٔ غیرخوداظهاری
   ============================================================ */
const COACH_Q = [
  ['pos', 'پست امروز چطور بود؟'],
  ['good', 'چه چیزی خوب بود؟'],
  ['fix', 'چه چیزی را درست کنم؟'],
  ['pass', 'پاس‌هایم چطور بود؟']
];

/** تناقض بین خوداظهاری و بازخورد بیرونی */
function feedbackGap(S) {
  const cf = (S && S.coach) || [];
  if (cf.length < 2) return null;
  const mentions = {};
  cf.forEach(c => {
    const t = (c.fix || '') + ' ' + (c.good || '');
    ['پاس', 'دفاع', 'سرعت', 'تصمیم', 'سر', 'تمرکز', 'فیزیک'].forEach(k => {
      if (t.includes(k)) mentions[k] = (mentions[k] || 0) + 1;
    });
  });
  const top = Object.entries(mentions).sort((a, b) => b[1] - a[1])[0];
  return top ? { word: top[0], n: top[1], total: cf.length } : null;
}

if (typeof module !== 'undefined') module.exports = {
  GOLDEN, VIEW_GATE, dayNum, viewOpen, lockedCount,
  goldenToday, goldenProgress, batchList, estimate, parseSkills,
  COACH_Q, feedbackGap
};
