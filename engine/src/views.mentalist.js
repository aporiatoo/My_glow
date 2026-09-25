/* ============ MENTALIST VIEWS ============ */

/* ---------- نمای اصلی ---------- */
V.mt = () => {
  const m = mentScore(S);
  const ft = fieldToday(S);

  /* نمودار پنج‌ضلعی ستون‌ها */
  const radar = () => {
    const n = 5, cx = 60, cy = 58, R = 42;
    const pt = (i, r) => [
      cx + r * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n),
      cy + r * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / n)
    ];
    let grid = '';
    [.25, .5, .75, 1].forEach(f => {
      grid += `<polygon points="${[...Array(n)].map((_, i) => pt(i, R * f).map(v => v.toFixed(1)).join(',')).join(' ')}"
        fill="none" stroke="rgba(255,255,255,.1)" stroke-width=".7"/>`;
    });
    const spokes = [...Array(n)].map((_, i) => {
      const [x, y] = pt(i, R);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"
        stroke="rgba(255,255,255,.08)" stroke-width=".7"/>`;
    }).join('');
    const shape = m.cols.map((v, i) => pt(i, R * Math.max(.04, v / 100)).map(x => x.toFixed(1)).join(',')).join(' ');
    const labels = PILLARS.map((p, i) => {
      const [x, y] = pt(i, R + 11);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="#8a8a93" font-size="7"
        font-family="Vazirmatn" text-anchor="middle" dominant-baseline="middle">${p[1]}</text>`;
    }).join('');
    return `<svg width="100%" height="124" viewBox="0 0 120 120" style="max-width:220px;display:block;margin:0 auto">
      ${grid}${spokes}
      <polygon points="${shape}" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="1.6"
        style="transition:all .8s cubic-bezier(.22,1,.36,1)"/>
      ${labels}</svg>`;
  };

  const acc = m.acc;
  return `<div class="c gl"><div class="ct">◉ ${L('منتالیست', 'Mentalist')}<b>${m.rank}</b></div>
   <div class="cs">${L('هیچ چیز ماورایی نیست. مشاهدهٔ دقیق، خط پایه، استنتاج منطقی.',
     'Nothing supernatural. Observation, baseline, inference.')}</div>
   ${radar()}
   <div class="bar lg" style="margin-top:var(--sp3)"><div class="bf" style="width:${m.all}%"></div></div>
   <div class="hint">${L('دانش', 'Knowledge')} ${fa(m.base)}٪ ·
    ${L('میدان', 'Field')} ${fa(m.field)}٪ ·
    ${L('دقت حدس', 'Accuracy')} ${acc.n >= 5 ? fa(acc.pc) + '٪' : L('نیاز به ۵ حدس', 'need 5')}</div></div>

  ${ft ? `<div class="c gl nowc"><div class="ct">◈ ${L('تمرین میدانی امروز', 'Field drill')}
    <b>${ft[1]}</b></div>
   <div class="nowbig">${ft[2]}</div>
   <div class="hint">${L('زمان', 'Time')}: ${fa(ft[3])} ${L('دقیقه', 'min')}</div>
   <button class="bt p" style="margin-top:var(--sp3)" onclick="fieldDone('${ft[0]}')">
    ${L('انجامش دادم', 'Done')}</button></div>`
   : `<div class="c gl"><div class="ct">★ ${L('همهٔ تمرین‌های میدانی', 'All field drills')}</div>
     <div class="cs">${L('هر ۱۰ تمرین را انجام دادی. حالا تکرارشان کن روی آدم‌های جدید.', 'Repeat on new people.')}</div>
     <button class="bt" onclick="fieldReset()">${L('دور جدید', 'New round')}</button></div>`}

  <div class="c gl"><div class="ct">◇ ${L('دفتر حدس', 'Prediction log')}
    <b>${acc.n ? fa(acc.hit) + '/' + fa(acc.n) : '—'}</b></div>
   <div class="cs">${L('قلب این سیستم اینجاست: حدس بزن، بنویس، بعداً بسنج. بدون ثبت، فقط توهم دقت داری.',
     'Log guesses, verify later. Without this you only feel accurate.')}</div>
   <button class="bt p" onclick="readNew()">${L('ثبت حدس جدید', 'New prediction')}</button>
   ${(() => {
     const log = (S.ment && S.ment.reads) || [];
     const open = log.filter(r => r.ok === null || r.ok === undefined);
     const closed = log.filter(r => r.ok === true || r.ok === false).slice(-6).reverse();
     let h = '';
     if (open.length) h += `<div class="hint" style="margin-top:var(--sp3)">${L('در انتظار تأیید', 'Pending')}</div>` +
       open.map((r, i) => `<div class="rw"><div class="ri">?</div>
        <div><div class="rt">${esc(r.t)}</div><div class="rd">${esc(r.who)} · ${r.d}</div></div>
        <div class="rx" onclick="event.stopPropagation();readJudge(${log.indexOf(r)},1)">✓</div>
        <div class="rx" onclick="event.stopPropagation();readJudge(${log.indexOf(r)},0)">✕</div></div>`).join('');
     if (closed.length) h += `<div class="hint">${L('سنجیده‌شده', 'Verified')}</div>` +
       closed.map(r => `<div class="rw ${r.ok ? 'done' : ''}"><div class="ri">${r.ok ? '✓' : '✕'}</div>
        <div><div class="rt">${esc(r.t)}</div><div class="rd">${esc(r.who)} · ${r.d}</div></div></div>`).join('');
     if (!log.length) h += `<div class="empty"><span class="ei">◇</span>${
       L('اولین حدست را ثبت کن. مثلاً: «این آدم ورزشکار است» و بعداً بسنج.', 'Log your first guess.')}</div>`;
     return h;
   })()}
   ${acc.n >= 5 ? `<div class="hint" style="color:var(--ink)">${
     acc.pc >= 70 ? L('دقتت بالاست. حالا حدس‌های سخت‌تر بزن.', 'High accuracy — try harder guesses.')
     : acc.pc >= 40 ? L('در محدودهٔ طبیعی. روی خوشهٔ نشانه‌ها کار کن، نه تک‌نشانه.', 'Work on clusters.')
     : L('دقت پایین یعنی داری از تک‌نشانه نتیجه می‌گیری. اول خط پایه بگیر.', 'Get a baseline first.')}</div>` : ''}</div>`;
};

/* ---------- ستون‌ها ---------- */
V.mt_learn = () => {
  const done = k => (S.ment && S.ment[k]) || [];
  return PILLARS.map(([key, title, items]) => {
    const d = done(key);
    return `<div class="c gl"><div class="ct">${
      key === 'obs' ? '◉' : key === 'cold' ? '◇' : key === 'base' ? '▲' : key === 'mem' ? '◆' : '◍'
    } ${title}<b>${fa(d.length)}/${fa(items.length)}</b></div>
     <div class="bar" style="margin:var(--sp2) 0"><div class="bf" style="width:${d.length / items.length * 100}%"></div></div>
     ${items.map(it => {
       const on = d.includes(it[0]);
       /* ساختار OBSERVE با بقیه فرق دارد: [id,نام,نشانه,مثال] */
       const sub = key === 'obs' ? it[2] : it[2];
       const ex = key === 'obs' ? it[3] : it[3];
       const anti = it[4];
       return `<div class="rw ${on ? 'done' : ''}" onclick="mentTap('${key}','${it[0]}')">
        <div class="ri">${on ? '✓' : '○'}</div>
        <div><div class="rt">${it[1]}</div>
         <div class="rd">${sub}</div>
         ${ex ? `<div class="rd" style="color:var(--dim2);margin-top:3px">${ex}</div>` : ''}
         ${on && anti ? `<div class="rd" style="color:var(--ink);margin-top:5px">◆ ${anti}</div>` : ''}
        </div></div>`;
     }).join('')}</div>`;
  }).join('') + `
  <div class="c gl"><div class="ct">◍ ${L('قانون سه‌گانه', 'The three rules')}</div>
   <div class="li">${L('یک نشانه هیچ چیز نیست. سه نشانهٔ همزمان یعنی چیزی هست.', 'One sign is nothing.')}</div>
   <div class="li">${L('اول خط پایه، بعد انحراف. بدون خط پایه هر تفسیری حدس کور است.', 'Baseline first.')}</div>
   <div class="li">${L('زمینه را حذف کن. دست‌به‌سینه در سرما یعنی سرد است.', 'Remove context first.')}</div>
   <div class="hint">${L('تفاوت تیزبینی و توهم، همین سه قانون است. جین هم اشتباه می‌کرد — ولی حدس‌هایش را می‌سنجید.',
     'This separates insight from delusion.')}</div></div>`;
};

/* ---------- اکشن‌ها ---------- */
window.mentTap = (key, id) => {
  S.ment = S.ment || {};
  S.ment[key] = S.ment[key] || [];
  const i = S.ment[key].indexOf(id);
  if (i >= 0) S.ment[key].splice(i, 1);
  else { S.ment[key].push(id); xp(20); window.haptic(10) }
  sv(); rd();
};

window.fieldDone = id => {
  S.ment = S.ment || {};
  S.ment.field = S.ment.field || [];
  if (!S.ment.field.includes(id)) { S.ment.field.push(id); xp(35); window.haptic(15) }
  sv(); rd();
  tst('◈ ' + L('ثبت شد', 'Logged'));
};

window.fieldReset = () => {
  S.ment = S.ment || {}; S.ment.field = [];
  sv(); rd(); tst(L('دور جدید', 'New round'));
};

window.readNew = async () => {
  const r = await ask({
    t: L('حدس جدید', 'New prediction'),
    s: L('یک حدس مشخص و قابل سنجش. «مهربان است» قابل سنجش نیست؛ «ورزش می‌کند» هست.',
         'Make it falsifiable.'),
    f: [{ k: 'who', t: L('دربارهٔ چه کسی', 'About'), ty: 'text', v: '' },
        { k: 't', t: L('حدس', 'Guess'), ty: 'area', v: '' },
        { k: 'why', t: L('بر چه اساسی', 'Based on'), hint: L('اختیاری', 'optional'), ty: 'text', v: '' }]
  });
  if (!r || !r.t || !r.who) return;
  S.ment = S.ment || {};
  S.ment.reads = S.ment.reads || [];
  S.ment.reads.push({ who: r.who, t: r.t, why: r.why || '', d: jStr(), ok: null });
  xp(10); sv(); rd();
  tst('◇ ' + L('ثبت شد — بعداً بسنجش', 'Logged'));
};

window.readJudge = (i, ok) => {
  const log = (S.ment && S.ment.reads) || [];
  if (!log[i]) return;
  log[i].ok = !!ok;
  if (ok) { xp(25); window.haptic(16) }
  sv(); rd();
  const a = readAccuracy(S);
  tst((ok ? '✓ ' : '✕ ') + L('دقت: ', 'Accuracy: ') + fa(a.pc) + '٪');
};
