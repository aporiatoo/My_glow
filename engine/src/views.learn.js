/* ============ LEARN VIEWS — مسیرهای ویدیویی ============ */

/* ---------- نمای کلی ---------- */
V.learn = () => {
  const ls = learnScore(S);
  const today = lessonToday(S);
  return `<div class="c gl"><div class="ct">▶ ${L('مسیر یادگیری', 'Learning')}
    <b>${fa(ls.done)}/${fa(ls.total)}</b></div>
   <div class="cs">${L('هفت رشته، صد و چهارده درس. هر درس یک جستجوی دقیق در یوتیوب — لینک ثابت می‌میرد، جستجو نه.',
     'Seven tracks. Search beats dead links.')}</div>
   <div class="bar lg" style="margin:var(--sp3) 0"><div class="bf" style="width:${ls.pc}%"></div></div>
   <div class="hint">${fa(ls.pc)}٪ · ${L('حدود ', 'about ')}${fa(Math.round(ls.minutes / 60))} ${L('ساعت تماشا', 'hours watched')}</div>
  </div>

  <div class="c gl"><div class="ct">⌕ ${L('جستجو در درس‌ها', 'Search lessons')}</div>
   <div class="cs">${L('با ' + fa(learnScore(S).total) + ' درس، تایپ سریع‌تر از گشتن است.',
     'Typing beats browsing.')}</div>
   <div class="gr" style="grid-template-columns:1fr 1fr;margin-top:var(--sp2)">
    <button class="bt p" onclick="lrnSearch()">${L('جستجو', 'Search')}</button>
    <button class="bt" onclick="lrnStars()">★ ${L('نشان‌شده', 'Starred')}
     ${(S.lrnStar || []).length ? '(' + fa(S.lrnStar.length) + ')' : ''}</button>
   </div></div>

  ${today ? `<div class="c gl nowc"><div class="ct">${today.ic} ${L('درس امروز', 'Today')}
    <b>${today.trackName}</b></div>
   <div class="nowbig">${today.t}</div>
   ${today.why ? `<div class="hint" style="color:var(--dim)">${today.why}</div>` : ''}
   <div class="hint">${today.stageName} · ${fa(today.min)} ${L('دقیقه', 'min')}</div>
   <div class="gr" style="grid-template-columns:2fr 1fr;margin-top:var(--sp3)">
    <a class="bt p" href="${ytLink(today.q)}" target="_blank" rel="noopener"
      style="text-decoration:none;display:grid;place-items:center">▶ ${L('تماشا', 'Watch')}</a>
    <button class="bt" onclick="lrnDone('${today.id}')">${L('دیدم', 'Seen')}</button>
   </div></div>` : ''}

  <div class="c gl"><div class="ct">◆ ${L('نقشهٔ راه', 'Roadmap')}</div>
   <div class="cs">${L('ترتیب پیشنهادی بر پایهٔ وضعیت واقعی تو، نه فهرست الفبایی.',
     'Ordered by your actual gaps.')}</div>
   ${ROADMAP.map(r => { const st = roadStage(S, r[0]);
     if (!st) return '';
     return `<div style="margin-top:var(--sp3)">
      <div class="sn"><span>${st.name}</span>
       <span class="sv">${fa(st.done)}/${fa(st.items.length)}</span></div>
      <div class="hint" style="margin:2px 0 6px">${st.why}</div>
      ${st.items.map(i => `<div class="rw ${i.done ? 'done' : ''}">
        <div class="ri" onclick="lrnDone('${i.id}')">${i.done ? '✓' : '○'}</div>
        <div style="flex:1"><div class="rt">${i.t}</div>
         <div class="rd">${i.trackName} · ${fa(i.min)} ${L('دقیقه', 'min')}</div></div>
        <a class="rx" href="${ytLink(i.q)}" target="_blank" rel="noopener"
          style="text-decoration:none;color:var(--ink)">▶</a></div>`).join('')}
     </div>`; }).join('')}</div>

  <div class="c gl"><div class="ct">◫ ${L('رشته‌ها', 'Tracks')}</div>
   ${ls.per.map(p => `<div class="rw" onclick="lrnOpen('${p.id}')">
     <div class="ri">${p.ic}</div>
     <div style="flex:1"><div class="rt">${p.n}</div>
      <div class="rd">${TRACK_MAP[p.id][4]} · ${fa(p.done)}/${fa(p.total)}</div>
      <div class="bar" style="margin-top:5px"><div class="bf" style="width:${p.pc}%"></div></div></div>
     <div class="rx">${fa(p.pc)}٪</div></div>`).join('')}</div>

  <div class="c gl"><div class="ct">◍ ${L('چطور تماشا کنی', 'How to watch')}</div>
   <div class="li">${L('یک درس در روز کافی است. بیشتر از آن یعنی هیچ‌کدام.', 'One lesson a day.')}</div>
   <div class="li">${L('بعد از هر ویدیو، یک چیز را همان روز امتحان کن. تماشای بدون اجرا، سرگرمی است.',
     'Apply one thing the same day.')}</div>
   <div class="li">${L('سرعت ۱.۲۵ خوب است، بالاتر یعنی فقط رد کردن.', '1.25x is fine.')}</div>
   <div class="li">${L('اگر ویدیویی بد بود، برگرد و نتیجهٔ بعدی را ببین. عبارت جستجو درست است.',
     'Try the next result.')}</div></div>`;
};

/* ---------- یک رشته ---------- */
V.learn_t = () => {
  const id = S.lrnTrack || 'foot';
  const tr = TRACK_MAP[id];
  if (!tr) return `<div class="c gl"><div class="cs">${L('رشته پیدا نشد', 'Not found')}</div></div>`;
  const seen = S.learn || [];
  const p = trackProgress(S, id);

  return `<div class="c gl"><div class="ct">${tr[1]} ${tr[2]}<b>${fa(p.done)}/${fa(p.total)}</b></div>
   <div class="cs">${tr[4]}</div>
   <div class="bar lg" style="margin-top:var(--sp2)"><div class="bf" style="width:${p.pc}%"></div></div>
   <div class="gr" style="grid-template-columns:repeat(7,1fr);gap:4px;margin-top:var(--sp3)">
    ${TRACKS.map(t => `<button class="bt ${t[0] === id ? 'p' : ''}"
      style="font-size:var(--t2);padding:9px 0" title="${t[2]}"
      onclick="lrnOpen('${t[0]}')">${t[1]}</button>`).join('')}
   </div></div>

  ${tr[3].map(stage => {
    const sd = stage.d.filter(d => seen.includes(d[0])).length;
    return `<div class="c gl"><div class="ct">${L('مرحلهٔ ', 'Stage ')}${fa(stage.s)} · ${stage.t}
      <b>${fa(sd)}/${fa(stage.d.length)}</b></div>
     ${stage.d.map(d => {
       const on = seen.includes(d[0]);
       return `<div class="rw ${on ? 'done' : ''}">
        <div class="ri" onclick="lrnDone('${d[0]}')">${on ? '✓' : '○'}</div>
        <div style="flex:1"><div class="rt">${d[1]}</div>
         <div class="rd">${fa(d[3])} ${L('دقیقه', 'min')}${d[4] ? ' · ' + d[4] : ''}</div></div>
        <span class="rx" onclick="lrnStar('${d[0]}')"
          style="color:${(S.lrnStar || []).includes(d[0]) ? 'var(--ink)' : 'var(--dim2)'}">★</span>
        <a class="rx" href="${ytLink(d[2])}" target="_blank" rel="noopener"
          style="text-decoration:none;color:var(--ink)">▶</a></div>`;
     }).join('')}</div>`;
  }).join('')}`;
};

/* ---------- اکشن‌ها ---------- */
window.lrnOpen = id => {
  if (!TRACK_MAP[id]) return;
  S.lrnTrack = id; sv();
  const g = GRP.find(x => x[4].some(v => v[0] === 'learn_t'));
  if (g) window.goSub(g[0], 'learn_t'); else rd();
};

window.lrnDone = id => {
  S.learn = S.learn || [];
  const i = S.learn.indexOf(id);
  if (i >= 0) S.learn.splice(i, 1);
  else { S.learn.push(id); xp(25); window.haptic(12) }
  sv(); rd();
};

/* ---------- جستجو و نشان ---------- */
window.lrnSearch = async () => {
  const r = await ask({
    t: L('جستجو در درس‌ها', 'Search'),
    s: L('فارسی یا انگلیسی. مثال: خواب، پاس، chess، memory', 'Persian or English'),
    f: [{ k: 'q', ty: 'text', v: '' }]
  });
  if (!r || !r.q) return;
  const hits = searchLessons(r.q);
  if (!hits.length) { tst(L('چیزی پیدا نشد', 'Nothing found')); return }
  const pick = await ask({
    t: fa(hits.length) + ' ' + L('نتیجه', 'results'),
    f: [{ k: 'i', ty: 'pick',
          o: hits.map((h, i) => [String(i), h.ic + ' ' + h.t + ' · ' + h.trackName]) }],
    ok: L('باز کن', 'Open')
  });
  if (!pick || pick.i === '') return;
  const l = hits[+pick.i];
  if (!l) return;
  await lrnShow(l);
};

window.lrnStars = async () => {
  const list = starred(S);
  if (!list.length) { tst(L('هنوز درسی نشان نکرده‌ای', 'Nothing starred')); return }
  const pick = await ask({
    t: '★ ' + L('نشان‌شده', 'Starred'),
    f: [{ k: 'i', ty: 'pick',
          o: list.map((h, i) => [String(i), h.ic + ' ' + h.t]) }],
    ok: L('باز کن', 'Open')
  });
  if (!pick || pick.i === '') return;
  const l = list[+pick.i];
  if (l) await lrnShow(l);
};

/** کارت جزئیات یک درس با لینک */
window.lrnShow = async l => {
  const seen = (S.learn || []).includes(l.id);
  const r = await ask({
    t: l.ic + ' ' + l.t,
    s: l.trackName + ' · ' + l.stageName + ' · ' + fa(l.min) + L(' دقیقه', ' min') +
       (l.why ? '\n' + l.why : ''),
    f: [{ k: 'i', ty: 'info', rows: [[L('جستجو در یوتیوب', 'YouTube search'), l.q]] }],
    ok: seen ? L('دیده‌ام ✓', 'Seen') : L('علامت دیدن', 'Mark seen'),
    del: L('باز کردن لینک', 'Open link')
  });
  if (!r) return;
  if (r.__del) { try { window.open(ytLink(l.q), '_blank') } catch (e) { } return }
  window.lrnDone(l.id);
};

window.lrnStar = id => {
  S.lrnStar = S.lrnStar || [];
  const i = S.lrnStar.indexOf(id);
  if (i >= 0) S.lrnStar.splice(i, 1); else { S.lrnStar.push(id); window.haptic(8) }
  sv(); rd();
};

/* ============ MINI — مهارت‌های ریز ============ */
V.mini = () => {
  const p = miniProgress(S);
  const today = miniToday(S);
  const seen = S.learn || [];

  return `<div class="c gl"><div class="ct">◦ ${L('مهارت‌های ریز', 'Micro skills')}
    <b>${fa(p.done)}/${fa(p.total)}</b></div>
   <div class="cs">${L('یک‌بار یاد می‌گیری، تا آخر عمر داری. هرکدام کمتر از ۱۲ دقیقه.',
     'Learn once, keep forever.')}</div>
   <div class="bar lg" style="margin:var(--sp2) 0"><div class="bf" style="width:${p.pc}%"></div></div>
   <div class="hint">${L('این‌ها درس نیستند — کارهای کوچکی‌اند که بلد نبودنشان هر روز هزینه دارد.',
     'Small things that cost you daily.')}</div></div>

  ${today ? `<div class="c gl nowc"><div class="ct">${today.ic} ${L('ریزمهارت امروز', 'Today')}
    <b>${fa(today.min)} ${L('دقیقه', 'min')}</b></div>
   <div class="nowbig">${today.t}</div>
   ${today.why ? `<div class="hint" style="color:var(--dim)">${today.why}</div>` : ''}
   <div class="gr" style="grid-template-columns:2fr 1fr;margin-top:var(--sp3)">
    <a class="bt p" href="${ytLink(today.q)}" target="_blank" rel="noopener"
      style="text-decoration:none;display:grid;place-items:center">▶ ${L('یاد بگیر', 'Learn')}</a>
    <button class="bt" onclick="lrnDone('${today.id}')">${L('بلدم', 'Know it')}</button>
   </div></div>` : ''}

  ${MINI.map(g => {
    const gp = miniProgress(S, g[0]);
    const open = S.miniOpen === g[0];
    return `<div class="c gl" style="padding:0">
     <div class="pw" onclick="miniTg('${g[0]}')">
      <div class="ri">${g[1]}</div>
      <div style="flex:1"><div class="rt">${g[2]}</div>
       <div class="rd">${fa(gp.done)}/${fa(gp.total)}</div>
       <div class="bar" style="margin-top:5px"><div class="bf" style="width:${gp.pc}%"></div></div></div>
      <div class="ar ${open ? 'op' : ''}">▼</div></div>
     ${open ? `<div style="padding:0 var(--sp3) var(--sp3)">
      ${g[3].map(d => {
        const on = seen.includes(d[0]);
        return `<div class="rw ${on ? 'done' : ''}">
         <div class="ri" onclick="lrnDone('${d[0]}')">${on ? '✓' : '○'}</div>
         <div style="flex:1"><div class="rt">${d[1]}</div>
          <div class="rd">${fa(d[3])} ${L('دقیقه', 'min')}${d[4] ? ' · ' + d[4] : ''}</div></div>
         <a class="rx" href="${ytLink(d[2])}" target="_blank" rel="noopener"
           style="text-decoration:none;color:var(--ink)">▶</a></div>`;
      }).join('')}</div>` : ''}</div>`;
  }).join('')}`;
};

window.miniTg = g => { S.miniOpen = S.miniOpen === g ? null : g; sv(); rd() };
