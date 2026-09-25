/* تاریخ محلی — هم‌راستا با td() در ui */
function _dstr(x){return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')}

/* ============================================================
   EXTRA — مرحلهٔ ۶
   شروع تدریجی · محرک لغزش · تست بدنی · بدهی خواب
   فصل ۱۲ هفته‌ای · لیست خرید
   ============================================================ */

/* ---------- ۱. شروع تدریجی: عادت‌ها هفته‌به‌هفته باز می‌شوند ---------- */
/* هفتهٔ ۱ سه عادت، بعد هر هفته دو تای دیگر. سیستم کامل از روز اول = رها کردن. */
const ONBOARD = [
  { w: 1, ids: ['sleep', 'water', 'jour'],
    t: 'پایه', d: 'خواب، آب، یک خط ژورنال. همین سه تا.' },
  { w: 2, ids: ['prot', 'skin'],
    t: 'بدن و پوست', d: 'پروتئین روزانه و روتین پوست.' },
  { w: 3, ids: ['train', 'jump'],
    t: 'حرکت', d: 'تمرین و پرش روزانه.' },
  { w: 4, ids: ['study', 'read'],
    t: 'ذهن', d: 'مطالعهٔ عمیق و کتاب کاغذی.' },
  { w: 5, ids: ['clean', 'screen'],
    t: 'انضباط', d: 'پاکی و سقف زمان صفحه.' },
  { w: 6, ids: ['post', 'cook', 'hard'],
    t: 'تکمیل', d: 'پوسچر، آشپزی، کار سخت. سیستم کامل شد.' }
];

/* هفتهٔ چندم از شروع */
function obWeek(S) {
  if (!S.startDate) return 99;                 // ثبت نشده = همه باز
  const d = Math.floor((Date.now() - new Date(S.startDate)) / 864e5);
  return Math.floor(d / 7) + 1;
}
/* آیا این کوئست الان باز است؟ */
function obOpen(S, id) {
  if (!S.startDate || S.obOff) return true;
  const w = obWeek(S);
  for (const st of ONBOARD) if (st.ids.includes(id)) return w >= st.w;
  return true;                                  // هرچه در فهرست نیست، باز
}
function obNext(S) {
  const w = obWeek(S);
  return ONBOARD.find(x => x.w > w) || null;
}
function obActive(S) {
  return !!S.startDate && !S.obOff && obWeek(S) <= 6;
}

/* ---------- ۲. محرک لغزش: چرا، نه فقط چند ---------- */
/* شمردن روز نمی‌گوید چرا می‌لغزی. این می‌گوید. */
const TRIGGERS = [
  ['tired',  'خستگی'],
  ['alone',  'تنهایی'],
  ['bored',  'بی‌حوصلگی'],
  ['stress', 'استرس'],
  ['social', 'بعد از شبکهٔ اجتماعی'],
  ['night',  'بیداری دیروقت'],
  ['sad',    'حال بد']
];
const TRG_MAP = Object.fromEntries(TRIGGERS.map(t => [t[0], t[1]]));

/* تحلیل: ساعت خطر، مکان خطر، محرک غالب */
function trgAnalyze(S) {
  const L = (S.urges || []).filter(x => x && typeof x.h === 'number');
  if (L.length < 5) return null;
  const byH = {};
  L.forEach(x => { const b = Math.floor(x.h / 3) * 3; byH[b] = (byH[b] || 0) + 1; });
  const hTop = Object.entries(byH).sort((a, b) => b[1] - a[1])[0];
  const byT = {};
  L.forEach(x => { if (x.t) byT[x.t] = (byT[x.t] || 0) + 1; });
  const tTop = Object.entries(byT).sort((a, b) => b[1] - a[1])[0];
  const resisted = L.filter(x => x.r).length;
  return {
    n: L.length,
    resisted,
    rate: Math.round(resisted / L.length * 100),
    hour: hTop ? +hTop[0] : null,
    hourPc: hTop ? Math.round(hTop[1] / L.length * 100) : 0,
    trg: tTop ? tTop[0] : null,
    trgPc: tTop ? Math.round(tTop[1] / L.length * 100) : 0
  };
}
/* راه‌حل مهندسی بر اساس محرک غالب — نه توصیهٔ اخلاقی */
function trgFix(k) {
  const F = {
    tired:  'خستگی محرک توست. یعنی مسئله خواب است نه اراده. ساعت خواب را ۳۰ دقیقه جلو بکش.',
    alone:  'تنهایی محرک توست. در آن ساعت از اتاق بیرون برو — پذیرایی، حیاط، بیرون.',
    bored:  'بی‌حوصلگی محرک توست. برای آن بازهٔ زمانی یک کار مشخص از قبل تعیین کن.',
    stress: 'استرس محرک توست. تنفس ۴-۷-۸ یا ۲۰ شنا، قبل از اینکه فکر بیاید.',
    social: 'شبکهٔ اجتماعی محرک توست. سقف زمانی را سفت کن و شب‌ها اپ را ببند.',
    night:  'بیداری دیروقت محرک توست. گوشی ساعت ۲۲ از اتاق بیرون می‌رود. این مهندسی است نه اراده.',
    sad:    'حال بد محرک توست. با یک نفر حرف بزن — این مؤثرتر از مقاومت تنهاست.'
  };
  return F[k] || 'داده را ادامه بده تا الگو روشن شود.';
}

/* ---------- ۳. تست‌های دورهٔ بدنی: آینه دروغ می‌گوید، عدد نه ---------- */
const FTEST = [
  ['sprint', 'سرعت ۲۰ متر', 'ثانیه', 1, 'کمتر بهتر — با گوشی کرنومتر بگیر'],
  ['vjump',  'پرش عمودی',   'cm',    0, 'کنار دیوار، گچ روی انگشت'],
  ['pushup', 'شنا بیشینه',  'تکرار', 0, 'تا ناتوانی، فرم درست'],
  ['plank',  'پلانک',       'ثانیه', 0, 'تا شکستن فرم'],
  ['sitreach','انعطاف',     'cm',    0, 'نشسته، دست به پنجه'],
  ['run',    'دوی ۱۲ دقیقه','متر',   0, 'تست کوپر — استقامت']
];
const FT_MAP = Object.fromEntries(FTEST.map(f => [f[0], f]));

/* آخرین و قبلی برای مقایسه */
function ftLast(S, k) {
  const L = (S.ftest || []).filter(x => x.k === k).sort((a, b) => a.d < b.d ? -1 : 1);
  return { last: L[L.length - 1] || null, prev: L[L.length - 2] || null, all: L };
}
function ftDelta(S, k) {
  const { last, prev } = ftLast(S, k);
  if (!last || !prev) return null;
  const lower = FT_MAP[k] && FT_MAP[k][3] === 1;
  const diff = last.v - prev.v;
  const better = lower ? diff < 0 : diff > 0;
  const pc = prev.v ? Math.abs(diff / prev.v * 100) : 0;
  return { diff, better, pc: Math.round(pc * 10) / 10 };
}
/* هر ۶ هفته موعد تست */
function ftDue(S) {
  const all = (S.ftest || []);
  if (!all.length) return true;
  const last = all.map(x => x.d).sort().pop();
  return (Date.now() - new Date(last)) / 864e5 >= 42;
}

/* ---------- ۴. بدهی خواب: یک شب بد، سه روز اثر ---------- */
function sleepDebt(S) {
  /* نیاز خواب از پروفایل شخصی */
  const NEED = (typeof prof === 'function') ? prof(S).sleepNeed : 8.5;
  const L = S.sleepLog || {};
  const keys = Object.keys(L).sort().slice(-7);
  if (!keys.length) return null;
  let debt = 0;
  keys.forEach(k => { const h = +L[k]; if (!isNaN(h)) debt += Math.max(0, NEED - h); });
  const avg = keys.reduce((a, k) => a + (+L[k] || 0), 0) / keys.length;
  return {
    debt: Math.round(debt * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    nights: keys.length,
    need: NEED,
    /* بدهی بالای ۵ ساعت یعنی افت محسوس تمرکز و ریکاوری */
    bad: debt >= 5
  };
}
/* ساعت خواب پیشنهادی امشب: اگر فردا مهم است، زودتر */
function sleepTarget(S, tomorrowBig) {
  const d = sleepDebt(S);
  let extra = 0;
  if (d && d.debt >= 3) extra += 30;
  if (tomorrowBig) extra += 30;
  return extra;                            // دقیقه زودتر از ساعت عادی
}

/* ---------- ۵. فصل ۱۲ هفته‌ای: نقطهٔ پایان و شروع تازه ---------- */
const SEASON_LEN = 84;                     // روز
function seasonNow(S) {
  if (!S.startDate) return null;
  const d = Math.floor((Date.now() - new Date(S.startDate)) / 864e5);
  const n = Math.floor(d / SEASON_LEN) + 1;
  const dayIn = d % SEASON_LEN;
  return {
    n,
    day: dayIn + 1,
    left: SEASON_LEN - dayIn,
    pc: Math.round((dayIn + 1) / SEASON_LEN * 100),
    week: Math.floor(dayIn / 7) + 1
  };
}

/* ---------- ۶. لیست خرید از برنامهٔ غذایی ---------- */
/* دسته‌بندی بر اساس قفسهٔ فروشگاه تا دوبار نچرخی */
const SHOP = {
  'لبنیات': ['شیر', 'ماست', 'پنیر', 'کره'],
  'پروتئین': ['تخم‌مرغ', 'مرغ', 'گوشت چرخ‌کرده', 'ماهی', 'حبوبات'],
  'نان و غلات': ['نان سبوس‌دار', 'برنج', 'ماکارونی', 'جو دوسر'],
  'میوه و سبزی': ['موز', 'سیب', 'خیار', 'گوجه', 'کاهو', 'پیاز', 'سیب‌زمینی'],
  'خشکبار': ['خرما', 'گردو', 'بادام', 'کشمش'],
  'متفرقه': ['روغن زیتون', 'عسل']
};
/* اقلامی که هرگز نباید پیشنهاد شوند */
const SHOP_NEVER = ['کدو', 'بادمجان'];

function shopList(S) {
  const out = [];
  /* محدودیت‌ها از پروفایل کاربر می‌آیند، نه فهرست ثابت */
  const banned = (typeof prof === 'function')
    ? [...(prof(S).dislikes || []), ...(prof(S).allergies || [])]
    : SHOP_NEVER;
  Object.keys(SHOP).forEach(cat => {
    const items = SHOP[cat].filter(x => !banned.some(n => n && x.includes(n)));
    items.forEach(it => {
      const id = cat + '|' + it;
      out.push({ id, cat, t: it, on: !!(S.shop && S.shop[id]) });
    });
  });
  return out;
}
function shopCount(S) {
  const l = shopList(S);
  return { total: l.length, got: l.filter(x => x.on).length };
}

if (typeof module !== 'undefined') module.exports = {
  ONBOARD, obWeek, obOpen, obNext, obActive,
  TRIGGERS, TRG_MAP, trgAnalyze, trgFix,
  FTEST, FT_MAP, ftLast, ftDelta, ftDue,
  sleepDebt, sleepTarget,
  SEASON_LEN, seasonNow,
  SHOP, SHOP_NEVER, shopList, shopCount
};

/* ============================================================
   مرحلهٔ ۷ — قد · تنفس · خانواده · یک سال پیش
   ============================================================ */

/* ---------- ۱. منحنی رشد قد ---------- */
/* در ۱۴ سالگی جذاب‌ترین نمودار همین است */
function htAdd(S, cm) {
  if (!Array.isArray(S.hts)) S.hts = [];
  const d = _dstr(new Date());
  const i = S.hts.findIndex(x => x.d === d);
  if (i >= 0) S.hts[i].v = cm; else S.hts.push({ d, v: cm });
  S.hts.sort((a, b) => a.d < b.d ? -1 : 1);
  return S.hts;
}
function htStats(S) {
  const L = (S.hts || []).filter(x => x && typeof x.v === 'number');
  if (!L.length) return null;
  const first = L[0], last = L[L.length - 1];
  const days = Math.max(1, (new Date(last.d) - new Date(first.d)) / 864e5);
  const grown = last.v - first.v;
  /* نرخ سالانه — در جهش رشد نوجوانی ۵ تا ۹ سانت طبیعی است */
  const perYear = days >= 30 ? Math.round(grown / days * 365 * 10) / 10 : null;
  return {
    n: L.length, first: first.v, last: last.v,
    grown: Math.round(grown * 10) / 10,
    perYear, days: Math.round(days),
    spurt: perYear !== null && perYear >= 5
  };
}

/* ---------- ۲. تمرین تنفس ۴-۷-۸ ---------- */
/* قبل امتحان و مسابقه. اثرش روی ضربان قلب واقعی است */
const BREATH = [
  ['in', 4, 'دم از بینی'],
  ['hold', 7, 'نگه دار'],
  ['out', 8, 'بازدم از دهان']
];
function breathTotal(cycles) {
  return (4 + 7 + 8) * (cycles || 4);
}

/* ---------- ۳. یادآور خانواده ---------- */
/* ساده ولی اثرش زیاد است */
const FAM = [
  ['gp', 'پدربزرگ و مادربزرگ', 7],
  ['par', 'گفتگوی بی‌گوشی با پدر یا مادر', 3],
  ['sib', 'وقت با خواهر یا برادر', 5]
];
function famDue(S) {
  const out = [];
  FAM.forEach(([k, t, cad]) => {
    const last = (S.fam && S.fam[k]) || null;
    const days = last ? Math.floor((Date.now() - new Date(last)) / 864e5) : 999;
    out.push({ k, t, cad, last, days, due: days >= cad });
  });
  return out;
}
function famLog(S, k) {
  if (!S.fam) S.fam = {};
  S.fam[k] = _dstr(new Date());
  return S.fam;
}
/* تشخیص انزوا: چند روز بدون هیچ تعامل حضوری */
function isolationDays(S) {
  const dates = [];
  (S.inter || []).forEach(x => { if (x && x.d && (x.k === 'meet' || x.k === 'deep' || x.k === 'play')) dates.push(x.d); });
  Object.values(S.fam || {}).forEach(d => dates.push(d));
  if (!dates.length) return null;
  const last = dates.sort().pop();
  return Math.floor((Date.now() - new Date(last)) / 864e5);
}

/* ---------- ۴. یک سال پیش امروز ---------- */
/* قوی‌ترین حس پیشرفت */
function yearAgo(S) {
  const t = new Date();
  const target = _dstr(new Date(t.getFullYear() - 1, t.getMonth(), t.getDate()));
  const j = (S.jr || []).find(x => x.d === target);
  const w = (S.wt || []).length > 1 ? S.wt[0] : null;
  const h = (S.hts || []).find(x => x.d <= target);
  return (j || h) ? { date: target, jr: j || null, ht: h || null } : null;
}
/* خاطرهٔ N روز پیش وقتی یک سال داده نداریم */
function memoryBack(S, days) {
  const target = _dstr(new Date(Date.now() - days * 864e5));
  const j = (S.jr || []).find(x => x.d === target);
  return j ? { date: target, jr: j, days } : null;
}

if (typeof module !== 'undefined') Object.assign(module.exports, {
  htAdd, htStats, BREATH, breathTotal,
  FAM, famDue, famLog, isolationDays, yearAgo, memoryBack
});

/* ============================================================
   BRIEF — یک جمله، نه یک داشبورد
   اپ باید اول حرف بزند، نه منتظر بماند تو بروی سراغش.
   ============================================================ */

/**
 * مهم‌ترین جملهٔ همین لحظه را برمی‌گرداند.
 * ترتیب اولویت: هشدار سلامت > تعارض برنامه > فرصت > تشویق.
 * اگر چیزی برای گفتن نیست null — اپی که هر روز حرف بزند نویز است.
 */
function brief(S, ctx) {
  const c = ctx || {};
  const hour = c.hour !== undefined ? c.hour : new Date().getHours();
  const out = [];

  /* ۱. بدهی خواب + روز تمرین = ریسک آسیب */
  const sd = sleepDebt(S);
  if (sd && sd.bad && c.training) {
    out.push({ p: 1, ic: '✚', t: 'دیشب کم خوابیدی و امروز تمرین داری. شدت را کم کن — در سن تو کم‌خوابی و بار زیاد با هم، آسیب می‌سازد.' });
  } else if (sd && sd.bad) {
    out.push({ p: 2, ic: '●', t: 'بدهی خواب هفتگی‌ات ' + Math.round(sd.debt) + ' ساعت است. امشب زودتر بخواب — این بیشترین اثر را روی قد و تمرکز دارد.' });
  }

  /* ۲. روند نزولی حال */
  const j7 = (S.jr || []).slice(-7).filter(x => x.m);
  if (j7.length >= 5) {
    const low = j7.filter(x => +x.m <= 2).length;
    if (low >= 5) out.push({ p: 1, ic: '◈', t: 'پنج روز از هفت روز گذشته حالت پایین بوده. با یک بزرگ‌تر که بهش اعتماد داری حرف بزن.' });
  }

  /* ۳. ساعت خطر وسوسه */
  const tg = trgAnalyze(S);
  if (tg && tg.hour !== null && hour >= tg.hour && hour < tg.hour + 3 && tg.n >= 5) {
    out.push({ p: 2, ic: '▲', t: 'این بازه ساعت خطر توست. ' + trgFix(tg.trg) });
  }

  /* ۴. استریک در آستانهٔ رکورد */
  const st = S.streak || {}, bs = S.best || {};
  ['clean', 'train', 'sleep'].forEach(k => {
    if (st[k] && bs[k] && st[k] === bs[k] - 1 && st[k] > 5)
      out.push({ p: 3, ic: '◆', t: 'یک روز تا شکستن رکورد ' + bs[k] + ' روزه‌ات مانده.' });
  });

  /* ۵. تست بدنی سررسید */
  if (ftDue(S) && (S.ftest || []).length > 0)
    out.push({ p: 4, ic: '◎', t: 'شش هفته از آخرین تست بدنی گذشته. امروز دوباره بسنج تا پیشرفت را با عدد ببینی.' });

  /* ۶. خانواده — فقط وقتی قبلاً ثبتی بوده.
        کاربر تازه نباید با یادآوری چیزی که هرگز شروع نکرده روبه‌رو شود. */
  if (S.fam && Object.keys(S.fam).length) {
    const fam = famDue(S).filter(f => f.due && f.last && f.days > f.cad * 2);
    if (fam.length) out.push({ p: 4, ic: '◈', t: fam[0].t + ' — ' + fam[0].days + ' روز گذشته. یک تماس کوتاه کافی است.' });
  }

  /* ۷. انزوا */
  const iso = isolationDays(S);
  if (iso !== null && iso >= 5)
    out.push({ p: 3, ic: '◇', t: iso + ' روز است تعامل حضوری ثبت نشده. امروز یک نفر را ببین.' });

  if (!out.length) return null;
  out.sort((a, b) => a.p - b.p);
  return out[0];
}

if (typeof module !== 'undefined') Object.assign(module.exports, { brief });
