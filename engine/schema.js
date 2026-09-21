/* ============================================================
   SCHEMA — اعتبارسنجی و مهاجرت داده
   جایگزین repair() دستی: یک توصیف اعلانی که خودش کار می‌کند.
   ============================================================ */

/** نسخهٔ فعلی ساختار داده. با هر تغییر ناسازگار یکی بالا می‌رود. */
const SCHEMA_VERSION = 3;

/* انواع مجاز و پیش‌فرضشان.
   هر کلید: [نوع, پیش‌فرض, اعتبارسنج اختیاری] */
const SCHEMA = {
  // --- هسته ---
  v:        ['num',  SCHEMA_VERSION],
  xp:       ['num',  0,    v => v >= 0],
  done:     ['obj',  {}],
  q:        ['obj',  {}],
  logs:     ['arr',  []],
  notif:    ['bool', 1],

  // --- استریک ---
  streak:   ['shape', { clean: 0, train: 0, sleep: 0, screen: 0 }],
  best:     ['shape', { clean: 0, train: 0, sleep: 0, screen: 0 }],
  comeback: ['any',  null],

  // --- حالت‌ها ---
  mode:     ['any',  null],
  ramadan:  ['any',  null],
  season:   ['str',  'summer'],
  lang:     ['str',  'fa'],

  // --- آنبوردینگ و فصل ---
  startDate:['any',  null],
  obOff:    ['bool', 0],

  // --- بدن ---
  wt:       ['arr',  [65], a => a.filter(x => typeof x === 'number' && x > 0 && x < 300)],
  hts:      ['arr',  [],   a => a.filter(x => x && x.d && typeof x.v === 'number' && x.v > 80 && x.v < 250)],
  wo:       ['arr',  []],
  ft:       ['arr',  []],
  ms:       ['arr',  []],
  fit:      ['arr',  []],
  ftest:    ['arr',  [],   a => a.filter(x => x && x.k && typeof x.v === 'number')],
  sleepLog: ['obj',  {}],
  lifts:    ['obj',  {}],
  gymMode:  ['bool', 0],

  // --- ذهن و درس ---
  jr:       ['arr',  []],
  srs:      ['arr',  []],
  mistakes: ['arr',  []],
  grades:   ['obj',  {}],
  stLog:    ['obj',  {}],
  hw:       ['arr',  []],
  stSess:   ['arr',  []],
  exams:    ['arr',  []],
  stream:   ['any',  null],
  focus:    ['obj',  {}],

  // --- انضباط ---
  urges:    ['arr',  [],   a => a.filter(x => x && typeof x.h === 'number')],
  skips:    ['arr',  []],
  contract: ['any',  null],
  crisis:   ['num',  0],

  // --- روابط ---
  ppl:      ['arr',  [],   a => a.filter(x => x && x.n)],
  inter:    ['arr',  [],   a => a.filter(x => x && x.p && x.k && x.d)],
  fam:      ['obj',  {}],

  // --- سایر ---
  tx:       ['arr',  []],
  goal:     ['num',  0],
  photos:   ['arr',  []],
  cook:     ['arr',  []],
  hist:     ['arr',  []],
  hist2:    ['arr',  []],
  ach:      ['arr',  []],
  boss:     ['any',  null],
  tree:     ['arr',  []],
  prot:     ['obj',  {}],
  mir:      ['obj',  {}],
  hair:     ['arr',  []],
  exit:     ['obj',  {}],
  ev:       ['arr',  []],
  barber:   ['any',  null],
  shop:     ['obj',  {}],
  sub:      ['obj',  {}],
  links:    ['arr',  []],
  games:    ['arr',  []],
  cmpWk:    ['num',  0],
  tbr:      ['str',  'body'],
  playLog:  ['obj',  {}],
  playPend: ['any',  null],
  hcount:   ['num',  0,    v => v >= 0],
  sec:      ['any',  null],
  flat:     ['bool', false],
  compact:  ['bool', 0],
  amoled:   ['bool', 0],
  fsz:      ['num',  0],
  bkWk:     ['num',  0],
  stat:     ['shape', { body: 32, look: 28, mind: 38, disc: 15, social: 30, money: 8 }],
  blk:      ['shape', { ig: 1, ir: 1, x: 1, adult: 1, games: 1, short: 1, tg: 0 }]
};

/**
 * یک مقدار را بر اساس توصیف اسکیما تمیز می‌کند.
 * هرگز throw نمی‌کند — بدترین حالت، پیش‌فرض برمی‌گرداند.
 */
function coerce(type, value, fallback, check) {
  const clone = () => JSON.parse(JSON.stringify(fallback));
  switch (type) {
    case 'num':
      if (typeof value !== 'number' || isNaN(value)) return fallback;
      return (check && !check(value)) ? fallback : value;
    case 'str':
      return typeof value === 'string' ? value : fallback;
    case 'bool':
      return (value === 1 || value === 0 || value === true || value === false)
        ? value : fallback;
    case 'arr': {
      if (!Array.isArray(value)) return clone();
      return check ? check(value) : value;
    }
    case 'obj':
      return (value && typeof value === 'object' && !Array.isArray(value))
        ? value : clone();
    case 'shape': {
      const out = (value && typeof value === 'object' && !Array.isArray(value))
        ? value : {};
      for (const k in fallback) {
        if (typeof out[k] !== 'number' || isNaN(out[k])) out[k] = fallback[k];
      }
      return out;
    }
    default:
      return value === undefined ? fallback : value;
  }
}

/* ---------- مهاجرت‌ها ----------
   هر تابع داده را از نسخهٔ قبل به نسخهٔ خودش می‌برد.
   داده‌ای که نسخه ندارد، نسخهٔ ۱ فرض می‌شود. */
const MIGRATIONS = {
  2: s => {
    // نسخهٔ ۲: streak/best از عدد ساده به شیء تبدیل شدند
    if (typeof s.streak === 'number') s.streak = { clean: s.streak, train: 0, sleep: 0, screen: 0 };
    if (typeof s.best === 'number') s.best = { clean: s.best, train: 0, sleep: 0, screen: 0 };
    return s;
  },
  3: s => {
    // نسخهٔ ۳: تاریخ‌ها از UTC به محلی رفتند.
    // ثبت‌های قدیمی ممکن است یک روز جابه‌جا باشند ولی قابل بازسازی نیستند،
    // پس فقط ساختارهای جدید را تضمین می‌کنیم.
    if (!Array.isArray(s.hts)) s.hts = [];
    if (!Array.isArray(s.urges)) s.urges = [];
    if (!Array.isArray(s.ftest)) s.ftest = [];
    if (!s.fam || typeof s.fam !== 'object') s.fam = {};
    if (!s.shop || typeof s.shop !== 'object') s.shop = {};
    return s;
  }
};

/**
 * نقطهٔ ورود: داده را مهاجرت می‌دهد، اعتبارسنجی می‌کند و برمی‌گرداند.
 * @returns {{state: object, migrated: number[], dropped: string[]}}
 */
function migrate(raw) {
  const state = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
  const from = typeof state.v === 'number' ? state.v : 1;
  const applied = [];

  for (let v = from + 1; v <= SCHEMA_VERSION; v++) {
    const fn = MIGRATIONS[v];
    if (!fn) continue;
    try { fn(state); applied.push(v); }
    catch (e) { /* مهاجرت شکست خورد — اسکیما در ادامه نجاتش می‌دهد */ }
  }

  // اعتبارسنجی همهٔ کلیدهای شناخته‌شده
  for (const key in SCHEMA) {
    const [type, def, check] = SCHEMA[key];
    state[key] = coerce(type, state[key], def, check);
  }

  // کلیدهای ناشناخته را نگه می‌داریم (ممکن است از نسخهٔ جدیدتر باشند)
  const dropped = [];
  state.v = SCHEMA_VERSION;
  return { state, migrated: applied, dropped };
}

/** فشرده‌سازی: ثبت‌های قدیمی‌تر از یک سال حذف می‌شوند تا داده بی‌حد رشد نکند */
function compact(state, maxDays = 400) {
  const cut = new Date(Date.now() - maxDays * 864e5);
  const cutStr = cut.getFullYear() + '-' +
    String(cut.getMonth() + 1).padStart(2, '0') + '-' +
    String(cut.getDate()).padStart(2, '0');
  let removed = 0;

  ['done', 'q'].forEach(k => {
    const o = state[k];
    if (!o) return;
    Object.keys(o).forEach(key => {
      const d = key.split('|')[0];
      if (d && d < cutStr) { delete o[key]; removed++; }
    });
  });

  ['jr', 'wo', 'inter'].forEach(k => {
    if (!Array.isArray(state[k])) return;
    const before = state[k].length;
    state[k] = state[k].filter(x => !x || !x.d || x.d >= cutStr);
    removed += before - state[k].length;
  });

  return removed;
}

if (typeof module !== 'undefined') module.exports = {
  SCHEMA_VERSION, SCHEMA, MIGRATIONS, coerce, migrate, compact
};
