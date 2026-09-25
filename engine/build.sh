#!/bin/bash
# بیلد اپ تک‌فایلی از ماژول‌های src/
#   bash build.sh        → نسخهٔ وب (تصاویر درون‌خط، کاملاً خودکفا)
#   bash build.sh apk    → نسخهٔ اندروید (تصاویر از assets/ig، سه برابر سبک‌تر)
set -e
cd "$(dirname "$0")"
MODE="${1:-web}"

MODE="$MODE" python3 - <<'PYEOF'
import os, re, sys

mode = os.environ.get('MODE', 'web')

# ماژول‌های منطق — ترتیب مهم است (وابستگی‌ها اول)
CORE = ['schema.js', 'core.js', 'profile.js', 'me.js', 'mastery.js', 'influence.js', 'mentalist.js', 'football.js', 'decision.js', 'tools.js', 'unlock.js', 'learn.js', 'ai.js', 'routines.js', 'calendar.js', 'study.js',
        'social.js', 'extra.js', 'guide.js', 'img.js', 'tree.js', 'systems.js']

# لایهٔ رابط — از src/ به ترتیب
UI = ['src/logic.js', 'src/interact.js', 'src/native.js', 'src/views.core.js',
      'src/views.life.js', 'src/views.sys.js', 'src/views.mastery.js', 'src/views.influence.js', 'src/views.mentalist.js', 'src/views.football.js', 'src/views.decision.js', 'src/views.tools.js', 'src/views.unlock.js', 'src/views.learn.js', 'src/views.ai.js', 'src/views.profile.js', 'src/views.me.js', 'src/views.edu.js']

def read(p):
    if not os.path.exists(p):
        sys.exit('فایل گم شده: ' + p)
    return open(p, encoding='utf-8').read()

# تصاویر: در اندروید فقط کلید، در وب base64 کامل
def img_module():
    src = read('img.js')
    if mode != 'apk':
        return src
    keys = re.findall(r"'([a-z_0-9]+)':'data:image/webp", src)
    if not keys:
        sys.exit('هیچ کلید تصویری در img.js پیدا نشد')
    return ("/* تصاویر در assets/ig/ — imgSrc() مسیرشان را می‌سازد */\n"
            "const IMG={" + ",".join("'%s':1" % k for k in keys) + "};\n"
            "if(typeof module!=='undefined')module.exports={IMG};")

core_src = '\n'.join(img_module() if m == 'img.js' else read(m) for m in CORE)
ui_src   = '\n'.join(read(p) for p in UI)

html = read('src/shell.html')

# اسلات‌های صریح — اگر نبودند بیلد با خطا متوقف می‌شود، نه بی‌صدا
for slot, content in (('/*FONT*/', read('font.css')),
                      ('/*CORE*/', core_src)):
    if slot not in html:
        sys.exit('اسلات پیدا نشد: ' + slot)
    html = html.replace(slot, content, 1)

# لایهٔ رابط به انتهای shell اضافه می‌شود (shell با <script> باز تمام می‌شود)
html += ui_src + '\n</script>\n' + read('src/tail.html')

if mode == 'web':
    out = 'ASCEND.html'
else:
    out = None
    for cand in ('../apk/app/src/main/assets', '../app/src/main/assets'):
        if os.path.isdir(cand):
            out = cand + '/ASCEND.html'
            break
    if out is None:
        os.makedirs('../app/src/main/assets', exist_ok=True)
        out = '../app/src/main/assets/ASCEND.html'

open(out, 'w', encoding='utf-8').write(html)
print('%-4s %-48s %d KB' % (mode, out, len(html) // 1024))
PYEOF

[ "$MODE" = "web" ] && echo "برای نسخهٔ اندروید:  bash build.sh apk" || true
