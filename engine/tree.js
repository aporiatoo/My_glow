/* ============ SKILL TREE — درخت مهارت واقعی ============ */
/* هر گره: id, نام, توضیح, شاخه, تیر(۰..۴), پیش‌نیازها, هزینهٔ امتیاز,
   req: تابع سنجش خودکار از دادهٔ واقعی اپ → {have, need, unit}
   perk: اثر واقعی که باز می‌کند */
const BRANCH = [
  ['body','⚽','تن',   'Body',    'قدرت، سرعت، استقامت'],
  ['mind','◆','ذهن',  'Mind',    'تمرکز، دانش، مطالعه'],
  ['look','◈','سیما', 'Presence','پوست، مو، استایل، حضور'],
  ['disc','▲','اراده','Will',    'انضباط، پاکی، استمرار'],
  ['soul','◍','پیوند','Bond',    'روابط، ارتباط، اثرگذاری']
];
const BMAP=Object.fromEntries(BRANCH.map(b=>[b[0],b]));

/* --- سنجه‌های خودکار از داده‌های موجود --- */
function _doneDays(S){const d={};Object.keys(S.done||{}).forEach(k=>{const p=k.split('|')[0];d[p]=(d[p]||0)+1});return d}
function _streakClean(S){return (S.streak&&S.streak.clean)||0}
function _workouts(S){return (S.wo||[]).length}
function _matches(S){return (S.ms||[]).length}
function _studyH(S){let m=0;Object.values(S.stLog||{}).forEach(w=>Object.values(w).forEach(v=>m+=v));return Math.round(m/60)}
function _sessions(S){return (S.stSess||[]).length}
function _gradeAvg(S){try{const g=gpa(S);return g.avg||0}catch(e){return 0}}
function _skinDays(S){const d=_doneDays(S);return Object.keys(d).length}
function _photos(S){return Object.keys(S.photos||{}).length}
function _cook(S){return (S.cook||[]).length}
function _srsMature(S){return (S.srs||[]).filter(x=>x.lvl>=3).length}
function _people(S){return (S.ppl||[]).length}
function _deep(S){return (S.inter||[]).filter(x=>x.k==='deep').length}
function _warmAvg(S){try{const P=S.ppl||[];if(!P.length)return 0;
  return Math.round(P.map(p=>warmth(S,p)).reduce((a,b)=>a+b,0)/P.length)}catch(e){return 0}}
function _lift(S,k){const l=(S.lifts||{})[k]||[];return l.length?Math.max(...l.map(x=>x.r||0)):0}
function _fit(S,k){const f=(S.fit||[]).filter(x=>x.k===k);return f.length?Math.max(...f.map(x=>x.v)):0}
function _journal(S){return (S.jr||[]).filter(x=>x.a&&x.a.some(Boolean)).length}
function _sleep8(S){return Object.values(S.sleepLog||{}).filter(v=>v>=8).length}

const NODES = [
 /* ---------- BODY ---------- */
 {id:'b1',b:'body',t:'پایهٔ حرکت',e:'Foundation',tier:0,cost:1,pre:[],
  d:'۱۲ جلسه تمرین ثبت‌شده',perk:'دفترچهٔ تمرین باز می‌شود',
  req:S=>({have:_workouts(S),need:12,u:'جلسه'})},
 {id:'b2',b:'body',t:'قدرت پایه',e:'Base Strength',tier:1,cost:1,pre:['b1'],
  d:'۲۰ شنا در یک ست',perk:'اضافه‌بار تدریجی فعال می‌شود',
  req:S=>({have:_lift(S,'شنا'),need:20,u:'تکرار'})},
 {id:'b3',b:'body',t:'انفجار',e:'Explosiveness',tier:2,cost:2,pre:['b2'],
  d:'پرش عمودی ۵۰ سانتی‌متر',perk:'برنامهٔ پلایومتریک',
  req:S=>({have:_fit(S,'jump'),need:50,u:'cm'})},
 {id:'b4',b:'body',t:'استقامت',e:'Endurance',tier:2,cost:2,pre:['b2'],
  d:'تست کوپر ۲۸۰۰ متر',perk:'نقش باکس‌تو‌باکس در زمین',
  req:S=>({have:_fit(S,'cooper'),need:2800,u:'m'})},
 {id:'b5',b:'body',t:'بازیکن',e:'Player',tier:3,cost:3,pre:['b3','b4'],
  d:'۲۰ مسابقهٔ ثبت‌شده',perk:'تحلیل آماری پست',
  req:S=>({have:_matches(S),need:20,u:'بازی'})},
 {id:'b6',b:'body',t:'ماشین',e:'Machine',tier:4,cost:5,pre:['b5'],
  d:'۱۲۰ جلسه تمرین',perk:'عنوان دائمی',
  req:S=>({have:_workouts(S),need:120,u:'جلسه'})},
 /* ---------- MIND ---------- */
 {id:'m1',b:'mind',t:'تمرکز',e:'Focus',tier:0,cost:1,pre:[],
  d:'۲۰ جلسهٔ مطالعهٔ ثبت‌شده',perk:'تایمر عمیق ۹۰ دقیقه',
  req:S=>({have:_sessions(S),need:20,u:'جلسه'})},
 {id:'m2',b:'mind',t:'انضباط درسی',e:'Study Discipline',tier:1,cost:1,pre:['m1'],
  d:'۶۰ ساعت مطالعهٔ ثبت‌شده',perk:'تحلیل هفتگی درس',
  req:S=>({have:_studyH(S),need:60,u:'ساعت'})},
 {id:'m3',b:'mind',t:'حافظهٔ بلندمدت',e:'Retention',tier:2,cost:2,pre:['m2'],
  d:'۳۰ کارت مرور به سطح ۳',perk:'مرور فاصله‌دار پیشرفته',
  req:S=>({have:_srsMature(S),need:30,u:'کارت'})},
 {id:'m4',b:'mind',t:'معدل بالا',e:'High GPA',tier:2,cost:2,pre:['m2'],
  d:'معدل ۱۷ یا بالاتر',perk:'پیش‌بینی رشته دقیق‌تر',
  req:S=>({have:_gradeAvg(S),need:17,u:'معدل'})},
 {id:'m5',b:'mind',t:'هدایت تحصیلی',e:'Stream Locked',tier:3,cost:3,pre:['m3','m4'],
  d:'معدل ۱۸ با رشتهٔ هدف مشخص',perk:'نقشهٔ راه رشته',
  req:S=>({have:S.stream?_gradeAvg(S):0,need:18,u:'معدل'})},
 {id:'m6',b:'mind',t:'ذهن ساخته',e:'Built Mind',tier:4,cost:5,pre:['m5'],
  d:'۳۰۰ ساعت مطالعه',perk:'عنوان دائمی',
  req:S=>({have:_studyH(S),need:300,u:'ساعت'})},
 /* ---------- LOOK ---------- */
 {id:'l1',b:'look',t:'پاکیزگی',e:'Grooming',tier:0,cost:1,pre:[],
  d:'۳۰ روز فعالیت ثبت‌شده',perk:'ردیاب پوست',
  req:S=>({have:_skinDays(S),need:30,u:'روز'})},
 {id:'l2',b:'look',t:'ثبت تغییر',e:'Documented',tier:1,cost:1,pre:['l1'],
  d:'۴ عکس پیشرفت ماهانه',perk:'مقایسهٔ قبل و بعد',
  req:S=>({have:_photos(S),need:4,u:'عکس'})},
 {id:'l3',b:'look',t:'انسجام استایل',e:'Coherence',tier:2,cost:2,pre:['l2'],
  d:'۱۲ قطعه در کمد دیجیتال',perk:'تولید خودکار ست',
  req:S=>({have:(S.wr||[]).length,need:12,u:'قطعه'})},
 {id:'l4',b:'look',t:'حضور',e:'Presence',tier:3,cost:3,pre:['l3'],
  d:'۹۰ روز فعالیت پیوسته',perk:'چک‌لیست حضور',
  req:S=>({have:_skinDays(S),need:90,u:'روز'})},
 /* ---------- DISC ---------- */
 {id:'d1',b:'disc',t:'شروع',e:'Ignition',tier:0,cost:1,pre:[],
  d:'۷ روز پاکی پیوسته',perk:'ردیاب استریک',
  req:S=>({have:_streakClean(S),need:7,u:'روز'})},
 {id:'d2',b:'disc',t:'فرمان',e:'Command',tier:1,cost:2,pre:['d1'],
  d:'۳۰ روز پاکی',perk:'حالت رهبانیت',
  req:S=>({have:_streakClean(S),need:30,u:'روز'})},
 {id:'d3',b:'disc',t:'خواب حاکم',e:'Sleep Master',tier:1,cost:1,pre:['d1'],
  d:'۳۰ شب خواب ۸ ساعته',perk:'تحلیل ریکاوری',
  req:S=>({have:_sleep8(S),need:30,u:'شب'})},
 {id:'d4',b:'disc',t:'آزادی',e:'Freedom',tier:2,cost:3,pre:['d2'],
  d:'۹۰ روز پاکی',perk:'باز شدن بخش روان',
  req:S=>({have:_streakClean(S),need:90,u:'روز'})},
 {id:'d5',b:'disc',t:'خودآگاهی',e:'Self-Awareness',tier:2,cost:2,pre:['d3'],
  d:'۶۰ ثبت ژورنال',perk:'کشف الگو خودکار',
  req:S=>({have:_journal(S),need:60,u:'ثبت'})},
 {id:'d6',b:'disc',t:'تسلط',e:'Mastery',tier:4,cost:5,pre:['d4','d5'],
  d:'۳۶۵ روز پاکی',perk:'عنوان دائمی',
  req:S=>({have:_streakClean(S),need:365,u:'روز'})},
 /* ---------- SOUL ---------- */
 {id:'s1',b:'soul',t:'نقشهٔ حلقه',e:'Mapped',tier:0,cost:1,pre:[],
  d:'۵ نفر ثبت‌شده',perk:'نقشهٔ مداری',
  req:S=>({have:_people(S),need:5,u:'نفر'})},
 {id:'s2',b:'soul',t:'عمق',e:'Depth',tier:1,cost:2,pre:['s1'],
  d:'۱۰ گفت‌وگوی عمیق',perk:'ردیاب گرمای رابطه',
  req:S=>({have:_deep(S),need:10,u:'گفت‌وگو'})},
 {id:'s3',b:'soul',t:'شبکهٔ گرم',e:'Warm Network',tier:2,cost:3,pre:['s2'],
  d:'میانگین گرمای ۶۰',perk:'بینش شبکه',
  req:S=>({have:_warmAvg(S),need:60,u:'گرما'})},
 {id:'s4',b:'soul',t:'آشپز',e:'Provider',tier:1,cost:1,pre:['s1'],
  d:'۶ غذا در نردبان آشپزی',perk:'دستور پیشرفته',
  req:S=>({have:_cook(S),need:6,u:'غذا'})}
];
const NMAP=Object.fromEntries(NODES.map(n=>[n.id,n]));
const MAXTIER=4;

/* امتیاز مهارت: هر ۳ سطح، ۱ امتیاز + امتیاز پایه */
function skillPoints(S){
  const earned=2+Math.floor(lvl(S.xp)/2);
  const spent=(S.tree||[]).reduce((a,id)=>a+((NMAP[id]||{cost:0}).cost||0),0);
  return {earned, spent, free:Math.max(0,earned-spent)};
}
function nodeState(S,n){
  const un=(S.tree||[]).includes(n.id);
  const pre=n.pre.every(p=>(S.tree||[]).includes(p));
  let r={have:0,need:1,u:''};
  try{r=n.req(S)}catch(e){}
  const pc=Math.max(0,Math.min(100,Math.round(r.have/r.need*100)));
  const met=r.have>=r.need;
  const sp=skillPoints(S);
  return {un, pre, met, pc, r, afford:sp.free>=n.cost,
    can: !un && pre && met && sp.free>=n.cost};
}
function branchProgress(S,b){
  const ns=NODES.filter(n=>n.b===b);
  const un=ns.filter(n=>(S.tree||[]).includes(n.id)).length;
  return {un, total:ns.length, pc:Math.round(un/ns.length*100)};
}
function treeRank(S){
  const n=(S.tree||[]).length, t=NODES.length;
  const pc=n/t*100;
  if(pc>=90)return ['استاد','Master'];
  if(pc>=70)return ['کهنه‌کار','Veteran'];
  if(pc>=50)return ['ورزیده','Adept'];
  if(pc>=30)return ['کارآموز','Apprentice'];
  if(pc>=10)return ['تازه‌کار','Novice'];
  return ['آغازگر','Initiate'];
}
/* پیشنهاد گرهٔ بعدی: نزدیک‌ترین به تکمیل */
function nextNodes(S){
  return NODES.map(n=>({n,st:nodeState(S,n)}))
    .filter(x=>!x.st.un&&x.st.pre)
    .sort((a,b)=>b.st.pc-a.st.pc).slice(0,3);
}
