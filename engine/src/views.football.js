/* ============ FOOTBALL VIEWS ============ */

/* ---------- کارت بازیکن ---------- */
V.fb = () => {
  const pl = player(S);
  const bp = bestPos(S);
  const ms = matchStats(S);
  /* پست ذخیره‌شده ممکن است نامعتبر باشد */
  const my = (POS.some(x => x[0] === S.fbpos) ? S.fbpos : null) || bp[0].code;
  const stage = pathStage(S, typeof ageNow === 'function' ? ageNow() : 14);

  /* زمین فوتبال با موقعیت پست */
  const pitch = () => {
    const spots = {
      GK: [50, 92], CB: [50, 76], FB: [16, 70], CDM: [50, 58],
      CM: [50, 45], CAM: [50, 32], W: [16, 28], ST: [50, 14]
    };
    return `<svg width="100%" height="168" viewBox="0 0 100 100"
      style="max-width:190px;display:block;margin:0 auto" preserveAspectRatio="xMidYMid meet">
      <rect x="2" y="2" width="96" height="96" rx="3" fill="none"
        stroke="rgba(255,255,255,.16)" stroke-width=".8"/>
      <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255,255,255,.12)" stroke-width=".6"/>
      <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".6"/>
      <rect x="28" y="2" width="44" height="14" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".6"/>
      <rect x="28" y="84" width="44" height="14" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".6"/>
      ${POS.map(p => {
        const [x, y] = spots[p[0]];
        const fit = bp.find(b => b.code === p[0]).fit;
        const on = p[0] === my;
        const r = on ? 7 : 4.6;
        return `<g onclick="fbPos('${p[0]}')" style="cursor:pointer">
          <circle cx="${x}" cy="${y}" r="${r}"
            fill="${on ? '#fff' : 'rgba(255,255,255,' + (0.1 + fit / 180) + ')'}"
            stroke="${on ? '#fff' : 'rgba(255,255,255,.3)'}" stroke-width=".8"/>
          <text x="${x}" y="${y + 1.6}" text-anchor="middle"
            fill="${on ? '#000' : '#f4f4f5'}" font-size="${on ? 4.4 : 3.4}"
            font-family="Vazirmatn" font-weight="700">${p[0]}</text></g>`;
      }).join('')}</svg>`;
  };

  return `<div class="c gl"><div class="ct">⚽ ${L('کارت بازیکن', 'Player Card')}
    <b>${fa(pl.overall)}</b></div>
   ${pitch()}
   <div class="hint" style="text-align:center">${L('روی پست بزن تا انتخابش کنی. روشنی هر دایره یعنی تناسب تو با آن پست.',
     'Tap a position. Brightness = your fit.')}</div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr);margin-top:var(--sp3)">
    <div class="sk"><div class="skn">${fa(pl.overall)}</div><div class="skl">${L('کلی', 'Overall')}</div></div>
    <div class="sk"><div class="skn">${fa(bp.find(b => b.code === my).fit)}</div>
     <div class="skl">${POS.find(p => p[0] === my)[1]}</div></div>
    <div class="sk"><div class="skn">${fa(pl.tested)}<span class="u">/${fa(pl.total)}</span></div>
     <div class="skl">${L('سنجیده', 'Tested')}</div></div>
   </div></div>

  <div class="c gl nowc"><div class="ct">◆ ${L('مرحلهٔ ', 'Stage ')}${fa(stage.stage[0])}
    <b>${stage.stage[1]}</b></div>
   <div class="cs">${stage.stage[3]}</div>
   ${stage.stage[4].map(g => `<div class="li">${g}</div>`).join('')}
   <div class="hint">${L('مرحلهٔ بعد در ', 'Next at ')}${fa(stage.stage[2] + 1)} ${L('سالگی', 'years old')}</div></div>

  ${(() => { const tr = trainToday(S);
    return `<div class="c gl"><div class="ct">◷ ${L('تمرین امروز', 'Today')}<b>${tr[1]}</b></div>
     <div class="cs">${tr[4]}</div>
     ${tr[2].split(',').map(k => { const r = REP_MAP[k];
       return r ? `<div class="rw" onclick="fbRep('${k}')"><div class="ri">◦</div>
        <div><div class="rt">${r[1]}</div><div class="rd">${r[2]}</div></div></div>` : ''; }).join('')}
     <div class="hint">${L('زمان کل', 'Total')}: ${fa(tr[3])} ${L('دقیقه', 'min')}
      ${pl.tested < 3 ? ' · ' + L('اول چند مهارت را بسنج تا برنامه دقیق شود', 'Test skills first') : ''}</div></div>`; })()}

  ${ms ? `<div class="c gl"><div class="ct">▦ ${L('آمار مسابقه', 'Match stats')}<b>${fa(ms.n)}</b></div>
   <div class="gr" style="grid-template-columns:repeat(4,1fr)">
    <div class="sk"><div class="skn">${fa(ms.goals)}</div><div class="skl">${L('گل', 'G')}</div></div>
    <div class="sk"><div class="skn">${fa(ms.assists)}</div><div class="skl">${L('پاس گل', 'A')}</div></div>
    <div class="sk"><div class="skn">${fa(ms.rate)}</div><div class="skl">${L('میانگین', 'Avg')}</div></div>
    <div class="sk"><div class="skn">${fa(Math.round(ms.mins / 90))}</div><div class="skl">${L('بازی کامل', '90s')}</div></div>
   </div>
   ${ms.last5.length > 1 ? `<div style="display:flex;gap:4px;align-items:flex-end;height:36px;margin-top:var(--sp3)">
     ${ms.last5.map(r => `<div style="flex:1;height:${Math.max(6, r * 10)}%;background:rgba(255,255,255,.5);border-radius:3px"></div>`).join('')}
    </div><div class="hint">${L('پنج بازی اخیر', 'Last 5')}</div>` : ''}
   <div class="hint">${L('گل در ۹۰ دقیقه', 'G/90')}: ${fa(ms.per90g)} ·
    ${L('پاس گل در ۹۰', 'A/90')}: ${fa(ms.per90a)}</div>
   <button class="bt" style="margin-top:var(--sp2)" onclick="fbMatch()">${L('ثبت مسابقه', 'Log match')}</button></div>`
   : `<div class="c gl"><div class="ct">▦ ${L('آمار مسابقه', 'Match stats')}</div>
     <div class="empty"><span class="ei">▦</span>${L('اولین مسابقه‌ات را ثبت کن. بعد از ۱۰ بازی، الگوها بیرون می‌آیند.', 'Log your first match.')}</div>
     <button class="bt p" onclick="fbMatch()">${L('ثبت مسابقه', 'Log match')}</button></div>`}`;
};

/* ---------- مهارت‌ها ---------- */
V.fb_skill = () => {
  const pl = player(S);
  const log = S.fb || {};
  /* fbpos ممکن است مقدار نامعتبر داشته باشد — به بهترین پست برگرد */
  const my = (POS.some(p => p[0] === S.fbpos) ? S.fbpos : null) || bestPos(S)[0].code;

  const row = s => {
    const t = pl.tiers[s[0]], v = log[s[0]];
    const key = s[5].includes('all') || s[5].includes(my);
    const next = t < 5 ? s[3][t] : null;
    return `<div class="rw" onclick="fbLog('${s[0]}')">
     <div class="ri">${t ? fa(t) : '○'}</div>
     <div><div class="rt">${s[1]}${key ? ' <span class="u">◆</span>' : ''}</div>
      <div class="rd">${v !== undefined ? fa(v) + ' ' + s[2] : L('سنجیده نشده', 'not tested')}
       ${next !== null ? ' · ' + L('سطح بعد: ', 'next: ') + fa(next) : ' · ' + L('حداکثر', 'max')}</div>
      <div class="bar" style="margin-top:5px"><div class="bf" style="width:${t * 20}%"></div></div>
     </div>
     <div class="rx">${t === 5 ? '★' : '+'}</div></div>`;
  };

  return `<div class="c gl"><div class="ct">◎ ${L('مهارت‌ها', 'Skills')}
    <b>${fa(pl.tested)}/${fa(pl.total)}</b></div>
   <div class="cs">${L('◆ یعنی این مهارت برای پست تو کلیدی است. سطح فقط با عدد سنجیده‌شده بالا می‌رود.',
     '◆ = key for your position.')}</div>
   ${SKILL.map(row).join('')}</div>

  ${pl.weak.length ? `<div class="c gl"><div class="ct">▼ ${L('ضعیف‌ترین‌ها', 'Weakest')}</div>
   <div class="cs">${L('بیشترین سود اینجاست. یک ماه فقط روی اینها کار کن.', 'Highest return here.')}</div>
   ${pl.weak.map(w => `<div class="rw"><div class="ri">${fa(w.t)}</div>
     <div class="rt">${w.n}</div></div>`).join('')}</div>` : ''}

  ${pl.untested.length ? `<div class="c gl"><div class="ct">○ ${L('هنوز نسنجیده', 'Untested')}
    <b>${fa(pl.untested.length)}</b></div>
   <div class="cs">${L('تا نسنجی، نمی‌دانی کجا ایستاده‌ای.', 'You cannot improve what you do not measure.')}</div>
   <div class="hint">${pl.untested.join(' · ')}</div></div>` : ''}`;
};

/* ---------- هوش بازی ---------- */
V.fb_iq = () => {
  const done = S.fbiq || [];
  return `<div class="c gl"><div class="ct">◈ ${L('هوش بازی', 'Game IQ')}
    <b>${fa(done.length)}/${fa(IQ.length)}</b></div>
   <div class="bar lg" style="margin:var(--sp2) 0"><div class="bf" style="width:${done.length / IQ.length * 100}%"></div></div>
   <div class="cs">${L('این بخش استعداد را از حرفه‌ای جدا می‌کند. سرعت و تکنیک زیاد است؛ کسی که بازی را می‌خواند کم است.',
     'This separates talent from professional.')}</div></div>

  ${IQ.map(q => { const on = done.includes(q[0]);
    return `<div class="c gl"><div class="ct">${on ? '✓' : '○'} ${q[1]}</div>
     <div class="cs">${q[2]}</div>
     <div class="hint" style="color:var(--dim)">${q[3]}</div>
     <button class="bt ${on ? '' : 'p'}" style="margin-top:var(--sp2)" onclick="fbIq('${q[0]}')">
      ${on ? L('در بازی استفاده کردم ✓', 'Used ✓') : L('در بازی استفاده کردم', 'Used in a match')}</button></div>`;
  }).join('')}`;
};

/* ---------- اکشن‌ها ---------- */
window.fbPos = code => {
  const p = POS.find(x => x[0] === code);
  if (!p) return;                       /* کد نامعتبر — بی‌صدا رد شو */
  S.fbpos = code; sv(); rd();
  window.haptic(10);
  tst('⚽ ' + p[1] + ' · ' + L('تناسب ', 'fit ') + fa(posFit(S, code)) + '٪');
};

window.fbLog = async key => {
  const s = SK_MAP[key];
  if (!s) return;
  const cur = (S.fb || {})[key];
  const marks = s[3].map((m, i) => L('سطح ', 'T') + fa(i + 1) + ': ' + fa(m)).join(' · ');
  const r = await ask({
    t: s[1],
    s: L('واحد: ', 'Unit: ') + s[2] + (s[4] ? ' · ' + L('کمتر بهتر است', 'lower is better') : '') + '\n' + marks,
    f: [{ k: 'v', ty: 'num', v: cur !== undefined ? String(cur) : '' }]
  });
  if (!r || r.v === '' || isNaN(+r.v)) return;
  const before = skTier(key, cur);
  S.fb = S.fb || {};
  S.fb[key] = +r.v;
  const after = skTier(key, +r.v);
  xp(30); sv(); rd();
  if (after > before) {
    window.haptic(25);
    tst('★ ' + s[1] + ' → ' + L('سطح ', 'Tier ') + fa(after));
  } else tst('✓ ' + L('ثبت شد', 'Logged'));
};

window.fbRep = key => {
  const r = REP_MAP[key];
  if (!r) return;
  S.wo = S.wo || [];
  S.wo.push({ d: td(), t: 1, l: r[1] });
  xp(25); window.haptic(12); sv(); rd();
  tst('⚽ ' + r[1]);
};

window.fbIq = id => {
  S.fbiq = S.fbiq || [];
  const i = S.fbiq.indexOf(id);
  if (i >= 0) S.fbiq.splice(i, 1);
  else { S.fbiq.push(id); xp(35); window.haptic(15); }
  sv(); rd();
};

window.fbMatch = async () => {
  const r = await ask({
    t: L('ثبت مسابقه', 'Log match'),
    f: [{ k: 'min', t: L('دقیقه بازی', 'Minutes'), ty: 'num', v: '90' },
        { k: 'g', t: L('گل', 'Goals'), ty: 'num', v: '0' },
        { k: 'a', t: L('پاس گل', 'Assists'), ty: 'num', v: '0' },
        { k: 'rate', t: L('نمرهٔ خودت از ۱۰', 'Self rating'), ty: 'num', v: '6' },
        { k: 'note', t: L('یک نکته برای دفعهٔ بعد', 'One lesson'), ty: 'text', v: '' }]
  });
  if (!r || isNaN(+r.min)) return;
  S.ms = S.ms || [];
  S.ms.push({
    date: td(), pos: S.fbpos || '', min: +r.min || 0,
    g: +r.g || 0, a: +r.a || 0, rate: +r.rate || 0, note: r.note || ''
  });
  xp(40); window.haptic(18); sv(); rd();
  tst('▦ ' + L('ثبت شد', 'Logged'));
};
