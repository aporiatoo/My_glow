/* ============ AI VIEW — بینش از دادهٔ خودت ============ */

V.ai = () => {
  const sum = aiSummary(S);
  const ins = insights(S);
  const fc = forecast(S);
  const adv = advise(S, { hour: new Date().getHours() });

  if (!S.ai) {
    return `<div class="c gl"><div class="ct">◇ ${L('موتور هوشمند', 'Smart engine')}
      <b>${L('خاموش', 'off')}</b></div>
     <div class="cs">${L('کشف الگو، پیش‌بینی و توصیهٔ تطبیقی خاموش است. هیچ داده‌ای پردازش نمی‌شود.',
       'Pattern detection is off.')}</div>
     <button class="bt p" style="margin-top:var(--sp3)" onclick="tgAi()">
      ${L('روشن کن', 'Turn on')}</button></div>`;
  }

  return `<div class="c gl"><div class="ct">◇ ${L('موتور هوشمند', 'Smart engine')}
    <b>${L('روشن', 'on')}</b></div>
   <div class="cs">${L('همه‌چیز روی همین گوشی محاسبه می‌شود. بدون اینترنت، بدون سرور. این الگوها از دادهٔ خودِ تو می‌آیند — نه توصیهٔ عمومی.',
     'Computed on-device from your own data.')}</div>
   <div class="gr" style="grid-template-columns:repeat(3,1fr);margin-top:var(--sp3)">
    <div class="sk"><div class="skn">${fa(sum.insights)}</div><div class="skl">${L('الگو', 'Patterns')}</div></div>
    <div class="sk"><div class="skn">${fa(sum.forecast)}</div><div class="skl">${L('پیش‌بینی', 'Forecast')}</div></div>
    <div class="sk"><div class="skn">${fa(sum.dataDays)}</div><div class="skl">${L('ثبت', 'Records')}</div></div>
   </div>
   <div class="hint" onclick="tgAi()" style="cursor:pointer">${L('خاموش کردن موتور', 'Turn off')}</div></div>

  ${adv ? `<div class="c gl nowc"><div class="ct">${adv.ic} ${L('همین حالا', 'Right now')}</div>
   <div class="nowbig">${adv.t}</div></div>` : ''}

  ${ins.length ? ins.map(i => `<div class="c gl">
     <div class="ct">${i.ic} ${L('الگوی کشف‌شده', 'Pattern')}
      <b>${L('قدرت', 'strength')} ${fa(Math.round(i.w * 100))}٪</b></div>
     <div class="nowbig" style="font-size:var(--t3)">${i.t}</div></div>`).join('')
   : `<div class="c gl"><div class="ct">◦ ${L('هنوز الگویی نیست', 'No patterns yet')}</div>
     <div class="empty"><span class="ei">◇</span>
      ${L('برای کشف الگو حداقل دو هفته ثبت خواب و حال لازم است. هرچه بیشتر ثبت کنی، دقیق‌تر می‌شود.',
        'Needs about two weeks of sleep and mood logs.')}</div></div>`}

  ${fc ? `<div class="c gl"><div class="ct">◈ ${L('پیش‌بینی', 'Forecast')}</div>
   ${fc.map(f => `<div class="rw"><div class="ri">${f.ic}</div>
     <div><div class="rt">${f.t}: ${f.v}</div><div class="rd">${f.note}</div></div></div>`).join('')}
   <div class="hint">${L('این‌ها برون‌یابی روند فعلی‌اند، نه قطعیت. اگر رفتارت عوض شود، عدد هم عوض می‌شود.',
     'Extrapolation, not certainty.')}</div></div>` : ''}

  <div class="c gl"><div class="ct">◍ ${L('چطور کار می‌کند', 'How it works')}</div>
   <div class="li">${L('همبستگی پیرسون بین خواب، حال، انرژی و کارهای انجام‌شده', 'Pearson correlation')}</div>
   <div class="li">${L('روند خطی برای تشخیص افت و صعود چهارده‌روزه', 'Linear trend over 14 days')}</div>
   <div class="li">${L('مقایسهٔ میانگین روزهای با تمرین و بدون تمرین', 'Group comparison')}</div>
   <div class="li">${L('تحلیل روز هفته برای پیدا کردن ضعیف‌ترین روزت', 'Day-of-week analysis')}</div>
   <div class="hint">${L('مدل زبانی بزرگ اینجا استفاده نشده — برای این کار کند و کم‌دقت است. آمار روی دادهٔ خودت فوری و دقیق‌تر جواب می‌دهد.',
     'No LLM: slower and less accurate for this task.')}</div></div>`;
};

window.tgAi = () => {
  S.ai = S.ai ? 0 : 1;
  sv(); rd();
  tst(S.ai ? L('موتور هوشمند روشن شد', 'Engine on') : L('خاموش شد', 'Off'));
};
