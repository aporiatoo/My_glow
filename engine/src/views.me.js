/* ============ ME VIEWS — ساخته‌شده روی واقعیت لوکاس ============ */

/* ---------- بازیابی خواب: بحرانی‌ترین سیستم فعلی ---------- */
V.slfix = () => {
  const cr = sleepCrisis(S);
  const pl = sleepPlan(S);

  if (!pl) {
    return `<div class="c gl nowc"><div class="ct">● ${L('بازیابی خواب', 'Sleep reset')}</div>
     <div class="nowbig">${L('این تنها متغیری است که اگر درست شود، بقیه خودشان راحت‌تر می‌شوند. خودت هم همین را گفتی.',
       'Fix this first.')}</div>
     <div class="gr" style="grid-template-columns:repeat(3,1fr);margin:var(--sp3) 0">
      <div class="sk"><div class="skn">${fa(ME.sleepHoursNow)}<span class="u">h</span></div>
       <div class="skl">${L('الان', 'Now')}</div></div>
      <div class="sk"><div class="skn">${fa(ME.sleepNeed)}<span class="u">h</span></div>
       <div class="skl">${L('نیاز', 'Need')}</div></div>
      <div class="sk"><div class="skn">${fa(cr.weekly)}<span class="u">h</span></div>
       <div class="skl">${L('بدهی هفته', 'Debt')}</div></div>
     </div>
     <div class="hint">${L('در دورهٔ جهش رشد، بیشترین ترشح هورمون رشد بین ۲۳ تا ۲ بامداد است. الان دقیقاً آن پنجره را از دست می‌دهی.',
       'Growth hormone peaks 23:00–02:00.')}</div>
     <div class="hint">${L('پریدن از ۰۳:۳۰ به ۲۳:۰۰ در یک شب شکست می‌خورد. هر سه شب، بیست دقیقه جلوتر. چهل و پنج روز تا هدف.',
       'Shift 20 min every 3 nights.')}</div>
     <button class="bt p" style="margin-top:var(--sp3)" onclick="slStart()">
      ${L('شروع برنامهٔ بازگشت', 'Start')}</button></div>

    ${_griefCard()}`;
  }

  return `<div class="c gl nowc"><div class="ct">● ${L('بازیابی خواب', 'Sleep reset')}
    <b>${L('روز ', 'Day ')}${fa(pl.day)}</b></div>
   ${pl.done
     ? `<div class="nowbig">${L('به هدف رسیدی. حالا فقط نگهش دار.', 'Target reached.')}</div>`
     : `<div class="nowbig">${L('امشب ساعت ', 'Tonight at ')}<b>${fa(pl.targetStr)}</b>${L(' بخواب', '')}</div>`}
   <div class="bar lg" style="margin:var(--sp3) 0">
    <div class="bf" style="width:${Math.round(pl.shiftMin / 270 * 100)}%"></div></div>
   <div class="hint">${L('جلو آمده', 'Shifted')}: ${fa(Math.floor(pl.shiftMin / 60))}${L(' ساعت ', 'h ')}${fa(pl.shiftMin % 60)}${L(' دقیقه', 'm')}
    ${pl.done ? '' : ' · ' + L('باقی‌مانده ', 'left ') + fa(Math.floor(pl.remain / 60)) + ':' + String(pl.remain % 60).padStart(2, '۰')}</div>
   <div class="hint">${L('پلهٔ ', 'Step ')}${fa(pl.step)} ${L('از ۱۴', 'of 14')} — ${L('هر سه شب یک پله', 'one step per 3 nights')}</div>
   <button class="bt" style="margin-top:var(--sp2)" onclick="slLog()">${L('ثبت خواب دیشب', 'Log last night')}</button>
   <div class="hint" onclick="slReset()" style="cursor:pointer">${L('شروع دوباره از امروز', 'Restart')}</div></div>

  <div class="c gl"><div class="ct">◍ ${L('قواعد این ۴۵ روز', 'Rules')}</div>
   <div class="li">${L('گوشی یک ساعت قبل از هدف، بیرون از اتاق. الان کنار تختت می‌خوابد.', 'Phone out of room.')}</div>
   <div class="li">${L('لپ‌تاپ و فیلم، دو ساعت قبل از هدف تمام.', 'No screens 2h before.')}</div>
   <div class="li">${L('اگر خوابت نبرد، بلند شو و کار کسل‌کننده کن. در تخت نمان.', 'Do not lie awake.')}</div>
   <div class="li">${L('ساعت بیداری ثابت، حتی جمعه. این از ساعت خواب مهم‌تر است.', 'Fixed wake time.')}</div>
   <div class="li">${L('نور آفتاب در ۳۰ دقیقهٔ اول بیداری — ساعت بدنت را جلو می‌کشد.', 'Morning light.')}</div>
   <div class="hint">${L('موسیقی کلاسیک بی‌کلام در نیم ساعت آخر کمک می‌کند. همان چیزی که دوست داری.',
     'Instrumental classical helps.')}</div></div>

  ${_griefCard()}`;
};

/* کارت سوگ — بدون احساساتی شدن، فقط واقعیت */
function _griefCard() {
  const gd = S.griefFrom ? Math.floor((Date.now() - new Date(S.griefFrom)) / 864e5) : null;
  return `<div class="c gl"><div class="ct">◇ ${L('چرا این عادت ساخته شد', 'Why this happened')}</div>
   <div class="cs">${L('دو ماه شب‌ها بیدار ماندی تا کنار مادربزرگت باشی. بدنت آن ریتم را یاد گرفت. این عادت از ضعف نیامده — از کاری آمده که درست بود.',
     'Your body learned that rhythm for a reason.')}</div>
   ${gd !== null ? `<div class="hint">${fa(gd)} ${L('روز از آن اتفاق گذشته', 'days since')}</div>` : ''}
   <div class="hint">${L('سوگ روی خواب اثر می‌گذارد و این طبیعی است. اگر بعد از اصلاح ریتم هم خواب برنگشت، مسئله خواب نیست.',
     'Grief affects sleep. That is normal.')}</div></div>`;
}

/* ---------- ژورنال صداقت ---------- */
V.honest = () => {
  const log = S.honest || [];
  const last30 = log.filter(x => (Date.now() - new Date(x.d)) / 864e5 <= 30);
  const truth = last30.filter(x => x.k === 'true').length;
  const lie = last30.filter(x => x.k === 'lie').length;
  const tot = truth + lie;

  return `<div class="c gl"><div class="ct">◈ ${L('دفتر صداقت', 'Honesty log')}
    ${tot ? `<b>${fa(Math.round(truth / tot * 100))}٪</b>` : ''}</div>
   <div class="cs">${L('نه برای قضاوت. برای دیدن الگو. هر بار که دروغ گفتی یا می‌توانستی بگویی و نگفتی، ثبت کن.',
     'Not judgement. Pattern.')}</div>
   ${tot >= 5 ? `<div class="gr" style="grid-template-columns:1fr 1fr;margin:var(--sp3) 0">
     <div class="sk"><div class="skn">${fa(truth)}</div><div class="skl">${L('راست گفتم', 'Told truth')}</div></div>
     <div class="sk"><div class="skn">${fa(lie)}</div><div class="skl">${L('دروغ گفتم', 'Lied')}</div></div>
    </div>
    ${(() => {
      const why = {};
      last30.filter(x => x.k === 'lie').forEach(x => { if (x.why) why[x.why] = (why[x.why] || 0) + 1 });
      const top = Object.entries(why).sort((a, b) => b[1] - a[1])[0];
      return top ? `<div class="hint" style="color:var(--ink)">${L('بیشترین دلیل: ', 'Top reason: ')}<b>${top[0]}</b>
       (${fa(top[1])} ${L('بار', 'times')})</div>
       <div class="hint">${_lieFix(top[0])}</div>` : '';
    })()}`
   : `<div class="empty"><span class="ei">◈</span>${L('بعد از پنج ثبت، الگویت ظاهر می‌شود.', 'Pattern after 5 logs.')}</div>`}
   <div class="gr" style="grid-template-columns:1fr 1fr;margin-top:var(--sp3)">
    <button class="bt p" onclick="hnLog('true')">${L('راست گفتم', 'Told truth')}</button>
    <button class="bt" onclick="hnLog('lie')">${L('دروغ گفتم', 'Lied')}</button>
   </div></div>

  <div class="c gl"><div class="ct">◍ ${L('چرا این مهم است', 'Why')}</div>
   <div class="cs">${L('نوشتی که نمی‌دانی حرف‌هایی که به خودت می‌زنی راست است یا نه. راهش این است که بیرون از ذهنت ثبت کنی. حافظه قابل تحریف است، نوشته نه.',
     'Memory distorts. Writing does not.')}</div>
   <div class="hint">${L('دروغ گفتن در ۱۴ سالگی معمولاً کارکرد دارد — محافظت، جا افتادن، کنترل. وقتی بفهمی کدام کارکرد را دارد، می‌توانی همان نیاز را جور دیگری برآورده کنی.',
     'Lying usually serves a function.')}</div>
   <div class="hint">${L('هدف صفر شدن نیست. هدف این است که بدانی کِی و چرا.', 'The goal is awareness, not zero.')}</div></div>

  ${last30.length ? `<div class="c gl"><div class="ct">◦ ${L('اخیر', 'Recent')}</div>
   ${log.slice(-8).reverse().map(x => `<div class="rw">
     <div class="ri">${x.k === 'true' ? '✓' : '○'}</div>
     <div><div class="rt">${x.k === 'true' ? L('راست', 'Truth') : L('دروغ', 'Lie')}${x.why ? ' · ' + esc(x.why) : ''}</div>
      <div class="rd">${x.d}${x.note ? ' · ' + esc(x.note) : ''}</div></div></div>`).join('')}</div>` : ''}`;
};

function _lieFix(why) {
  const F = {
    'محافظت از خودم': 'وقتی برای محافظت دروغ می‌گویی یعنی جایی احساس ناامنی می‌کنی. آن موقعیت را بنویس — معمولاً یک الگوی تکراری است.',
    'جا افتادن': 'برای پذیرفته شدن دروغ می‌گویی. این یعنی جمعی که در آنی، تو را با خودت نمی‌پذیرد. ارزش پرسیدن دارد.',
    'بزرگ‌نمایی': 'بلوف برای تحسین. کوتاه‌مدت جواب می‌دهد، بلندمدت اعتبار می‌سوزاند — همان چیزی که نمی‌خواهی.',
    'فرار از دردسر': 'رایج‌ترین دلیل و قابل‌فهم‌ترین. ولی هزینه‌اش این است که بعداً خودت هم نمی‌دانی چه چیزی واقعی بود.',
    'عادت': 'بدون دلیل مشخص. این سخت‌ترین نوع است چون خودکار شده. فقط ثبت کردنش، آگاهی می‌سازد.'
  };
  return F[why] || 'ادامه بده تا الگو روشن‌تر شود.';
}

/* ---------- تدارکات ---------- */
V.buy = () => {
  const got = S.buy || {};
  const tot = BUY.filter(b => !got[b[0]]).reduce((a, b) => a + b[2], 0);
  return `<div class="c gl"><div class="ct">◱ ${L('تدارکات', 'Gear')}
    <b>${fa(Object.keys(got).filter(k => got[k]).length)}/${fa(BUY.length)}</b></div>
   <div class="cs">${L('به ترتیب اثر واقعی، نه قیمت. اول توپ — بدون آن هشت تمرین از ده تمرین ممکن نیست.',
     'Ordered by impact.')}</div>
   ${[1, 2, 3].map(pr => {
     const items = BUY.filter(b => b[3] === pr);
     if (!items.length) return '';
     return `<div class="hint" style="margin-top:var(--sp3)">${
       pr === 1 ? L('الان', 'Now') : pr === 2 ? L('این ماه', 'This month') : L('بعداً', 'Later')}</div>
      ${items.map(b => {
        const on = !!got[b[0]];
        return `<div class="rw ${on ? 'done' : ''}" onclick="buyTg('${b[0]}')">
         <div class="ri">${on ? '✓' : '○'}</div>
         <div><div class="rt">${b[1]}${b[2] ? ' · ' + fa(Math.round(b[2] / 1000)) + L(' هزار', 'k') : ' · ' + L('رایگان', 'free')}</div>
          <div class="rd">${b[4]}</div></div></div>`;
      }).join('')}`;
   }).join('')}
   <div class="hint">${L('باقی‌ماندهٔ تخمینی', 'Remaining')}: ${fa(Math.round(tot / 1000))} ${L('هزار تومان', 'k')}</div>
   <div class="hint">${L('مخروط لازم نیست بخری — بطری آب خالی یا کفش هم کار می‌کند.', 'Bottles work as cones.')}</div></div>`;
};

/* ---------- اکشن‌ها ---------- */
window.slStart = () => {
  S.sleepFix = { start: td() };
  if (!S.griefFrom) S.griefFrom = dstr(new Date(Date.now() - 14 * 864e5));
  sv(); rd();
  const p = sleepPlan(S);
  tst('● ' + L('امشب ', 'Tonight ') + (p ? fa(p.targetStr) : ''));
};

window.slReset = () => { S.sleepFix = { start: td() }; sv(); rd(); tst(L('از امروز', 'Restarted')) };

window.hnLog = async k => {
  const r = await ask({
    t: k === 'true' ? L('راست گفتم', 'Told truth') : L('دروغ گفتم', 'Lied'),
    s: k === 'lie' ? L('بدون قضاوت. فقط برای دیدن الگو.', 'No judgement.') : '',
    f: k === 'lie'
      ? [{ k: 'why', t: L('چرا', 'Why'), ty: 'pick', o: [
          ['محافظت از خودم', 'محافظت از خودم'], ['جا افتادن', 'جا افتادن'],
          ['بزرگ‌نمایی', 'بزرگ‌نمایی'], ['فرار از دردسر', 'فرار از دردسر'], ['عادت', 'عادت']] },
         { k: 'note', t: L('یک کلمه دربارهٔ موقعیت', 'Context'), ty: 'text', v: '' }]
      : [{ k: 'note', t: L('سخت بود؟', 'Was it hard?'), ty: 'text', v: '' }]
  });
  if (!r) return;
  S.honest = S.honest || [];
  S.honest.push({ d: td(), k, why: r.why || '', note: r.note || '' });
  if (k === 'true') xp(20);
  window.haptic(10); sv(); rd();
  tst(k === 'true' ? '✓' : '◦ ' + L('ثبت شد', 'Logged'));
};

window.buyTg = id => {
  S.buy = S.buy || {};
  S.buy[id] = !S.buy[id];
  window.haptic(8); sv(); rd();
};
