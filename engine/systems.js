/* ================= READINESS INDEX ================= */
function readiness(S){
  const d=td();
  const j=(S.jr||[]).find(x=>x.d===d);
  const mood=j?+j.m:3;
  const sl=S.sleepLog&&S.sleepLog[d]!==undefined?S.sleepLog[d]:8;
  const load=(S.wo||[]).filter(w=>(Date.now()-new Date(w.t))/864e5<=3).length;
  const avg=(S.wo||[]).length?S.wo.length/Math.max(1,Math.ceil((Date.now()-new Date(S.wo[0].t))/6048e5)):2;
  let sc=50;
  sc += (sl-7)*11;                       // خواب: مهم‌ترین عامل
  sc += (mood-3)*7;                      // حال
  sc -= Math.max(0,load-avg*0.6)*8;      // خستگی تجمعی
  if(S.streak && S.streak.clean>3) sc+=4;
  sc=Math.max(5,Math.min(100,Math.round(sc)));
  const v = sc>=78?['اوج','امروز می‌توانی سخت‌ترین کارها را بزنی. فشار بیاور.']
          : sc>=58?['خوب','ظرفیت عادی. برنامه را کامل اجرا کن.']
          : sc>=38?['متوسط','شدت را کم کن ولی متوقف نشو. کیفیت به جای حجم.']
          : ['پایین','امروز فقط حداقل‌ها. ریکاوری اولویت است — این هوشمندی است نه تنبلی.'];
  return {sc, lbl:v[0], msg:v[1], sl, mood};
}

/* ================= DIRECTIVE OF THE DAY ================= */
function directive(S){
  const d=td(), p=plan(), m=mn(), r=readiness(S);
  const D=[];
  // خواب
  const sl3=Object.values(S.sleepLog||{}).slice(-3);
  if(sl3.length>=2 && sl3.every(x=>x<7.5))
    D.push([95,'امشب قبل از ۲۱:۰۰ در تخت باش','سه شب پیاپی کم‌خوابی. در سن تو این مستقیماً روی رشد قد و تمرکز اثر می‌گذارد. هر کار دیگری امروز در اولویت دوم است.']);
  // تمرین
  const dow=new Date().getDay(), isFoot=[0,2,4].includes(dow)&&!(S.season==='school'&&dow===2);
  const trainDone=S.q[d+'|train'];
  if(isFoot && !trainDone && m>=12*60 && m<14*60)
    D.push([88,'تا ۲ ساعت دیگر تمرین داری — الان آماده شو','ساک، آب، میان‌وعدهٔ سبک. گرم‌کردن سرد وارد زمین نشو.']);
  if(!isFoot && !trainDone && m>=16*60 && m<19*60)
    D.push([70,'تمرین خانگی هنوز انجام نشده','۴۰ دقیقه. همین الان بهترین زمان است.']);
  // پروتئین
  const tp=(S.prot&&S.prot[d]||[]).reduce((a,x)=>a+x.p,0);
  if(m>=15*60 && tp<60)
    D.push([75,`فقط ${fa(tp)} گرم پروتئین خورده‌ای`,`تا شب باید به ${fa(PROTEIN_TARGET)} برسی. بدون پروتئین، تمرین امروز هدر می‌رود.`]);
  // آمادگی پایین
  if(r.sc<38)
    D.push([90,'امروز روز ریکاوری است، نه فشار','شاخص آمادگی پایین است. برنامه را سبک کن — اصرار در این حالت، مصدومیت و فرسودگی می‌آورد.']);
  else if(r.sc>=80)
    D.push([60,'امروز ظرفیت بالایی داری','بهترین روز برای سخت‌ترین کاری که مدام عقب انداخته‌ای.']);
  // استریک در خطر
  if(S.streak&&S.streak.clean>=7&&m>=20*60)
    D.push([85,`${fa(S.streak.clean)} روز پاکی — شب خطرناک‌ترین بازه است`,'گوشی بیرون اتاق. همین حالا، نه بعداً.']);
  // آرایشگاه
  if(S.barber&&barberDue()===0)
    D.push([45,'آرایشگاه سررسید شده','موهای زودرشت تو بعد از ۳ هفته فرم را از دست می‌دهند.']);
  // بلوک رد شده
  const missed=p.filter(x=>m>=x.e&&x.e>x.s&&!S.done[d+'|'+x.id]).length;
  if(missed>=3)
    D.push([65,`${fa(missed)} بلوک رد شده`,'روز را رها نکن. یک بلوک بعدی را کامل بزن تا مسیر برگردد.']);
  if(!D.length) D.push([50,'مسیر روی ریل است','کار خاصی لازم نیست. بلوک بعدی را اجرا کن.']);
  D.sort((a,b)=>b[0]-a[0]);
  return D[0];
}

/* ================= SKIP REASONS + EXCUSE DETECTION ================= */
const SKIPR=[['time','وقت نداشتم'],['mood','حوصله نداشتم'],['tired','خسته بودم'],
             ['sick','مریض/مصدوم بودم'],['other','دلیل بیرونی'],['forgot','یادم رفت']];
function excuses(S){
  const c={};(S.skips||[]).forEach(s=>{const k=s.blk+'|'+s.r;c[k]=(c[k]||0)+1});
  return Object.entries(c).filter(([k,v])=>v>=3).map(([k,v])=>{
    const[b,r]=k.split('|');const rn=(SKIPR.find(x=>x[0]===r)||['','?'])[1];
    return [b, rn, v, r==='time'?'اگر سه بار «وقت نداشتم» گفتی، مشکل زمان نیست — یا بلوک را کوتاه کن یا جایش را عوض کن.'
      : r==='mood'?'حوصله یک حالت است نه یک واقعیت. این بلوک را به نصف زمان کاهش بده تا شروعش راحت‌تر شود.'
      : r==='tired'?'خستگی تکرارشونده یعنی یا خواب کم است یا بار زیاد. یکی را اصلاح کن.'
      : 'این بلوک با واقعیت زندگی تو جور نیست. بازطراحی‌اش کن.'];
  });
}

/* ================= FOOTBALL DEPTH ================= */
const ZONES=[['LB','چپ دفاع'],['CB','قلب دفاع'],['RB','راست دفاع'],
             ['LM','چپ میانه'],['CDM','هافبک دفاعی'],['RM','راست میانه'],
             ['LW','چپ حمله'],['CAM','هافبک هجومی'],['RW','راست حمله']];
const POS_BENCH={ // معیارهای تقریبی یک بازیکن خوب ۱۴–۱۵ ساله در هر پست
  CB:{pass:78,tack:6,duel:65,note:'بازی هوایی و خواندن بازی مهم‌تر از سرعت.'},
  RB:{pass:80,tack:5,duel:60,note:'استقامت و پوشش طول خط. باید ۹۰ دقیقه بدوی.'},
  LB:{pass:80,tack:5,duel:60,note:'پای چپ قوی، مزیت نادر و ارزشمند.'},
  CDM:{pass:85,tack:7,duel:62,note:'قطع پاس و توزیع ساده. توپ را گم نکن.'},
  CM:{pass:84,tack:4,duel:55,note:'دید بازی و حجم دویدن.'},
  CAM:{pass:82,tack:2,duel:50,note:'خلاقیت و پاس آخر.'}
};
const SEASON_PHASES=[
  ['پیش‌فصل','تیر – مرداد','پایه‌سازی بدنی. حجم بالا، شدت متوسط.'],
  ['شروع فصل','شهریور – مهر','انتقال به شدت بالا. حفظ حجم.'],
  ['میان‌فصل','آبان – بهمن','نگهداری. تمرکز روی ریکاوری بین بازی‌ها.'],
  ['اوج فصل','اسفند – فروردین','کاهش حجم، حداکثر تازگی برای بازی‌های مهم.'],
  ['پایان فصل','اردیبهشت – خرداد','استراحت فعال و ترمیم.']
];

/* ================= LOOKS DEPTH ================= */
const COLOR_ME={
  t:'تحلیل رنگ شخصی',
  d:'پوست روشن با زیرتُن گرم، موی مشکی، چشم قهوه‌ای تیره — کنتراست بالا. این یعنی رنگ‌های خالص و اشباع بهتر از رنگ‌های محو روی تو می‌نشینند.',
  best:['سفید خالص','سرمه‌ای عمیق','مشکی','خاکستری زغالی','بورگاندی','سبز جنگلی','آبی رویال'],
  avoid:['بژ کم‌رنگ','زرد روشن','نارنجی','صورتی پاستلی','قهوه‌ای گلی'],
  why:'کنتراست بالای مو و پوست تو، رنگ‌های محو را می‌بلعد و چهره را بی‌رنگ نشان می‌دهد.'
};
const EXITCHK=['مو مرتب','دندان و دهان','ریش اصلاح‌شده','ناخن کوتاه','لباس بدون چروک و لکه',
               'کفش تمیز','بوی بدن و عطر','پوسچر: شانه عقب','گوشی، کلید، کیف','نگاه آخر در آینهٔ تمام‌قد'];
const POSTURE=[['head','سر جلو','چانه را تو بکش. سر جلو = ۵ کیلو فشار اضافه روی گردن.'],
  ['shoulder','شانهٔ گرد','شانه‌ها را عقب و پایین. روزی ۳ بار آگاهانه.'],
  ['back','قوز بالاتنه','تقویت پشت: بارفیکس و پارویی.'],
  ['pelvis','چرخش لگن','کشش خم‌کنندهٔ ران + تقویت باسن.']];

/* ================= MIND: SRS + MISTAKES ================= */
const SRS_STEPS=[1,3,7,16,35,90]; // فاصله برحسب روز
function srsDue(S){const n=Date.now();
  return (S.srs||[]).filter(c=>n>=c.next)}
function srsNext(c,ok){
  c.lvl = ok? Math.min(SRS_STEPS.length-1,(c.lvl||0)+1) : 0;
  c.next = Date.now()+SRS_STEPS[c.lvl]*864e5; return c;
}

/* ================= PSYCHOLOGY ================= */
const CONTRACT_T = `من با خودم قرار می‌گذارم:

۱. هر شب قبل از ۲۱:۰۰ در تخت باشم، چون می‌دانم خواب پایهٔ رشد است.
۲. هیچ روزی تمرین را به خاطر بی‌حوصلگی رد نکنم.
۳. وقتی لغزیدم، خودم را سرزنش نکنم — ثبتش کنم و ادامه دهم.
۴. به کسی که در ۲۰ سالگی می‌شوم خیانت نکنم.

این قرارداد با هیچ‌کس جز خودم نیست. و دقیقاً به همین دلیل جدی‌تر است.`;

const REGRET_Q=['فردا صبح که بیدار شوی، از این کار چه حسی خواهی داشت؟',
  'آیا این کار تو را به آن آدم نزدیک می‌کند یا دور؟',
  'اگر این لحظه را ده بار تکرار کنی، ده روز بعد کجایی؟',
  'چیزی که الان می‌خواهی، یا چیزی که بیشتر از همه می‌خواهی؟'];
const CELEBRATE=['یک غذای مورد علاقه‌ات بخور','یک فیلم ببین بدون احساس گناه',
  'چیزی بخر که مدت‌هاست می‌خواستی','یک روز کامل استراحت','با دوستت بیرون برو'];
const REFRAME={'شکست':'داده','تنبلی':'مقاومت','باخت':'بازخورد','ضعف':'نقطهٔ شروع',
  'نمی‌توانم':'هنوز نتوانسته‌ام','مجبورم':'انتخاب می‌کنم'};

/* ================= NARRATIVE MODE ================= */
function chapters(S){
  const st=S.startDate?new Date(S.startDate):new Date();
  const days=Math.max(1,Math.floor((Date.now()-st)/864e5));
  const CH=[[0,'فصل اول: تصمیم','روزی که سیستم را روشن کردی.'],
    [14,'فصل دوم: اصطکاک','جایی که بیشتر آدم‌ها رها می‌کنند.'],
    [45,'فصل سوم: عادت','دیگر لازم نیست به خودت یادآوری کنی.'],
    [90,'فصل چهارم: تغییر قابل دیدن','دیگران شروع به دیدن تفاوت می‌کنند.'],
    [180,'فصل پنجم: هویت','دیگر «تلاش نمی‌کنی» — این فقط کسی است که هستی.'],
    [365,'فصل ششم: سال اول','یک سال کامل. حالا داده داری، نه امید.']];
  const cur=CH.filter(c=>days>=c[0]).pop();
  const nxt=CH.find(c=>days<c[0]);
  return {days, cur, nxt};
}

/* ================= SYSTEM HEALTH ================= */
function sysHealth(S){
  const p=[];
  const h14=(S.hist||[]).slice(-14);
  const comp=h14.length?h14.reduce((a,x)=>a+x.rate,0)/h14.length:0;
  p.push(['اجرای برنامه',Math.round(comp*100)]);
  const jr=(S.jr||[]).slice(-14).length/14;
  p.push(['ثبت داده',Math.round(Math.min(1,jr)*100)]);
  const sl=Object.values(S.sleepLog||{}).slice(-7);
  p.push(['خواب',sl.length?Math.round(Math.min(1,sl.reduce((a,b)=>a+b,0)/sl.length/8)*100):0]);
  const wo=(S.wo||[]).filter(w=>(Date.now()-new Date(w.t))/864e5<=7).length;
  p.push(['تمرین',Math.round(Math.min(1,wo/5)*100)]);
  p.push(['انضباط',Math.round(Math.min(1,(S.streak?S.streak.clean:0)/30)*100)]);
  const tot=Math.round(p.reduce((a,x)=>a+x[1],0)/p.length);
  return {parts:p, total:tot,
    msg: tot>=75?'سیستم سالم است. ادامه بده.'
       : tot>=50?'سیستم کار می‌کند ولی نقاط ضعیف دارد. ضعیف‌ترین بخش را هدف بگیر.'
       : 'سیستم در حال از دست رفتن است. به سه کار حیاتی برگرد و از آنجا بساز.'};
}

/* ================= BREAK PREDICTION ================= */
function predictBreak(S){
  const l=S.logs||[];if(l.length<3)return null;
  const dys={};l.forEach(x=>{const d=new Date(x.d).getDay();dys[d]=(dys[d]||0)+1});
  const top=Object.entries(dys).sort((a,b)=>b[1]-a[1])[0];
  if(!top||top[1]<2)return null;
  const tg=+top[0], now=new Date().getDay();
  const inD=(tg-now+7)%7;
  return {day:JW[tg], inD, n:top[1],
    msg:`از ${fa(l.length)} لغزش ثبت‌شده، ${fa(top[1])} مورد در ${JW[tg]} رخ داده. ${inD===0?'امروز همان روز است.':'تا '+fa(inD)+' روز دیگر.'} برای آن روز از قبل برنامهٔ بیرون از خانه بچین.`};
}

/* ================= MULTIVARIATE ================= */
function multiVar(S){
  const out=[];const d=S.hist||[];
  if(d.length<10){out.push(['داده کافی نیست','برای تحلیل چندمتغیره حداقل ۱۰ روز داده لازم است.']);return out}
  const sl=S.sleepLog||{};
  const low=d.filter(x=>sl[x.d]!==undefined&&sl[x.d]<7);
  const high=d.filter(x=>sl[x.d]!==undefined&&sl[x.d]>=8);
  if(low.length>=3&&high.length>=3){
    const a=low.reduce((x,y)=>x+y.rate,0)/low.length, b=high.reduce((x,y)=>x+y.rate,0)/high.length;
    const df=Math.round((b-a)*100);
    if(Math.abs(df)>=8) out.push(['خواب ← اجرای برنامه',
      `در روزهای با خواب ۸+ ساعت، نرخ اجرای تو ${fa(Math.abs(df))}٪ ${df>0?'بالاتر':'پایین‌تر'} است. این قوی‌ترین اهرم توست.`]);
  }
  const jr=S.jr||[];
  if(jr.length>=8){
    const good=jr.filter(x=>+x.m>=4).map(x=>x.d), bad=jr.filter(x=>+x.m<=2).map(x=>x.d);
    const rg=d.filter(x=>good.includes(x.d)), rb=d.filter(x=>bad.includes(x.d));
    if(rg.length>=2&&rb.length>=2){
      const a=rg.reduce((x,y)=>x+y.rate,0)/rg.length, b=rb.reduce((x,y)=>x+y.rate,0)/rb.length;
      out.push(['حال ← اجرا',`در روزهای با حال خوب، اجرای تو ${fa(Math.round((a-b)*100))}٪ بهتر است. حال، نتیجه است نه علت — با خواب و تمرین بسازش.`]);
    }
  }
  if((S.logs||[]).length>=3&&Object.keys(sl).length>=5){
    const ld=(S.logs||[]).map(x=>x.d.slice(0,10));
    const slp=ld.filter(x=>sl[x]!==undefined&&sl[x]<7).length;
    if(slp>=2) out.push(['کم‌خوابی ← لغزش',
      `${fa(slp)} مورد از لغزش‌ها در روزهایی بوده که کمتر از ۷ ساعت خوابیده‌ای. خواب، اراده را می‌سازد.`]);
  }
  if(!out.length)out.push(['هنوز الگوی معناداری پیدا نشد','به ثبت ادامه بده. تحلیل با داده بیشتر دقیق‌تر می‌شود.']);
  return out;
}
