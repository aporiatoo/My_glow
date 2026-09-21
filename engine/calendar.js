/* ================= SMART JALALI CALENDAR ================= */

/* --- Jalali → Gregorian --- */
function toGregorian(jy,jm,jd){
  let gy = jy<=979?621:1600;
  jy -= jy<=979?0:979;
  let days = 365*jy + ((jy/33|0)*8) + (((jy%33)+3)/4|0) + 78 + jd
           + (jm<7 ? (jm-1)*31 : ((jm-7)*30)+186);
  gy += 400*((days/146097)|0); days%=146097;
  if(days>36524){ gy+=100*((--days/36524)|0); days%=36524; if(days>=365)days++ }
  gy += 4*((days/1461)|0); days%=1461;
  if(days>365){ gy+=((days-1)/365)|0; days=(days-1)%365 }
  const sal=[0,31,(gy%4===0&&gy%100!==0)||gy%400===0?29:28,31,30,31,30,31,31,30,31,30,31];
  let gm=0; while(gm<13 && days>=sal[gm]){days-=sal[gm];gm++}
  return [gy,gm,days+1];
}
function jIsLeap(jy){const r=jy%33;return [1,5,9,13,17,22,26,30].includes(r)}
function jDaysInMonth(jy,jm){return jm<=6?31:(jm<=11?30:(jIsLeap(jy)?30:29))}

/* --- تعطیلات ثابت شمسی --- */
const HOL_J = {
  '1-1':['نوروز',1],'1-2':['نوروز',1],'1-3':['نوروز',1],'1-4':['نوروز',1],
  '1-12':['روز جمهوری اسلامی',1],'1-13':['سیزده‌به‌در',1],
  '3-14':['رحلت امام خمینی',1],'3-15':['قیام ۱۵ خرداد',1],
  '11-22':['پیروزی انقلاب',1],'12-29':['ملی شدن صنعت نفت',1],
  '2-2':['روز زمین',0],'6-31':['روز شعر و ادب',0],
  '7-13':['روز نیروی انتظامی',0],'8-8':['روز نوجوان',0],
  '9-30':['شب یلدا',0],'10-5':['روز ملی ایمنی',0],
  '2-12':['روز معلم',0],'9-16':['روز دانشجو',0],
  '12-5':['روز مهندس',0]
};
/* --- رویدادهای تحصیلی --- */
const SCHOOL_EV = {
  '7-1':['آغاز سال تحصیلی','school_start'],
  '10-1':['شروع امتحانات نوبت اول','exam'],
  '10-25':['پایان امتحانات نوبت اول','exam_end'],
  '11-1':['آغاز نیم‌سال دوم','term2'],
  '3-1':['شروع امتحانات نوبت دوم','exam'],
  '3-31':['پایان سال تحصیلی','school_end'],
  '4-1':['آغاز تعطیلات تابستان','summer_start']
};
/* --- فصول --- */
function jSeason(jm){
  return jm<=3?['بهار','◇']:jm<=6?['تابستان','☀']:jm<=9?['پاییز','◈']:['زمستان','❄'];
}
/* --- تشخیص روز --- */
function dayInfo(dt){
  dt = dt||new Date();
  const j = toJalali(dt.getFullYear(),dt.getMonth()+1,dt.getDate());
  const key = j[1]+'-'+j[2];
  const dow = dt.getDay();
  const isFri = dow===5;
  const hol = HOL_J[key];
  const sch = SCHOOL_EV[key];
  const off = !!(isFri || (hol && hol[1]===1));
  return {
    j, key, dow, dowName:JW[dow], isFri,
    holiday: hol?hol[0]:null, official: !!(hol&&hol[1]===1),
    occasion: hol&&hol[1]===0?hol[0]:null,
    schoolEvent: sch?sch[0]:null, schoolType: sch?sch[1]:null,
    off, season: jSeason(j[1]),
    monthName: JM[j[1]-1],
    daysInMonth: jDaysInMonth(j[0],j[1]),
    isSchoolPeriod: j[1]>=7 && j[1]<=12,
    isRamadanish: false
  };
}

/* --- رویدادهای آینده --- */
function upcoming(n){
  const out=[]; const t=new Date();
  for(let i=0;i<400 && out.length<n;i++){
    const d=new Date(t); d.setDate(d.getDate()+i);
    const inf=dayInfo(d);
    if(inf.holiday||inf.schoolEvent){
      out.push({in:i, d:inf.j[2]+' '+inf.monthName,
        t:inf.holiday||inf.schoolEvent,
        k:inf.official?'hol':inf.schoolEvent?'sch':'occ'});
    }
    // تولد
    if(inf.j[1]===P.birth[1]&&inf.j[2]===P.birth[2])
      out.push({in:i,d:inf.j[2]+' '+inf.monthName,t:'تولد '+fa(inf.j[0]-P.birth[0])+' سالگی',k:'bd'});
  }
  return out;
}

/* --- تأثیر تاریخ بر برنامه --- */
function dateAdjust(S){
  const inf=dayInfo(), out=[];
  if(inf.official)
    out.push(['تعطیل رسمی — '+inf.holiday,'برنامهٔ مدرسه غیرفعال شد. بلوک‌های صبح آزاد است؛ از این فرصت برای درس عمیق یا مهارت استفاده کن.']);
  else if(inf.isFri)
    out.push(['جمعه','روز ریکاوری و بازبینی هفته. تمرین سنگین نگذار.']);
  if(inf.schoolType==='exam')
    out.push(['دورهٔ امتحانات','تمرین سبک می‌شود، بلوک‌های آزاد به درس اختصاص می‌یابند. خواب را کم نکن — شب‌بیداری بازده منفی دارد.']);
  if(inf.schoolType==='school_start')
    out.push(['آغاز سال تحصیلی','برنامه به حالت مدرسه سوییچ شد. سه‌شنبه‌ها فوتبال حذف می‌شود.']);
  if(inf.schoolType==='summer_start')
    out.push(['آغاز تابستان','برنامه به حالت تابستان سوییچ شد. بلوک‌های صبح طولانی‌تر شدند.']);
  if(inf.occasion)
    out.push([inf.occasion,'مناسبت امروز.']);
  const bd=daysToBirthday();
  if(bd===0) out.push(['امروز تولد توست','۱۱ مهر. یک سال گذشت — بازبینی سالانه انجام بده.']);
  else if(bd<=7) out.push([fa(bd)+' روز تا تولد','زمان خوبی برای بازبینی سال و تعیین اهداف سال جدید.']);
  // فصل
  if(inf.season[0]==='زمستان')
    out.push(['زمستان','نور کم = ویتامین D کمتر و خلق پایین‌تر. نور صبح و مکمل D3 اهمیت بیشتری دارند.']);
  if(inf.season[0]==='تابستان')
    out.push(['تابستان','گرما = نیاز بیشتر به آب. قبل تمرین ۵۰۰ml اضافه بنوش.']);
  return {inf, adj:out};
}

/* --- ساعت طلوع/غروب تقریبی تهران --- */
function sunTimes(){
  const j=jToday(), doy=(j[1]<=6?(j[1]-1)*31:186+(j[1]-7)*30)+j[2];
  const dec=23.45*Math.sin(2*Math.PI*(doy-80)/365.25);
  const lat=35.7*Math.PI/180, d=dec*Math.PI/180;
  const ha=Math.acos(-Math.tan(lat)*Math.tan(d))*180/Math.PI/15;
  const noon=12*60+15;
  return {rise:Math.round(noon-ha*60), set:Math.round(noon+ha*60), len:Math.round(ha*120)};
}
