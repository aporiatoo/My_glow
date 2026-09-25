/* ============================================================
   PROFILE — شخصی‌سازی کامل
   همهٔ اعداد سیستم از اینجا می‌آیند، نه از ثابت‌های پراکنده.
   با تغییر یک مقدار، کل اپ خودش را تنظیم می‌کند.
   ============================================================ */

/* پیش‌فرض‌های پروفایل شخصی */
const PROF_DEF = {
  /* --- هویت --- */
  name: '',
  birth: [1390, 7, 11],
  height: 165,

  /* --- ساعات --- */
  wake: '05:00',
  sleep: '21:00',
  sleepNeed: 8.5,              // ساعت — در دورهٔ رشد

  /* --- مدرسه --- */
  grade: 9,
  schoolDays: [6, 0, 1, 2, 3], // شنبه تا چهارشنبه
  schoolStart: '07:00',
  schoolEnd: '12:30',

  /* --- فوتبال --- */
  clubDays: [0, 2, 4],         // یکشنبه، سه‌شنبه، پنجشنبه
  clubStart: '14:00',
  clubEnd: '15:30',
  position: '',                // خالی = سیستم خودش پیشنهاد می‌دهد
  footStrong: 'right',

  /* --- تغذیه --- */
  protein: 110,                // گرم روزانه
  water: 2500,                 // میلی‌لیتر
  dislikes: ['کدو', 'بادمجان'],
  allergies: [],

  /* --- تمرین --- */
  gymMode: false,              // وزنه — فعلاً خاموش، خانگی با وزن بدن
  trainDays: 5,

  /* --- اهداف شخصی --- */
  goalHeight: 185,
  goalGPA: 19,
  targetPos: '',

  /* --- سبک --- */
  tone: 'data',                // data | warm
  lang: 'fa',
  barberWeeks: 4
};

/** پروفایل فعال: پیش‌فرض + تغییرات کاربر */
function prof(S) {
  const p = Object.assign({}, PROF_DEF, (S && S.prof) || {});
  /* اعتبارسنجی: مقادیر بی‌معنی به پیش‌فرض برگردند */
  if (typeof p.sleepNeed !== 'number' || p.sleepNeed < 6 || p.sleepNeed > 11) p.sleepNeed = 8.5;
  if (typeof p.protein !== 'number' || p.protein < 40 || p.protein > 250) p.protein = 110;
  if (typeof p.water !== 'number' || p.water < 1000 || p.water > 6000) p.water = 2500;
  if (typeof p.height !== 'number' || p.height < 100 || p.height > 230) p.height = 165;
  if (!Array.isArray(p.dislikes)) p.dislikes = PROF_DEF.dislikes.slice();
  if (!Array.isArray(p.clubDays)) p.clubDays = PROF_DEF.clubDays.slice();
  if (!Array.isArray(p.schoolDays)) p.schoolDays = PROF_DEF.schoolDays.slice();
  return p;
}

/** سن دقیق از تاریخ تولد شمسی */
function profAge(S) {
  const p = prof(S);
  try {
    const g = toGregorian(p.birth[0], p.birth[1], p.birth[2]);
    const b = new Date(g[0], g[1] - 1, g[2]);
    return Math.floor((Date.now() - b) / (365.25 * 864e5));
  } catch (e) { return 14; }
}

/** آیا امروز روز باشگاه است */
function isClubDay(S, dow) {
  const d = dow === undefined ? new Date().getDay() : dow;
  return prof(S).clubDays.includes(d);
}
function isSchoolDay(S, dow) {
  const d = dow === undefined ? new Date().getDay() : dow;
  return prof(S).schoolDays.includes(d);
}

/** آیا این غذا مجاز است — محدودیت‌ها در سطح داده اعمال می‌شوند */
function foodOk(S, name) {
  const p = prof(S);
  const bad = [...(p.dislikes || []), ...(p.allergies || [])];
  return !bad.some(x => x && String(name).includes(x));
}

/** فهرست را از موارد ممنوع پاک می‌کند */
function foodFilter(S, list) {
  return (list || []).filter(x => foodOk(S, typeof x === 'string' ? x : (x.t || x.name || '')));
}

/* ============================================================
   اهداف شخصی — پیشرفت به سمت چیزی که خودت تعیین کردی
   ============================================================ */
function goals(S) {
  const p = prof(S);
  const out = [];

  /* قد */
  const h = (S.hts || []).filter(x => x && typeof x.v === 'number');
  const curH = h.length ? h[h.length - 1].v : p.height;
  if (p.goalHeight > curH) {
    out.push({
      k: 'height', ic: '↥', t: 'قد',
      cur: curH, goal: p.goalHeight, unit: 'cm',
      pc: Math.round(Math.min(100, curH / p.goalHeight * 100)),
      note: (p.goalHeight - curH) + ' سانت مانده'
    });
  }

  /* معدل */
  if (typeof gpa === 'function') {
    try {
      const g = gpa(S);
      const cur = typeof g === 'number' ? g : (g && g.v) || 0;
      if (cur > 0) out.push({
        k: 'gpa', ic: '▦', t: 'معدل',
        cur: Math.round(cur * 100) / 100, goal: p.goalGPA, unit: '',
        pc: Math.round(Math.min(100, cur / p.goalGPA * 100)),
        note: cur >= p.goalGPA ? 'رسیدی' : (Math.round((p.goalGPA - cur) * 100) / 100) + ' نمره مانده'
      });
    } catch (e) { }
  }

  /* پست هدف */
  if (p.targetPos && typeof posFit === 'function') {
    const fit = posFit(S, p.targetPos);
    const pos = typeof POS !== 'undefined' ? POS.find(x => x[0] === p.targetPos) : null;
    out.push({
      k: 'pos', ic: '⚽', t: pos ? pos[1] : p.targetPos,
      cur: fit, goal: 100, unit: '٪',
      pc: fit, note: 'تناسب با پست هدف'
    });
  }

  /* پروتئین امروز */
  const pr = (S.protDay && S.protDay.d === (typeof td === 'function' ? td() : '')) ? S.protDay.g : 0;
  if (pr > 0) out.push({
    k: 'protein', ic: '▲', t: 'پروتئین امروز',
    cur: pr, goal: p.protein, unit: 'g',
    pc: Math.round(Math.min(100, pr / p.protein * 100)),
    note: pr >= p.protein ? 'رسیدی' : (p.protein - pr) + ' گرم مانده'
  });

  return out;
}

/** خلاصهٔ پروفایل برای نمایش */
function profRows(S) {
  const p = prof(S);
  const DOW = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  return [
    ['نام', p.name || '—'],
    ['سن', profAge(S) + ' سال'],
    ['پایه', p.grade],
    ['قد', p.height + ' cm'],
    ['بیداری', p.wake],
    ['خواب', p.sleep],
    ['نیاز خواب', p.sleepNeed + ' ساعت'],
    ['روزهای باشگاه', p.clubDays.map(d => DOW[d]).join('، ')],
    ['ساعت باشگاه', p.clubStart + ' – ' + p.clubEnd],
    ['پای برتر', p.footStrong === 'right' ? 'راست' : 'چپ'],
    ['پروتئین', p.protein + ' g'],
    ['آب', p.water + ' ml'],
    ['نمی‌خورم', (p.dislikes || []).join('، ') || '—'],
    ['هدف قد', p.goalHeight + ' cm'],
    ['هدف معدل', p.goalGPA]
  ];
}

if (typeof module !== 'undefined') module.exports = {
  PROF_DEF, prof, profAge, isClubDay, isSchoolDay,
  foodOk, foodFilter, goals, profRows
};
