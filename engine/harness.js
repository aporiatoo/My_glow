const fs=require('fs');
const P=__dirname+'/';
/* از همان ماژول‌هایی می‌خواند که build.sh استفاده می‌کند،
   تا تست دقیقاً همان چیزی را بسنجد که منتشر می‌شود */
const CORE=['schema.js','core.js','routines.js','calendar.js','study.js','social.js',
            'extra.js','guide.js','img.js','tree.js','systems.js'];
const UI=['src/logic.js','src/interact.js','src/views.core.js','src/views.life.js',
          'src/views.sys.js','src/views.edu.js'];
const read=f=>fs.readFileSync(P+f,'utf8');
let src=CORE.map(read).join('\n')+'\n'+UI.map(read).join('\n');
const els={};
const mk=id=>els[id]||(els[id]={id,style:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},
  innerHTML:'',textContent:'',value:'',scrollTop:0,appendChild(){},setAttribute(){},click(){},
  querySelector:()=>null,focus(){},select(){},onclick:null});
const store={};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
global.caches={open:()=>Promise.resolve({add(){},match(){},put(){}})};
global.URL=global.URL||function(){};global.URL.createObjectURL=()=>'blob:x';
global.Blob=function(){};
global.navigator={serviceWorker:{register:()=>Promise.reject(new Error('n/a'))},userAgent:'node'};
global.history={replaceState(){},pushState(){}};
global.location={protocol:'file:',pathname:'/x',reload(){},href:''};
global.AudioContext=undefined;
global.document={addEventListener(){},createElement:()=>({style:{},setAttribute(){},appendChild(){},click(){}}),
 head:{appendChild(){}},querySelector:()=>null,querySelectorAll:()=>[],
 body:{style:{},className:'',appendChild(){},removeChild(){},
   classList:{_s:new Set(),
     add(c){this._s.add(c)},remove(c){this._s.delete(c)},
     toggle(c,f){f===undefined?(this._s.has(c)?this._s.delete(c):this._s.add(c))
                              :(f?this._s.add(c):this._s.delete(c));return !!f},
     contains(c){return this._s.has(c)}}},
 documentElement:{style:{},dir:'rtl'},
 getElementById:mk};
global.window={addEventListener(){},open(){},scrollTo(){}};
global.setInterval=()=>0;global.clearInterval=()=>{};global.setTimeout=(f)=>{return 0};global.clearTimeout=()=>{};
global.alert=()=>{};global.prompt=()=>null;global.confirm=()=>true;
const names=['S','V','GRP','plan','dayInfo','toJalali','toGregorian','jDaysInMonth','jIsLeap','jToday',
 'readiness','directive','sysHealth','multiVar','predictBreak','excuses','chapters','upcoming',
 'dateAdjust','sunTimes','routFor','ROUT','energyAt','overload','srsDue','srsNext','patterns',
 'simulate','adapt','lvl','xp','td','mn','hm','tM','fa','rd','QUESTS','ACH','PLANS','EVT',
 'barberDue','PROTOCOLS','DRILLS','FTESTS','HOME','LIFTS','FOODDB','BOSS','TREE','SKIPR',
 'ROUT_MAP','HOL_J','SCHOOL_EV','MGOALS','RINGS','COOK','MIRROR','NATIVE','CRISIS_MIN','PANIC',
 'jStr','JM','JW','ageNow','daysToBirthday','evToday','fitCheck','CLUB','GYM_LIFTS','PROTEIN_TARGET',
 'LINKS_DEF','GAMES_DEF','LCAT','PLAY_CAP','playToday','gameMin','lkHost','SUBJ','studyPlan','gpa',
 'streamAdvice','examPlan','weekKey','TECHS','STREAMS','TDEF','daysLived','daysToStream','HCOUNT',
 'splitCards','cardMeta','renderView','SPLIT_MIN','deTag',
 'warmth','overdue','balance','socialHealth','socialMoves','socialInsight','socialTrend',
 'RING_CAD','RING_CAP','INTER','ROLES','IMAP','RMAP','lastSeen','daysSince','SOCIAL_QUESTS','soOrbit','NODES','NMAP','BRANCH','BMAP','skillPoints','nodeState','branchProgress','treeRank','nextNodes','treeSVG','TREE','GUIDE','IMG','brief','SWIPE_MIN','QUICK','MIGRATIONS','coerce','compact','migrate','SCHEMA','SCHEMA_VERSION','memoryBack','yearAgo','isolationDays','famLog','famDue','FAM','breathTotal','BREATH','htStats','htAdd','shopCount','shopList','SHOP_NEVER','SHOP','seasonNow','SEASON_LEN','sleepTarget','sleepDebt','ftDue','ftDelta','ftLast','FT_MAP','FTEST','trgFix','trgAnalyze','TRG_MAP','TRIGGERS','obActive','obNext','obOpen','obWeek','ONBOARD','isNative','syncNotif','tgNotif'];
const grab='(()=>{const o={};'+names.map(n=>`try{o.${n}=${n}}catch(e){}`).join('')+'return o})()';
const ctx=eval(src+'\n;'+grab);
ctx.els=els; ctx.store=store; ctx.win=global.window; ctx.reeval=code=>eval(code);
module.exports=ctx;
