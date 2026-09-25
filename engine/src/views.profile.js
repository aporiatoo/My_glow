/* ============ PROFILE VIEW — شخصی‌سازی کامل ============ */

V.pf = () => {
  const p = prof(S);
  const gl = goals(S);
  const DOW = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];

  return `<div class="c gl"><div class="ct">◎ ${L('پروفایل شخصی','Profile')}</div>
   <div class="cs">${L('همهٔ اعداد سیستم از اینجا می‌آیند. هر چیزی را عوض کنی، کل اپ خودش را تنظیم می‌کند.','Every number flows from here.')}</div>
   <div class="gr" style="grid-template-columns:1fr 1fr;margin-top:var(--sp3)">
    ${profRows(S).map(r=>`<div class="st"><div class="sn">
      <span>${r[0]}</span><span class="sv">${typeof r[1]==='number'?fa(r[1]):r[1]}</span></div></div>`).join('')}
   </div></div>

  ${gl.length?`<div class="c gl"><div class="ct">◆ ${L('اهداف شخصی','Goals')}</div>
   ${gl.map(g=>`<div style="margin-bottom:var(--sp3)">
     <div class="sn"><span>${g.ic} ${g.t}</span>
      <span class="sv">${fa(g.cur)}${g.unit} / ${fa(g.goal)}${g.unit}</span></div>
     <div class="bar" style="margin:6px 0"><div class="bf" style="width:${g.pc}%"></div></div>
     <div class="hint" style="margin:0">${g.note}</div></div>`).join('')}</div>`:''}

  <div class="c gl"><div class="ct">◈ ${L('تنظیم','Adjust')}</div>
   ${[['name',L('نام','Name'),'text'],
      ['height',L('قد فعلی (cm)','Height'),'num'],
      ['sleepNeed',L('نیاز خواب (ساعت)','Sleep need'),'num'],
      ['protein',L('پروتئین روزانه (g)','Protein'),'num'],
      ['water',L('آب روزانه (ml)','Water'),'num'],
      ['goalHeight',L('هدف قد (cm)','Goal height'),'num'],
      ['goalGPA',L('هدف معدل','Goal GPA'),'num'],
      ['barberWeeks',L('فاصلهٔ آرایشگاه (هفته)','Barber weeks'),'num']]
     .map(f=>`<div class="rw" onclick="pfEdit('${f[0]}','${f[1]}','${f[2]}')">
      <div class="ri">◦</div><div><div class="rt">${f[1]}</div>
      <div class="rd">${typeof p[f[0]]==='number'?fa(p[f[0]]):(p[f[0]]||'—')}</div></div>
      <div class="rx">✎</div></div>`).join('')}
   <div class="rw" onclick="pfFood()"><div class="ri">⊘</div>
    <div><div class="rt">${L('غذاهایی که نمی‌خورم','Food dislikes')}</div>
    <div class="rd">${(p.dislikes||[]).join('، ')||'—'}</div></div><div class="rx">✎</div></div>
   <div class="rw" onclick="pfDays('clubDays')"><div class="ri">⚽</div>
    <div><div class="rt">${L('روزهای باشگاه','Club days')}</div>
    <div class="rd">${p.clubDays.map(d=>DOW[d]).join('، ')}</div></div><div class="rx">✎</div></div>
   <div class="rw" onclick="pfPos()"><div class="ri">◉</div>
    <div><div class="rt">${L('پست هدف','Target position')}</div>
    <div class="rd">${p.targetPos?(POS.find(x=>x[0]===p.targetPos)||[,'—'])[1]:L('تعیین نشده','not set')}</div></div>
    <div class="rx">✎</div></div>
   <div class="rw" onclick="pfFoot()"><div class="ri">◐</div>
    <div><div class="rt">${L('پای برتر','Strong foot')}</div>
    <div class="rd">${p.footStrong==='right'?L('راست','Right'):L('چپ','Left')}</div></div>
    <div class="rx">⇄</div></div></div>

  <div class="c gl"><div class="ct">◍ ${L('چرا مهم است','Why')}</div>
   <div class="li">${L('پروتئین و آب مستقیم در برنامهٔ غذایی و کوئست‌ها اعمال می‌شوند','Protein and water drive meals')}</div>
   <div class="li">${L('غذاهای ممنوع در سطح داده فیلتر می‌شوند — هرگز پیشنهاد نمی‌شوند','Dislikes filtered at data level')}</div>
   <div class="li">${L('روزهای باشگاه، تایم‌لاین را بازنویسی می‌کنند','Club days rewrite the timeline')}</div>
   <div class="li">${L('پست هدف، مهارت‌های کلیدی فوتبال را مشخص می‌کند','Target position marks key skills')}</div></div>`;
};

/* ---------- اکشن‌ها ---------- */
window.pfSet = (k, v) => {
  S.prof = S.prof || {};
  S.prof[k] = v;
  sv(); rd();
};

window.pfEdit = async (key, label, type) => {
  const p = prof(S);
  const r = await ask({ t: label,
    f: [{ k: 'v', ty: type === 'num' ? 'num' : 'text', v: String(p[key] ?? '') }] });
  if (!r || r.v === '') return;
  window.pfSet(key, type === 'num' ? +r.v : r.v);
  window.haptic(10);
  tst('✓ ' + label);
};

window.pfFood = async () => {
  const p = prof(S);
  const r = await ask({
    t: L('غذاهایی که نمی‌خورم', 'Dislikes'),
    s: L('با ویرگول جدا کن. این‌ها هرگز در برنامهٔ غذایی و لیست خرید نمی‌آیند.', 'Never suggested.'),
    f: [{ k: 'v', ty: 'text', v: (p.dislikes || []).join('، ') }] });
  if (!r) return;
  const list = String(r.v || '').split(/[،,]/).map(x => x.trim()).filter(Boolean);
  window.pfSet('dislikes', list);
  tst('⊘ ' + fa(list.length) + ' ' + L('مورد', 'items'));
};

window.pfDays = async key => {
  const p = prof(S);
  const DOW = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
  const r = await ask({
    t: L('روزهای باشگاه', 'Club days'),
    f: [{ k: 'v', ty: 'text', v: p[key].map(d => DOW[d]).join('، ') }],
    s: L('نام روزها با ویرگول', 'Day names, comma separated') });
  if (!r) return;
  const days = String(r.v || '').split(/[،,]/).map(x => DOW.indexOf(x.trim())).filter(i => i >= 0);
  if (days.length) { window.pfSet(key, days); tst('✓'); }
};

window.pfPos = async () => {
  const r = await ask({ t: L('پست هدف', 'Target position'),
    f: [{ k: 'v', ty: 'pick', o: POS.map(x => [x[0], x[1]]) }] });
  if (!r || !r.v) return;
  window.pfSet('targetPos', r.v);
  tst('⚽ ' + (POS.find(x => x[0] === r.v) || [, ''])[1]);
};

window.pfFoot = () => {
  const p = prof(S);
  window.pfSet('footStrong', p.footStrong === 'right' ? 'left' : 'right');
};
