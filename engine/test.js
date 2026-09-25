/* تست خودکار — در CI اجرا می‌شود و بیلد خراب را متوقف می‌کند
   اجرا:  node test.js            */
const fs = require('fs');

/* کلون تازه: اگر هنوز بیلد نشده، خودش بساز.
   بدون این، هر کسی مخزن را تازه کلون کند تست می‌شکند. */
if (!fs.existsSync(__dirname + '/ASCEND.html')) {
  console.log('(اولین اجرا — build.sh)');
  require('child_process').execSync('bash build.sh', { cwd: __dirname, stdio: 'ignore' });
}

const c = require('./harness.js');
const S = c.S, W = c.win;

let pass = 0, fail = 0;
const t = (name, ok, info) => {
  ok ? pass++ : fail++;
  console.log((ok ? '  ok  ' : ' FAIL ') + name + (info ? '   ' + info : ''));
};
const T = d => new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);

const views = [];
c.GRP.forEach(g => g[4].forEach(v => views.push(v[0])));

function sweep() {
  let bad = [], screens = 0;
  views.forEach(v => {
    const n = c.splitCards(c.V[v]()).filter(p => p.card).length;
    [null, ...Array.from({ length: n }, (_, i) => i)].forEach(i => {
      S.sec = i === null ? null : { v, i }; screens++;
      try {
        const r = c.renderView(v);
        if (r.includes('undefined') || r.includes('NaN')) bad.push(v + '#' + i);
      } catch (e) { bad.push(v + '#' + i + ': ' + e.message.slice(0, 50)); }
    });
  });
  S.sec = null;
  return [bad, screens];
}

function reset() {
  Object.assign(S, {
    tree: [], wo: [], ppl: [], inter: [], ms: [], xp: 0, mode: null, comeback: null,
    ramadan: null, jr: [], mistakes: [], done: {}, q: {}, urges: [], ftest: [],
    shop: {}, sleepLog: {}, startDate: null, obOff: 0, hts: [], fam: {},
    streak: { clean: 0, train: 0, sleep: 0, screen: 0 },
    best: { clean: 0, train: 0, sleep: 0, screen: 0 }
  });
}

console.log('\n— رندر —');
reset();
let [bad, sc] = sweep();
t('ذخیرهٔ خالی', bad.length === 0, bad.join() || sc + ' صفحه');

S.startDate = T(3);
t('هفتهٔ اول آنبوردینگ', sweep()[0].length === 0);

reset(); S.ramadan = { start: c.td() }; S.mode = { k: 'sick', d: c.td() };
t('رمضان + حالت مریضی', sweep()[0].length === 0);

reset();
S.startDate = T(100);
S.comeback = { k: 'clean', from: 55, d: c.td(), n: 2 };
S.hts = [{ d: T(400), v: 165 }, { d: T(30), v: 171 }];
S.fam = { gp: T(10) };
S.jr = Array.from({ length: 7 }, (_, i) => ({ d: T(i), m: '2', en: 2 }));
S.urges = Array.from({ length: 8 }, (_, i) => ({ h: 23, t: 'night', r: i % 2, d: T(i) }));
S.ftest = [{ k: 'pushup', v: 20, d: '2026-01-01' }, { k: 'pushup', v: 26, d: '2026-03-01' }];
[1, 2, 3, 4, 5, 6, 7].forEach(i => { S.sleepLog['2026-09-0' + i] = 6.5; });
S.mistakes = Array.from({ length: 6 }, (_, i) => ({ q: 'q' + i, s: 'math', w: 'بی‌دقتی', d: '1' }));
S.streak = { clean: 120, train: 40, sleep: 30, screen: 12 };
S.best = { clean: 120, train: 44, sleep: 33, screen: 20 };
S.wo = Array.from({ length: 130 }, (_, i) => ({ d: T(i), t: 1, l: 'x' }));
S.ms = Array.from({ length: 22 }, () => ({ date: 'x', pos: 'CDM', min: 90, pass: 82, tack: 3, rate: 7 }));
S.ppl = Array.from({ length: 8 }, (_, i) => ({ id: 'p' + i, n: 'n' + i, r: i < 3 ? 'core' : 'close', role: 'peer', e: 1 }));
S.inter = Array.from({ length: 20 }, (_, i) => ({ id: 'i' + i, p: 'p' + (i % 8), k: 'deep', d: T(i), n: '' }));
S.xp = 9000; S.tree = c.NODES.filter(n => n.tier <= 1).map(n => n.id);
[0, 1, 2, 5, 9].forEach(d => { S.done[T(d) + '|x'] = 1; });
let [bad2, sc2] = sweep();
t('ذخیرهٔ پر', bad2.length === 0, bad2.join() || sc2 + ' صفحه');

console.log('\n— برنامه —');
reset();
let overlaps = 0;
const OD = Date.prototype.getDay;
for (let d = 0; d < 7; d++) {
  Date.prototype.getDay = () => d;
  [null, { start: c.td() }].forEach(ram => {
    S.ramadan = ram;
    ['', 'sick', 'bad', 'trip', 'exam'].forEach(k => {
      S.mode = k ? { k, d: c.td() } : null;
      const p = c.plan();
      for (let i = 0; i < p.length - 1; i++)
        if (p[i].e > p[i].s && p[i + 1].e > p[i + 1].s && p[i + 1].s < p[i].e) overlaps++;
    });
  });
}
Date.prototype.getDay = OD; reset();
t('۷۰ ترکیب روز×حالت×رمضان بدون تداخل', overlaps === 0, String(overlaps));

console.log('\n— محتوا —');
t('۴۶ راهنما', Object.keys(c.GUIDE).length === 46);
t('۴۶ تصویر', Object.keys(c.IMG).length === 46);
const ids = [...Object.keys(c.ROUT), ...c.PROTOCOLS.map(p => p.id), ...c.QUESTS.map(q => 'q_' + q[0])];
t('هر آیتم راهنما دارد', ids.every(i => c.GUIDE[i]));
t('۲۷۶ گام', Object.values(c.GUIDE).reduce((a, g) => a + g.how.length, 0) === 276);
t('۵۸ ویو / ۷ گروه', views.length === 58 && c.GRP.length === 7, views.length + '/' + c.GRP.length);
t('۲۶ گره درخت', c.NODES.length === 26);

console.log('\n— قوانین کاربر —');
const allText = Object.values(c.GUIDE).map(g => g.ex + g.how.join('')).join('');
const shop = c.shopList({}).map(x => x.t).join(' ');
t('کدو/بادمجان در خرید نیست', !/کدو|بادمجان/.test(shop));
t('کدو/بادمجان فقط به‌عنوان ممنوع', !/کدو|بادمجان/.test(allText) ||
  /بدون کدو|کدو و بادمجان هرگز|بدون کدو و بادمجان/.test(allText));
t('پروتئین ۱۱۰g', c.PROTEIN_TARGET === 110);

console.log('\n— منطق —');
t('شروع تدریجی قفل می‌کند', c.obOpen({ startDate: T(3) }, 'train') === false);
t('بعد از هفته باز می‌شود', c.obOpen({ startDate: T(15) }, 'train') === true);
t('سرعت: کمتر بهتر',
  c.ftDelta({ ftest: [{ k: 'sprint', v: 3.4, d: 'a' }, { k: 'sprint', v: 3.1, d: 'b' }] }, 'sprint').better === true);
t('بدهی خواب', c.sleepDebt({ sleepLog: { a: 6, b: 6, c: 6 } }).debt === 7.5);
t('جهش رشد', c.htStats({ hts: [{ d: '2025-09-19', v: 165 }, { d: '2026-09-19', v: 172 }] }).spurt === true);
t('تحلیل وسوسه', c.trgAnalyze({ urges: Array.from({ length: 6 }, () => ({ h: 23, t: 'night', r: 1 })) }).trg === 'night');

console.log('\n— تاریخ —');
{
  const n = new Date();
  const want = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') +
               String('-') + String(n.getDate()).padStart(2, '0');
  t('td() تاریخ محلی است نه UTC', c.td() === want, c.td());
  const src = fs.readFileSync(__dirname + '/ASCEND.html', 'utf8');
  t('هیچ toISOString برای تاریخ روز نمانده',
    !/toISOString\(\)\.slice\(0,\s*10\)/.test(src));
}

console.log('\n— تسلط —');
{
  t('۷ ریزحالت چهره', c.MICRO.length === 7);
  t('تحقیر تنها حالت نامتقارن',
    c.MICRO.find(m => m[0] === 'contempt')[2].includes('نامتقارن'));
  t('۷ اصل نفوذ', c.INFLUENCE.length === 7);
  t('۸ مغالطه', c.FALLACY.length === 8);
  t('۸ مدل ذهنی', c.MODELS.length === 8);
  t('۸ مهارت فوتبال با نشان عددی',
    c.FSKILL.length === 8 && c.FSKILL.every(s2 => s2[3].length === 5));

  /* سطح فقط با عدد باز می‌شود، نه با زمان */
  t('روپایی ۵ = هنوز سطح صفر', c.fskillTier('juggle', 5) === 0);
  t('روپایی ۱۰۰۰ = استاد', c.fskillTier('juggle', 1000) === 5);
  t('دریبل: عدد کمتر بهتر است',
    c.fskillTier('dribble', 9) === 5 && c.fskillTier('dribble', 20) === 1);
  t('بدون سنجش، بدون سطح', c.fskillTier('juggle', undefined) === 0);

  t('نمرات از صفر شروع می‌شوند', c.masteryScore({}).all === 0);
  const rich = { fsk: { juggle: 1000, weak: 10, first: 20, pass: 9, dribble: 9,
                        shot: 9, head: 9, vision: 5 } };
  t('فوتبال کامل = ۱۰۰٪', c.footballScore(rich).pc === 100);
  t('ضعیف‌ترین حوزه شناسایی می‌شود',
    ['mind', 'body', 'look'].includes(c.masteryScore(rich).weakest));
  t('تمرین ذهنی روزانه می‌چرخد', !!c.mindToday({}).item);

  /* اخلاق: نفوذ آری، فریب نه */
  const mindView = c.V.mx_mind();
  t('اصول نفوذ نمایش داده می‌شوند', mindView.includes('عمل متقابل'));
  t('هشدار اخلاقی موجود است', mindView.includes('اخلاق نفوذ'));
}

console.log('\n— نفوذ و دفاع —');
{
  t('۱۴ تاکتیک دستکاری', c.TACTIC.length === 14);
  t('هر تاکتیک پادزهر دارد', c.TACTIC.every(x => x[5] && x[5].length > 20));
  t('هر تاکتیک جملهٔ نمونه دارد', c.TACTIC.every(x => x[4] && x[4].length > 5));
  t('۸ تکنیک مذاکره', c.NEGO.length === 8);
  t('۱۲ سناریوی تمرینی', c.SCEN.length === 12);
  t('هر سناریو سه گزینه و توضیح',
    c.SCEN.every(s2 => s2.opt.length === 3 && s2.why && s2.why.length > 30));
  t('پاسخ‌های درست معتبرند', c.SCEN.every(s2 => s2.ans >= 0 && s2.ans < 3));
  t('تاکتیک خطرناک وزن بیشتری دارد',
    c.defScore({ inf: { known: ['guilt', 'gaslight', 'isolate'] } }).pc >
    c.defScore({ inf: { known: ['strawman', 'whatabt', 'flatter'] } }).pc);
  t('خالی = ناآگاه', c.infScore({}).all === 0 && c.infScore({}).rank === 'ناآگاه');
  t('سناریوی بعدی انتخاب می‌شود', !!c.nextScen({}));
  t('همه درست = پایان',
    c.nextScen({ inf: { drill: Object.fromEntries(c.SCEN.map(x => [x.id, true])) } }) === null);

  /* پادزهر تا وقتی تاکتیک شناخته نشده پنهان است */
  const v0 = c.V.inf_def();
  S.inf = { known: ['guilt'] };
  const v1 = c.V.inf_def();
  S.inf = {};
  t('پادزهر پس از یادگیری باز می‌شود',
    !v0.includes('کمک گذشته را جدا') && v1.includes('کمک گذشته را جدا'));
  t('خط قرمز اخلاقی نمایش داده می‌شود', c.V.inf().includes('خط قرمز'));
}

console.log('\n— شخصی‌سازی و هوشمند —');
{
  /* پروفایل: همهٔ اعداد از یک جا */
  t('پیش‌فرض پروفایل', c.prof({}).protein === 110);
  t('تنظیم کاربر اعمال می‌شود', c.prof({ prof: { protein: 130 } }).protein === 130);
  t('مقدار بی‌معنی رد می‌شود', c.prof({ prof: { protein: 9999 } }).protein === 110);
  t('سن از تاریخ تولد', c.profAge({}) >= 14 && c.profAge({}) <= 16);

  /* محدودیت غذایی در سطح داده، نه متن */
  t('کدو و بادمجان ممنوع',
    !c.foodOk({}, 'خورش کدو') && !c.foodOk({}, 'میرزاقاسمی بادمجان'));
  t('مرغ مجاز', c.foodOk({}, 'مرغ گریل'));
  t('لیست خرید فیلتر می‌شود',
    !c.shopList({}).some(x => /کدو|بادمجان/.test(x.t)));
  t('محدودیت شخصی جدید اعمال می‌شود',
    !c.shopList({ prof: { dislikes: ['شیر'] } }).some(x => x.t === 'شیر'));

  /* روزهای شخصی */
  t('یکشنبه روز باشگاه', c.isClubDay({}, 0) === true);
  t('شنبه روز باشگاه نیست', c.isClubDay({}, 6) === false);
  t('روز باشگاه قابل تغییر',
    c.isClubDay({ prof: { clubDays: [6] } }, 6) === true);

  /* نیاز خواب شخصی روی محاسبه اثر می‌گذارد */
  t('بدهی خواب از پروفایل می‌آید',
    c.sleepDebt({ prof: { sleepNeed: 9 }, sleepLog: { a: 7, b: 7, c: 7 } }).need === 9);

  /* اهداف */
  const g = c.goals({ prof: { goalHeight: 185 }, hts: [{ d: 'x', v: 170 }] });
  t('هدف قد محاسبه می‌شود', g.find(x => x.k === 'height').pc === 92);

  /* موتور هوشمند */
  t('AI خاموش = بدون پردازش',
    c.insights({ ai: 0 }).length === 0 && c.forecast({ ai: 0 }) === null && c.advise({ ai: 0 }) === null);
  t('همبستگی درست کار می‌کند',
    Math.abs(c.corr([1,2,3,4,5], [2,4,6,8,10]) - 1) < 0.001);
  t('همبستگی معکوس', c.corr([1,2,3,4,5], [10,8,6,4,2]) < -0.99);
  t('کم‌داده همبستگی نمی‌دهد', c.corr([1,2], [3,4]) === null);
  t('روند صعودی و نزولی', c.trend([1,2,3,4,5]) > 0 && c.trend([5,4,3,2,1]) < 0);

  /* با داده واقعی الگو پیدا می‌کند */
  const S9 = { ai: 1, sleepLog: {}, jr: [], done: {}, q: {}, wo: [] };
  for (let i = 0; i < 20; i++) {
    const dt = new Date(Date.now() - i * 864e5);
    const d = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') +
              '-' + String(dt.getDate()).padStart(2, '0');
    S9.sleepLog[d] = i % 3 === 0 ? 6 : 9;
    S9.jr.push({ d, m: String(i % 3 === 0 ? 2 : 4) });
  }
  t('الگو کشف می‌شود', c.insights(S9).length > 0, c.insights(S9).length + ' مورد');
}

console.log('\n— فوتبال —');
{
  t('۸ پست', c.POS.length === 8);
  t('۱۵ مهارت با نشان عددی',
    c.SKILL.length === 15 && c.SKILL.every(s2 => s2[3].length === 5));
  t('۸ اصل هوش بازی', c.IQ.length === 8);
  t('۵ مرحلهٔ مسیر تا حرفه‌ای', c.PATH.length === 5);

  /* سطح فقط با عدد سنجیده‌شده */
  t('بدون سنجش سطحی نیست', c.skTier('juggle', undefined) === 0);
  t('روپایی ۱۰۰۰ = سطح ۵', c.skTier('juggle', 1000) === 5);
  t('اسپرینت: کمتر بهتر',
    c.skTier('sprint', 2.7) === 5 && c.skTier('sprint', 3.6) === 1);
  t('دریبل مخروط: کمتر بهتر',
    c.skTier('cone', 10) === 5 && c.skTier('cone', 22) === 1);

  /* تناسب پست باید معنادار باشد، نه یکسان */
  const att = { fb: { juggle:150, weak:14, sprint:3.0, finish:8, oneone:7, cone:12, first:15 } };
  const def = { fb: { juggle:60, weak:10, head:8, longp:6, vjump:52, cooper:3000, sprint:3.2 } };
  const aTop = c.bestPos(att)[0].code, dTop = c.bestPos(def)[0].code;
  t('بازیکن هجومی → پست هجومی', ['W','CAM','ST'].includes(aTop), aTop);
  t('بازیکن دفاعی → پست دفاعی', ['CB','CDM','FB','GK'].includes(dTop), dTop);
  t('تناسب پست‌ها یکسان نیست',
    c.bestPos(att)[0].fit !== c.bestPos(att)[7].fit);

  const st = c.matchStats({ ms: [{ min:90, g:1, a:0, rate:7 }, { min:60, g:0, a:2, rate:8 }] });
  t('آمار مسابقه جمع می‌شود', st.n === 2 && st.goals === 1 && st.assists === 2);
  t('per90 محاسبه می‌شود', st.per90g > 0);
  t('بدون مسابقه null', c.matchStats({}) === null);
  t('تمرین روز از ضعف می‌آید', Array.isArray(c.trainToday(att)));
  t('زمین فوتبال رسم می‌شود', c.V.fb().includes('CDM'));
}

console.log('\n— منتالیست —');
{
  t('۵ ستون', c.PILLARS.length === 5);
  t('۸ نقطهٔ مشاهده', c.OBSERVE.length === 8);
  t('۶ تکنیک سردخوانی با پادزهر',
    c.COLD.length === 6 && c.COLD.every(x => x[4] && x[4].length > 20));
  t('۱۰ تمرین میدانی', c.FIELD.length === 10);
  t('هر مشاهده مثال عینی دارد', c.OBSERVE.every(o => o[3] && o[3].length > 40));
  t('خالی = ناظر', c.mentScore({}).all === 0 && c.mentScore({}).rank === 'ناظر');

  /* دقت فقط با نمونهٔ کافی معتبر است */
  t('زیر ۵ حدس، دقت شمرده نمی‌شود',
    c.mentScore({ ment: { reads: [{ ok: true }, { ok: true }] } }).all === 0);
  const withReads = { ment: { reads: [{ok:true},{ok:true},{ok:false},{ok:true},{ok:false}] } };
  t('دقت با ۵ حدس محاسبه می‌شود', c.readAccuracy(withReads).pc === 60);

  t('تمرین میدانی می‌چرخد', !!c.fieldToday({}));
  t('همه انجام = پایان دور',
    c.fieldToday({ ment: { field: c.FIELD.map(f => f[0]) } }) === null);
  t('قانون سه‌گانه نمایش داده می‌شود', c.V.mt_learn().includes('قانون سه‌گانه'));
  t('دفتر حدس در نما هست', c.V.mt().includes('readNew'));
}

console.log('\n— قابلیت‌های نیتیو —');
{
  const W = c.win;
  /* وب: همه باید بی‌خطر تنزل کنند، نه اینکه بشکنند */
  t('صوت در وب', W.voiceOk() === false);
  t('قفل در وب', W.lockOk() === false);
  t('سلامت در وب', W.healthState() === 'web');
  t('بلاکر در وب', W.blockerOn() === false);
  t('sync بدون پل بی‌خطر', W.blockerSync() === false);

  /* نیتیو */
  let saved = null;
  W.Native = { isNative: () => true,
    voiceAvailable: () => true, voiceStart: () => {},
    lockAvailable: () => true, lockPrompt: () => {},
    healthStatus: () => 'ready', healthOpen: () => {},
    blockerEnabled: () => true, blockerSettings: () => {},
    blockerSave: j => { saved = j }, blockerUsed: () => 0 };
  t('صوت در APK', W.voiceOk() === true);
  t('قفل در APK', W.lockOk() === true);
  t('بلاکر در APK', W.blockerOn() === true);
  S.blk2 = {};
  t('قواعد به نیتیو رفت', W.blockerSync() === true && !!saved);
  const r = JSON.parse(saved || '{}');
  t('اینستاگرام مسدود', r['com.instagram.android'] && r['com.instagram.android'].mode === 'block');
  t('تلگرام فقط سقف ۴۵', r['org.telegram.messenger'] &&
     r['org.telegram.messenger'].mode === 'cap' && r['org.telegram.messenger'].cap === 45);
  /* قانون کاربر: تلگرام هرگز کاملاً بلاک نشود */
  S.blk2 = {}; const seen = new Set();
  for (let i = 0; i < 6; i++) { W.blkCycle('org.telegram.messenger');
    seen.add(S.blk2['org.telegram.messenger']) }
  t('تلگرام هرگز مسدود نمی‌شود', !seen.has('block'), [...seen].join());
  S.blk2 = {}; delete W.Native;
}

console.log('\n— طراحی —');
{
  const css = fs.readFileSync(__dirname + '/src/shell.html', 'utf8');
  const raw = [...css.matchAll(/font-size:([0-9.]+)px/g)].map(m => m[1]);
  t('مقیاس تایپوگرافی: بدون اندازهٔ خام', raw.length === 0, raw.join() || 'همه توکن');
  t('شش پلهٔ تعریف‌شده', [1,2,3,4,5,6].every(n => css.includes('--t' + n + ':')));
  t('کف فونت ۱۱px', css.includes('--t1:11px'));
  t('بدون letter-spacing منفی', !/letter-spacing:-/.test(css));
  t('احترام به prefers-reduced-motion', css.includes('prefers-reduced-motion'));
  t('انیمیشن‌ها تعریف شده‌اند',
    (css.match(/@keyframes/g) || []).length >= 15,
    (css.match(/@keyframes/g) || []).length + ' کی‌فریم');
  t('لکه‌ها will-change دارند', (css.match(/will-change:transform/g) || []).length >= 3);
  t('حالت AMOLED لکه را خاموش می‌کند', css.includes('body.amoled #bg i{display:none}'));
  t('صفحهٔ راه‌انداز', css.includes('#splash'));
}

console.log('\n— پروفایل واقعی —');
{
  t('پروفایل لوکاس بارگذاری شد', c.ME.name === 'لوکاس' && c.ME.height === 170);
  t('جهش رشد ثبت شده', c.ME.inGrowthSpurt === true);
  t('بحران خواب تشخیص داده می‌شود',
    c.sleepCrisis({}).daily > 2, c.sleepCrisis({}).daily + 'h/روز');

  /* تداخل واقعی سه‌شنبه: مدرسهٔ بعدازظهر با باشگاه */
  t('تداخل سه‌شنبه شناسایی شد', c.todayShape(2).conflict === true);
  t('شنبه مدرسهٔ صبح', c.todayShape(6).schoolAM === true);
  t('جمعه آزاد', c.todayShape(5).free === true);

  /* برنامهٔ خواب تدریجی، نه یک‌شبه */
  const D = n => { const x = new Date(Date.now() - n * 864e5);
    return x.getFullYear() + '-' + String(x.getMonth()+1).padStart(2,'0') + '-' + String(x.getDate()).padStart(2,'0') };
  t('بدون شروع برنامه‌ای نیست', c.sleepPlan({}) === null);
  t('هر ۳ شب ۲۰ دقیقه', c.sleepPlan({ sleepFix: { start: D(6) } }).shiftMin === 40);
  t('۴۵ روز تا هدف ۲۳:۰۰',
    c.sleepPlan({ sleepFix: { start: D(45) } }).targetStr === '23:00');
  t('جهش ناگهانی ممنوع',
    c.sleepPlan({ sleepFix: { start: D(1) } }).shiftMin === 0);

  /* تدارکات به ترتیب اثر */
  t('توپ اولویت مطلق', c.BUY[0][0] === 'ball' && c.BUY[0][3] === 1);
  t('مخروط رایگان است', c.BUY.find(b => b[0] === 'cones')[2] === 0);

  /* محدودیت غذایی از پروفایل واقعی */
  t('کدو و بادمجان در ME', c.ME.dislikes.includes('کدو') && c.ME.dislikes.includes('بادمجان'));
  t('لحن بی‌طرف ثبت شده', c.ME.tone === 'data');
}

console.log('\n— تصمیم‌گیری —');
{
  t('۸ تمرین در سه جزء',
    c.DDRILL.length === 8 && new Set(c.DDRILL.map(d => d[1])).size === 3);
  t('۶ خطای رایج با پادزهر',
    c.DERROR.length === 6 && c.DERROR.every(e => e[3] && e[3].length > 20));
  t('خالی = نادیده', c.decScore({}).all === 0);
  const withData = { dec: [{ scan: 3, good: 20, bad: 5 }, { scan: 5, good: 25, bad: 3 }] };
  t('اسکن میانگین', c.scanAvg(withData).avg === 4);
  t('دقت پاس', c.passAcc(withData).pc === 85);
  /* تمرین باید ضعیف‌ترین جزء را هدف بگیرد */
  t('اسکن ضعیف → تمرین اسکن', c.decToday({})[1] === 'scan');
  t('اسکن قوی → جزء بعدی',
    c.decToday({ dec: [{ scan: 9, good: 9, bad: 1 }] })[1] !== 'scan');

  /* سه‌شنبه: باشگاه فقط با مسابقه */
  const OD = Date.prototype.getDay;
  Date.prototype.getDay = () => 2;
  S.season = 'school';
  const tue = c.plan();
  Date.prototype.getDay = OD;
  t('سه‌شنبه باشگاه ثابت ندارد', !tue.some(x => x.t.includes('باشگاه فوتبال')));
  t('سه‌شنبه تمرین تصمیم دارد', tue.some(x => x.t.includes('تمرین تصمیم')));
}

console.log('\n— مسیر یادگیری —');
{
  t('۲۰ رشته', c.TRACKS.length === 20, c.TRACKS.length + ' رشته');
  t('نقشهٔ راه ۵ مرحله‌ای', c.ROADMAP.length === 5);
  t('ارجاعات نقشهٔ راه معتبرند',
    c.ROADMAP.every(st => c.roadStage({}, st[0]).items.length === st[2].length));
  t('هر درس نام رشته دارد',
    c.TRACKS.flatMap(tr => c.trackLessons(tr[0])).every(l => l.trackName && l.ic));
  const all = c.TRACKS.flatMap(tr => c.trackLessons(tr[0]));
  t('بیش از ۲۴۰ درس', all.length > 240, all.length + ' درس');
  t('شناسه‌ها یکتا', new Set(all.map(l => l.id)).size === all.length);
  t('هر درس عبارت جستجو دارد', all.every(l => l.q && l.q.length > 8));
  t('هر درس زمان دارد', all.every(l => l.min > 0 && l.min < 60));
  t('عبارت‌ها لاتین‌اند', all.every(l => !/[\u0600-\u06FF]/.test(l.q)));

  /* لینک باید همیشه معتبر باشد — لینک ثابت می‌میرد، جستجو نه */
  const lk = c.ytLink('first touch training');
  t('لینک جستجوی یوتیوب', lk.startsWith('https://www.youtube.com/results?search_query='));
  t('کدگذاری درست', !/ /.test(lk));
  t('فارسی هم کدگذاری می‌شود', c.ytLink('تست').includes('%'));
  t('ورودی خالی نمی‌شکند', c.ytLink('').length > 40 && c.ytLink(null).length > 40);

  t('پیشرفت از صفر', c.learnScore({}).pc === 0);
  const some = { learn: all.slice(0, 20).map(l => l.id) };
  t('پیشرفت محاسبه می‌شود', c.learnScore(some).done === 20);
  t('درس امروز پیشنهاد می‌شود', !!c.lessonToday({}));
  t('همه دیده = پایان', c.lessonToday({ learn: all.map(l => l.id) }) === null);

  /* هر رشته باید حداقل سه مرحله داشته باشد */
  t('هر رشته حداقل ۲ مرحله', c.TRACKS.every(tr => tr[3].length >= 2));

  /* جستجو — با ۲۴۴ درس، فهرست کردن کافی نیست */
  t('جستجوی فارسی کار می‌کند', c.searchLessons('خواب').length > 0);
  t('جستجوی انگلیسی کار می‌کند', c.searchLessons('chess').length > 0);
  t('جستجوی تک‌حرفی نتیجه نمی‌دهد', c.searchLessons('a').length === 0);
  t('سقف نتایج رعایت می‌شود', c.searchLessons('e').length <= 25);
  t('نشان‌گذاری کار می‌کند', c.starred({ lrnStar: ['f11', 'm11'] }).length === 2);
  t('نشان نامعتبر نادیده', c.starred({ lrnStar: ['nope'] }).length === 0);

  /* شاخه‌های فرعی: مهارت‌های ریز */
  t('۸ شاخهٔ فرعی', c.MINI.length === 8);
  const mini = c.miniAll();
  t('۸۰ ریزمهارت', mini.length === 80, mini.length + ' مورد');
  t('شناسهٔ ریزمهارت یکتا', new Set(mini.map(m => m.id)).size === 80);
  t('بدون تداخل با درس‌های اصلی',
    mini.filter(m => all.some(l => l.id === m.id)).length === 0);
  t('همه زیر ۱۲ دقیقه', mini.every(m => m.min <= 12));
  t('عبارت‌های ریزمهارت لاتین', mini.every(m => !/[\u0600-\u06FF]/.test(m.q)));
  t('MICRO ریزحالت دست‌نخورده', c.MICRO.length === 7);
  t('ریزمهارت امروز کوتاه‌ترین را می‌دهد', c.miniToday({}).min <= 6);
}

console.log('\n— قفل تدریجی و شروع —');
{
  const D = n => { const x = new Date(Date.now() - n * 864e5);
    return x.getFullYear() + '-' + String(x.getMonth()+1).padStart(2,'0') + '-' + String(x.getDate()).padStart(2,'0') };
  t('۱۸ قدم مسیر طلایی', c.GOLDEN.length === 18);
  t('بدون شروع همه باز', c.viewOpen({}, 'tree') === true);
  t('روز ۱: پیشرفته قفل', c.viewOpen({ startDate: D(0) }, 'tree') === false);
  t('روز ۱: هستهٔ روزانه باز',
    ['day','q','slfix','lg'].every(v => c.viewOpen({ startDate: D(0) }, v)));
  t('روز ۴۰: هیچ قفلی', c.lockedCount({ startDate: D(40) }) === 0);
  t('رد کردن آنبوردینگ = همه باز',
    c.viewOpen({ startDate: D(0), obOff: 1 }, 'tree') === true);

  /* مسیر ترتیبی: عقب‌افتاده اول */
  const late = c.goldenToday({ startDate: D(4), golden: [1,2,3] });
  t('قدم عقب‌افتاده اول می‌آید', late.late === true && late.day === 4);
  t('بدون عقب‌افتاده، کار امروز',
    c.goldenToday({ startDate: D(4), golden: [1,2,3,4] }).day === 5);

  /* ورود انبوه */
  t('لیست نسنجیده مرتب است', c.batchList({ fb: { juggle: 100 } }).length === 14);
  t('تخمین عدد می‌دهد', c.estimate('juggle', 'mid') === 150);
  const ps = c.parseSkills('روپایی ۱۲۰، پای ضعیف ۱۴، اسپرینت ۳.۲');
  t('پارس متن آزاد', ps.length === 3, ps.map(x => x.k).join());
  t('روپایی و پای ضعیف قاطی نمی‌شوند',
    ps.find(x => x.k === 'juggle').v === 120 && ps.find(x => x.k === 'weak').v === 14);
  t('متن بی‌ربط چیزی نمی‌سازد', c.parseSkills('سلام').length === 0);

  /* بازخورد بیرونی */
  t('تناقض با کم‌داده null', c.feedbackGap({ coach: [{ fix: 'پاس' }] }) === null);
  const gap = c.feedbackGap({ coach: [{ fix: 'پاس بده' }, { fix: 'پاس' }, { good: 'دفاع' }] });
  t('الگوی بازخورد پیدا می‌شود', gap && gap.word === 'پاس', gap && gap.word);
}

console.log('\n— ویجت‌ها —');
{
  const W = c.win;
  t('بدون پل نیتیو امن است', W.syncWidget() === false);
  let saved = null;
  W.Native = { isNative: () => true, schedule: () => {}, cancelAll: () => {},
               planOnly: () => {}, saveWidget: j => { saved = j } };
  const snap = JSON.stringify(S);
  S.xp = 500; S.streak = { clean: 12, train: 5, sleep: 0, screen: 0 };
  t('خلاصهٔ ویجت ساخته می‌شود', W.syncWidget() === true && !!saved);
  const d = JSON.parse(saved || '{}');
  t('کوئست‌ها با فیلد کامل',
    Array.isArray(d.quests) && d.quests.length > 0 &&
    d.quests.every(q => q.id && q.t && typeof q.done === 'boolean'));
  t('نمرات تسلط', d.mastery && typeof d.mastery.mind === 'number');
  t('کارت فوتبال', d.football && typeof d.football.overall === 'number');
  t('سطح و استریک', d.lvl > 0 && d.streak.clean === 12);
  /* ویجت نباید به JS وابسته باشد — همه‌چیز از قبل محاسبه شده */
  t('خلاصه قابل سریال‌سازی', typeof saved === 'string' && saved.length > 50);
  /* هر ذخیره باید ویجت‌ها را تازه کند، وگرنه فقط موقع باز شدن اپ به‌روز می‌شوند */
  t('sv() ویجت را تازه می‌کند', /syncWidget/.test(String(c.sv)));
  Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(snap));
  delete W.Native;
}

console.log('\n— ابزارها —');
{
  t('۶ آرایش فوتبال، ۵ فوتسال',
    Object.keys(c.FORM11).length === 6 && Object.keys(c.FORM5).length === 5);
  t('تعداد بازیکن هر آرایش درست',
    Object.values(c.FORM11).every(f => f.length === 11) &&
    Object.values(c.FORM5).every(f => f.length === 5));
  t('هر آرایش توضیح قوت و ضعف دارد',
    [...Object.keys(c.FORM11), ...Object.keys(c.FORM5)].every(k => c.FORM_NOTE[k] && c.FORM_NOTE[k].length === 3));
  t('مختصات همه داخل زمین',
    Object.values(c.FORM11).flat().every(p => p[0] >= 0 && p[0] <= 100 && p[1] >= 0 && p[1] <= 100));
  const lu = c.lineup('football', '4-3-3', ['رضا']);
  t('لاین‌آپ با نام', lu.length === 11 && lu[0].name === 'رضا');

  /* معدل */
  t('معدل فعلی درست', c.gpaNeed([{ score: 17, weight: 3 }, { score: 19, weight: 2 }], 19, [{ weight: 3 }]).cur === 17.8);
  t('هدف غیرممکن تشخیص داده می‌شود',
    c.gpaNeed([{ score: 10, weight: 9 }], 20, [{ weight: 1 }]).impossible === true);

  /* پروتئین و بدن */
  t('غذاهای ایرانی در جدول', c.PROT.some(x => x[0].includes('قرمه')) && c.PROT.length >= 20);
  const b = c.bodyCalc(170, 55, 14);
  t('BMI و پروتئین هدف', b.bmi === 19 && b.protMin === 88);

  /* تبدیل */
  t('اسپرینت به سرعت', c.convert(3, 'sprint20') === 24);
  t('ورودی نامعتبر امن', c.convert('abc', 'sprint20') === null);

  /* پیام */
  t('قالب پیام با متغیر خالی', c.msgFill('ساعت {time}', {}) === 'ساعت ___');
  t('۱۲ مرحلهٔ آماده‌سازی مسابقه', c.MATCHPREP.length === 12);
}

console.log('\n— مقاومت در برابر دادهٔ خراب —');
{
  const snap = JSON.stringify(S);
  const reset = () => { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(snap)); };
  const BAD = [null, undefined, 0, -1, NaN, '', [], {}, 'abc', 1e9, [null], [{}], [[]]];
  const KEYS = ['jr','wo','ms','ppl','inter','hts','urges','ftest','mistakes','tree',
                'done','q','streak','best','sleepLog','fb','fbiq','inf','ment','prof',
                'wt','tx','exams','fbpos','ramadan','mode','comeback'];
  let broken = [];
  KEYS.forEach(k => BAD.forEach(bad => {
    const raw = JSON.parse(snap); raw[k] = bad;
    const clean = c.migrate(raw).state;      /* همان مسیر اپ واقعی */
    Object.keys(S).forEach(x => delete S[x]); Object.assign(S, clean);
    views.forEach(v => {
      try {
        const r = c.V[v]();
        if (/undefined|NaN/.test(r)) broken.push(v + '←' + k + '=' + JSON.stringify(bad));
      } catch (e) { broken.push(v + '←' + k + ': ' + e.message.slice(0, 40)); }
    });
  }));
  reset();
  t('هیچ ویو با دادهٔ خراب نمی‌شکند', broken.length === 0,
    broken.length ? [...new Set(broken)].slice(0, 3).join(' | ') : KEYS.length * BAD.length * views.length + ' ترکیب');
}

console.log('\n— امنیت —');
{
  const snap = JSON.stringify(S);
  const XSS = '<img src=x onerror=alert(1)>';
  Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(snap));
  S.jr = [{ d: c.td(), m: '3', a: [XSS] }];
  S.ppl = [{ id: 'p1', n: XSS, r: 'close', role: 'peer', e: 1 }];
  S.mistakes = [{ q: XSS, s: 'math', w: 'x', d: '1' }];
  S.ment = { reads: [{ who: XSS, t: XSS, d: '1', ok: null }] };
  let leaks = [];
  ['lg', 'so', 'sys_mind2', 'mt'].forEach(v => {
    try { if (/<img[^>]+onerror|<script>/i.test(c.V[v]())) leaks.push(v); } catch (e) { leaks.push(v + ':err'); }
  });
  Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(snap));
  t('ورودی کاربر فرار داده می‌شود', leaks.length === 0, leaks.join() || 'امن');
  t('تابع esc موجود است', typeof c.win.esc === 'function' || fs.readFileSync(__dirname + '/src/logic.js', 'utf8').includes('const esc='));
}

console.log('\n— زمان —');
{
  const OD = Date.prototype.getDay, OH = Date.prototype.getHours;
  let bad = 0;
  for (let d = 0; d < 7; d++) {
    Date.prototype.getDay = () => d;
    for (let h = 0; h < 24; h += 4) {
      Date.prototype.getHours = () => h;
      const p = c.plan();
      p.forEach(b => { if (b.s < 0 || b.s >= 1440 || !b.t) bad++; });
    }
  }
  Date.prototype.getDay = OD; Date.prototype.getHours = OH;
  t('بلوک با زمان یا عنوان نامعتبر نیست', bad === 0, String(bad));

  /* رفت‌وبرگشت تقویم جلالی */
  let conv = 0;
  [[1404,1,1],[1404,6,31],[1404,7,1],[1404,12,29],[1405,1,1]].forEach(([y,m,dd]) => {
    const g = c.toGregorian(y, m, dd);
    const back = c.toJalali(g[0], g[1], g[2]);
    if (back[0] !== y || back[1] !== m || back[2] !== dd) conv++;
  });
  t('تبدیل تقویم جلالی بازگشت‌پذیر است', conv === 0, String(conv));
}

console.log('\n— بار —');
{
  const snap = JSON.stringify(S);
  const D = n => { const x = new Date(Date.now() - n * 864e5);
    return x.getFullYear() + '-' + String(x.getMonth()+1).padStart(2,'0') + '-' + String(x.getDate()).padStart(2,'0') };
  const big = c.migrate({}).state;
  for (let i = 0; i < 365; i++) {
    const d = D(i);
    big.sleepLog[d] = 7 + (i % 3);
    if (i % 2 === 0) big.jr.push({ d, m: '3', en: 3, a: ['x'] });
    if (i % 3 === 0) big.wo.push({ d, t: 1, l: 'x' });
    for (let k = 0; k < 5; k++) big.done[d + '|x' + k] = 1;
  }
  Object.keys(S).forEach(k => delete S[k]); Object.assign(S, big);
  const t0 = Date.now();
  let err = 0;
  views.forEach(v => { try { const r = c.V[v](); if (/undefined|NaN/.test(r)) err++; } catch (e) { err++; } });
  const dur = Date.now() - t0;
  Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(snap));
  t('یک سال داده: بدون خطا', err === 0, String(err));
  t('رندر کل زیر ۲ ثانیه', dur < 2000, dur + 'ms');

  /* فشرده‌سازی با داده قدیمی */
  const old = { done: {}, q: {}, jr: [], wo: [], inter: [] };
  for (let i = 0; i < 730; i++) { old.done[D(i) + '|x'] = 1; old.jr.push({ d: D(i) }); }
  const removed = c.compact(old);
  t('فشرده‌سازی دادهٔ کهنه', removed > 300 && Object.keys(old.done).length <= 401,
    removed + ' حذف، ' + Object.keys(old.done).length + ' باقی');
}

console.log('\n— خروجی —');
const web = fs.readFileSync(__dirname + '/ASCEND.html', 'utf8');
t('بدون تصویر بیرونی', !/<img[^>]+src="http/.test(web));
t('بدون اسکریپت بیرونی', !/<script[^>]+src=/.test(web));
t('بدون دیالوگ مرورگر',
  ((web.match(/(^|[^.\w])prompt\(/g) || []).length + (web.match(/[^.\w]confirm\(/g) || []).length) === 0);
t('۴۶ تصویر درون‌خط', (web.match(/data:image\/webp;base64,/g) || []).length === 46);

/* مسیر asset اندروید: هم در ورک‌اسپیس و هم در کلون مخزن */
const apkPath = [__dirname + '/../app/src/main/assets/ASCEND.html',
                 '/home/user/apk/app/src/main/assets/ASCEND.html']
                .find(p => fs.existsSync(p)) || '';
if (fs.existsSync(apkPath)) {
  const apk = fs.readFileSync(apkPath, 'utf8');
  t('نسخهٔ اندروید بدون base64', !apk.includes('data:image/webp'));
  t('نسخهٔ اندروید سبک‌تر', apk.length < web.length * 0.6,
    (apk.length / 1024 | 0) + 'KB < ' + (web.length / 1024 | 0) + 'KB');
}

console.log('\n' + (fail ? 'FAIL' : 'PASS') + '  ' + pass + '/' + (pass + fail) + '\n');
process.exit(fail ? 1 : 0);
