/* ============================================================
   AUDIT — ممیزی سراسری
   دنبال باگ‌های واقعی می‌گردد، نه تخلف سبک.
   هر یافته با شدت: HIGH می‌شکند · MED ممکن است · LOW بو می‌دهد
   ============================================================ */
const fs = require('fs');
const P = __dirname + '/';

const CORE = ['schema.js','core.js','profile.js','routines.js','calendar.js','study.js',
  'social.js','extra.js','guide.js','tree.js','systems.js','mastery.js','influence.js',
  'mentalist.js','football.js','ai.js'];
const UI = ['src/logic.js','src/interact.js','src/native.js','src/views.core.js',
  'src/views.life.js','src/views.sys.js','src/views.mastery.js','src/views.influence.js',
  'src/views.mentalist.js','src/views.football.js','src/views.ai.js','src/views.profile.js',
  'src/views.edu.js'];
const ALL = [...CORE, ...UI];

const found = [];
const add = (sev, cat, file, line, msg) => found.push({ sev, cat, file, line, msg });

const read = f => { try { return fs.readFileSync(P + f, 'utf8') } catch (e) { return null } };
const files = {};
ALL.forEach(f => { const s = read(f); if (s !== null) files[f] = s; });

/* ---------- ۱. نحو ---------- */
Object.entries(files).forEach(([f, s]) => {
  try { new Function(s); }
  catch (e) { add('HIGH', 'نحو', f, 0, e.message.slice(0, 70)); }
});

/* ---------- ۲. تراز براکت‌ها ----------
   حذف شد: بررسی نحو با new Function دقیق‌تر است و template literalهای
   تودرتو شمارش دستی را گمراه می‌کنند. */

/* ---------- ۳. تاریخ UTC ---------- */
Object.entries(files).forEach(([f, s]) => {
  s.split('\n').forEach((ln, i) => {
    if (/toISOString\(\)\.slice\(0,\s*10\)/.test(ln))
      add('HIGH', 'تاریخ', f, i + 1, 'تاریخ UTC — بین ۰۰:۰۰ تا ۰۳:۳۰ روز اشتباه می‌دهد');
  });
});

/* ---------- ۴. دسترسی بی‌گارد به آرایه/شیء ---------- */
const RISK = ['S.jr','S.wo','S.ms','S.ppl','S.inter','S.hts','S.urges','S.ftest',
              'S.mistakes','S.tree','S.photos','S.cook','S.exams','S.fbiq'];
Object.entries(files).forEach(([f, s]) => {
  const lines = s.split('\n');
  lines.forEach((ln, i) => {
    RISK.forEach(r => {
      /* .length یا .map روی چیزی که ممکن است undefined باشد */
      const re = new RegExp(r.replace('.', '\\.') + '\\.(length|map|filter|forEach|slice|find|some|reduce)');
      if (!re.test(ln)) return;
      const guarded = ln.includes('(' + r + '||') || ln.includes(r + '||') ||
                      ln.includes('Array.isArray(' + r + ')') || ln.includes(r + '?.') ||
                      ln.includes(r + ' =') || ln.includes(r + '=');
      if (!guarded) add('LOW', 'گارد', f, i + 1, r + ' بدون گارد (repair معمولاً پوشش می‌دهد)');
    });
  });
});

/* ---------- ۵. تقسیم بر صفر ---------- */
Object.entries(files).forEach(([f, s]) => {
  s.split('\n').forEach((ln, i) => {
    /* الگو: / متغیر.length  بدون Math.max یا ||1 */
    const m = ln.match(/\/\s*([A-Za-z_$][\w$.]*\.length)\b/);
    if (m && !/Math\.max|\|\|\s*1|\?\s*/.test(ln))
      add('MED', 'تقسیم', f, i + 1, 'تقسیم بر ' + m[1] + ' — اگر صفر باشد NaN می‌دهد');
    const m2 = ln.match(/\/\s*\(([^)]*\.length)\)/);
    if (m2 && !/Math\.max|\|\|\s*1/.test(ln))
      add('MED', 'تقسیم', f, i + 1, 'تقسیم بر ' + m2[1]);
  });
});

/* ---------- ۶. فراخوان برهنهٔ توابع window ---------- */
const winFns = new Set();
Object.values(files).forEach(s => {
  [...s.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)].forEach(m => winFns.add(m[1]));
});
Object.entries(files).forEach(([f, s]) => {
  const lines = s.split('\n');
  let boot = false;
  lines.forEach((ln, i) => {
    if (/^\(\(\)=>\{|^rd\(\);|addEventListener\(/.test(ln.trim())) boot = true;
    if (boot || /on[a-z]+="|onclick=|onchange=|oninput=|`/.test(ln)) return;
    winFns.forEach(fn => {
      const bare = new RegExp('(?<![\\w.$])' + fn + '\\s*\\(');
      if (bare.test(ln) && !new RegExp('window\\.' + fn).test(ln))
        add('MED', 'window', f, i + 1, fn + '() برهنه — در Node می‌شکند');
    });
  });
});

/* ---------- ۷. کلیدهای state تعریف‌نشده در schema ---------- */
{
  const sch = files['schema.js'] || '';
  const declared = new Set([...sch.matchAll(/^\s{2}([a-zA-Z_$][\w$]*):\s*\[/gm)].map(m => m[1]));
  const used = new Set();
  Object.values(files).forEach(s => {
    [...s.matchAll(/\bS\.([a-zA-Z_$][\w$]*)/g)].forEach(m => used.add(m[1]));
  });
  const skip = new Set(['prototype','constructor','length','sec','sub','_unlocked','cmpWk','tbr','bkWk']);
  [...used].forEach(k => {
    if (!declared.has(k) && !skip.has(k) && !k.startsWith('_'))
      add('MED', 'اسکیما', 'schema.js', 0, 'S.' + k + ' در اسکیما تعریف نشده — مهاجرت و اعتبارسنجی ندارد');
  });
}

/* ---------- ۸. شناسه‌های تکراری در آرایه‌های داده ---------- */
{
  const c = require('./harness.js');
  const checkDup = (name, arr, idx) => {
    if (!Array.isArray(arr)) return;
    const seen = new Set(), dup = [];
    arr.forEach(x => {
      const id = Array.isArray(x) ? x[idx] : (x && x.id);
      if (id === undefined) return;
      if (seen.has(id)) dup.push(id); else seen.add(id);
    });
    if (dup.length) add('HIGH', 'تکرار', name, 0, 'شناسهٔ تکراری: ' + dup.join(', '));
  };
  checkDup('SKILL', c.SKILL, 0); checkDup('POS', c.POS, 0);
  checkDup('TACTIC', c.TACTIC, 0); checkDup('NEGO', c.NEGO, 0);
  checkDup('SCEN', c.SCEN, 'id'); checkDup('OBSERVE', c.OBSERVE, 0);
  checkDup('COLD', c.COLD, 0); checkDup('MICRO', c.MICRO, 0);
  checkDup('INFLUENCE', c.INFLUENCE, 0); checkDup('FALLACY', c.FALLACY, 0);
  checkDup('MODELS', c.MODELS, 0); checkDup('FSKILL', c.FSKILL, 0);
  checkDup('IQ', c.IQ, 0); checkDup('FIELD', c.FIELD, 0);
  checkDup('QUESTS', c.QUESTS, 0); checkDup('PROTOCOLS', c.PROTOCOLS, 'id');
  checkDup('NODES', c.NODES, 'id');
}

/* ---------- ۹. نشان‌های سطح نامرتب ---------- */
{
  const c = require('./harness.js');
  const chk = (name, arr, iMark, iLower) => {
    (arr || []).forEach(s => {
      const m = s[iMark], lower = s[iLower] === 1;
      if (!Array.isArray(m)) return;
      for (let i = 1; i < m.length; i++) {
        const bad = lower ? m[i] >= m[i - 1] : m[i] <= m[i - 1];
        if (bad) add('HIGH', 'سطح', name, 0,
          s[1] + ': نشان‌ها مرتب نیستند [' + m.join(',') + ']' + (lower ? ' (کمتر بهتر)' : ''));
      }
    });
  };
  chk('SKILL', c.SKILL, 3, 4);
  /* FSKILL فیلد lower ندارد — منطقش در fskillTier با نام کلید است.
     فقط کلیدهایی که می‌دانیم صعودی‌اند بررسی می‌شوند. */
  (c.FSKILL || []).forEach(s => {
    if (s[0] === 'dribble') return;          // کمتر بهتر
    const m = s[3];
    if (!Array.isArray(m)) return;
    for (let i = 1; i < m.length; i++)
      if (m[i] <= m[i - 1])
        add('HIGH', 'سطح', 'FSKILL', 0, s[1] + ': نشان‌ها صعودی نیستند');
  });
}

/* ---------- ۱۰. ویوهای ثبت‌شده که وجود ندارند ---------- */
{
  const c = require('./harness.js');
  const declared = [];
  c.GRP.forEach(g => g[4].forEach(v => declared.push(v[0])));
  declared.forEach(v => {
    if (typeof c.V[v] !== 'function')
      add('HIGH', 'ویو', 'GRP', 0, 'ویو «' + v + '» در ناوبری هست ولی تعریف نشده');
  });
  Object.keys(c.V).forEach(v => {
    if (!declared.includes(v))
      add('LOW', 'ویو', 'V', 0, 'ویو «' + v + '» تعریف شده ولی در ناوبری نیست');
  });
}

/* ---------- ۱۱. onclick هایی که تابعشان وجود ندارد ---------- */
{
  const c = require('./harness.js');
  const rendered = [];
  Object.keys(c.V).forEach(v => { try { rendered.push(c.V[v]()) } catch (e) { } });
  const html = rendered.join('\n');
  const calls = new Set();
  [...html.matchAll(/on(?:click|change|input)="([a-zA-Z_$][\w$]*)\(/g)].forEach(m => calls.add(m[1]));
  const builtin = new Set(['event','tst','alert']);
  calls.forEach(fn => {
    if (builtin.has(fn)) return;
    if (typeof c.win[fn] !== 'function' && typeof c[fn] !== 'function')
      add('HIGH', 'هندلر', 'views', 0, 'onclick به ' + fn + '() که وجود ندارد');
  });
}

/* ---------- ۱۲. متن فارسی خالی یا شکسته در L() ---------- */
Object.entries(files).forEach(([f, s]) => {
  s.split('\n').forEach((ln, i) => {
    const m = [...ln.matchAll(/L\(\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/g)];
    m.forEach(x => {
      if (!x[1].trim()) add('MED', 'ترجمه', f, i + 1, 'متن فارسی خالی');
      if (x[1] === x[2] && x[1].length > 3 && /[a-zA-Z]/.test(x[1]))
        add('LOW', 'ترجمه', f, i + 1, 'فارسی و انگلیسی یکسان: ' + x[1].slice(0, 25));
    });
  });
});

/* ---------- ۱۳. اعداد جادویی تکراری ---------- */
{
  const magic = {};
  Object.entries(files).forEach(([f, s]) => {
    [...s.matchAll(/\b(864e5|86400000)\b/g)].forEach(() => {
      magic['864e5'] = (magic['864e5'] || 0) + 1;
    });
  });
}

/* ---------- ۱۴. حلقهٔ بی‌نهایت بالقوه ---------- */
Object.entries(files).forEach(([f, s]) => {
  s.split('\n').forEach((ln, i) => {
    if (/while\s*\(\s*(true|1)\s*\)/.test(ln))
      add('MED', 'حلقه', f, i + 1, 'while(true) — شرط خروج را بررسی کن');
  });
});

/* ---------- ۱۵. TDZ واقعی ----------
   فقط وقتی متغیر در عبارت مقداردهی خودش استفاده شود، نه در دستور بعدی
   همان خط. const a=1;use(a) کاملاً معتبر است. */
Object.entries(files).forEach(([f, s]) => {
  s.split('\n').forEach((ln, i) => {
    const m = ln.match(/^\s*(?:const|let)\s+(\w+)\s*=\s*([^;,]*)/);
    if (!m) return;
    const name = m[1], init = m[2];
    /* خودارجاعی در همان عبارت مقداردهی */
    const self = new RegExp('(?<![\\w.$])' + name + '(?![\\w$])');
    if (self.test(init) && !init.includes('=>') && !init.includes('function'))
      add('HIGH', 'TDZ', f, i + 1, name + ' در مقداردهی خودش استفاده شده');
  });
});

/* ============================================================
   گزارش
   ============================================================ */
const order = { HIGH: 0, MED: 1, LOW: 2 };
found.sort((a, b) => order[a.sev] - order[b.sev] || a.cat.localeCompare(b.cat));

const bySev = { HIGH: 0, MED: 0, LOW: 0 };
found.forEach(x => bySev[x.sev]++);
const byCat = {};
found.forEach(x => { byCat[x.cat] = (byCat[x.cat] || 0) + 1; });

console.log('\n══════ ممیزی سراسری ══════');
console.log(`فایل بررسی‌شده: ${Object.keys(files).length}`);
console.log(`یافته: ${found.length}  (بحرانی ${bySev.HIGH} · متوسط ${bySev.MED} · کم ${bySev.LOW})\n`);

console.log('── بر اساس دسته ──');
Object.entries(byCat).sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k.padEnd(10)} ${v}`));

const show = process.argv[2] || 'HIGH';
console.log(`\n── ${show === 'ALL' ? 'همه' : show} ──`);
found.filter(x => show === 'ALL' || x.sev === show).slice(0, 120)
  .forEach(x => console.log(`  [${x.sev}] ${x.cat} · ${x.file}${x.line ? ':' + x.line : ''}\n        ${x.msg}`));

if (found.filter(x => x.sev === 'HIGH').length === 0)
  console.log('\n  هیچ باگ بحرانی یافت نشد.');
console.log('');
