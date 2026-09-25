/* ============================================================
   AI — موتور هوشمند آفلاین
   بدون مدل زبانی، بدون اینترنت، بدون سرور.

   چرا نه LLM واقعی: کوچک‌ترین مدل مفید حدود ۶۰۰ مگابایت است،
   روی گوشی متوسط کند اجرا می‌شود و فارسی را ضعیف می‌فهمد.
   به‌جایش یک موتور قاعده‌محور + آماری روی دادهٔ واقعی تو —
   که برای این کار دقیق‌تر و فوری است.

   کاملاً قابل خاموش کردن با S.ai.
   ============================================================ */

/* ---------- ابزار آماری ---------- */
function mean(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }

/** همبستگی پیرسون — پایهٔ کشف الگو */
function corr(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 4) return null;
  const mx = mean(xs.slice(0, n)), my = mean(ys.slice(0, n));
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

/** روند خطی ساده: شیب در واحد روز */
function trend(vals) {
  const n = vals.length;
  if (n < 3) return null;
  const xs = vals.map((_, i) => i);
  const mx = mean(xs), my = mean(vals);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (vals[i] - my); den += (xs[i] - mx) ** 2; }
  return den ? num / den : null;
}

/* ---------- استخراج سری‌های زمانی از state ---------- */
function series(S, days) {
  const D = days || 30;
  const out = { sleep: [], mood: [], energy: [], done: [], train: [], study: [] };
  for (let i = D - 1; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 864e5);
    const d = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') +
              '-' + String(dt.getDate()).padStart(2, '0');
    const sl = (S.sleepLog || {})[d];
    const j = (S.jr || []).find(x => x.d === d);
    let doneN = 0;
    Object.keys(S.done || {}).forEach(k => { if (k.startsWith(d + '|')) doneN++; });
    Object.keys(S.q || {}).forEach(k => { if (k.startsWith(d + '|')) doneN++; });
    out.sleep.push(typeof sl === 'number' ? sl : null);
    out.mood.push(j && j.m ? +j.m : null);
    out.energy.push(j && j.en ? +j.en : null);
    out.done.push(doneN);
    out.train.push((S.wo || []).some(w => w.d === d) ? 1 : 0);
    out.study.push((S.stSess || []).some(x => x.d === d) ? 1 : 0);
  }
  return out;
}

/** دو سری را با حذف null هم‌تراز می‌کند */
function pair(a, b, shift) {
  const xs = [], ys = [];
  const sh = shift || 0;
  for (let i = 0; i < a.length - sh; i++) {
    const x = a[i], y = b[i + sh];
    if (x !== null && y !== null && x !== undefined && y !== undefined) { xs.push(x); ys.push(y); }
  }
  return [xs, ys];
}

/* ============================================================
   کشف الگو — جملاتی دربارهٔ خودِ تو، نه توصیهٔ عمومی
   ============================================================ */
function insights(S) {
  if (!S.ai) return [];
  const s = series(S, 45);
  const out = [];

  /* خواب شب قبل → حال فردا */
  {
    const [x, y] = pair(s.sleep, s.mood, 1);
    const r = corr(x, y);
    if (r !== null && Math.abs(r) > 0.35 && x.length >= 6) {
      out.push({
        w: Math.abs(r), ic: '●',
        t: r > 0
          ? 'شب‌هایی که بیشتر می‌خوابی، فردایش حالت بهتر است. این در دادهٔ خودت دیده می‌شود، نه یک توصیهٔ کلی.'
          : 'رابطهٔ خواب و حالت معکوس درآمده — احتمالاً چیز دیگری وسط است. چند روز دقیق‌تر ثبت کن.'
      });
    }
  }

  /* خواب → کارهای انجام‌شده */
  {
    const [x, y] = pair(s.sleep, s.done, 1);
    const r = corr(x, y);
    if (r !== null && r > 0.35 && x.length >= 6) {
      const lo = [], hi = [];
      for (let i = 0; i < x.length; i++) (x[i] >= 8 ? hi : lo).push(y[i]);
      if (lo.length >= 2 && hi.length >= 2) {
        const diff = Math.round((mean(hi) - mean(lo)) * 10) / 10;
        if (diff > 0.5) out.push({
          w: r, ic: '◆',
          t: 'بعد از شب‌های ۸ ساعت به بالا، به‌طور میانگین ' + diff + ' کار بیشتر انجام می‌دهی.'
        });
      }
    }
  }

  /* تمرین → حال روز بعد */
  {
    const [x, y] = pair(s.train, s.mood, 1);
    if (x.length >= 8) {
      const withT = [], noT = [];
      for (let i = 0; i < x.length; i++) (x[i] ? withT : noT).push(y[i]);
      if (withT.length >= 3 && noT.length >= 3) {
        const d = mean(withT) - mean(noT);
        if (Math.abs(d) > 0.3) out.push({
          w: Math.abs(d), ic: '⚽',
          t: d > 0
            ? 'روزهای بعد از تمرین، حالت به‌طور میانگین ' + (Math.round(d * 10) / 10) + ' نمره بهتر است.'
            : 'بعد از تمرین حالت پایین‌تر می‌آید — شاید بار تمرین زیاد است یا ریکاوری کم.'
        });
      }
    }
  }

  /* روند خواب */
  {
    const vals = s.sleep.filter(v => v !== null);
    const tr = trend(vals.slice(-14));
    if (tr !== null && Math.abs(tr) > 0.04 && vals.length >= 7) {
      out.push({
        w: Math.abs(tr) * 8, ic: '◐',
        t: tr < 0
          ? 'خوابت در دو هفتهٔ اخیر روند نزولی دارد. اگر ادامه یابد، اول تمرکز و بعد رشد قد ضربه می‌خورد.'
          : 'خوابت روند صعودی دارد. همین را نگه دار.'
      });
    }
  }

  /* پایداری: انحراف روزهای فعال */
  {
    const d = s.done;
    const zero = d.filter(v => v === 0).length;
    if (d.length >= 20 && zero > d.length * 0.4) out.push({
      w: 0.6, ic: '▦',
      t: 'در ' + zero + ' روز از ' + d.length + ' روز اخیر هیچ چیزی ثبت نشده. پیوستگی از شدت مهم‌تر است — حتی یک تیک در روز بد، زنجیره را نگه می‌دارد.'
    });
  }

  /* روز هفته با بیشترین افت */
  {
    const byDow = [[], [], [], [], [], [], []];
    for (let i = 0; i < s.done.length; i++) {
      const dt = new Date(Date.now() - (s.done.length - 1 - i) * 864e5);
      byDow[dt.getDay()].push(s.done[i]);
    }
    const names = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    const avgs = byDow.map((a, i) => ({ i, n: names[i], m: a.length >= 3 ? mean(a) : null }))
                      .filter(x => x.m !== null);
    if (avgs.length >= 5) {
      avgs.sort((a, b) => a.m - b.m);
      const worst = avgs[0], best = avgs[avgs.length - 1];
      if (best.m - worst.m > 1.2) out.push({
        w: 0.5, ic: '◷',
        t: worst.n + '‌ها ضعیف‌ترین روز توست و ' + best.n + '‌ها قوی‌ترین. برای ' + worst.n + ' برنامهٔ سبک‌تر بچین به‌جای اینکه کامل رهایش کنی.'
      });
    }
  }

  return out.sort((a, b) => b.w - a.w);
}

/* ============================================================
   پیش‌بینی — بر پایهٔ روند واقعی
   ============================================================ */
function forecast(S) {
  if (!S.ai) return null;
  const out = [];

  /* قد */
  const h = (S.hts || []).filter(x => x && typeof x.v === 'number');
  if (h.length >= 3) {
    const first = h[0], last = h[h.length - 1];
    const days = Math.max(1, (new Date(last.d) - new Date(first.d)) / 864e5);
    const perYear = (last.v - first.v) / days * 365;
    if (perYear > 0.5 && days >= 60) {
      out.push({
        ic: '↥', t: 'قد',
        v: Math.round(last.v + perYear) + ' cm',
        note: 'با نرخ فعلی، یک سال دیگر. نرخ ' + (Math.round(perYear * 10) / 10) + ' سانت در سال.'
      });
    }
  }

  /* مهارت فوتبال با بیشترین نزدیکی به سطح بعد */
  if (typeof SKILL !== 'undefined' && S.fb) {
    let best = null;
    SKILL.forEach(s => {
      const v = S.fb[s[0]];
      if (typeof v !== 'number') return;
      const t = skTier(s[0], v);
      if (t >= 5) return;
      const next = s[3][t];
      const lower = s[4] === 1;
      const gap = lower ? (v - next) / Math.max(1, v) : (next - v) / Math.max(1, next);
      if (gap > 0 && gap < 0.25 && (!best || gap < best.gap))
        best = { gap, name: s[1], next, unit: s[2] };
    });
    if (best) out.push({
      ic: '⚽', t: 'نزدیک‌ترین سطح',
      v: best.name,
      note: 'فقط تا ' + best.next + ' ' + best.unit + ' فاصله داری تا سطح بعد.'
    });
  }

  /* استریک */
  const st = S.streak || {}, bs = S.best || {};
  Object.keys(st).forEach(k => {
    if (st[k] && bs[k] && st[k] >= bs[k] - 3 && st[k] > 5)
      out.push({
        ic: '◆', t: 'رکورد',
        v: (bs[k] - st[k] + 1) + ' روز',
        note: 'تا شکستن رکورد ' + bs[k] + ' روزه‌ات.'
      });
  });

  return out.length ? out : null;
}

/* ============================================================
   توصیهٔ تطبیقی — یک کار مشخص برای همین الان
   ============================================================ */
function advise(S, ctx) {
  if (!S.ai) return null;
  const c = ctx || {};
  const hour = c.hour !== undefined ? c.hour : new Date().getHours();
  const cand = [];

  /* ضعیف‌ترین حوزهٔ تسلط */
  if (typeof masteryScore === 'function') {
    const m = masteryScore(S);
    if (m.all > 0) {
      const w = m.weakest;
      cand.push({
        p: 3, ic: '★',
        t: w === 'mind' ? 'ذهن عقب‌تر از بقیه است. یک تمرین ذهنی امروز، بیشترین اثر را روی نمرهٔ کلی دارد.'
          : w === 'body' ? 'بدن عقب‌تر است. یک مهارت فوتبال را بسنج یا تمرین انفرادی بزن.'
          : 'ظاهر عقب‌تر است — و بیشترش از خواب و ثبات می‌آید نه محصول.'
      });
    }
  }

  /* مهارت سنجیده‌نشده */
  if (typeof player === 'function' && S.fb) {
    const pl = player(S);
    if (pl.untested.length > 8)
      cand.push({ p: 2, ic: '◎', t: pl.untested.length + ' مهارت را هنوز نسنجیده‌ای. تا نسنجی نمی‌دانی کجا ایستاده‌ای.' });
  }

  /* دفتر حدس خالی */
  if (typeof readAccuracy === 'function') {
    const a = readAccuracy(S);
    if (a.n > 0 && a.n < 5)
      cand.push({ p: 4, ic: '◇', t: 'فقط ' + a.n + ' حدس ثبت کرده‌ای. با ۵ حدس، دقت واقعی‌ات محاسبه می‌شود.' });
  }

  /* شب: آماده‌سازی فردا */
  if (hour >= 20 && hour <= 23)
    cand.push({ p: 2, ic: '◐', t: 'شب است. لباس و کیف فردا را الان آماده کن — صبح‌ها تصمیم‌گیری گران است.' });

  /* صبح زود */
  if (hour >= 5 && hour <= 8)
    cand.push({ p: 3, ic: '◷', t: 'صبح بهترین زمان کار سخت است. سخت‌ترین کار امروز را اول انجام بده.' });

  if (!cand.length) return null;
  cand.sort((a, b) => a.p - b.p);
  return cand[0];
}

/** خلاصهٔ وضعیت برای نمایش */
function aiSummary(S) {
  return {
    on: !!S.ai,
    insights: insights(S).length,
    forecast: (forecast(S) || []).length,
    dataDays: Object.keys(S.sleepLog || {}).length + (S.jr || []).length
  };
}

if (typeof module !== 'undefined') module.exports = {
  mean, corr, trend, series, pair, insights, forecast, advise, aiSummary
};
