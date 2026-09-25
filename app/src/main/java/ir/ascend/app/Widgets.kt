package ir.ascend.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject

/**
 * ویجت‌های صفحهٔ اصلی.
 *
 * هیچ‌کدام JS اجرا نمی‌کنند — موتور وب خلاصه را در widgetData ذخیره می‌کند
 * و ویجت‌ها فقط می‌خوانند. پس ویجت به باز بودن اپ وابسته نیست.
 */
object Widgets {

    private fun data(ctx: Context): JSONObject? = try {
        val raw = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
            .getString("widgetData", "") ?: ""
        if (raw.isEmpty()) null else JSONObject(raw)
    } catch (e: Exception) { null }

    /** عدد فارسی */
    fun fa(n: Any?): String {
        val d = charArrayOf('۰','۱','۲','۳','۴','۵','۶','۷','۸','۹')
        return n.toString().map { if (it.isDigit()) d[it - '0'] else it }.joinToString("")
    }

    private fun openApp(ctx: Context, req: Int): PendingIntent =
        PendingIntent.getActivity(ctx, req,
            Intent(ctx, MainActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

    /** همهٔ ویجت‌ها را تازه می‌کند */
    fun refreshAll(ctx: Context) {
        val mgr = AppWidgetManager.getInstance(ctx) ?: return
        listOf(Widget::class.java, QuestWidget::class.java, StatWidget::class.java,
               SleepWidget::class.java, MiniWidget::class.java, BallWidget::class.java)
            .forEach { cls ->
                try {
                    val ids = mgr.getAppWidgetIds(ComponentName(ctx, cls)) ?: return@forEach
                    if (ids.isEmpty()) return@forEach
                    val i = Intent(ctx, cls).apply {
                        action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                        putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                    }
                    ctx.sendBroadcast(i)
                } catch (e: Exception) { }
            }
    }

    /* ---------- کوئست ---------- */
    fun renderQuest(ctx: Context, mgr: AppWidgetManager, id: Int) {
        val v = RemoteViews(ctx.packageName, R.layout.w_quest)
        val d = data(ctx)
        val qs = d?.optJSONArray("quests") ?: JSONArray()
        var done = 0
        for (i in 0 until qs.length()) if (qs.optJSONObject(i)?.optBoolean("done") == true) done++
        val total = qs.length()

        v.setTextViewText(R.id.q_count, if (total > 0) "${fa(done)}/${fa(total)}" else "")
        v.setProgressBar(R.id.q_bar, 100, if (total > 0) done * 100 / total else 0, false)

        /* ListView به RemoteViewsService نیاز دارد که برای این حجم داده
           اضافی است. ردیف‌ها را مستقیم می‌سازیم — پایدارتر و سبک‌تر. */
        v.removeAllViews(R.id.q_list)
        var shown = 0
        for (i in 0 until qs.length()) {
            if (shown >= 5) break
            val q = qs.optJSONObject(i) ?: continue
            val isDone = q.optBoolean("done")
            /* اول ناتمام‌ها */
            if (isDone && shown < 4) continue
            val row = RemoteViews(ctx.packageName, R.layout.w_quest_row)
            row.setTextViewText(R.id.qr_mark, if (isDone) "✓" else "○")
            row.setTextViewText(R.id.qr_text, q.optString("t", ""))
            row.setTextViewText(R.id.qr_xp, "+" + fa(q.optInt("xp", 0)))
            if (isDone) {
                row.setInt(R.id.qr_root, "setBackgroundResource", R.drawable.w_chip_on)
                row.setTextColor(R.id.qr_text, 0xFF000000.toInt())
                row.setTextColor(R.id.qr_mark, 0xFF000000.toInt())
                row.setTextColor(R.id.qr_xp, 0xFF444444.toInt())
            }
            /* کلیک روی ردیف: اپ را روی تب کوئست باز کن */
            row.setOnClickPendingIntent(R.id.qr_root, openApp(ctx, 210 + i))
            v.addView(R.id.q_list, row)
            shown++
        }
        if (shown == 0) {
            val row = RemoteViews(ctx.packageName, R.layout.w_quest_row)
            row.setTextViewText(R.id.qr_mark, "◦")
            row.setTextViewText(R.id.qr_text,
                if (total == 0) "اپ را باز کن" else "همه انجام شد")
            row.setTextViewText(R.id.qr_xp, "")
            v.addView(R.id.q_list, row)
        }
        v.setOnClickPendingIntent(R.id.q_root, openApp(ctx, 200))
        mgr.updateAppWidget(id, v)
    }

    /* ---------- آمار ---------- */
    fun renderStat(ctx: Context, mgr: AppWidgetManager, id: Int) {
        val v = RemoteViews(ctx.packageName, R.layout.w_stat)
        val d = data(ctx)
        val m = d?.optJSONObject("mastery")
        val st = d?.optJSONObject("streak")

        v.setTextViewText(R.id.s_lvl, "سطح " + fa(d?.optInt("lvl", 1) ?: 1))
        v.setTextViewText(R.id.s_xp, fa(d?.optInt("xp", 0) ?: 0) + " XP")
        v.setTextViewText(R.id.s_mind, fa(m?.optInt("mind", 0) ?: 0))
        v.setTextViewText(R.id.s_body, fa(m?.optInt("body", 0) ?: 0))
        v.setTextViewText(R.id.s_look, fa(m?.optInt("look", 0) ?: 0))

        val parts = mutableListOf<String>()
        st?.optInt("clean", 0)?.let { if (it > 0) parts.add("پاکی " + fa(it)) }
        st?.optInt("train", 0)?.let { if (it > 0) parts.add("تمرین " + fa(it)) }
        st?.optInt("sleep", 0)?.let { if (it > 0) parts.add("خواب " + fa(it)) }
        v.setTextViewText(R.id.s_streak,
            if (parts.isEmpty()) "هنوز استریکی نیست" else parts.joinToString(" · "))

        v.setOnClickPendingIntent(R.id.s_root, openApp(ctx, 201))
        mgr.updateAppWidget(id, v)
    }

    /* ---------- خواب ---------- */
    fun renderSleep(ctx: Context, mgr: AppWidgetManager, id: Int) {
        val v = RemoteViews(ctx.packageName, R.layout.w_sleep)
        val d = data(ctx)
        val sl = d?.optJSONObject("sleep")

        if (sl == null) {
            v.setTextViewText(R.id.sl_label, "برنامهٔ خواب")
            v.setTextViewText(R.id.sl_time, "—")
            v.setTextViewText(R.id.sl_left, "در اپ فعالش کن")
            v.setProgressBar(R.id.sl_bar, 100, 0, false)
        } else {
            val target = sl.optString("target", "")
            v.setTextViewText(R.id.sl_label, "امشب بخواب")
            v.setTextViewText(R.id.sl_time, fa(target))
            /* دقیقه تا هدف */
            val now = java.util.Calendar.getInstance()
            val nowMin = now.get(java.util.Calendar.HOUR_OF_DAY) * 60 + now.get(java.util.Calendar.MINUTE)
            val parts = target.split(":")
            val tMin = if (parts.size == 2)
                (parts[0].toIntOrNull() ?: 0) * 60 + (parts[1].toIntOrNull() ?: 0) else 0
            var diff = tMin - nowMin
            if (diff < 0) diff += 1440
            v.setTextViewText(R.id.sl_left,
                if (diff < 60) fa(diff) + " دقیقه مانده"
                else fa(diff / 60) + " ساعت و " + fa(diff % 60) + " دقیقه مانده")
            v.setProgressBar(R.id.sl_bar, 100, sl.optInt("pc", 0), false)
        }
        v.setOnClickPendingIntent(R.id.sl_root, openApp(ctx, 202))
        mgr.updateAppWidget(id, v)
    }

    /* ---------- مینی: بلوک بعدی ---------- */
    fun renderMini(ctx: Context, mgr: AppWidgetManager, id: Int) {
        val v = RemoteViews(ctx.packageName, R.layout.w_mini)
        val raw = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
            .getString("planJson", "") ?: ""
        val c = java.util.Calendar.getInstance()
        val nowMin = c.get(java.util.Calendar.HOUR_OF_DAY) * 60 + c.get(java.util.Calendar.MINUTE)

        var curT = ""; var curIc = "◷"; var nextT = ""; var nextS = -1; var curE = -1
        try {
            val arr = JSONArray(raw)
            for (i in 0 until arr.length()) {
                val o = arr.optJSONObject(i) ?: continue
                val s = o.optInt("s", -1); val e = o.optInt("e", -1)
                if (s < 0) continue
                if (e > s && nowMin >= s && nowMin < e) {
                    curT = o.optString("t", ""); curIc = o.optString("ic", "◷"); curE = e
                } else if (s > nowMin && nextS < 0) {
                    nextS = s; nextT = o.optString("t", "")
                }
            }
        } catch (e: Exception) { }

        if (curT.isNotEmpty()) {
            v.setTextViewText(R.id.m_ic, curIc)
            v.setTextViewText(R.id.m_title, curT)
            v.setTextViewText(R.id.m_sub, fa(curE - nowMin) + " دقیقه مانده")
        } else if (nextS >= 0) {
            v.setTextViewText(R.id.m_ic, "◦")
            v.setTextViewText(R.id.m_title, nextT)
            v.setTextViewText(R.id.m_sub, "بعدی · " +
                fa(String.format("%02d:%02d", nextS / 60, nextS % 60)))
        } else {
            v.setTextViewText(R.id.m_ic, "◷")
            v.setTextViewText(R.id.m_title, if (raw.isEmpty()) "اپ را باز کن" else "زمان آزاد")
            v.setTextViewText(R.id.m_sub, "")
        }
        v.setOnClickPendingIntent(R.id.m_root, openApp(ctx, 203))
        mgr.updateAppWidget(id, v)
    }

    /* ---------- فوتبال ---------- */
    fun renderBall(ctx: Context, mgr: AppWidgetManager, id: Int) {
        val v = RemoteViews(ctx.packageName, R.layout.w_ball)
        val d = data(ctx)
        val f = d?.optJSONObject("football")
        val ovr = f?.optInt("overall", 0) ?: 0

        v.setTextViewText(R.id.f_ovr, fa(ovr))
        v.setProgressBar(R.id.f_bar, 100, ovr, false)
        v.setTextViewText(R.id.f_pos,
            ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
               .getString("fbpos", "") ?: "")

        val next = f?.optInt("next", -1) ?: -1
        val DOW = arrayOf("یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه")
        v.setTextViewText(R.id.f_next, when {
            next == 0 -> "امروز تمرین داری"
            next > 0 -> "تمرین بعدی: " + DOW[(java.util.Calendar.getInstance()
                            .get(java.util.Calendar.DAY_OF_WEEK) - 1 + next) % 7]
            else -> ""
        })
        val tested = f?.optInt("tested", 0) ?: 0
        val total = f?.optInt("total", 15) ?: 15
        v.setTextViewText(R.id.f_tested,
            if (tested < total) fa(total - tested) + " مهارت هنوز سنجیده نشده"
            else "همهٔ مهارت‌ها سنجیده شده")

        v.setOnClickPendingIntent(R.id.f_root, openApp(ctx, 204))
        mgr.updateAppWidget(id, v)
    }
}

/* ============ کلاس‌های ویجت ============ */

class QuestWidget : AppWidgetProvider() {
    override fun onUpdate(c: Context, m: AppWidgetManager, ids: IntArray) {
        ids.forEach { Widgets.renderQuest(c, m, it) }
    }
}

class StatWidget : AppWidgetProvider() {
    override fun onUpdate(c: Context, m: AppWidgetManager, ids: IntArray) {
        ids.forEach { Widgets.renderStat(c, m, it) }
    }
}

class SleepWidget : AppWidgetProvider() {
    override fun onUpdate(c: Context, m: AppWidgetManager, ids: IntArray) {
        ids.forEach { Widgets.renderSleep(c, m, it) }
    }
}

class MiniWidget : AppWidgetProvider() {
    override fun onUpdate(c: Context, m: AppWidgetManager, ids: IntArray) {
        ids.forEach { Widgets.renderMini(c, m, it) }
    }
    override fun onReceive(c: Context, i: Intent) {
        super.onReceive(c, i)
        if (i.action == Intent.ACTION_TIME_TICK) {
            val m = AppWidgetManager.getInstance(c) ?: return
            m.getAppWidgetIds(ComponentName(c, MiniWidget::class.java))
                ?.forEach { Widgets.renderMini(c, m, it) }
        }
    }
}

class BallWidget : AppWidgetProvider() {
    override fun onUpdate(c: Context, m: AppWidgetManager, ids: IntArray) {
        ids.forEach { Widgets.renderBall(c, m, it) }
    }
}
