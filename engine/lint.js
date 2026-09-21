/* بررسی ایستا بدون وابستگی خارجی.
   الگوهایی را می‌گیرد که در این پروژه واقعاً باگ ساخته‌اند. */
const fs = require('fs');
const P = __dirname + '/';
const UI = ['src/logic.js', 'src/views.core.js', 'src/views.life.js',
            'src/views.sys.js', 'src/views.edu.js'];
const CORE = ['schema.js', 'core.js', 'routines.js', 'calendar.js', 'study.js',
              'social.js', 'extra.js', 'guide.js', 'tree.js', 'systems.js'];

let problems = 0;
const flag = (file, line, msg) => {
  problems++;
  console.log(`  ${file}:${line}  ${msg}`);
};

const all = [...UI, ...CORE].map(f => ({ f, src: fs.readFileSync(P + f, 'utf8') }));
const joined = all.map(x => x.src).join('\n');

/* ۱. توابعی که با window. تعریف شده‌اند ولی برهنه صدا زده می‌شوند.
      در مرورگر کار می‌کند، در Node نه — سه بار باگ ساخته. */
console.log('\n— فراخوان برهنهٔ توابع window —');
const winFns = new Set([...joined.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)].map(m => m[1]));
all.forEach(({ f, src }) => {
  const lines = src.split('\n');
  let inBootstrap = false;
  lines.forEach((ln, i) => {
    if (/^\(\(\)=>\{|^rd\(\);|addEventListener\('visibilitychange'/.test(ln.trim())) inBootstrap = true;
    // داخل رشتهٔ HTML، هندلر، یا بلوک bootstrap — مرورگر خودش resolve می‌کند
    if (/onclick=|onchange=|oninput=|oncontextmenu=|`/.test(ln)) return;
    if (inBootstrap) return;
    winFns.forEach(fn => {
      const bare = new RegExp('(?<![\\w.$])' + fn + '\\s*\\(');
      if (!bare.test(ln)) return;
      if (new RegExp('window\\.' + fn).test(ln)) return;
      if (new RegExp('window\\.\\w+\\s*=\\s*\\w*\\s*=>\\s*' + fn + '\\(').test(ln)) return;
      flag(f, i + 1, `${fn}() برهنه صدا زده شده — window.${fn}() بنویس`);
    });
  });
});

/* ۲. تاریخ UTC به‌جای محلی */
console.log('\n— تاریخ UTC —');
all.forEach(({ f, src }) => {
  src.split('\n').forEach((ln, i) => {
    if (/toISOString\(\)\.slice\(0,\s*10\)/.test(ln))
      flag(f, i + 1, 'تاریخ UTC — از dstr() یا td() استفاده کن');
  });
});

/* ۳. دیالوگ بومی مرورگر */
console.log('\n— دیالوگ مرورگر —');
all.forEach(({ f, src }) => {
  src.split('\n').forEach((ln, i) => {
    if (/(^|[^.\w])(alert|confirm|prompt)\s*\(/.test(ln))
      flag(f, i + 1, 'دیالوگ بومی — از ask() استفاده کن');
  });
});

/* ۴. دسترسی بدون گارد به کلیدهای تودرتوی state */
console.log('\n— دسترسی بی‌گارد به state —');
const risky = ['S.mode.', 'S.ramadan.', 'S.comeback.'];
all.forEach(({ f, src }) => {
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    risky.forEach(r => {
      if (!ln.includes(r)) return;
      const base = r.slice(0, -1);                       // مثل S.mode
      const ctx = lines.slice(Math.max(0, i - 4), i + 1).join(' ');
      // محافظ‌های رایج: S.x&&  /  S.x?  /  S.x?.  /  if(S.x)  /  S.x!==null
      const guarded = new RegExp(base.replace(/\./g, '\\.') + '\\s*(&&|\\?|\\)|!==|!=)').test(ctx)
        || ctx.includes(base + '?.')
        || new RegExp('\\b(if|return)\\s*\\(?[^)]*' + base.replace(/\./g, '\\.')).test(ctx)
        || /ramActive\(\)|modeToday\(\)|S\.comeback\?/.test(ctx);
      if (!guarded) flag(f, i + 1, `${r} بدون گارد — ممکن است null باشد`);
    });
  });
});

/* ۵. نحو همهٔ فایل‌ها */
console.log('\n— نحو —');
[...CORE, 'harness.js', 'test.js'].forEach(f => {
  try { new Function(fs.readFileSync(P + f, 'utf8')); }
  catch (e) { flag(f, 0, 'خطای نحوی: ' + e.message.slice(0, 60)); }
});

console.log('\n' + (problems ? `${problems} مورد` : 'تمیز') + '\n');
process.exit(problems > 0 ? 1 : 0);
