package ir.ascend.app

import android.accessibilityservice.AccessibilityService
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.view.accessibility.AccessibilityEvent
import org.json.JSONObject

/**
 * بلاکر اپ‌های مضر.
 *
 * چرا Accessibility و نه VpnService:
 * VpnService فقط ترافیک شبکه را می‌بیند و با DNS رمزگذاری‌شده یا اپ‌های
 * آفلاین کاری از پیش نمی‌برد. Accessibility می‌فهمد کدام اپ جلوی چشم است
 * و می‌تواند فوراً بیرونش کند — قابل اتکاتر و بدون دست زدن به شبکه.
 *
 * محدودیت صادقانه: کاربر هر لحظه می‌تواند از تنظیمات خاموشش کند.
 * این یک مانع اصطکاکی است، نه قفل. برای چیزی که خودت خواسته‌ای کافی است.
 */
class Blocker : AccessibilityService() {

    private var lastPkg = ""
    private var lastAt = 0L

    override fun onServiceConnected() {
        super.onServiceConnected()
        running = true
    }

    override fun onDestroy() {
        running = false
        super.onDestroy()
    }

    override fun onAccessibilityEvent(e: AccessibilityEvent?) {
        if (e == null || e.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
        val pkg = e.packageName?.toString() ?: return
        if (pkg == packageName) return

        val now = System.currentTimeMillis()
        /* ضد اسپم: همان اپ در دو ثانیه دوباره بررسی نشود */
        if (pkg == lastPkg && now - lastAt < 2000) return
        lastPkg = pkg; lastAt = now

        val rule = ruleFor(this, pkg) ?: return

        when (rule.mode) {
            "block" -> bounce(pkg)
            "cap" -> {
                val used = usedToday(this, pkg)
                if (used >= rule.capMin) bounce(pkg)
                else mark(this, pkg)
            }
        }
    }

    /** بیرون انداختن از اپ: بازگشت به صفحهٔ اصلی */
    private fun bounce(pkg: String) {
        try {
            performGlobalAction(GLOBAL_ACTION_HOME)
            android.widget.Toast.makeText(
                this,
                "این اپ الان مسدود است",
                android.widget.Toast.LENGTH_SHORT
            ).show()
        } catch (e: Exception) { }
    }

    override fun onInterrupt() { }

    data class Rule(val mode: String, val capMin: Int)

    companion object {
        @Volatile var running = false

        /** آیا سرویس در تنظیمات فعال شده؟ */
        fun enabled(ctx: Context): Boolean = try {
            val flat = Settings.Secure.getString(
                ctx.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES) ?: ""
            val me = ComponentName(ctx, Blocker::class.java).flattenToString()
            flat.split(':').any { it.equals(me, true) }
        } catch (e: Exception) { false }

        fun openSettings(act: Context) {
            try {
                act.startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            } catch (e: Exception) { }
        }

        /**
         * قواعد از موتور وب می‌آیند و در SharedPreferences ذخیره می‌شوند.
         * قالب: {"com.instagram.android":{"mode":"block"},
         *        "org.telegram.messenger":{"mode":"cap","cap":45}}
         */
        fun saveRules(ctx: Context, json: String) {
            ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
                .edit().putString("blockRules", json).apply()
        }

        private fun ruleFor(ctx: Context, pkg: String): Rule? {
            return try {
                val raw = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
                    .getString("blockRules", "") ?: ""
                if (raw.isEmpty()) return null
                val o = JSONObject(raw).optJSONObject(pkg) ?: return null
                Rule(o.optString("mode", "block"), o.optInt("cap", 45))
            } catch (e: Exception) { null }
        }

        /* --- شمارش زمان مصرف: هر بازدید ≈ ۱ دقیقه، تخمینی ولی کافی --- */
        private fun key(pkg: String): String {
            val c = java.util.Calendar.getInstance()
            return "use_" + c.get(java.util.Calendar.YEAR) +
                   c.get(java.util.Calendar.DAY_OF_YEAR) + "_" + pkg
        }

        fun usedToday(ctx: Context, pkg: String): Int =
            ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
               .getInt(key(pkg), 0)

        private fun mark(ctx: Context, pkg: String) {
            val p = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
            p.edit().putInt(key(pkg), p.getInt(key(pkg), 0) + 1).apply()
        }
    }
}
