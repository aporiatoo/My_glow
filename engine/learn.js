/* ============================================================
   LEARN — مسیرهای یادگیری ویدیویی
   هر رشته: چند مرحله · هر مرحله چند درس · هر درس یک جستجوی دقیق

   چرا جستجو و نه لینک ثابت: لینک ویدیو می‌میرد، جستجو نه.
   عبارت‌ها انگلیسی‌اند چون کیفیت محتوای انگلیسی بالاتر است.
   ============================================================ */

/* ساختار هر درس: [شناسه, عنوان, عبارت جستجو, دقیقه, توضیح چرا] */

/* ============================================================
   ۱. فوتبال — تکنیک، تاکتیک، بدن
   ============================================================ */
const T_FOOT = [
  { s: 1, t: 'پایه', d: [
    ['f11', 'کنترل توپ با هر دو پا', 'first touch training drills both feet', 12,
     'لمس اول تعیین می‌کند چند گزینه داری'],
    ['f12', 'پاس دقیق روی زمین', 'passing technique inside foot accuracy', 10,
     'پایهٔ همه‌چیز در پست هافبک'],
    ['f13', 'روپایی از صفر', 'juggling tutorial for beginners progression', 8,
     'حس توپ را می‌سازد'],
    ['f14', 'دریبل پایه', 'basic dribbling close control cones', 12,
     'توپ نزدیک پا یعنی کنترل'],
  ]},
  { s: 2, t: 'پای ضعیف', d: [
    ['f21', 'تقویت پای ضعیف', 'weak foot training complete guide', 15,
     'اینجا از هم‌سن‌هایت جلو می‌زنی — بیشترشان رویش کار نمی‌کنند'],
    ['f22', 'شوت با پای ضعیف', 'weak foot shooting technique', 10, ''],
    ['f23', 'پاس بلند با پای ضعیف', 'long pass weak foot drills', 10, ''],
  ]},
  { s: 3, t: 'هافبک میانی', d: [
    ['f31', 'نقش هافبک میانی', 'central midfielder role explained tactics', 15,
     'پست رؤیایی تو'],
    ['f32', 'اسکن و دید محیطی', 'scanning football xavi head movement', 12,
     'همان چیزی که ضعف توست'],
    ['f33', 'بدن باز در دریافت', 'open body shape receiving midfielder', 10,
     'یک تغییر، گزینه‌هایت را دو برابر می‌کند'],
    ['f34', 'چرخش زیر فشار', 'turning under pressure midfield', 12, ''],
    ['f35', 'قانون سوم نفر', 'third man run football tactics', 10,
     'بیشتر گل‌ها اینطور ساخته می‌شوند'],
  ]},
  { s: 4, t: 'دفاع', d: [
    ['f41', 'دفاع یک‌به‌یک', 'defending 1v1 technique jockeying', 12,
     'نقطهٔ قوت فعلی‌ات — محکم‌ترش کن'],
    ['f42', 'تکل تمیز', 'how to tackle properly football', 10, ''],
    ['f43', 'بازی هوایی', 'heading technique defensive', 10, ''],
    ['f44', 'خواندن بازی حریف', 'reading the game anticipation defending', 12, ''],
  ]},
  { s: 5, t: 'بدنی', d: [
    ['f51', 'سرعت و شتاب', 'speed training football sprint acceleration', 15, ''],
    ['f52', 'چابکی و تغییر جهت', 'agility drills change of direction football', 12, ''],
    ['f53', 'استقامت فوتبالی', 'football conditioning endurance no equipment', 15, ''],
    ['f54', 'پیشگیری از آسیب', 'injury prevention youth football warm up', 12,
     'در دورهٔ رشد، مفاصل آسیب‌پذیرترند'],
  ]},
  { s: 6, t: 'ذهنیت', d: [
    ['f61', 'ذهنیت برنده', 'winning mentality football mindset', 12, ''],
    ['f62', 'بازگشت بعد از اشتباه', 'bounce back after mistake football mental', 10, ''],
    ['f63', 'تحلیل بازی خودت', 'how to analyse your own football performance', 12, ''],
  ]}
];

/* ============================================================
   ۲. ذهن — حافظه، تمرکز، تفکر، یادگیری
   ============================================================ */
const T_MIND = [
  { s: 1, t: 'یادگیری', d: [
    ['m11', 'بازیابی فعال', 'active recall study technique explained', 12,
     'مشکل «فکر می‌کنم بلدم ولی سر امتحان نه» را همین حل می‌کند'],
    ['m12', 'مرور فاصله‌دار', 'spaced repetition how it works', 10, ''],
    ['m13', 'توهم تسلط', 'illusion of competence studying', 8,
     'دقیقاً همان چیزی که خودت توصیف کردی'],
    ['m14', 'یادگیری عمیق در برابر سطحی', 'deep work vs shallow learning', 12, ''],
  ]},
  { s: 2, t: 'حافظه', d: [
    ['m21', 'کاخ حافظه', 'memory palace technique tutorial', 15, ''],
    ['m22', 'حفظ اسم افراد', 'how to remember names technique', 10,
     'در روابط، یادآوری اسم بیشترین اثر را دارد'],
    ['m23', 'سیستم قلاب عددی', 'peg system memory numbers', 12, ''],
    ['m24', 'حفظ سریع متن', 'memorize text fast technique', 10, ''],
  ]},
  { s: 3, t: 'تمرکز', d: [
    ['m31', 'کار عمیق', 'deep work cal newport summary', 15, ''],
    ['m32', 'ترک اهمالکاری', 'how to stop procrastinating science', 12, ''],
    ['m33', 'بازسازی دامنهٔ توجه', 'rebuild attention span dopamine', 12,
     'تماشای زیاد فیلم، آستانهٔ تمرکز را پایین می‌آورد'],
  ]},
  { s: 4, t: 'تفکر', d: [
    ['m41', 'مدل‌های ذهنی', 'mental models thinking tools', 15, ''],
    ['m42', 'اصول اولیه', 'first principles thinking explained', 12, ''],
    ['m43', 'سوگیری‌های شناختی', 'cognitive biases explained list', 15, ''],
    ['m44', 'تفکر مرتبهٔ دوم', 'second order thinking decision making', 10, ''],
  ]},
  { s: 5, t: 'سرعت', d: [
    ['m51', 'تندخوانی واقعی', 'speed reading what actually works', 12, ''],
    ['m52', 'یادداشت‌برداری مؤثر', 'note taking systems compared', 12, ''],
    ['m53', 'حل مسئلهٔ ریاضی', 'math problem solving strategies', 15,
     'ریاضی سخت‌ترین درس توست'],
  ]}
];

/* ============================================================
   ۳. ارتباط و نفوذ
   ============================================================ */
const T_COMM = [
  { s: 1, t: 'زبان بدن', d: [
    ['c11', 'خواندن زبان بدن', 'body language reading people guide', 15, ''],
    ['c12', 'ریزحالت‌های چهره', 'microexpressions ekman seven emotions', 12, ''],
    ['c13', 'تشخیص دروغ', 'how to detect deception behavioral', 15,
     'ولی یادت باشد: یک نشانه هیچ چیز نیست'],
    ['c14', 'زبان بدن مسلط', 'confident body language posture', 10, ''],
  ]},
  { s: 2, t: 'گفتگو', d: [
    ['c21', 'شروع گفتگو', 'how to start a conversation with anyone', 10, ''],
    ['c22', 'گوش دادن فعال', 'active listening skills', 10,
     'بیشتر آدم‌ها منتظر نوبت حرف زدنشان‌اند، نه گوش دادن'],
    ['c23', 'پرسیدن سؤال بهتر', 'how to ask better questions', 10, ''],
    ['c24', 'خروج از سکوت ناخوشایند', 'handle awkward silence conversation', 8, ''],
  ]},
  { s: 3, t: 'اقناع', d: [
    ['c31', 'اصول نفوذ چیالدینی', 'cialdini influence principles explained', 15, ''],
    ['c32', 'مذاکرهٔ کریس واس', 'chris voss never split the difference summary', 20,
     'تکنیک‌های مذاکرهٔ گروگان‌گیری روی همه کار می‌کند'],
    ['c33', 'نام‌گذاری احساس', 'tactical empathy labeling negotiation', 10, ''],
    ['c34', 'نه گفتن بدون آسیب', 'how to say no politely but firmly', 10, ''],
  ]},
  { s: 4, t: 'سخنرانی', d: [
    ['c41', 'سخنرانی بدون استرس', 'public speaking overcome fear', 12, ''],
    ['c42', 'ساختار یک صحبت خوب', 'how to structure a speech', 12, ''],
    ['c43', 'صدا و تُن', 'voice training speaking tone', 10, ''],
  ]},
  { s: 5, t: 'دفاع', d: [
    ['c51', 'تشخیص دستکاری', 'manipulation tactics how to recognize', 15, ''],
    ['c52', 'مرزبندی سالم', 'setting boundaries with people', 12, ''],
    ['c53', 'برخورد با آدم سمی', 'dealing with toxic people', 12, ''],
  ]}
];

/* ============================================================
   ۴. ظاهر
   ============================================================ */
const T_LOOK = [
  { s: 1, t: 'پوست', d: [
    ['l11', 'روتین پوست خشک', 'dry skin routine for men beginner', 12,
     'نوع پوست توست'],
    ['l12', 'درمان جوش', 'how to get rid of acne teenager', 12, ''],
    ['l13', 'ضدآفتاب چرا و چطور', 'sunscreen why daily men', 8, ''],
  ]},
  { s: 2, t: 'مو', d: [
    ['l21', 'مدل مو بر اساس فرم صورت', 'best hairstyle for face shape men', 12, ''],
    ['l22', 'مراقبت از موی صاف', 'straight hair care routine men', 10, ''],
    ['l23', 'حالت دادن بدون خرابی', 'how to style hair without damage', 10, ''],
  ]},
  { s: 3, t: 'بدن', d: [
    ['l31', 'اصلاح پوسچر', 'fix posture exercises at home', 15,
     'سریع‌ترین تغییر ظاهری ممکن'],
    ['l32', 'چربی شکم نوجوان', 'lose belly fat teenager healthy', 12,
     'همان چیزی که گفتی اذیتت می‌کند'],
    ['l33', 'خط فک', 'jawline improvement natural', 10, ''],
  ]},
  { s: 4, t: 'استایل', d: [
    ['l41', 'استایل کلاسیک مردانه', 'classic menswear style basics', 15,
     'سبک مورد علاقه‌ات'],
    ['l42', 'فیت درست لباس', 'how clothes should fit men guide', 12,
     'فیت از برند مهم‌تر است'],
    ['l43', 'کمد کپسولی', 'capsule wardrobe men minimal', 12,
     'با بودجهٔ محدود، بهترین راه'],
  ]},
  { s: 5, t: 'آراستگی', d: [
    ['l51', 'اصلاح صورت درست', 'how to shave properly avoid irritation', 10, ''],
    ['l52', 'مرتب کردن ابرو', 'eyebrow grooming men natural', 8, ''],
    ['l53', 'بهداشت دهان و دندان', 'teeth whitening at home safe', 10, ''],
  ]}
];

/* ============================================================
   ۵. مهارت‌های زندگی — چیزهایی که مدرسه یاد نمی‌دهد
   ============================================================ */
const T_LIFE = [
  { s: 1, t: 'آشپزی', d: [
    ['v11', 'تخم‌مرغ به پنج روش', 'how to cook eggs five ways', 10, ''],
    ['v12', 'برنج ایرانی', 'persian rice tahdig tutorial', 15, ''],
    ['v13', 'مرغ در تابه', 'pan seared chicken breast juicy', 10, ''],
    ['v14', 'خورش پایه', 'persian stew khoresh basics', 15, ''],
    ['v15', 'چاقو درست دست گرفتن', 'knife skills basics for beginners', 12, ''],
  ]},
  { s: 2, t: 'اضطراری', d: [
    ['v21', 'کمک‌های اولیه', 'basic first aid everyone should know', 15, ''],
    ['v22', 'احیای قلبی ریوی', 'CPR tutorial step by step', 12,
     'ممکن است یک بار در عمرت لازم شود و همان یک بار کافی است'],
    ['v23', 'خفگی هایملیک', 'heimlich maneuver how to', 8, ''],
  ]},
  { s: 3, t: 'تعمیر', d: [
    ['v31', 'تعمیرات پایهٔ خانه', 'basic home repairs everyone should know', 15, ''],
    ['v32', 'برق ساده و ایمنی', 'basic electrical safety home', 12, ''],
    ['v33', 'تعمیر دوچرخه', 'bicycle maintenance basics', 12, ''],
  ]},
  { s: 4, t: 'بقا', d: [
    ['v41', 'شنا یاد گرفتن', 'learn to swim adult beginner', 15,
     'مهارت نجات‌بخش'],
    ['v42', 'گره‌های کاربردی', 'useful knots everyone should know', 10, ''],
    ['v43', 'جهت‌یابی بدون گوشی', 'navigate without gps basics', 10, ''],
  ]},
  { s: 5, t: 'دفاع شخصی', d: [
    ['v51', 'دفاع شخصی پایه', 'self defense basics for beginners', 15, ''],
    ['v52', 'بوکس پایه', 'boxing basics stance jab', 15, ''],
    ['v53', 'اجتناب از درگیری', 'how to avoid a fight de-escalation', 12,
     'بهترین دعوا، دعوایی است که نشود'],
  ]}
];

/* ============================================================
   ۶. دیجیتال و درآمد
   ============================================================ */
const T_DIGI = [
  { s: 1, t: 'پایه', d: [
    ['d11', 'تایپ سریع', 'touch typing tutorial learn fast', 12,
     'یک بار یاد بگیری، تا آخر عمر وقت صرفه‌جویی می‌کنی'],
    ['d12', 'میان‌برهای صفحه‌کلید', 'keyboard shortcuts productivity', 10, ''],
    ['d13', 'جستجوی حرفه‌ای', 'google search operators advanced', 10, ''],
  ]},
  { s: 2, t: 'ساخت', d: [
    ['d21', 'برنامه‌نویسی از صفر', 'learn programming from zero beginner', 20, ''],
    ['d22', 'ساخت وب‌سایت ساده', 'build a website html css beginner', 20, ''],
    ['d23', 'طراحی گرافیک پایه', 'graphic design basics beginners', 15, ''],
    ['d24', 'تدوین ویدیو', 'video editing basics tutorial', 15, ''],
  ]},
  { s: 3, t: 'درآمد', d: [
    ['d31', 'فریلنسری نوجوان', 'freelancing as a teenager start', 15, ''],
    ['d32', 'ساخت پورتفولیو', 'build a portfolio with no experience', 12, ''],
    ['d33', 'قیمت‌گذاری کار', 'how to price your work freelance', 12, ''],
  ]},
  { s: 4, t: 'مالی', d: [
    ['d41', 'پول پایه', 'personal finance basics for teens', 15, ''],
    ['d42', 'بهرهٔ مرکب', 'compound interest explained simply', 10,
     'در سن تو، زمان بزرگ‌ترین دارایی است'],
    ['d43', 'پس‌انداز هدف‌دار', 'saving money goals system', 10, ''],
  ]}
];

/* ============================================================
   ۷. زبان و هنر
   ============================================================ */
const T_ART = [
  { s: 1, t: 'انگلیسی', d: [
    ['a11', 'مکالمهٔ روزمره', 'english conversation practice daily', 15, ''],
    ['a12', 'تلفظ درست', 'english pronunciation training', 12, ''],
    ['a13', 'گسترش دایرهٔ لغت', 'build english vocabulary fast', 12, ''],
    ['a14', 'فهم شنیداری', 'english listening practice intermediate', 15, ''],
  ]},
  { s: 2, t: 'موسیقی', d: [
    ['a21', 'گوش دادن تحلیلی', 'how to listen to classical music', 15,
     'چیزی که دوستش داری را عمیق‌تر بفهم'],
    ['a22', 'تئوری موسیقی پایه', 'music theory basics for beginners', 15, ''],
    ['a23', 'پیانو از صفر', 'learn piano beginner first lesson', 20, ''],
  ]},
  { s: 3, t: 'بصری', d: [
    ['a31', 'عکاسی با گوشی', 'smartphone photography tips composition', 12, ''],
    ['a32', 'طراحی پایه', 'learn to draw basics beginner', 15, ''],
    ['a33', 'دیدن آسمان', 'astronomy for beginners night sky', 15,
     'عاشق آسمانی — این را بلد باش'],
  ]}
];

/* ============================================================
   فهرست رشته‌ها
   ============================================================ */
const TRACKS = [
  ['foot', '⚽', 'فوتبال',        T_FOOT, 'مسیر حرفه‌ای شدن'],
  ['mind', '◈', 'ذهن',           T_MIND, 'یادگیری، حافظه، تفکر'],
  ['comm', '◉', 'ارتباط و نفوذ', T_COMM, 'خواندن آدم‌ها و اقناع'],
  ['look', '◇', 'ظاهر',          T_LOOK, 'بهترین نسخهٔ ظاهری'],
  ['life', '▣', 'مهارت زندگی',   T_LIFE, 'چیزهایی که مدرسه یاد نمی‌دهد'],
  ['digi', '▦', 'دیجیتال و پول', T_DIGI, 'ساختن و درآمد'],
  ['art',  '◍', 'زبان و هنر',    T_ART,  'انگلیسی، موسیقی، بصری']
];
const TRACK_MAP = Object.fromEntries(TRACKS.map(t => [t[0], t]));

/* ============================================================
   توابع
   ============================================================ */

/** لینک جستجوی یوتیوب — همیشه معتبر، حتی اگر ویدیویی حذف شود */
function ytLink(query) {
  return 'https://www.youtube.com/results?search_query=' +
         encodeURIComponent(String(query || '').trim());
}

/** همهٔ درس‌های یک رشته */
function trackLessons(id) {
  const t = TRACK_MAP[id];
  if (!t) return [];
  return t[3].flatMap(stage => stage.d.map(d => ({
    id: d[0], t: d[1], q: d[2], min: d[3], why: d[4] || '',
    stage: stage.s, stageName: stage.t,
    /* نام و آیکون رشته همیشه همراه درس باشد — ویوها لازمشان دارند */
    track: t[0], trackName: t[2], ic: t[1]
  })));
}

/** پیشرفت یک رشته */
function trackProgress(S, id) {
  const all = trackLessons(id);
  if (!all.length) return { done: 0, total: 0, pc: 0 };
  const seen = (S && S.learn) || [];
  const done = all.filter(l => seen.includes(l.id)).length;
  return { done, total: all.length, pc: Math.round(done / all.length * 100) };
}

/** پیشرفت کلی همهٔ رشته‌ها */
function learnScore(S) {
  const per = TRACKS.map(t => ({ id: t[0], ic: t[1], n: t[2], ...trackProgress(S, t[0]) }));
  const done = per.reduce((a, x) => a + x.done, 0);
  const total = per.reduce((a, x) => a + x.total, 0);
  return {
    per, done, total,
    pc: total ? Math.round(done / total * 100) : 0,
    minutes: done * 12
  };
}

/**
 * درس پیشنهادی امروز.
 * اولویت: رشته‌ای که به ضعف فعلی کاربر مربوط است.
 */
function lessonToday(S) {
  const seen = (S && S.learn) || [];
  /* ترتیب اولویت بر پایهٔ وضعیت واقعی */
  const order = [];
  /* بحران خواب یا ضعف تصمیم → اول فوتبال و ذهن */
  if (typeof decScore === 'function') {
    const d = decScore(S);
    if (d.all < 40) order.push('foot');
  }
  order.push('mind', 'comm', 'foot', 'look', 'life', 'digi', 'art');

  for (const tid of order) {
    const next = trackLessons(tid).find(l => !seen.includes(l.id));
    if (next) return { ...next, track: tid, trackName: TRACK_MAP[tid][2], ic: TRACK_MAP[tid][1] };
  }
  return null;
}

if (typeof module !== 'undefined') module.exports = {
  TRACKS, TRACK_MAP, ytLink, trackLessons, trackProgress, learnScore, lessonToday
};

/* ============================================================
   رشته‌های گسترش — فاز دوم
   ============================================================ */

/* ---------- ۸. کاریزما و حضور ---------- */
const T_CHAR = [
  { s: 1, t: 'حضور', d: [
    ['k11', 'حضور در اتاق', 'charisma presence how to command a room', 15,
     'هدف ۲۵ سالگی‌ات: کاریزماتیک'],
    ['k12', 'تماس چشمی درست', 'eye contact confidence training', 10, ''],
    ['k13', 'صحبت آهسته و مطمئن', 'speak slower with authority', 10,
     'سرعت حرف زدن، اضطراب را لو می‌دهد'],
    ['k14', 'سکوت به‌عنوان قدرت', 'power of pause speaking', 8, ''],
  ]},
  { s: 2, t: 'گرمی', d: [
    ['k21', 'به‌یاد ماندنی بودن', 'how to be memorable first impression', 12, ''],
    ['k22', 'شوخ‌طبعی یادگرفتنی', 'how to be funnier social skills', 12, ''],
    ['k23', 'تعریف صادقانه', 'how to give genuine compliments', 8, ''],
    ['k24', 'ساختن رابطهٔ سریع', 'build rapport quickly techniques', 12, ''],
  ]},
  { s: 3, t: 'اعتماد', d: [
    ['k31', 'اعتمادبه‌نفس واقعی', 'build real confidence not fake', 15, ''],
    ['k32', 'غلبه بر خجالت', 'overcome social anxiety practical', 15, ''],
    ['k33', 'رفتار زیر فشار', 'stay calm under pressure', 12, ''],
  ]}
];

/* ---------- ۹. مقاومت ذهنی ---------- */
const T_TOUGH = [
  { s: 1, t: 'پایه', d: [
    ['g11', 'سرسختی ذهنی', 'mental toughness training athletes', 15, ''],
    ['g12', 'رواقی‌گری کاربردی', 'stoicism practical guide beginners', 15,
     'کنترل آنچه در کنترل توست، رها کردن بقیه'],
    ['g13', 'ناراحتی عمدی', 'voluntary discomfort discipline', 12, ''],
  ]},
  { s: 2, t: 'شکست', d: [
    ['g21', 'برخورد با شکست', 'how to handle failure and bounce back', 12, ''],
    ['g22', 'ذهنیت رشد', 'growth mindset carol dweck explained', 12, ''],
    ['g23', 'انتقاد را چطور بگیری', 'how to take criticism without ego', 10,
     'مربی‌ات گفت پاس‌هایت مشکل دارد — این مهارت لازم است'],
  ]},
  { s: 3, t: 'سوگ و فقدان', d: [
    ['g31', 'فهمیدن سوگ', 'understanding grief stages teenager', 15,
     'چیزی که الان از سر می‌گذرانی'],
    ['g32', 'زندگی بعد از فقدان', 'coping with loss of grandparent', 12, ''],
    ['g33', 'کِی کمک بخواهی', 'when to ask for help mental health teen', 10, ''],
  ]},
  { s: 4, t: 'انضباط', d: [
    ['g41', 'انضباط بدون انگیزه', 'discipline over motivation how', 12,
     'انگیزه می‌آید و می‌رود، انضباط می‌ماند'],
    ['g42', 'ساختن عادت', 'atomic habits summary james clear', 15, ''],
    ['g43', 'شکستن عادت بد', 'how to break a bad habit science', 12, ''],
    ['g44', 'کنترل تکانه', 'impulse control techniques', 12, ''],
  ]}
];

/* ---------- ۱۰. استراتژی و بازی ---------- */
const T_STRAT = [
  { s: 1, t: 'شطرنج', d: [
    ['s11', 'شطرنج از صفر', 'chess for beginners complete guide', 20,
     'بهترین تمرین برای تفکر چند قدم جلوتر'],
    ['s12', 'تاکتیک‌های پایه', 'chess tactics patterns beginners', 15, ''],
    ['s13', 'برنامه‌ریزی در شطرنج', 'chess strategy planning middlegame', 15, ''],
  ]},
  { s: 2, t: 'تئوری بازی', d: [
    ['s21', 'تئوری بازی ساده', 'game theory explained simply', 15, ''],
    ['s22', 'معمای زندانی', 'prisoners dilemma cooperation', 12, ''],
    ['s23', 'بازی‌های تکراری', 'iterated games reputation strategy', 12,
     'چرا صداقت بلندمدت برنده است'],
  ]},
  { s: 3, t: 'تصمیم', d: [
    ['s31', 'تصمیم زیر عدم قطعیت', 'decision making under uncertainty', 15, ''],
    ['s32', 'تحلیل ریسک', 'risk assessment thinking', 12, ''],
    ['s33', 'هزینهٔ غرق‌شده', 'sunk cost fallacy explained', 10, ''],
  ]}
];

/* ---------- ۱۱. سلامت و بدن ---------- */
const T_HEALTH = [
  { s: 1, t: 'خواب', d: [
    ['h11', 'علم خواب', 'sleep science matthew walker explained', 20,
     'بحرانی‌ترین موضوع فعلی توست'],
    ['h12', 'اصلاح ریتم خواب', 'fix your sleep schedule shift circadian', 15,
     'دقیقاً همان کاری که داری می‌کنی'],
    ['h13', 'خواب و رشد قد', 'sleep growth hormone teenagers', 12, ''],
  ]},
  { s: 2, t: 'تغذیه', d: [
    ['h21', 'تغذیه برای رشد', 'nutrition for teenage athletes growth', 15, ''],
    ['h22', 'پروتئین چقدر و چطور', 'protein intake for teens athletes', 12, ''],
    ['h23', 'صبحانه چرا مهم است', 'why breakfast matters for teenagers', 10,
     'تو نمی‌خوری — این بزرگ‌ترین شکاف تغذیه‌ات است'],
    ['h24', 'آب و عملکرد ورزشی', 'hydration athletic performance', 10, ''],
  ]},
  { s: 3, t: 'ریکاوری', d: [
    ['h31', 'ریکاوری بین تمرین', 'recovery between training sessions', 12, ''],
    ['h32', 'کشش و تحرک', 'mobility routine for footballers', 15, ''],
    ['h33', 'ماساژ با فوم رولر', 'foam rolling guide athletes', 10, ''],
  ]},
  { s: 4, t: 'رشد', d: [
    ['h41', 'جهش رشد نوجوانی', 'growth spurt puberty what happens', 12, ''],
    ['h42', 'حداکثر کردن قد', 'maximize height naturally teenager', 12,
     'ژنتیک سقف را تعیین می‌کند، عادت‌ها تعیین می‌کنند به سقف برسی یا نه'],
    ['h43', 'آسیب‌های دورهٔ رشد', 'osgood schlatter growth plate injury', 12, ''],
  ]}
];

/* ---------- ۱۲. نوشتن و بیان ---------- */
const T_WRITE = [
  { s: 1, t: 'پایه', d: [
    ['w11', 'نوشتن روشن', 'how to write clearly and simply', 12, ''],
    ['w12', 'ساختار پاراگراف', 'paragraph structure writing', 10, ''],
    ['w13', 'ویرایش نوشته', 'self editing writing tips', 10, ''],
  ]},
  { s: 2, t: 'روایت', d: [
    ['w21', 'داستان‌گویی', 'storytelling techniques structure', 15,
     'کسی که خوب روایت می‌کند، بهتر متقاعد می‌کند'],
    ['w22', 'شروع جذاب', 'how to write a good hook opening', 10, ''],
    ['w23', 'روایت شخصی', 'personal narrative writing', 12, ''],
  ]},
  { s: 3, t: 'ژورنال', d: [
    ['w31', 'ژورنال‌نویسی مؤثر', 'journaling techniques that work', 12, ''],
    ['w32', 'نوشتن برای فکر کردن', 'writing to think clearly', 12,
     'نوشتن، فکر کردن را دقیق می‌کند — مخصوصاً وقتی مطمئن نیستی'],
  ]}
];

/* ---------- ۱۳. یادگیری سریع ---------- */
const T_META = [
  { s: 1, t: 'روش', d: [
    ['x11', 'فرایادگیری', 'metalearning how to learn anything fast', 15, ''],
    ['x12', 'قانون بیست ساعت', 'first 20 hours learn anything', 12, ''],
    ['x13', 'تمرین هدفمند', 'deliberate practice explained', 15,
     'تفاوت ده سال تجربه و یک سال تجربهٔ تکرارشده'],
  ]},
  { s: 2, t: 'ابزار', d: [
    ['x21', 'روش فاینمن', 'feynman technique learning', 10,
     'اگر نتوانی ساده توضیح بدهی، نفهمیده‌ای'],
    ['x22', 'یادگیری با تدریس', 'learn by teaching protege effect', 10, ''],
    ['x23', 'تمرین درهم', 'interleaving practice technique', 12, ''],
  ]},
  { s: 3, t: 'تسلط', d: [
    ['x31', 'مسیر تسلط', 'mastery robert greene summary', 20, ''],
    ['x32', 'پیدا کردن مربی', 'how to find a mentor', 12, ''],
    ['x33', 'حلقهٔ بازخورد', 'feedback loops skill improvement', 12,
     'بدون بازخورد بیرونی، فقط اشتباه را تکرار می‌کنی'],
  ]}
];

/* افزودن به فهرست رشته‌ها */
TRACKS.push(
  ['char',   '★', 'کاریزما',        T_CHAR,   'حضور، گرمی، اعتماد'],
  ['tough',  '▲', 'مقاومت ذهنی',   T_TOUGH,  'سرسختی، شکست، انضباط'],
  ['strat',  '◆', 'استراتژی',      T_STRAT,  'شطرنج، تئوری بازی، تصمیم'],
  ['health', '✚', 'سلامت و رشد',   T_HEALTH, 'خواب، تغذیه، ریکاوری'],
  ['write',  '✎', 'نوشتن',         T_WRITE,  'روشن نوشتن و روایت'],
  ['meta',   '◎', 'یادگیری سریع',  T_META,   'چطور هرچیزی را سریع یاد بگیری']
);
TRACKS.forEach(t => { TRACK_MAP[t[0]] = t; });

/* ============================================================
   نقشهٔ راه — ترتیب پیشنهادی بر پایهٔ وضعیت واقعی
   ============================================================ */
const ROADMAP = [
  ['now',  'همین حالا', ['h11', 'h12', 'm13', 'f32'],
   'خواب و توهم تسلط و اسکن — سه شکاف فوری‌ات'],
  ['m1',   'ماه اول',   ['f21', 'm11', 'g41', 'h23'],
   'پای ضعیف، بازیابی فعال، انضباط، صبحانه'],
  ['m2',   'ماه دوم',   ['f31', 'c11', 'k31', 'l31'],
   'نقش هافبک، زبان بدن، اعتماد، پوسچر'],
  ['m3',   'ماه سوم',   ['c32', 'x13', 'g12', 's11'],
   'مذاکره، تمرین هدفمند، رواقی‌گری، شطرنج'],
  ['later','بعدتر',     ['d21', 'v21', 'a11', 'w21'],
   'برنامه‌نویسی، کمک‌های اولیه، انگلیسی، روایت']
];

/** درس‌های یک مرحلهٔ نقشهٔ راه با وضعیت */
function roadStage(S, key) {
  const st = ROADMAP.find(r => r[0] === key);
  if (!st) return null;
  const seen = (S && S.learn) || [];
  const all = TRACKS.flatMap(t => trackLessons(t[0]));
  const items = st[2].map(id => {
    const l = all.find(x => x.id === id);
    return l ? { ...l, done: seen.includes(id) } : null;
  }).filter(Boolean);
  return { key: st[0], name: st[1], why: st[3], items,
           done: items.filter(i => i.done).length };
}

if (typeof module !== 'undefined') Object.assign(module.exports, { ROADMAP, roadStage });

/* ============================================================
   رشته‌های گسترش — فاز سوم
   ============================================================ */

/* ---------- ۱۴. کسب‌وکار ---------- */
const T_BIZ = [
  { s: 1, t: 'پایه', d: [
    ['b11', 'کسب‌وکار چطور کار می‌کند', 'how business works basics explained', 15,
     'تو با وان شریک کاری هستی — این پایه است'],
    ['b12', 'پیدا کردن مشتری اول', 'how to get your first customer', 12, ''],
    ['b13', 'قیمت‌گذاری درست', 'how to price your product service', 12, ''],
    ['b14', 'شراکت سالم', 'business partnership rules agreement', 12,
     'شراکت بدون قرارداد روشن، دوستی را هم می‌سوزاند'],
  ]},
  { s: 2, t: 'فروش', d: [
    ['b21', 'فروش بدون فشار', 'how to sell without being pushy', 15, ''],
    ['b22', 'پاسخ به نه', 'handling objections sales', 12, ''],
    ['b23', 'ارائهٔ محصول', 'how to pitch your idea', 12, ''],
  ]},
  { s: 3, t: 'رشد', d: [
    ['b31', 'بازاریابی با بودجهٔ صفر', 'marketing with no budget bootstrapping', 15, ''],
    ['b32', 'ساخت برند شخصی', 'personal brand building young', 12, ''],
    ['b33', 'شبکه‌سازی واقعی', 'networking for introverts authentic', 12, ''],
  ]}
];

/* ---------- ۱۵. مطالعه و کتاب ---------- */
const T_READ = [
  { s: 1, t: 'روش', d: [
    ['r11', 'چطور کتاب بخوانی', 'how to read a book effectively', 15, ''],
    ['r12', 'یادداشت‌برداری از کتاب', 'book notes system remember what you read', 12,
     'خواندن بدون یادداشت، سرگرمی است'],
    ['r13', 'انتخاب کتاب درست', 'how to choose books worth reading', 10, ''],
    ['r14', 'عادت روزانهٔ خواندن', 'build a daily reading habit', 10, ''],
  ]},
  { s: 2, t: 'کتاب‌های کلیدی', d: [
    ['r21', 'عادت‌های اتمی', 'atomic habits full summary', 20, ''],
    ['r22', 'تفکر سریع و کند', 'thinking fast and slow summary', 20, ''],
    ['r23', 'قدرت عادت', 'power of habit summary', 15, ''],
    ['r24', 'اثر مرکب', 'the compound effect summary', 15, ''],
    ['r25', 'ذهنیت', 'mindset carol dweck full summary', 15, ''],
  ]}
];

/* ---------- ۱۶. روابط ---------- */
const T_REL = [
  { s: 1, t: 'دوستی', d: [
    ['n11', 'دوست واقعی پیدا کردن', 'how to make real friends', 12,
     'یک دوست نزدیک داری — کیفیت از کمیت مهم‌تر است'],
    ['n12', 'نگه داشتن دوستی', 'how to maintain friendships', 10, ''],
    ['n13', 'تشخیص دوست بد', 'signs of a bad friend', 10, ''],
    ['n14', 'حل تعارض با دوست', 'resolve conflict with friend', 12, ''],
  ]},
  { s: 2, t: 'خانواده', d: [
    ['n21', 'حرف زدن با والدین', 'how to talk to your parents effectively', 12, ''],
    ['n22', 'خانوادهٔ پیچیده', 'blended family stepparent relationship', 12,
     'وضعیت خانوادگی تو ساده نیست — این طبیعی است'],
    ['n23', 'مرزبندی با خانواده', 'setting boundaries with family teen', 12, ''],
  ]},
  { s: 3, t: 'تیم', d: [
    ['n31', 'رهبری بدون عنوان', 'lead without authority influence', 15, ''],
    ['n32', 'کاپیتان تیم بودن', 'how to be a good team captain', 12, ''],
    ['n33', 'کار با آدم سخت', 'working with difficult teammates', 12, ''],
    ['n34', 'اعتمادسازی در تیم', 'building trust in a team', 12, ''],
  ]}
];

/* ---------- ۱۷. زمان و بهره‌وری ---------- */
const T_TIME = [
  { s: 1, t: 'مدیریت', d: [
    ['p11', 'مدیریت زمان واقعی', 'time management that actually works', 15, ''],
    ['p12', 'اولویت‌بندی', 'prioritization eisenhower matrix', 12, ''],
    ['p13', 'بلوک‌بندی زمان', 'time blocking method', 12,
     'همان چیزی که تایم‌لاین اپ انجام می‌دهد'],
    ['p14', 'نه گفتن به کارها', 'saying no to commitments', 10, ''],
  ]},
  { s: 2, t: 'تمرکز', d: [
    ['p21', 'پومودورو درست', 'pomodoro technique properly', 10, ''],
    ['p22', 'حذف حواس‌پرتی', 'eliminate distractions deep focus', 12, ''],
    ['p23', 'شروع کردن سخت‌ترین کار', 'eat the frog productivity', 10, ''],
  ]},
  { s: 3, t: 'سیستم', d: [
    ['p31', 'مرور هفتگی', 'weekly review system', 12, ''],
    ['p32', 'مغز دوم', 'second brain note taking system', 15, ''],
    ['p33', 'خودکارسازی کارها', 'automate repetitive tasks', 12, ''],
  ]}
];

/* ---------- ۱۸. امنیت و دنیای واقعی ---------- */
const T_SAFE = [
  { s: 1, t: 'دیجیتال', d: [
    ['y11', 'امنیت حساب‌ها', 'online account security basics', 12, ''],
    ['y12', 'تشخیص کلاهبرداری', 'how to spot online scams', 12, ''],
    ['y13', 'حریم خصوصی', 'digital privacy basics protect yourself', 12, ''],
    ['y14', 'رد پای دیجیتال', 'digital footprint what you post matters', 10,
     'آنچه امروز می‌فرستی، ده سال دیگر پیدا می‌شود'],
  ]},
  { s: 2, t: 'فیزیکی', d: [
    ['y21', 'آگاهی موقعیتی', 'situational awareness basics', 12, ''],
    ['y22', 'ایمنی در خیابان', 'street safety awareness teenager', 12, ''],
    ['y23', 'واکنش در اضطرار', 'emergency response what to do', 12, ''],
  ]},
  { s: 3, t: 'اجتماعی', d: [
    ['y31', 'مقاومت در برابر فشار جمع', 'resist peer pressure', 12, ''],
    ['y32', 'تشخیص آدم خطرناک', 'red flags dangerous people', 12, ''],
    ['y33', 'خروج از موقعیت بد', 'exit strategy uncomfortable situation', 10, ''],
  ]}
];

/* ---------- ۱۹. علوم و درس ---------- */
const T_SCI = [
  { s: 1, t: 'ریاضی', d: [
    ['q11', 'ریاضی پایهٔ نهم', 'algebra basics explained step by step', 20,
     'سخت‌ترین درس توست — از پایه شروع کن'],
    ['q12', 'حل معادله', 'solving equations methods', 15, ''],
    ['q13', 'هندسه', 'geometry basics explained', 15, ''],
    ['q14', 'چرا ریاضی سخت به‌نظر می‌رسد', 'why math feels hard mindset', 12,
     'معمولاً مشکل، شکاف در پایه است نه استعداد'],
  ]},
  { s: 2, t: 'علوم', d: [
    ['q21', 'فیزیک پایه', 'physics basics forces motion', 15, ''],
    ['q22', 'شیمی پایه', 'chemistry basics explained', 15, ''],
    ['q23', 'زیست پایه', 'biology basics cells body', 15, ''],
  ]},
  { s: 3, t: 'عربی', d: [
    ['q31', 'قواعد عربی', 'arabic grammar basics for beginners', 15,
     'دومین درس سخت تو'],
    ['q32', 'صرف فعل عربی', 'arabic verb conjugation explained', 15, ''],
  ]}
];

/* ---------- ۲۰. خلاقیت ---------- */
const T_CREA = [
  { s: 1, t: 'تفکر خلاق', d: [
    ['z11', 'خلاقیت یادگرفتنی است', 'creativity is a skill not talent', 12, ''],
    ['z12', 'تولید ایده', 'idea generation techniques', 12, ''],
    ['z13', 'ترکیب ایده‌ها', 'combinatorial creativity connecting ideas', 12, ''],
  ]},
  { s: 2, t: 'ساختن', d: [
    ['z21', 'عکاسی با موبایل', 'mobile photography composition rules', 12, ''],
    ['z22', 'تدوین سریع', 'quick video editing phone', 12, ''],
    ['z23', 'طراحی پایه', 'design principles for non designers', 12, ''],
  ]},
  { s: 3, t: 'انتشار', d: [
    ['z31', 'ساختن در ملأ عام', 'building in public share your work', 12,
     'نشان دادن کار ناقص، از مخفی کردن کامل بهتر است'],
    ['z32', 'برخورد با نقد', 'handle criticism of your work', 10, ''],
  ]}
];

TRACKS.push(
  ['biz',  '◱', 'کسب‌وکار',      T_BIZ,  'با وان شریکی — این را بلد باش'],
  ['read', '▭', 'کتاب',          T_READ, 'چطور بخوانی و چه بخوانی'],
  ['rel',  '◈', 'روابط',         T_REL,  'دوستی، خانواده، تیم'],
  ['time', '◷', 'زمان',          T_TIME, 'مدیریت، تمرکز، سیستم'],
  ['safe', '⛨', 'امنیت',         T_SAFE, 'دیجیتال، فیزیکی، اجتماعی'],
  ['sci',  '∑', 'درس',           T_SCI,  'ریاضی و عربی — دو درس سخت تو'],
  ['crea', '◐', 'خلاقیت',        T_CREA, 'ایده، ساختن، انتشار']
);
TRACKS.forEach(t => { TRACK_MAP[t[0]] = t; });

/* ============================================================
   جستجو در درس‌ها — با این تعداد، فهرست کردن کافی نیست
   ============================================================ */
function searchLessons(q) {
  const s = String(q || '').trim().toLowerCase();
  if (s.length < 2) return [];
  const all = TRACKS.flatMap(t => trackLessons(t[0]));
  return all.filter(l =>
    l.t.toLowerCase().includes(s) ||
    l.q.toLowerCase().includes(s) ||
    l.trackName.includes(s) ||
    l.stageName.includes(s) ||
    (l.why && l.why.includes(s))
  ).slice(0, 25);
}

/** درس‌های نشان‌شده */
function starred(S) {
  const ids = (S && S.lrnStar) || [];
  if (!ids.length) return [];
  const all = TRACKS.flatMap(t => trackLessons(t[0]));
  return all.filter(l => ids.includes(l.id));
}

if (typeof module !== 'undefined') Object.assign(module.exports, { searchLessons, starred });

/* ============================================================
   MINI — مهارت‌های ریز
   یک‌بار یاد می‌گیری، تا آخر عمر داری.
   کمتر از ۱۵ دقیقه، ولی اثرشان روزانه است.
   قالب: [شناسه, نام, جستجو, دقیقه, چرا]
   ============================================================ */

const M_BODY = [
  ['u01', 'بستن بند کفش که باز نشود', 'shoelace knot that never comes undone', 4,
   'در فوتبال، بند باز یعنی توقف بازی'],
  ['u02', 'تنفس دیافراگمی', 'diaphragmatic breathing technique', 6,
   'پایهٔ استقامت و کنترل استرس'],
  ['u03', 'تنفس ۴-۷-۸', '478 breathing technique', 5, 'قبل امتحان و مسابقه'],
  ['u04', 'گرم‌کردن پویا', 'dynamic warm up routine 5 minutes', 8, ''],
  ['u05', 'کشش بعد تمرین', 'static stretching after workout', 8, ''],
  ['u06', 'بلند کردن درست وزنه', 'how to lift heavy object safely back', 5,
   'یک بار کمر درد، ماه‌ها تمرین را می‌گیرد'],
  ['u07', 'نشستن درست پشت میز', 'proper sitting posture desk', 6, ''],
  ['u08', 'بیدار شدن بدون اسنوز', 'how to wake up without snooze', 6, ''],
  ['u09', 'چرت بیست دقیقه‌ای', 'power nap how to do it right', 5, ''],
  ['u10', 'دوش سرد', 'cold shower how to start', 5, '']
];

const M_LIFE = [
  ['u11', 'اتو کردن پیراهن', 'how to iron a shirt properly', 8, ''],
  ['u12', 'دوختن دکمه', 'how to sew a button', 6, ''],
  ['u13', 'لکه‌بری لباس', 'remove stains from clothes guide', 8, ''],
  ['u14', 'شستن درست لباس', 'laundry basics sorting washing', 8, ''],
  ['u15', 'تا کردن لباس', 'fold clothes efficiently method', 6, ''],
  ['u16', 'نگهداری کفش', 'how to clean and maintain shoes', 8, ''],
  ['u17', 'بستن کراوات', 'how to tie a tie windsor knot', 6,
   'استایل کلاسیک دوست داری — این پایه است'],
  ['u18', 'بستن چمدان', 'how to pack a suitcase efficiently', 8, ''],
  ['u19', 'تیز کردن چاقو', 'how to sharpen a knife', 8, ''],
  ['u20', 'باز کردن سینک گرفته', 'unclog a drain without chemicals', 6, '']
];

const M_SOCIAL = [
  ['u21', 'دست دادن درست', 'proper handshake technique', 4,
   'اولین قضاوت در سه ثانیه شکل می‌گیرد'],
  ['u22', 'معرفی کردن خودت', 'how to introduce yourself confidently', 6, ''],
  ['u23', 'معرفی دو نفر به هم', 'how to introduce two people', 5, ''],
  ['u24', 'تماس تلفنی رسمی', 'professional phone call etiquette', 8, ''],
  ['u25', 'ایمیل رسمی نوشتن', 'how to write a formal email', 8, ''],
  ['u26', 'عذرخواهی درست', 'how to apologize properly sincere', 6,
   'عذرخواهی بد، از عذرخواهی نکردن بدتر است'],
  ['u27', 'رد کردن مؤدبانه', 'how to decline politely', 6, ''],
  ['u28', 'قطع کردن گفتگو', 'how to end a conversation politely', 6, ''],
  ['u29', 'یادگرفتن اسم در لحظه', 'remember someone name instantly trick', 5, ''],
  ['u30', 'ورود به جمع ناآشنا', 'how to join a group conversation', 6, '']
];

const M_STUDY = [
  ['u31', 'خلاصه‌نویسی درس', 'how to summarize what you read', 8, ''],
  ['u32', 'ساخت فلش‌کارت مؤثر', 'how to make effective flashcards', 8, ''],
  ['u33', 'نقشهٔ ذهنی', 'mind mapping technique tutorial', 8, ''],
  ['u34', 'مرور شب امتحان', 'night before exam revision strategy', 8, ''],
  ['u35', 'مدیریت اضطراب امتحان', 'test anxiety how to manage', 8, ''],
  ['u36', 'خواندن سؤال امتحان', 'how to read exam questions properly', 6,
   'خیلی از غلط‌ها از بدفهمی صورت سؤال است'],
  ['u37', 'مدیریت وقت در امتحان', 'exam time management strategy', 6, ''],
  ['u38', 'بررسی برگه قبل تحویل', 'checking your exam paper before submitting', 5, ''],
  ['u39', 'حفظ فرمول', 'how to memorize formulas', 8, ''],
  ['u40', 'یادگیری از اشتباه امتحان', 'learn from test mistakes system', 8, '']
];

const M_DIGI = [
  ['u41', 'میان‌برهای ویندوز', 'windows keyboard shortcuts essential', 8, ''],
  ['u42', 'اکسل پایه', 'excel basics for beginners', 12, ''],
  ['u43', 'پرامپت‌نویسی هوش مصنوعی', 'how to write better AI prompts', 10,
   'مهارتی که هر سال مهم‌تر می‌شود'],
  ['u44', 'مدیریت فایل', 'file organization system computer', 8, ''],
  ['u45', 'پشتیبان‌گیری', 'backup your data properly', 8, ''],
  ['u46', 'رمز عبور امن', 'create strong passwords password manager', 8, ''],
  ['u47', 'جستجوی پیشرفته', 'advanced google search tricks', 8, ''],
  ['u48', 'تشخیص خبر جعلی', 'how to spot fake news', 8, ''],
  ['u49', 'بازیابی فایل پاک‌شده', 'recover deleted files', 6, ''],
  ['u50', 'سرعت اینترنت و عیب‌یابی', 'fix slow internet troubleshooting', 8, '']
];

const M_FOOT = [
  ['u51', 'ضربهٔ کرنر', 'how to take a corner kick', 8, ''],
  ['u52', 'پنالتی زدن', 'how to take a penalty kick technique', 8, ''],
  ['u53', 'ضربهٔ ایستگاهی', 'free kick technique curve', 10, ''],
  ['u54', 'پرتاب اوت', 'throw in technique long', 6, ''],
  ['u55', 'قوانین آفساید', 'offside rule explained simply', 8,
   'خیلی از بازیکن‌ها هنوز درست نمی‌دانند'],
  ['u56', 'تفاوت فوتسال', 'futsal vs football differences rules', 8, ''],
  ['u57', 'بستن کفش فوتبال', 'how to lace football boots', 5, ''],
  ['u58', 'انتخاب کفش درست', 'choose right football boots surface', 8, ''],
  ['u59', 'مراقبت از کفش فوتبال', 'football boots care cleaning', 6, ''],
  ['u60', 'بادکردن توپ درست', 'correct football pressure inflate', 4, '']
];

const M_MIND = [
  ['u61', 'حساب ذهنی سریع', 'mental math tricks fast calculation', 10, ''],
  ['u62', 'حفظ شمارهٔ تلفن', 'memorize phone numbers technique', 6, ''],
  ['u63', 'تخمین سریع', 'quick estimation skills', 8, ''],
  ['u64', 'تشخیص آمار گمراه‌کننده', 'how to lie with statistics spot', 10, ''],
  ['u65', 'تصمیم دو دقیقه‌ای', 'two minute rule decision making', 5, ''],
  ['u66', 'قانون دو دقیقه', 'two minute rule productivity', 5, ''],
  ['u67', 'بازنشانی تمرکز', 'reset your focus quickly', 6, ''],
  ['u68', 'قطع فکر تکراری', 'stop overthinking techniques', 8, ''],
  ['u69', 'تصمیم وقتی خسته‌ای', 'decision fatigue how to handle', 8, ''],
  ['u70', 'حافظهٔ کاری', 'improve working memory exercises', 8, '']
];

const M_LOOK = [
  ['u71', 'اصلاح ریش نامرتب', 'trim patchy beard teenager', 8,
   'ریشت نامنظم درمی‌آید — این راهش است'],
  ['u72', 'کوتاه کردن مو در خانه', 'cut your own hair men basic', 10, ''],
  ['u73', 'حالت دادن مو بدون ژل', 'style hair without products', 6, ''],
  ['u74', 'مراقبت از لب', 'chapped lips treatment', 4, ''],
  ['u75', 'کوتاه کردن ناخن درست', 'how to cut nails properly', 4, ''],
  ['u76', 'بوی بدن و عرق', 'body odor prevention hygiene', 6, ''],
  ['u77', 'مسواک درست', 'proper brushing technique dentist', 6, ''],
  ['u78', 'نخ دندان', 'how to floss correctly', 5, ''],
  ['u79', 'انتخاب عطر', 'how to choose and apply fragrance', 8, ''],
  ['u80', 'عکس گرفتن از خودت', 'how to look good in photos men', 8, '']
];

const MINI = [
  ['mb', '◐', 'بدن و تنفس',   M_BODY],
  ['ml', '▣', 'خانه و لباس',  M_LIFE],
  ['ms', '◉', 'اجتماعی',      M_SOCIAL],
  ['mt', '▦', 'امتحان و درس', M_STUDY],
  ['md', '⌨', 'دیجیتال',      M_DIGI],
  ['mf', '⚽', 'فوتبال',       M_FOOT],
  ['mm', '◈', 'ذهن سریع',     M_MIND],
  ['mk', '◇', 'آراستگی',      M_LOOK]
];
const MINI_MAP = Object.fromEntries(MINI.map(m => [m[0], m]));

/** همهٔ میکرومهارت‌ها به‌صورت مسطح */
function miniAll() {
  return MINI.flatMap(g => g[3].map(d => ({
    id: d[0], t: d[1], q: d[2], min: d[3], why: d[4] || '',
    grp: g[0], grpName: g[2], ic: g[1]
  })));
}

function miniProgress(S, grp) {
  const seen = (S && S.learn) || [];
  const list = grp ? (MINI_MAP[grp] ? MINI_MAP[grp][3] : []) : miniAll();
  const ids = grp ? list.map(d => d[0]) : list.map(d => d.id);
  const done = ids.filter(id => seen.includes(id)).length;
  return { done, total: ids.length, pc: ids.length ? Math.round(done / ids.length * 100) : 0 };
}

/** میکرومهارت امروز — کوتاه‌ترین کار نیمه‌تمام */
function miniToday(S) {
  const seen = (S && S.learn) || [];
  const todo = miniAll().filter(m => !seen.includes(m.id));
  if (!todo.length) return null;
  todo.sort((a, b) => a.min - b.min);
  /* از میان پنج کوتاه‌ترین، یکی بر پایهٔ روز */
  const pool = todo.slice(0, 5);
  return pool[Math.floor(Date.now() / 864e5) % pool.length];
}

if (typeof module !== 'undefined') Object.assign(module.exports,
  { MINI, MINI_MAP, miniAll, miniProgress, miniToday });
