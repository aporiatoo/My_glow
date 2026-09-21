/* ============ STATE ============ */
const K='ascend.v2';
const DEF={xp:0,done:{},q:{},logs:[],
 notif:1, bkWk:0, mode:null, comeback:null, ramadan:null, obOff:0, urges:[], ftest:[], shop:{}, hts:[], fam:{}, streak:{clean:0,train:0,sleep:0,screen:0},best:{clean:0,train:0,sleep:0,screen:0},
 blk:{ig:1,ir:1,x:1,adult:1,games:1,short:1,tg:0},
 stat:{body:32,look:28,mind:38,disc:15,social:30,money:8},
 season:'summer',lang:'fa',wt:[65],ev:[],barber:null,
 tx:[],goal:0,ppl:[],photos:[],jr:[],cook:[],hist:[],
 wo:[],ft:[],ms:[],fit:[],ach:[],boss:null,tree:[],prot:{},mir:{},crisis:0,lifts:{},gymMode:0,
 skips:[],sleepLog:{},srs:[],mistakes:[],contract:null,startDate:null,
 hair:[],exit:{},focus:{},sub:{},compact:0,amoled:0,fsz:0,hist2:[],
 grades:{},stLog:{},hw:[],stSess:[],stream:null,tmr:null,exams:[],
 links:JSON.parse(JSON.stringify(LINKS_DEF)),games:JSON.parse(JSON.stringify(GAMES_DEF)),
 playLog:{},playPend:null,hcount:0,sec:null,flat:false,inter:[]};
let S=Object.assign({},JSON.parse(JSON.stringify(DEF)),(()=>{
 try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}})());
/* ---- ترمیم وضعیت: اسکیما در schema.js اعتبارسنجی و مهاجرت را انجام می‌دهد ---- */
(function(){
  const r = migrate(S);
  S = Object.assign(S, r.state);

  /* موارد وابسته به ثابت‌های زمان اجرا که در اسکیما قابل توصیف نیستند */
  LINKS_DEF.forEach(d => { if (!S.links.some(x => x.id === d.id)) S.links.push(JSON.parse(JSON.stringify(d))) });
  GAMES_DEF.forEach(d => { if (!S.games.some(x => x.id === d.id)) S.games.push(JSON.parse(JSON.stringify(d))) });
  S.links = S.links.filter(x => x && x.id && x.u);
  S.games = S.games.filter(x => x && x.id && x.u);
  S.tree  = S.tree.filter(x => typeof x === 'string' && NMAP[x]);
  if (typeof S.tbr !== 'string' || !BMAP[S.tbr]) S.tbr = 'body';
  if (S.sec && (typeof S.sec !== 'object' || typeof S.sec.i !== 'number' || typeof S.sec.v !== 'string')) S.sec = null;
  S.ppl.forEach((x, i) => {
    if (!x.id) x.id = 'p' + i + '_' + (x.n || '').length;
    if (!x.role) x.role = x.e < 0 ? 'drain' : 'peer';
    if (!x.r) x.r = 'close';
    if (typeof x.e !== 'number') x.e = 0;
  });
  ['clean','train','sleep','screen'].forEach(k => {
    if (S.best[k] < S.streak[k]) S.best[k] = S.streak[k];
  });
  if (!S.wt.length) S.wt = [65];

  /* فشرده‌سازی سالانه: داده بی‌حد رشد نکند */
  const wk = Math.floor(Date.now() / 6048e5);
  if (S.cmpWk !== wk) { compact(S); S.cmpWk = wk; }
})();
const sv=()=>{
  if(typeof planInvalidate==='function')planInvalidate();
  try{localStorage.setItem(K,JSON.stringify(S))}
  catch(e){ /* حافظه پر — داده در همین نشست سالم می‌ماند */ }
};
/* تاریخ محلی، نه UTC — بین نیمه‌شب تا ۰۳:۳۰ تهران، UTC هنوز روز قبل است
   و باعث می‌شد کوئست شبانه روی روز اشتباه ثبت شود */
const dstr=d=>{const x=d||new Date();
  return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const td=()=>dstr();
const mn=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
const hm=m=>{m=((m%1440)+1440)%1440;return String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const tM=s=>{const[a,b]=s.split(':').map(Number);return a*60+b};
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const L=(f,e)=>S.lang==='fa'?f:e;

/* ============ FOCUS ENVIRONMENT — live workspace ============ */
let _T=null;
const TDEF={study:{m:50,b:10,t:'مطالعه',te:'Study'},deep:{m:90,b:15,t:'عمیق',te:'Deep'},
 quick:{m:25,b:5,t:'کوتاه',te:'Quick'},rev:{m:15,b:3,t:'مرور',te:'Review'}};
function beep(n){try{const c=new (window.AudioContext||window.webkitAudioContext)();
 for(let i=0;i<(n||1);i++){const o=c.createOscillator(),g=c.createGain();
  o.connect(g);g.connect(c.destination);o.frequency.value=660;o.type='sine';
  const t=c.currentTime+i*.42;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.03);
  g.gain.exponentialRampToValueAtTime(.001,t+.34);o.start(t);o.stop(t+.36)}}catch(e){}}
window.fzStart=async k=>{
  const d=TDEF[k]||TDEF.study;
  const r=await ask({t:L('شروع '+d.t,'Start '+d.te),
   s:L('گوشی را بیرون اتاق بگذار. تایمر حتی اگر تب را ببندی ادامه دارد.','Timer survives tab close.'),
   f:[{k:'s',t:L('درس','Subject'),ty:'pick',o:SUBJ.map(x=>[x[0],x[2]+' '+x[1]]),v:(studyPlan(S)[0]||{k:'math'}).k},
      {k:'m',t:L('دقیقه','Minutes'),ty:'num',v:d.m,st:5,min:5,max:180},
      {k:'g',t:L('هدف این جلسه','Goal'),ty:'text',ph:L('مثلاً ۱۵ سؤال فصل ۳','e.g. 15 problems ch.3')}]});
  if(!r)return;
  S.tmr={k,s:r.s,g:r.g||'',m:r.m,end:Date.now()+r.m*60000,f:0,st:Date.now()};
  sv();fzTick();rd();tst('◷ '+L('شروع شد','Started'))};
window.fzStop=async(auto)=>{
  const t=S.tmr;if(!t)return;
  const el=Math.min(t.m,Math.round((Date.now()-t.st)/60000));
  S.tmr=null;clearInterval(_T);_T=null;
  if(el<2){sv();rd();return tst(L('لغو شد','Cancelled'))}
  const r=await ask({t:L('جلسه تمام شد','Session done'),
   s:fa(el)+L(' دقیقه · ',' min · ')+((SUBJ.find(x=>x[0]===t.s)||['','?'])[1])+(t.g?' · '+t.g:''),
   ok:L('ثبت کن','Log it'),
   f:[{k:'f',t:L('چند بار حواست پرت شد؟','Distractions?'),ty:'num',v:t.f||0,st:1,min:0,max:60},
      {k:'q',t:L('هدف را رسیدی؟','Goal reached?'),ty:'pick',o:[['1',L('کامل','Fully')],['.5',L('نیمه','Partly')],['0',L('نه','No')]],v:'1'}]});
  if(!r){sv();rd();return}
  const wk=weekKey();S.stLog[wk]=S.stLog[wk]||{};S.stLog[wk][t.s]=(S.stLog[wk][t.s]||0)+el;
  S.stSess.push({d:td(),f:r.f||0,g:t.g,s:t.s,min:el,q:+r.q,t:Date.now()});
  S.focus[Date.now()]=r.f||0;
  const g=Math.round(el/2)+(+r.q===1?15:0);xp(g);sv();rd();tst('◷ +'+fa(g)+' XP')};
window.fzDist=()=>{if(!S.tmr)return;S.tmr.f=(S.tmr.f||0)+1;sv();
 const e=document.getElementById('fzf');if(e)e.textContent=fa(S.tmr.f);
 tst(L('ثبت شد — برگرد به کار','Logged — back to work'))};
window.fzAdd=m=>{if(!S.tmr)return;S.tmr.end+=m*60000;S.tmr.m+=m;sv();fzPaint()};
function fzPaint(){
  const w=document.getElementById('fzbar');if(!w)return;
  const t=S.tmr;
  if(!t){w.classList.remove('on');w.innerHTML='';return}
  const left=Math.max(0,t.end-Date.now()),sec=Math.ceil(left/1000);
  const pc=Math.max(0,Math.min(100,100-left/(t.m*60000)*100));
  const sb=(SUBJ.find(x=>x[0]===t.s)||['','',''])
  w.classList.add('on');
  w.innerHTML=`<div class="fzp"><div class="fzpf" style="width:${pc}%"></div></div>
   <div class="fzr"><div class="fzi">${sb[2]||'◷'}</div>
    <div class="fzm"><div class="fzt">${fa(String(sec/60|0).padStart(2,'0'))}:${fa(String(sec%60).padStart(2,'0'))}</div>
     <div class="fzs">${sb[1]||''}${t.g?' · '+t.g:''}</div></div>
    <button class="fzb" onclick="fzDist()">${L('حواس‌پرتی','Distract')} <b id="fzf">${fa(t.f||0)}</b></button>
    <button class="fzb" onclick="fzAdd(5)">+${fa(5)}</button>
    <button class="fzb x" onclick="fzStop()">${L('پایان','End')}</button></div>`;
  if(left<=0&&!t.done){t.done=1;beep(3);sv();window.fzStop(1)}}
function fzTick(){clearInterval(_T);if(!S.tmr)return fzPaint();_T=setInterval(fzPaint,1000);fzPaint()}

/* ============ ASK — in-app dialog engine (replaces browser prompt/confirm) ============ */
let _askQ=null;
/* ask(spec) -> Promise
   spec.f = [{k,t,ty:'num'|'text'|'area'|'pick'|'time'|'date'|'rate'|'chips',o:[],v,ph,hint,min,max,st}] */
function ask(spec){return new Promise(res=>{
  const f=(spec.f||[]).map(x=>({...x,v:x.v===undefined?'':x.v}));
  _askQ={spec,f,res};
  document.getElementById('askw').innerHTML=askHTML(spec,f);
  document.getElementById('askw').classList.add('on');
  document.body.style.overflow='hidden';
  setTimeout(()=>{const el=document.querySelector('#askw input,#askw textarea');if(el){el.focus();el.select&&el.select()}},60);
})}
function askHTML(sp,f){
  return `<div class="askbd" onclick="askX(0)"></div>
  <div class="askc gl">
   <div class="askh"><div><div class="askt">${sp.t||''}</div>
    ${sp.s?`<div class="asks">${sp.s}</div>`:''}</div>
    <button class="askcl" onclick="askX(0)">✕</button></div>
   <div class="askb">${f.map((x,i)=>askF(x,i)).join('')}</div>
   <div class="askft">
    ${sp.del?`<button class="bt dg" onclick="askX(2)">${sp.del}</button>`:''}
    <button class="bt" onclick="askX(0)">${L('انصراف','Cancel')}</button>
    <button class="bt p" onclick="askX(1)">${sp.ok||L('تأیید','Confirm')}</button></div></div>`}
function askF(x,i){
  const lb=x.t?`<div class="askl">${x.t}${x.hint?`<span>${x.hint}</span>`:''}</div>`:'';
  let b='';
  if(x.ty==='pick')
    b=`<div class="askp">${x.o.map((o,j)=>`<button class="askpb${String(x.v)===String(askV(o))?' on':''}" onclick="askS(${i},'${String(askV(o)).replace(/'/g,"\\'")}')">${askT(o)}</button>`).join('')}</div>`;
  else if(x.ty==='chips')
    b=`<div class="askp">${x.o.map(o=>`<button class="askpb${(x.v||'')===askV(o)?' on':''}" onclick="askS(${i},'${askV(o).replace(/'/g,"\\'")}')">${askT(o)}</button>`).join('')}</div>`;
  else if(x.ty==='rate'){const mx=x.max||5;
    b=`<div class="askp">${Array.from({length:mx},(_,j)=>`<button class="askpb r${+x.v===j+1?' on':''}" onclick="askS(${i},${j+1})">${fa(j+1)}</button>`).join('')}</div>`}
  else if(x.ty==='info')
    b=`<div class="askinf">${(x.rows||[]).map(r=>`<div class="askir"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`;
  else if(x.ty==='area')
    b=`<textarea class="aski ta" rows="4" placeholder="${x.ph||''}" oninput="askS(${i},this.value,1)">${x.v||''}</textarea>`;
  else if(x.ty==='num')
    b=`<div class="asknum"><button class="askst" onclick="askN(${i},-${x.st||1})">−</button>
       <input class="aski n" type="number" inputmode="decimal" value="${x.v}" placeholder="${x.ph||''}" oninput="askS(${i},this.value,1)">
       <button class="askst" onclick="askN(${i},${x.st||1})">+</button>${x.u?`<span class="asku">${x.u}</span>`:''}</div>`;
  else
    b=`<input class="aski" type="${x.ty==='time'?'time':x.ty==='date'?'date':'text'}" value="${x.v}" placeholder="${x.ph||''}" oninput="askS(${i},this.value,1)">`;
  return `<div class="askfd" id="askfd${i}">${lb}${b}</div>`}
const askV=o=>Array.isArray(o)?o[0]:o, askT=o=>Array.isArray(o)?o[1]:o;
window.askS=(i,v,raw)=>{if(!_askQ)return;_askQ.f[i].v=v;
  if(!raw){const w=document.getElementById('askw');
   const fd=document.getElementById('askfd'+i);
   fd.outerHTML=askF(_askQ.f[i],i).replace('class="askfd"','class="askfd" id="askfd'+i+'"')}};
window.askN=(i,d)=>{const f=_askQ.f[i];f.v=(parseFloat(f.v)||0)+d;
  if(f.min!==undefined&&f.v<f.min)f.v=f.min; if(f.max!==undefined&&f.v>f.max)f.v=f.max;
  f.v=Math.round(f.v*100)/100;
  document.querySelector('#askfd'+i+' input').value=f.v};
window.askX=r=>{if(!_askQ)return;const q=_askQ;_askQ=null;
  const w=document.getElementById('askw');w.classList.remove('on');document.body.style.overflow='';
  setTimeout(()=>{w.innerHTML=''},220);
  if(!r)return q.res(null);
  if(r===2)return q.res({__del:1});
  const o={};q.f.forEach(x=>{if(x.ty==='info')return;let v=x.v;
    if(x.ty==='num'||x.ty==='rate')v=parseFloat(v);
    if(typeof v==='string')v=v.trim();
    o[x.k]=v});
  q.res(o)};
/* shorthands */
const askOne=(t,k,ty,extra)=>ask({t,f:[{k:'v',ty,...(extra||{})}]}).then(r=>r?r.v:null);
const askYes=(t,s,ok)=>ask({t,s,ok:ok||L('بله','Yes'),f:[]}).then(r=>!!r);


/* auto-switch season on 1 Mehr */
(()=>{const j=jToday();S.season=(j[1]>=7&&j[1]<=12)?'school':'summer'})();

function evToday(){const t=td();return S.ev.filter(e=>t>=e.d1&&t<=e.d2)}
/* ============ مرحلهٔ ۳: حالت رمضان ============ */
/* رمضان تقویم قمری دارد و با شمسی جابه‌جا می‌شود؛ کاربر تاریخ شروع را یک بار ثبت می‌کند */
window.ramActive=()=>{
  const r=S.ramadan; if(!r||!r.start)return false;
  const t=td();
  if(t<r.start)return false;
  const end=dstr(new Date(new Date(r.start).getTime()+29*864e5));
  return t<=end;
};
window.ramDay=()=>{
  if(!window.ramActive())return 0;
  return Math.floor((new Date(td())-new Date(S.ramadan.start))/864e5)+1;
};
window.ramTimes=()=>{
  const st=sunTimes();
  /* اذان صبح ≈ ۸۰ دقیقه پیش از طلوع، افطار = غروب */
  return {sahar:Math.max(0,st.rise-80), eftar:st.set, rise:st.rise};
};
window.ramSet=async()=>{
  const r=await ask({t:L('حالت رمضان','Ramadan'),
    s:L('تاریخ اولین روز روزه را وارد کن. برنامه تا ۳۰ روز بعد بازنویسی می‌شود.','First fasting day'),
    f:[{k:'d',ty:'date',v:S.ramadan&&S.ramadan.start?S.ramadan.start:td()}],
    ok:L('فعال کن','Enable'),del:S.ramadan?L('خاموش','Off'):''});
  if(r&&r.__del){S.ramadan=null;sv();rd();if(window.syncNotif)syncNotif();
    tst(L('حالت رمضان خاموش شد','Ramadan off'));return}
  if(!r||!r.d)return;
  S.ramadan={start:r.d}; sv(); rd();
  if(window.syncNotif)syncNotif();
  tst(L('حالت رمضان فعال شد','Ramadan on'))};

/* ============ مرحلهٔ ۲: حالت‌های خرابی ============ */
/* حالت‌ها: '' عادی | 'sick' مریضی | 'bad' روز خراب | 'trip' سفر | 'exam' بحران امتحان */
const MODES={
  sick:{ic:'✚',fa:'حالت مریضی',en:'Sick',
    d:'تمرین و درس سنگین حذف می‌شود. استریک نمی‌شکند.',
    keep:['rest','food','skin','sleep']},
  bad:{ic:'◌',fa:'روز خراب',en:'Bad day',
    d:'فقط حداقل روز باقی می‌ماند. بدون سرزنش.',
    keep:['rest','food','sleep']},
  trip:{ic:'✈',fa:'حالت سفر',en:'Travel',
    d:'برنامهٔ حداقلی و قابل انجام در هر جا.',
    keep:['rest','food','sleep','mind']},
  exam:{ic:'▦',fa:'بحران امتحان',en:'Exam crunch',
    d:'همه‌چیز جز درس و پایه‌ها کنار می‌رود.',
    keep:['rest','food','sleep','mind','duty']}
};
window.modeToday=()=>{const m=S.mode&&S.mode.d===td()?S.mode.k:''; return MODES[m]?m:''};
window.setMode=async k=>{
  if(!k){S.mode=null;sv();rd();tst(L('به حالت عادی برگشت','Back to normal'));return}
  const M=MODES[k]; if(!M)return;
  const ok=await ask({t:M.ic+' '+L(M.fa,M.en),s:L(M.d,M.d),
    ok:L('فعال کن برای امروز','Enable for today')});
  if(!ok)return;
  S.mode={k,d:td()}; sv(); rd();
  if(window.syncNotif)syncNotif();
  tst(L('فعال شد. فردا خودکار برمی‌گردد.','On. Auto-clears tomorrow.'))};

/* کش: plan() در هر رندر چند بار صدا زده می‌شود و محاسبه‌اش سنگین است.
   کلید شامل هر چیزی است که خروجی را عوض می‌کند. */
let _planCache = null;
function planKey(){
  return [td(), new Date().getDay(),
    (S.mode && S.mode.d === td()) ? S.mode.k : '',
    S.ramadan ? S.ramadan.start : '',
    S.season, (S.ev || []).length, S.gymMode ? 1 : 0].join('~');
}
function planInvalidate(){ _planCache = null }

function plan(){
  const key = planKey();
  if (_planCache && _planCache.key === key) return _planCache.rows;
  const rows = planBuild();
  _planCache = { key, rows };
  return rows;
}

function planBuild(){
  const inf=dayInfo();
  /* حالت فصل بر اساس تقویم شمسی واقعی */
  S.season = inf.isSchoolPeriod ? 'school' : 'summer';
  const P0=PLANS[S.season];
  let d=new Date().getDay();
  let dayRows=(P0.byDay[d]||[]);
  /* بلوک‌های روز، بلوک‌های پایه را در بازهٔ متداخل کنار می‌زنند (اولویت با برنامهٔ روز) */
  let rows=[...P0.base.filter(b=>{
    const bs=tM(b[0]),be=tM(b[1]);
    if(be<bs) return true;                       // بلوک خواب (عبور از نیمه‌شب)
    if(b[5]==='food') {                           // وعده‌های غذایی فقط با تداخل کامل حذف شوند
      return !dayRows.some(r=>{const s=tM(r[0]),e=tM(r[1]);return e>bs&&s<be&&(s<=bs&&e>=be)});
    }
    return !dayRows.some(r=>{const s=tM(r[0]),e=tM(r[1]);return e>bs&&s<be});
  }),...dayRows];
  /* تعطیل رسمی: بلوک‌های مدرسه حذف و جایگزین می‌شوند */
  if(inf.official||inf.isFri){
    rows=rows.filter(r=>r[5]!=='duty');
    if(inf.official&&S.season==='school')
      rows.push(['08:00','10:30','◆','بلوک آزاد تعطیلات','مدرسه تعطیل است — درس عمیق یا مهارت','mind'],
                ['10:30','11:30','◇','فعالیت بدنی آزاد','پیاده‌روی، دوچرخه، یا تمرین انفرادی','body']);
  }
  /* دورهٔ امتحانات: تمرین سبک، درس بیشتر */
  if(inf.schoolType==='exam'){
    rows=rows.map(r=>r[5]==='body'&&r[3].includes('خانگی')?
      [r[0],r[1],'◇','تمرین سبک (دورهٔ امتحان)','۲۰ دقیقه — فقط برای حفظ ریتم','body']:r);
    rows.push(['20:15','21:00','▦','مرور امتحان فردا','بدون یادگیری جدید. فقط مرور.','mind']);
  }
  const ev=evToday();
  if(ev.length){
    // رویداد فعال: بلوک‌های متداخل حذف و بلوک رویداد جایگزین می‌شود
    const keep=['rest','food','look'];
    ev.forEach(e=>{
      const s=tM(e.st),en=s+e.dur*60;
      rows=rows.filter(r=>{
        const rs=tM(r[0]),re=tM(r[1]);
        if(keep.includes(r[5])&&!(rs<en&&re>s))return true;
        return !(rs<en&&re>s);
      });
      rows.push([e.st,hm(en),EVT[e.k].ic,EVT[e.k].t+(e.n?' — '+e.n:''),CLUB+' · '+EVT[e.k].rule,'body']);
    });
  }
  /* حالت رمضان: وعده‌ها حذف، سحری و افطار جایگزین، تمرین بعد از افطار */
  {const _r=(S.ramadan&&S.ramadan.start&&td()>=S.ramadan.start&&
     td()<=dstr(new Date(new Date(S.ramadan.start).getTime()+29*864e5)));
   if(_r){
    const st=sunTimes();
    const sahar=Math.max(0,st.rise-80), eftar=st.set;
    /* همهٔ وعده‌های روز و تمرین روز حذف می‌شوند */
    rows=rows.filter(r=>{
      if(r[5]==='food')return false;
      if(r[5]==='body'){const bs=tM(r[0]);return bs>=eftar}   /* تمرین فقط بعد افطار */
      return true;});
    const _h=m=>hm(m);
    /* سحری و افطار ثابت‌اند و اولویت دارند: هر بلوکی که با آن‌ها تداخل کند کنار می‌رود */
    const _win=[[Math.max(0,sahar-40),sahar],[eftar,eftar+35]];
    rows=rows.filter(r=>{const rs=tM(r[0]),re=tM(r[1]);
      if(re<=rs)return true;
      return !_win.some(([a,b])=>rs<b&&re>a);});
    rows.push([_h(Math.max(0,sahar-40)),_h(sahar),'◐','سحری',
      'پروتئین و آب فراوان. خرما، تخم‌مرغ، نان، ماست. آب کم‌کم تا اذان','food']);
    rows.push([_h(eftar),_h(eftar+35),'■','افطار',
      'با خرما و آب ولرم باز کن. تند نخور. ۲۰ دقیقه بعد غذای اصلی','food']);
    /* بقیه فقط اگر شکاف خالی باشد */
    const _fitR=(a,b)=>{const s0=tM(a),e0=tM(b);
      return !rows.some(r=>{const rs=tM(r[0]),re=tM(r[1]);return re>rs&&rs<e0&&re>s0});};
    const _addR=(a,b,ic,t,d,cat)=>{if(_fitR(a,b))rows.push([a,b,ic,t,d,cat])};
    _addR(_h(eftar+95),_h(eftar+125),'⚽','تمرین سبک بعد افطار',
      'بدن کم‌آب است. شدت را نصف کن و آب بنوش','body');
    _addR(_h(eftar+150),_h(eftar+180),'▲','وعدهٔ دوم',
      'پروتئین دوم روز تا به ۱۱۰ گرم برسی','food');
    _addR(_h(15*60),_h(15*60+40),'●','چرت جبرانی',
      'کوتاه و ثابت. جای خواب شب را پر می‌کند','rest');
   }}

  /* حالت‌های خرابی: فقط دسته‌های ضروری بماند */
  const _md=(S.mode&&S.mode.d===td()&&MODES[S.mode.k])?S.mode.k:'';
  if(_md&&MODES[_md]){
    const keep=MODES[_md].keep;
    rows=rows.filter(r=>keep.includes(r[5]));
    /* افزودن امن: فقط در شکافی که با هیچ بلوک باقی‌مانده تداخل ندارد */
    const _fit=(a,b)=>{const s0=tM(a),e0=tM(b);
      return !rows.some(r=>{const rs=tM(r[0]),re=tM(r[1]);
        return re>rs && rs<e0 && re>s0});};
    const _add=(a,b,ic,t,d,cat)=>{if(_fit(a,b))rows.push([a,b,ic,t,d,cat])};
    if(_md==='exam'){
      _add('16:00','17:30','▦','بلوک اضطراری درس','مرور فشرده — فقط مهم‌ترین فصل','mind');
      _add('18:10','19:30','▦','ادامهٔ مرور','تست بزن، فصل جدید شروع نکن','mind');
    }
    if(_md==='sick')
      _add('10:00','10:20','✚','آب و دارو','مایعات زیاد. بدن در حال ترمیم است','rest');
  }
  return rows
    .map(r=>({s:tM(r[0]),e:tM(r[1]),ic:r[2],t:r[3],d:r[4],c:r[5],id:r[2]+r[0]}))
    .sort((a,b)=>a.s-b.s);
}
function barberDue(){
  if(!S.barber)return 0;
  const diff=Math.floor((Date.now()-new Date(S.barber))/864e5);
  return Math.max(0,BARBER_WEEKS*7-diff);
}
const lvl=x=>Math.floor(Math.sqrt(Math.max(0,x)/55))+1;
const xfl=l=>55*(l-1)**2;
function tst(m){const t=document.getElementById('tst');t.textContent=m;t.classList.add('on');
 clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('on'),1800)}
function xp(n){const b=lvl(S.xp);S.xp=Math.max(0,S.xp+n);
 if(lvl(S.xp)>b)setTimeout(()=>tst('◆ LEVEL '+fa(lvl(S.xp))),420);sv();hd()}

function hd(){
  const l=lvl(S.xp),a=xfl(l),b=xfl(l+1);
  document.getElementById('lv').textContent=fa(l);
  document.getElementById('xf').style.width=((S.xp-a)/(b-a)*100)+'%';
  document.getElementById('xn').textContent=fa(S.xp-a)+' / '+fa(b-a)+' XP';
  document.getElementById('xd').textContent=fa(b-S.xp)+' XP '+L('تا سطح ','to L')+fa(l+1);
  {const _hi=(S.hcount||0)%HCOUNT.length, _hv=HCOUNT[_hi](S), _he=document.getElementById('hn');
   _he.textContent=L(_hv[0],_hv[1]); _he.style.cursor='pointer';
   _he.onclick=()=>{S.hcount=((S.hcount||0)+1)%HCOUNT.length;sv();hd()};}
  const p=plan(),m=mn(),c=p.find(x=>x.s<=x.e?(m>=x.s&&m<x.e):(m>=x.s||m<x.e));
  const _i=dayInfo();
  const _tag=_i.official?' ✦'+_i.holiday:_i.schoolEvent?' ▦'+_i.schoolEvent:_i.occasion?' ◦'+_i.occasion:'';
  document.getElementById('hs').textContent=jStr()+_tag+' · '+(c?c.ic+' '+c.t:L('زمان آزاد','Free'));
}

