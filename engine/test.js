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
t('۳۱ ویو / ۶ گروه', views.length === 31 && c.GRP.length === 6);
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
