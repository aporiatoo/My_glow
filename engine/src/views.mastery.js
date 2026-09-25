/* ============ MASTERY VIEWS — ذهن · بدن · ظاهر ============ */

/* ---------- نمای کلی تسلط ---------- */
V.mx = () => {
  const m = masteryScore(S);
  const ring = (pc, label, key) => {
    const R = 26, C = 2 * Math.PI * R;
    return `<div class="st" style="text-align:center;padding:var(--sp3) var(--sp1)">
     <svg width="66" height="66" viewBox="0 0 66 66" class="ring">
      <circle cx="33" cy="33" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="4"/>
      <circle cx="33" cy="33" r="${R}" fill="none" stroke="#fff" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${C}"
        stroke-dashoffset="${C * (1 - pc / 100)}" transform="rotate(-90 33 33)"/>
      <text x="33" y="37" text-anchor="middle" fill="#f4f4f5"
        font-size="15" font-family="Vazirmatn" font-weight="800">${fa(pc)}</text>
     </svg>
     <div class="skl" style="margin-top:var(--sp1)">${label}</div></div>`;
  };

  return `<div class="c gl"><div class="ct">◆ ${L('مسیر تسلط', 'Mastery')}<b>${m.tier}</b></div>
   <div class="cs">${L('هیچ سطحی با گذشت زمان باز نمی‌شود. فقط با عدد.', 'Levels unlock by numbers, not time.')}</div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr);margin:var(--sp3) 0">
    ${ring(m.mind, L('ذهن', 'Mind'))}
    ${ring(m.body, L('بدن', 'Body'))}
    ${ring(m.look, L('ظاهر', 'Look'))}
   </div>
   <div class="bar lg"><div class="bf" style="width:${m.all}%"></div></div>
   <div class="hint">${L('کل مسیر', 'Overall')}: ${fa(m.all)}٪ · ${L('ضعیف‌ترین حوزه', 'Weakest')}:
    <b>${m.weakest === 'mind' ? L('ذهن', 'Mind') : m.weakest === 'body' ? L('بدن', 'Body') : L('ظاهر', 'Look')}</b>
    — ${L('اینجا بیشترین سود را می‌گیری.', 'Highest return here.')}</div></div>

  <div class="c gl"><div class="ct">◉ ${L('تمرین ذهنی امروز', 'Mind rep today')}</div>
   ${(() => { const t = mindToday(S); const it = t.item;
     return `<div class="cs">${t.title}</div>
      <div class="nowbig">${it[1]}</div>
      <div class="hint" style="color:var(--dim)">${it[2]}</div>
      ${it[3] ? `<div class="hint">${it[3]}</div>` : ''}
      <button class="bt p" style="margin-top:var(--sp3)" onclick="mindRep('${t.type}','${it[0]}')">
       ${L('امروز تمرینش کردم', 'Practiced today')}</button>`; })()}
   <div class="hint">${L('تکرارهای ثبت‌شده', 'Reps')}: ${fa((S.mind2 && S.mind2.reps) || 0)}</div></div>`;
};

/* ---------- ذهن ---------- */
V.mx_mind = () => {
  const ms = mindScore(S);
  const m2 = S.mind2 || {};
  const sec = (key, title, items, cols) => {
    const done = m2[key] || [];
    return `<div class="c gl"><div class="ct">${title}<b>${fa(done.length)}/${fa(items.length)}</b></div>
     <div class="bar" style="margin:var(--sp2) 0"><div class="bf" style="width:${done.length / items.length * 100}%"></div></div>
     ${items.map(it => `<div class="rw ${done.includes(it[0]) ? 'done' : ''}" onclick="mindRep('${key}','${it[0]}')">
       <div class="ri">${done.includes(it[0]) ? '✓' : '○'}</div>
       <div><div class="rt">${it[1]}</div><div class="rd">${it[2]}</div>
       ${it[3] ? `<div class="rd" style="color:var(--dim2);margin-top:2px">${it[3]}</div>` : ''}</div></div>`).join('')}</div>`;
  };

  return `<div class="c gl"><div class="ct">◈ ${L('ذهن', 'Mind')}<b>${fa(ms.pc)}٪</b></div>
   <div class="cs">${L('خواندن آدم‌ها، نفوذ سالم، و تفکر دقیق. هر مورد را که در دنیای واقعی تمرین کردی تیک بزن.', 'Read people, influence honestly, think clearly.')}</div>
   <div class="hint">${L('تشخیص، تمرین می‌خواهد نه خواندن. یک هفته روی هر مورد بمان و در آدم‌های واقعی دنبالش بگرد.', 'Recognition needs reps, not reading.')}</div></div>

  ${sec('micro', '◉ ' + L('ریزحالت چهره', 'Microexpressions'), MICRO)}
  ${sec('tells', '◇ ' + L('نشانهٔ ناهماهنگی', 'Incongruence tells'), TELLS)}
  ${sec('infl', '◆ ' + L('اصول نفوذ', 'Influence'), INFLUENCE)}
  ${sec('fall', '⊘ ' + L('مغالطه‌ها', 'Fallacies'), FALLACY)}
  ${sec('model', '▲ ' + L('مدل‌های ذهنی', 'Mental models'), MODELS)}

  <div class="c gl"><div class="ct">◍ ${L('اخلاق نفوذ', 'Ethics')}</div>
   <div class="cs">${L('فریب در کوتاه‌مدت جواب می‌دهد و در بلندمدت اعتبارت را می‌سوزاند. نفوذ واقعی یعنی آدم‌ها بخواهند با تو کار کنند — و این برنمی‌گردد به تو ضربه بزند.', 'Manipulation wins short-term and destroys trust long-term.')}</div>
   <div class="hint">${L('معیار ساده: اگر طرف مقابل بعداً بفهمد چه کردی، هنوز راضی است؟ اگر نه، آن کار فریب بود.', 'If they later learn what you did, would they still be fine with it?')}</div></div>`;
};

/* ---------- بدن و فوتبال ---------- */
V.mx_body = () => {
  const fs = footballScore(S);
  const log = S.fsk || {};

  return `<div class="c gl"><div class="ct">⚽ ${L('فوتبال', 'Football')}<b>${fa(fs.pc)}٪</b></div>
   <div class="bar lg" style="margin:var(--sp2) 0"><div class="bf" style="width:${fs.pc}%"></div></div>
   <div class="cs">${L('هر مهارت را بسنج و عدد را ثبت کن. سطح فقط با عدد بالا می‌رود.', 'Measure, then log. Levels come from numbers.')}</div>
   ${FSKILL.map((s, i) => { const v = log[s[0]], tier = fs.tiers[i];
     return `<div class="rw" onclick="fskLog('${s[0]}')">
      <div class="ri">${tier ? fa(tier) : '○'}</div>
      <div><div class="rt">${s[1]}</div>
       <div class="rd">${v !== undefined ? fa(v) + ' · ' + TIERS[Math.max(0, tier - 1)] : s[2]}</div></div>
      <div class="rx">${tier === 5 ? '★' : '+'}</div></div>`; }).join('')}
   ${fs.tested > 0 ? `<div class="hint">${L('ضعیف‌ترین مهارتت', 'Weakest')}: <b>${fs.weakest[1]}</b> —
     ${L('اینجا تمرین کن، بیشترین جهش را می‌گیری.', 'Train here for the biggest jump.')}</div>` : ''}</div>

  <div class="c gl"><div class="ct">◷ ${L('تمرین انفرادی', 'Solo drills')}</div>
   <div class="cs">${L('روزهایی که تیم نداری. بدون تجهیزات خاص.', 'No team, no equipment.')}</div>
   ${FDRILL.map(d => `<div class="rw" onclick="drillDo('${d[0]}')">
     <div class="ri">◦</div>
     <div><div class="rt">${d[1]} · ${fa(d[2])} ${L('دقیقه', 'min')}</div>
      <div class="rd">${d[3]}</div></div></div>`).join('')}
   <div class="hint">${L('پای ضعیف مهم‌ترین است. بیشتر بازیکنان هم‌سن تو رویش کار نمی‌کنند — همان‌جاست که جلو می‌زنی.', 'Weak foot is where you pull ahead.')}</div></div>

  <div class="c gl"><div class="ct">▲ ${L('ذهنیت مبارز', 'Warrior mindset')}</div>
   <div class="cs">${L('نه پرخاشگری — توانایی انجام کاری که سخت است وقتی حوصله نداری.', 'Not aggression. Doing hard things anyway.')}</div>
   ${WARRIOR.map(w => { const n = (S.war && S.war[w[0]]) || 0;
     return `<div class="rw" onclick="warDo('${w[0]}')">
      <div class="ri">${n > 0 ? fa(n) : '○'}</div>
      <div><div class="rt">${w[1]}</div><div class="rd">${w[2]}</div></div></div>`; }).join('')}</div>`;
};

/* ---------- ظاهر ---------- */
V.mx_look = () => {
  const ls = lookScore(S);
  return `<div class="c gl"><div class="ct">◈ ${L('ظاهر', 'Appearance')}<b>${fa(ls.pc)}٪</b></div>
   <div class="bar lg" style="margin:var(--sp2) 0"><div class="bf" style="width:${ls.pc}%"></div></div>
   <div class="cs">${L('این نمره از دادهٔ واقعی اپ می‌آید، نه خوداظهاری: خواب، تمرین، ثبات روتین، عکس پیشرفت.', 'Scored from real data, not self-report.')}</div>
   <div class="hint">${L('ظاهر بیشتر نتیجهٔ عادت است تا ژنتیک. خواب و ترکیب بدن از هر محصولی مؤثرترند.', 'Looks follow habits more than genes.')}</div></div>

  <div class="c gl"><div class="ct">◉ ${L('عوامل به ترتیب اهمیت', 'By impact')}</div>
   ${LOOKS.map((l, i) => `<div class="rw"><div class="ri">${fa(i + 1)}</div>
     <div><div class="rt">${l[1]}</div><div class="rd">${l[2]}</div></div></div>`).join('')}
   <div class="hint">${L('ترتیب مهم است. کسی که کم می‌خوابد ولی سرم گران می‌زند، دارد اشتباه هزینه می‌کند.', 'Order matters.')}</div></div>`;
};

/* ---------- اکشن‌ها ---------- */
window.mindRep = (type, id) => {
  S.mind2 = S.mind2 || {};
  S.mind2[type] = S.mind2[type] || [];
  const i = S.mind2[type].indexOf(id);
  if (i >= 0) { S.mind2[type].splice(i, 1); }
  else { S.mind2[type].push(id); S.mind2.reps = (S.mind2.reps || 0) + 1; xp(15); window.haptic(10); }
  sv(); rd();
};

window.fskLog = async key => {
  const s = FSKILL.find(x => x[0] === key);
  if (!s) return;
  const cur = (S.fsk || {})[key];
  const r = await ask({
    t: s[1], s: s[2] + '\n' + L('نشان‌های سطح: ', 'Tiers: ') + s[3].map(fa).join(' · '),
    f: [{ k: 'v', ty: 'num', v: cur !== undefined ? String(cur) : '' }]
  });
  if (!r || r.v === '' || isNaN(+r.v)) return;
  const before = fskillTier(key, cur);
  S.fsk = S.fsk || {};
  S.fsk[key] = +r.v;
  const after = fskillTier(key, +r.v);
  xp(30); sv(); rd();
  if (after > before) { window.haptic(25); tst('★ ' + L('سطح ', 'Tier ') + fa(after) + ' — ' + TIERS[after - 1]); }
  else tst('✓ ' + L('ثبت شد', 'Logged'));
};

window.drillDo = key => {
  const d = FDRILL.find(x => x[0] === key);
  if (!d) return;
  S.wo = S.wo || [];
  S.wo.push({ d: td(), t: 1, l: d[1] });
  xp(25); window.haptic(12); sv(); rd();
  tst('⚽ ' + d[1] + ' ' + L('ثبت شد', 'logged'));
};

window.warDo = key => {
  S.war = S.war || {};
  S.war[key] = (S.war[key] || 0) + 1;
  xp(20); window.haptic(14); sv(); rd();
  tst('▲ ' + fa(S.war[key]));
};
