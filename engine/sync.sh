#!/bin/bash
# همگام‌سازی موتور وب با پوشهٔ engine در پروژهٔ APK
#   bash sync.sh
set -e
cd "$(dirname "$0")"

node lint.js
bash build.sh
bash build.sh apk
node test.js

DEST=../apk/engine
mkdir -p "$DEST/src"
cp *.js *.css *.sh *.json "$DEST/" 2>/dev/null || true
cp src/* "$DEST/src/"
cp README.md "$DEST/" 2>/dev/null || true
rm -f "$DEST/ASCEND.html"
echo "engine/ همگام شد — $(ls $DEST/*.js | wc -l) ماژول + $(ls $DEST/src | wc -l) فایل رابط"
