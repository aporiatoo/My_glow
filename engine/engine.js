/* ============================================================
   ENGINE — اتصال جزیره‌ها
   تا الان هر سیستم داده‌اش را جدا نگه می‌داشت.
   اینجا همه به هم وصل می‌شوند: ورودی یک بخش، خروجی بخش دیگر.
   ============================================================ */

/* ============================================================
   ۱. سقف روزانه — ۴۹۹ آیتم بدون سقف یعنی فلج
   ============================================================ */
const DAILY_CAP = 3;

/**
 * سه کار امروز، انتخاب‌شده از کل سیستم بر پایهٔ فوریت.
 * نه فهرست — انتخاب.
 */
function todayThree(S) {
  const out = [];
  const push = (p, ic, t, why, view, id) => out.push({ p, ic, t, why, view, id });

  /* ۱. مسیر طلایی مقدم بر همه‌چیز است */
  if (typeof goldenToday === 'function') {
    const g = goldenToday(S);
    if (g) push(1, '★', g.task, g.why, g.view, 'golden' + g.day);
  }

  /* ۲. بحران خواب */
  if (typeof sleepPlan === 'function') {
    const sl = sleepPlan(S);
    if (sl && !sl.done) {
      const d = td();
      const logged = (S.sleepLog || {})[d] !== undefined;
      if (!logged) push(1, '●', 'خواب دیشب را ثبت کن',
        'هدف امشب ' + sl.targetStr, 'slfix', 'sleep');
    }
  }

  /* ۳. بازخورد مربی → تمرین مربوطه */
  const cg = (typeof feedbackGap === 'function') ? feedbackGap(S) : null;
  if (cg && cg.word === 'پاس') {
    const done = (S.decDrill || []).length;
    if (done < 8) push(2, '◈', 'تمرین تصمیم‌گیری',
      'مربی روی پاس تأکید کرده — ' + cg.n + ' بار', 'dec', 'deccoach');
  }

  /* ۴. مهارت سنجیده‌نشده */
  if (typeof player === 'function') {
    const pl = player(S);
    if (pl.tested < 5) push(2, '◎', 'یک مهارت فوتبال را بسنج',
      pl.untested.length + ' مهارت هنوز عدد ندارد', 'batch', 'measure');
  }

  /* ۵. بازبینی سررسیدشده */
  const due = retestDue(S);
  if (due.length) push(2, '↻', 'بازبینی ' + due[0].n,
    'شش هفته از آخرین سنجش گذشته', 'fb_skill', 'retest');

  /* ۶. درس روز */
  if (typeof lessonToday === 'function') {
    const l = lessonToday(S);
    if (l) push(3, '▶', l.t, l.trackName + ' · ' + l.min + ' دقیقه', 'learn', 'lesson');
  }

  /* ۷. ریزمهارت */
  if (typeof miniToday === 'function') {
    const m = miniToday(S);
    if (m) push(4, '◦', m.t, m.min + ' دقیقه', 'mini', 'mini');
  }

  /* ۸. کوئست ناتمام */
  {
    const d = td();
    const open = (typeof QUESTS !== 'undefined' ? QUESTS : [])
      .filter(q => !S.q[d + '|' + q[0]] &&
                   (typeof obOpen !== 'function' || obOpen(S, q[0])));
    if (open.length > 3) push(4, '⚔', 'کوئست‌های امروز',
      open.length + ' مانده', 'q', 'quests');
  }

  out.sort((a, b) => a.p - b.p);
  const done = (S.capDone && S.capDone.d === td()) ? S.capDone.ids : [];
  return {
    items: out.slice(0, DAILY_CAP).map(x => ({ ...x, done: done.includes(x.id) })),
    more: Math.max(0, out.length - DAILY_CAP),
    doneCount: done.length
  };
}

/* ============================================================
   ۲. بازبینی دوره‌ای — سنجش یک‌باره بی‌معنی است
   ============================================================ */
const RETEST_DAYS = 42;

function retestDue(S) {
  const log = (S && S.fbDate) || {};
  const fb = (S && S.fb) || {};
  const out = [];
  (typeof SKILL !== 'undefined' ? SKILL : []).forEach(s => {
    if (fb[s[0]] === undefined) return;
    const last = log[s[0]];
    if (!last) { out.push({ k: s[0], n: s[1], days: 999 }); return; }
    const days = Math.floor((Date.now() - new Date(last)) / 864e5);
    if (days >= RETEST_DAYS) out.push({ k: s[0], n: s[1], days });
  });
  return out.sort((a, b) => b.days - a.days);
}

/* ============================================================
   ۳. اتصال: درس دیده‌شده → امتیاز سیستم مربوطه
   نگاشت درس‌های کلیدی به آیتم‌هایی که باید باز شوند
   ============================================================ */
const LESSON_LINK = {
  /* درس اسکن → هوش بازی */
  f32: { sys: 'fbiq', id: 'scan' },
  f33: { sys: 'fbiq', id: 'body' },
  f35: { sys: 'fbiq', id: 'third' },
  /* درس‌های ذهن → تسلط ذهنی */
  m11: { sys: 'mind2', part: 'model', id: 'first' },
  m21: { sys: 'ment', part: 'mem', id: 'palace' },
  m22: { sys: 'ment', part: 'mem', id: 'name' },
  c11: { sys: 'ment', part: 'obs', id: 'posture' },
  c12: { sys: 'mind2', part: 'micro', id: 'happy' },
  c31: { sys: 'mind2', part: 'infl', id: 'recip' },
  c32: { sys: 'inf', part: 'nego', id: 'mirror' },
  c51: { sys: 'inf', part: 'known', id: 'guilt' }
};

/** وقتی درسی دیده شد، امتیاز مربوطه هم باز می‌شود */
function applyLesson(S, lessonId) {
  const link = LESSON_LINK[lessonId];
  if (!link) return null;
  try {
    if (link.sys === 'fbiq') {
      S.fbiq = S.fbiq || [];
      if (!S.fbiq.includes(link.id)) { S.fbiq.push(link.id); return 'هوش بازی' }
    } else if (link.sys === 'mind2') {
      S.mind2 = S.mind2 || {};
      S.mind2[link.part] = S.mind2[link.part] || [];
      if (!S.mind2[link.part].includes(link.id)) {
        S.mind2[link.part].push(link.id); return 'تسلط ذهنی'
      }
    } else if (link.sys === 'ment') {
      S.ment = S.ment || {};
      S.ment[link.part] = S.ment[link.part] || [];
      if (!S.ment[link.part].includes(link.id)) {
        S.ment[link.part].push(link.id); return 'منتالیست'
      }
    } else if (link.sys === 'inf') {
      S.inf = S.inf || {};
      S.inf[link.part] = S.inf[link.part] || [];
      if (!S.inf[link.part].includes(link.id)) {
        S.inf[link.part].push(link.id); return 'سپر نفوذ'
      }
    }
  } catch (e) { }
  return null;
}

/* ============================================================
   ۴. امتیاز واحد — به‌جای شش امتیاز جدا
   ============================================================ */
function unified(S) {
  const g = (f, d) => { try { return f() } catch (e) { return d } };
  const parts = [
    { k: 'body',  n: 'بدن',    ic: '⚽',
      v: g(() => footballScore(S).pc, 0), w: 3 },
    { k: 'mind',  n: 'ذهن',    ic: '◈',
      v: g(() => mindScore(S).pc, 0), w: 2 },
    { k: 'look',  n: 'ظاهر',   ic: '◇',
      v: g(() => lookScore(S).pc, 0), w: 2 },
    { k: 'dec',   n: 'تصمیم',  ic: '◉',
      v: g(() => decScore(S).all, 0), w: 3 },
    { k: 'inf',   n: 'نفوذ',   ic: '⛊',
      v: g(() => infScore(S).all, 0), w: 1 },
    { k: 'ment',  n: 'مشاهده', ic: '◎',
      v: g(() => mentScore(S).all, 0), w: 1 },
    { k: 'learn', n: 'دانش',   ic: '▶',
      v: g(() => learnScore(S).pc, 0), w: 2 },
    { k: 'disc',  n: 'انضباط', ic: '▲',
      v: g(() => Math.min(100, ((S.streak && S.streak.clean) || 0) * 2), 0), w: 3 }
  ];
  const tw = parts.reduce((a, p) => a + p.w, 0);
  const total = Math.round(parts.reduce((a, p) => a + p.v * p.w, 0) / tw);
  const sorted = [...parts].sort((a, b) => a.v - b.v);
  const RANK = ['آغازگر', 'تازه‌کار', 'در مسیر', 'ورزیده', 'کهنه‌کار', 'استاد'];
  return {
    parts, total,
    rank: RANK[Math.min(5, Math.floor(total / 17))],
    weakest: sorted[0], strongest: sorted[sorted.length - 1]
  };
}

/* ============================================================
   ۵. مقایسهٔ دوره‌ای — این ماه در برابر ماه قبل
   ============================================================ */
function periodCompare(S) {
  const now = Date.now();
  const inRange = (d, from, to) => {
    if (!d) return false;
    const t = new Date(d).getTime();
    return t >= now - from * 864e5 && t < now - to * 864e5;
  };
  const count = (arr, from, to, key) =>
    (arr || []).filter(x => inRange(x && (x[key || 'd'] || x.date), from, to)).length;

  const metric = (name, arr, key) => ({
    n: name,
    now: count(arr, 30, 0, key),
    prev: count(arr, 60, 30, key)
  });

  const rows = [
    metric('تمرین', S.wo),
    metric('ژورنال', S.jr),
    metric('مسابقه', S.ms, 'date'),
    metric('درس', null),   /* از learn جدا محاسبه می‌شود */
    metric('بازخورد', S.coach)
  ].filter(r => r.n !== 'درس');

  /* روزهای فعال */
  const activeDays = (from, to) => {
    const set = new Set();
    Object.keys(S.done || {}).forEach(k => {
      const d = k.split('|')[0];
      if (inRange(d, from, to)) set.add(d);
    });
    return set.size;
  };
  rows.unshift({ n: 'روز فعال', now: activeDays(30, 0), prev: activeDays(60, 30) });

  return rows.map(r => ({
    ...r,
    diff: r.now - r.prev,
    pc: r.prev ? Math.round((r.now - r.prev) / r.prev * 100) : (r.now ? 100 : 0)
  }));
}

/* ============================================================
   ۶. آرشیو خودکار — چیزی که استفاده نمی‌شود باید جمع شود
   ============================================================ */
function staleTracks(S) {
  if (!S || !S.startDate) return [];
  const days = Math.floor((Date.now() - new Date(S.startDate)) / 864e5);
  if (days < 45) return [];             /* زود است */
  const seen = S.learn || [];
  const hidden = S.trackHide || [];
  return (typeof TRACKS !== 'undefined' ? TRACKS : [])
    .filter(t => !hidden.includes(t[0]))
    .map(t => ({ id: t[0], n: t[2], ic: t[1],
                 done: trackLessons(t[0]).filter(l => seen.includes(l.id)).length }))
    .filter(x => x.done === 0);
}

/** رشته‌های فعال — پنهان‌شده‌ها حذف می‌شوند */
function activeTracks(S) {
  const hidden = (S && S.trackHide) || [];
  return (typeof TRACKS !== 'undefined' ? TRACKS : []).filter(t => !hidden.includes(t[0]));
}

/** پیشرفت فقط روی رشته‌های فعال — ۴۹۹ آیتم دلسردکننده است */
function activeScore(S) {
  const seen = (S && S.learn) || [];
  const act = activeTracks(S);
  const all = act.flatMap(t => trackLessons(t[0]));
  const done = all.filter(l => seen.includes(l.id)).length;
  return { done, total: all.length, tracks: act.length,
           pc: all.length ? Math.round(done / all.length * 100) : 0 };
}

/* ============================================================
   ۷. پیشرفت این هفته — به‌جای درصد کل دلسردکننده
   ============================================================ */
function weekProgress(S) {
  const now = Date.now();
  const wk = 7 * 864e5;
  let n = 0;
  Object.keys(S.done || {}).forEach(k => {
    const d = k.split('|')[0];
    if (d && now - new Date(d).getTime() < wk) n++;
  });
  Object.keys(S.q || {}).forEach(k => {
    const d = k.split('|')[0];
    if (d && now - new Date(d).getTime() < wk) n++;
  });
  const lw = (S.weekLast && S.weekLast.n) || 0;
  return { n, prev: lw, up: n >= lw };
}

if (typeof module !== 'undefined') module.exports = {
  DAILY_CAP, todayThree, RETEST_DAYS, retestDue,
  LESSON_LINK, applyLesson, unified, periodCompare,
  staleTracks, activeTracks, activeScore, weekProgress
};
