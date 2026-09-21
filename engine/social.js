/* ============ SOCIAL ENGINE — روابط هدفمند ============ */
/* آهنگ تماس پیشنهادی هر حلقه (روز) */
const RING_CAD = {core:3, close:10, act:30, out:90};
const RING_CAP = {core:5, close:15, act:50, out:999};

/* انواع تعامل و وزن آن‌ها در گرمای رابطه */
const INTER = [
  ['deep','◈','گفت‌وگوی عمیق',  'Deep talk',   12],
  ['meet','◉','دیدار حضوری',    'Met up',      10],
  ['play','⚽','بازی یا تمرین',  'Played',       8],
  ['help','✚','کمک کردم',       'Helped',       9],
  ['got', '✦','کمک گرفتم',      'Got help',     7],
  ['call','☎','تماس یا ویس',    'Called',       6],
  ['text','✉','پیام',           'Texted',       3],
  ['conf','⚡','تنش یا دعوا',    'Conflict',    -6]
];
const IMAP = Object.fromEntries(INTER.map(x=>[x[0],x]));

/* آرکی‌تایپ نقش هر نفر در زندگی تو */
const ROLES = [
  ['mirror','◍','آینه',    'Mirror',    'راستش را می‌گوید، حتی وقتی سخت است'],
  ['lift',  '▲','بالابر',  'Lifter',    'بعد از او انرژی و انگیزه‌ات بیشتر است'],
  ['teach', '▦','معلم',    'Teacher',   'از او چیزی یاد می‌گیری'],
  ['peer',  '⚔','هم‌رزم',  'Peer',      'هم‌مسیر توست، با هم رشد می‌کنید'],
  ['anchor','⚓','لنگر',    'Anchor',    'در بحران کنارت می‌ماند'],
  ['drain', '▽','فرساینده','Drain',     'وقت و انرژی می‌گیرد، چیزی برنمی‌گرداند']
];
const RMAP = Object.fromEntries(ROLES.map(x=>[x[0],x]));

function dnum(d){const t=new Date(d);return isNaN(t)?0:Math.floor(t.getTime()/864e5)}
function todayN(){return Math.floor(Date.now()/864e5)}

/* آخرین تماس با یک نفر */
function lastSeen(S,id){
  const ls=(S.inter||[]).filter(x=>x.p===id);
  if(!ls.length)return null;
  return Math.max(...ls.map(x=>dnum(x.d)));
}
function daysSince(S,id){const l=lastSeen(S,id);return l===null?null:todayN()-l}

/* گرمای رابطه ۰..۱۰۰ — از تعاملات اخیر با افت نمایی */
function warmth(S,p){
  const ls=(S.inter||[]).filter(x=>x.p===p.id);
  if(!ls.length)return 0;
  const now=todayN(), cad=RING_CAD[p.r]||30;
  let w=0;
  ls.forEach(x=>{
    const age=now-dnum(x.d);
    const hl=cad*2.2;                     /* نیمه‌عمر متناسب با حلقه */
    const decay=Math.pow(.5, age/hl);
    w += ((IMAP[x.k]||['','','','',4])[4]) * decay;
  });
  return Math.max(0,Math.min(100,Math.round(w*2.6)));
}
/* آیا سررسید تماس گذشته؟ */
function overdue(S,p){
  const d=daysSince(S,p.id), cad=RING_CAD[p.r]||30;
  if(d===null)return {due:true,by:null,cad};
  return {due:d>cad, by:d-cad, cad, d};
}
/* توازن داد و ستد: مثبت = تو بیشتر داده‌ای */
function balance(S,id){
  const ls=(S.inter||[]).filter(x=>x.p===id);
  const g=ls.filter(x=>x.k==='help').length, t=ls.filter(x=>x.k==='got').length;
  return {give:g, take:t, net:g-t};
}
/* شاخص سلامت کل شبکه */
function socialHealth(S){
  const P=S.ppl||[];
  if(!P.length)return {score:0, n:0, warm:0, od:0, drain:0, inner:0};
  const ws=P.map(p=>warmth(S,p));
  const warm=Math.round(ws.reduce((a,b)=>a+b,0)/P.length);
  const od=P.filter(p=>overdue(S,p).due).length;
  const drain=P.filter(p=>p.role==='drain'||p.e<0).length;
  const inner=P.filter(p=>p.r==='core').length;
  /* کیفیت شبکه = گرم‌ترین روابط (نه میانگین ساده که با آشنایان رقیق می‌شود) */
  const sorted=ws.slice().sort((a,b)=>b-a);
  const topN=sorted.slice(0,Math.max(1,Math.min(5,sorted.length)));
  const core=Math.round(topN.reduce((a,b)=>a+b,0)/topN.length);
  let s=core*.65+warm*.35;
  s-=od/P.length*20;
  s-=drain/P.length*15;
  if(inner===0)s-=15; else if(inner>RING_CAP.core)s-=8;
  return {score:Math.max(0,Math.min(100,Math.round(s))), n:P.length, warm, od, drain, inner};
}
/* حرکت پیشنهادی امروز — یک اقدام مشخص، نه توصیهٔ کلی */
function socialMoves(S){
  const P=S.ppl||[], out=[];
  P.forEach(p=>{
    const o=overdue(S,p), w=warmth(S,p);
    if(o.due){
      const sev=o.by===null?3:o.by>o.cad?3:o.by>o.cad/2?2:1;
      out.push({p, sev, ic:'◷',
        t:o.by===null?'هنوز تعاملی ثبت نشده':fa(o.d)+' روز بی‌خبری',
        d:p.r==='core'?'هستهٔ درونی با ۳ روز سکوت سرد می‌شود.':'یک پیام کوتاه کافی است.',
        act:'تماس بگیر'});
    } else if(w<25&&(p.r==='core'||p.r==='close')&&o.d!==undefined&&o.d>o.cad/2){
      out.push({p, sev:2, ic:'◌', t:'رابطه در حال سرد شدن', d:'گرمای رابطه '+fa(w)+' از ۱۰۰ است.', act:'یک دیدار'});
    }
    const b=balance(S,p.id);
    if(b.net<=-3)out.push({p, sev:2, ic:'⚖', t:'توازن یک‌طرفه', d:fa(b.take)+' بار کمک گرفته‌ای، '+fa(b.give)+' بار داده‌ای.', act:'جبران کن'});
    if(p.role==='drain')out.push({p, sev:1, ic:'▽', t:'رابطهٔ فرساینده', d:'مرز بگذار یا فاصله را بیشتر کن.', act:'مرزگذاری'});
  });
  return out.sort((a,b)=>b.sev-a.sev||warmth(S,a.p)-warmth(S,b.p)).slice(0,6);
}
/* بینش‌های آماری شبکه */
function socialInsight(S){
  const P=S.ppl||[], I=S.inter||[], out=[];
  if(!P.length)return out;
  const now=todayN();
  const last30=I.filter(x=>now-dnum(x.d)<=30);
  /* پرتماس‌ترین */
  const cnt={}; last30.forEach(x=>cnt[x.p]=(cnt[x.p]||0)+1);
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
  if(top){const pp=P.find(x=>x.id===top[0]);
    if(pp)out.push(['◉','بیشترین وقت','در ۳۰ روز گذشته بیشترین تعامل با '+pp.n+' بوده — '+fa(top[1])+' بار.']);}
  /* انرژی خالص */
  const pos=P.filter(p=>p.e>0).length, neg=P.filter(p=>p.e<0).length;
  if(P.length>=3)out.push(['⚡','ترازنامهٔ انرژی',fa(pos)+' نفر انرژی می‌دهند، '+fa(neg)+' نفر می‌گیرند.'+(neg>pos?' این نسبت به ضرر توست.':'')]);
  /* ظرفیت حلقه */
  Object.keys(RING_CAP).forEach(k=>{
    const n=P.filter(p=>p.r===k).length, cap=RING_CAP[k];
    if(cap<900&&n>cap){const R=RINGS.find(x=>x.k===k);
      out.push(['◍','حلقهٔ شلوغ',R.t+' '+fa(n)+' نفر دارد؛ ظرفیت واقعی حدود '+fa(cap)+' نفر است.']);}
  });
  /* تنش */
  const cf=last30.filter(x=>x.k==='conf');
  if(cf.length)out.push(['⚡','تنش اخیر',fa(cf.length)+' تنش در ۳۰ روز گذشته ثبت شده.']);
  /* بدون هسته */
  if(!P.filter(p=>p.r==='core').length)out.push(['○','هستهٔ خالی','هیچ‌کس در هستهٔ درونی نیست. یک یا دو نفر را مشخص کن.']);
  return out;
}
/* آمار ۸ هفتهٔ اخیر برای نمودار */
function socialTrend(S){
  const I=S.inter||[], now=todayN(), w=[];
  for(let i=7;i>=0;i--){
    const a=now-(i+1)*7, b=now-i*7;
    w.push(I.filter(x=>{const d=dnum(x.d);return d>a&&d<=b}).length);
  }
  return w;
}
const SOCIAL_QUESTS = [
  ['◈','یک گفت‌وگوی عمیق این هفته','سؤال باز بپرس و بگذار طرف مقابل حرف بزند.'],
  ['✚','یک کمک بدون انتظار','بهترین سرمایه‌گذاری اجتماعی، کمک بی‌چشم‌داشت است.'],
  ['☎','با کسی که ۳۰ روز ندیدی تماس بگیر','رابطه‌ها با سکوت نمی‌میرند، با فراموشی می‌میرند.'],
  ['◉','یک دیدار حضوری','پیام جای دیدار را نمی‌گیرد.']
];
