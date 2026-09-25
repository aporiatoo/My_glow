/* ============================================================
   ME — پروفایل واقعی، از فرم پرشده
   این فایل تنها جایی است که واقعیت زندگی کاربر ثبت می‌شود.
   هر عدد اینجا از پاسخ خودش آمده، نه پیش‌فرض.
   ============================================================ */

const ME = {
  /* --- هویت --- */
  name: 'لوکاس',
  fullName: 'سید آرتین رضوی طوسی',
  birth: [1390, 7, 11],
  birthHour: 22,
  height: 170,
  weight: 55,
  handStrong: 'right',
  footStrong: 'right',

  /* --- بدن ---
     BMI ≈ ۱۹ در ۱۷۰cm/۵۵kg — پایین ولی طبیعی برای این سن.
     جهش رشد شروع شده: خواب و پروتئین بحرانی‌ترین اهرم‌ها هستند. */
  inGrowthSpurt: true,
  voiceBroken: true,
  injuries: [],
  meds: [],
  allergies: [],
  bodyNote: 'چربی شکم و پهلو · لاغر در بقیهٔ بدن',

  /* --- خواب: بحران فعال ---
     دو ماه بیداری شبانه برای مراقبت از مادربزرگ.
     مادربزرگ دو هفته پیش فوت کرد، عادت مانده. */
  sleepNow: '03:30',
  wakeNow: '09:00',
  sleepHoursNow: 5.75,
  sleepNeed: 8.5,
  sleepTarget: '23:00',       /* هدف نهایی، نه فوری */
  sleepCause: 'grief',
  nightWakes: 0,
  morningState: 'خسته',
  naps: false,

  /* --- مدرسه: دو شیفتی ---
     شنبه تا دوشنبه صبح · سه‌شنبه و چهارشنبه بعدازظهر */
  school: 'شیخ طوسی · هیئت امنایی',
  grade: 9,
  schoolAM: { days: [6, 0, 1], start: '08:00', end: '12:30' },
  schoolPM: { days: [2, 3], start: '12:00', end: '16:30' },
  commuteMin: 5,
  lastGPA: 17.8,
  goalGPA: 20,

  /* دروس: سختی واقعی از تجربهٔ خودش */
  subjEasy: ['social', 'eng', 'work', 'farsi', 'sci'],
  subjHard: ['math', 'arabic'],
  studyProblem: 'illusion',   /* توهم تسلط — سر امتحان معلوم می‌شود */
  streamWant: 'انسانی',
  streamFamily: 'آزاد',
  tutor: false,

  /* --- فوتبال --- */
  club: 'پرسپولیس نوین',
  yearsPlaying: 3.5,
  posPlayed: ['CB', 'RB', 'LB', 'CAM', 'CDM', 'CM'],
  posDream: 'CM',
  idol: 'پوگبا',
  idolWhy: 'سبک بازی و پاسکاری',
  starter: true,
  minutesTypical: 80,
  strengthSelf: 'دفاع',
  weaknessCoach: 'پاس به بازیکن اشتباه',   /* یعنی تصمیم‌گیری، نه تکنیک */
  clubDays: [0, 2, 4],
  clubStart: '14:00',
  clubEnd: '15:30',
  clubLongEnd: '17:30',
  matchDay: null,

  /* --- امکانات تمرین --- */
  yard: true,
  yardSize: '۶۰×۶۰',
  wall: true,
  hasBall: false,             /* اولویت یک خرید */
  hasCones: false,
  hasBands: false,
  hasBar: false,

  /* --- تغذیه --- */
  dislikes: ['کدو', 'بادمجان'],
  favFoods: ['قرمه سبزی', 'قیمه'],
  breakfast: false,           /* نمی‌خورد — مشکل جدی در دورهٔ رشد */
  lunchPlace: 'خانه',
  dinnerHour: '20:30',
  waterGlasses: 8,
  fastFood: 'کم',
  supplements: false,
  cook: 'پدربزرگ یا مادر',
  schoolFood: false,          /* در مدرسه فقط آب */
  protein: 110,

  /* --- ظاهر --- */
  skinType: 'خشک',
  acne: 'کم · پیشانی و روی بینی',
  skinProducts: [],
  hairType: 'صاف',
  hairStyle: 'بازکات',
  beard: 'نامرتب',
  brows: false,
  teeth: 'احتمال نیاز به ارتودنسی',
  style: 'کلاسیک',
  barberWeeks: 4,

  /* --- انضباط --- */
  urgeHours: [22, 23, 0, 1],
  urgePlace: 'اتاق',
  urgeTrigger: 'bored',
  cleanRecord: 21,
  cleanBreaker: 'بی‌حوصلگی',
  screenMain: 'فیلم روی لپ‌تاپ',
  phoneAtNight: 'کنار تخت',

  /* --- روابط --- */
  livesWith: ['پدربزرگ'],
  motherPresent: 'گاهی',
  fatherReal: 'قطع ارتباط',
  stepfather: 'بدک نیست',
  grandmother: 'فوت · دو هفته پیش',
  grandmotherRaised: true,
  closeFriends: ['علی‌اصغر'],
  teammates: ['علی‌اصغر', 'فرهاد', 'آرمین'],
  partner: 'وان · شریک کاری مجازی',
  coach: 'خنثی تا منفی',
  confidant: null,            /* کسی برای گفتن مشکلات ندارد */

  /* --- مالی --- */
  allowance: 'نامرتب',
  monthlySpend: 1500000,
  savingNow: 4000000,
  goalMid: 100000000,
  goalLong: 'زمین ۱۵۰ متری شمال',

  /* --- اهداف --- */
  goalHeight: 190,            /* «بهترین ممکن» — سقف واقع‌بینانه */
  goalFootball: 'حرفه‌ای',
  planB: 'بیزینس با وان',
  keystone: 'sleep',          /* خودش گفت: اگر یکی درست شود، خواب */
  goal25: ['پولدار', 'راحت', 'خوشتیپ', 'کاریزماتیک'],

  /* --- سبک --- */
  tone: 'data',               /* بی‌طرف و عددی — صریح خواست */
  intensity: 'ramp',          /* اول قابل تنفس، بعد فشرده */
  notifyStyle: 'few',         /* اعلان‌ها را چک نمی‌کند */
  music: ['کلاسیک بی‌کلام', 'قدیمی ایرانی', 'قدیمی خارجی'],
  loves: ['آسمان'],

  /* --- محدودیت --- */
  budget: 'محدود',
  familySupport: 'بی‌خبر ولی احتمالاً همراه',
  fasting: 'اختیاری',
  religious: false
};

/* ============================================================
   وضعیت خواب — بحرانی‌ترین متغیر فعلی
   ============================================================ */

/** بدهی خواب انباشته بر پایهٔ وضعیت واقعی */
function sleepCrisis(S) {
  const log = (S && S.sleepLog) || {};
  const keys = Object.keys(log).sort().slice(-14);
  if (!keys.length) {
    /* هنوز ثبتی نیست — از وضعیت اعلام‌شده تخمین بزن */
    const daily = ME.sleepNeed - ME.sleepHoursNow;
    return { est: true, daily: Math.round(daily * 10) / 10,
             weekly: Math.round(daily * 7 * 10) / 10, nights: 0 };
  }
  let debt = 0;
  keys.forEach(k => { const h = +log[k]; if (!isNaN(h)) debt += Math.max(0, ME.sleepNeed - h) });
  return { est: false, daily: Math.round(debt / keys.length * 10) / 10,
           weekly: Math.round(debt / keys.length * 7 * 10) / 10, nights: keys.length };
}

/**
 * برنامهٔ بازگشت خواب — تدریجی، نه یک‌شبه.
 * پریدن از ۰۳:۳۰ به ۲۳:۰۰ شکست می‌خورد. هر سه شب ۲۰ دقیقه جلوتر.
 */
function sleepPlan(S) {
  const start = (S && S.sleepFix && S.sleepFix.start) || null;
  if (!start) return null;
  const days = Math.max(0, Math.floor((Date.now() - new Date(start)) / 864e5));
  const steps = Math.floor(days / 3);
  const fromMin = 3 * 60 + 30;          /* ۰۳:۳۰ */
  const toMin = 23 * 60;                /* ۲۳:۰۰ فردای قبل = ۴.۵ ساعت جلوتر */
  const shift = Math.min(270, steps * 20);
  let target = fromMin - shift;
  if (target < 0) target += 1440;
  const done = shift >= 270;
  return {
    day: days + 1, step: steps + 1, shiftMin: shift, done,
    target: target, targetStr: String(Math.floor(target / 60) % 24).padStart(2, '0') + ':' +
                               String(target % 60).padStart(2, '0'),
    remain: Math.max(0, 270 - shift)
  };
}

/* ============================================================
   تدارکات — به ترتیب اثر واقعی، نه قیمت
   ============================================================ */
const BUY = [
  ['ball',   'توپ فوتبال سایز ۵', 700000, 1,
   'بدون توپ، هشت تمرین از ده تمرین انفرادی ممکن نیست. اولویت مطلق.'],
  ['cones',  'مخروط یا جایگزین', 0, 1,
   'بطری آب خالی یا کفش هم کار می‌کند. صفر تومان.'],
  ['moist',  'مرطوب‌کنندهٔ پوست خشک', 250000, 1,
   'پوست خشک + بدون هیچ محصولی = مهم‌ترین شکاف ظاهری.'],
  ['spf',    'ضدآفتاب', 200000, 2,
   'مؤثرترین قدم ضدپیری. حتی در پاییز.'],
  ['bar',    'میلهٔ بارفیکس چهارچوب در', 300000, 2,
   'آویزان شدن روزانه در دورهٔ جهش رشد.'],
  ['band',   'کش مقاومتی', 200000, 3,
   'وقتی وزن بدن آسان شد.'],
  ['razor',  'تیغ اصلاح مناسب', 200000, 2,
   'ریش نامرتب — تیغ کند یعنی سوزش و جوش.']
];

/* ============================================================
   برنامهٔ هفتگی واقعی — با دو شیفت مدرسه
   ============================================================ */
function todayShape(dow) {
  const d = dow === undefined ? new Date().getDay() : dow;
  const am = ME.schoolAM.days.includes(d);
  const pm = ME.schoolPM.days.includes(d);
  const club = ME.clubDays.includes(d);
  return {
    dow: d,
    schoolAM: am, schoolPM: pm, club,
    /* سه‌شنبه تداخل دارد: مدرسهٔ بعدازظهر با باشگاه */
    conflict: pm && club,
    free: !am && !pm && !club
  };
}

if (typeof module !== 'undefined') module.exports = {
  ME, sleepCrisis, sleepPlan, BUY, todayShape
};
