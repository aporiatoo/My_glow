package ir.ascend.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONArray
import java.util.Calendar

/**
 * ویجت صفحهٔ اصلی: بلوک فعلی، پیشرفتش، و بلوک بعدی.
 *
 * دادهٔ برنامه را موتور وب موقع syncNotif در SharedPreferences می‌گذارد؛
 * ویجت همان را می‌خواند. پس ویجت به باز بودن اپ وابسته نیست.
 */
class Widget : AppWidgetProvider() {

    override fun onUpdate(ctx: Context, mgr: AppWidgetManager, ids: IntArray) {
        ids.forEach { render(ctx, mgr, it) }
    }

    override fun onReceive(ctx: Context, i: Intent) {
        super.onReceive(ctx, i)
        if (i.action == ACTION_REFRESH || i.action == Intent.ACTION_TIME_TICK) {
            Widgets.refreshAll(ctx)
        }
    }

    companion object {
        const val ACTION_REFRESH = "ir.ascend.app.WIDGET_REFRESH"

        /** همهٔ نمونه‌های ویجت را دوباره بکش */
        fun refreshAll(ctx: Context) {
            val mgr = AppWidgetManager.getInstance(ctx) ?: return
            val ids = mgr.getAppWidgetIds(ComponentName(ctx, Widget::class.java)) ?: return
            ids.forEach { render(ctx, mgr, it) }
        }

        private fun render(ctx: Context, mgr: AppWidgetManager, id: Int) {
            val v = RemoteViews(ctx.packageName, R.layout.widget)
            val p = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
            val json = p.getString("planJson", "") ?: ""

            val c = Calendar.getInstance()
            val nowMin = c.get(Calendar.HOUR_OF_DAY) * 60 + c.get(Calendar.MINUTE)

            var curT = ""; var curD = ""; var curS = 0; var curE = 0
            var nextT = ""; var nextS = -1
            var found = false

            if (json.isNotEmpty()) {
                try {
                    val arr = JSONArray(json)
                    for (i in 0 until arr.length()) {
                        val o = arr.optJSONObject(i) ?: continue
                        val s = o.optInt("s", -1)
                        val e = o.optInt("e", -1)
                        if (s < 0) continue
                        val t = o.optString("t", "")
                        val ic = o.optString("ic", "")
                        val label = if (ic.isEmpty()) t else "$ic  $t"

                        if (e > s && nowMin >= s && nowMin < e) {
                            curT = label; curD = o.optString("d", "")
                            curS = s; curE = e; found = true
                        } else if (s > nowMin && nextS < 0) {
                            nextS = s; nextT = label
                        }
                    }
                } catch (e: Exception) { /* داده خراب — حالت خالی نشان بده */ }
            }

            if (found) {
                v.setTextViewText(R.id.w_now, curT)
                v.setTextViewText(R.id.w_desc, curD)
                v.setTextViewText(R.id.w_time, hm(curS) + " – " + hm(curE))
                val span = (curE - curS).coerceAtLeast(1)
                val pc = (((nowMin - curS).toFloat() / span) * 100).toInt().coerceIn(0, 100)
                v.setProgressBar(R.id.w_bar, 100, pc, false)
                v.setTextViewText(R.id.w_foot, fa(curE - nowMin) + " دقیقه مانده")
            } else if (json.isEmpty()) {
                v.setTextViewText(R.id.w_now, "اپ را باز کن")
                v.setTextViewText(R.id.w_desc, "برای همگام‌سازی برنامهٔ امروز")
                v.setTextViewText(R.id.w_time, "")
                v.setTextViewText(R.id.w_foot, "")
                v.setProgressBar(R.id.w_bar, 100, 0, false)
            } else {
                v.setTextViewText(R.id.w_now, "بلوک آزاد")
                v.setTextViewText(R.id.w_desc, "")
                v.setTextViewText(R.id.w_time, hm(nowMin))
                v.setTextViewText(R.id.w_foot, "")
                v.setProgressBar(R.id.w_bar, 100, 0, false)
            }

            v.setTextViewText(
                R.id.w_next,
                if (nextS >= 0) "بعدی:  " + hm(nextS) + "   " + nextT else "پایان برنامهٔ امروز"
            )

            // کلیک روی ویجت = باز کردن اپ
            val pi = PendingIntent.getActivity(
                ctx, 0,
                Intent(ctx, MainActivity::class.java)
                    .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            v.setOnClickPendingIntent(R.id.w_root, pi)

            mgr.updateAppWidget(id, v)
        }

        private fun hm(m: Int): String {
            val h = (m / 60) % 24; val mm = m % 60
            return fa(h).padStart(2, '۰') + ":" + fa(mm).padStart(2, '۰')
        }

        private fun fa(n: Int): String {
            val d = charArrayOf('۰','۱','۲','۳','۴','۵','۶','۷','۸','۹')
            return n.toString().map { if (it.isDigit()) d[it - '0'] else it }.joinToString("")
        }
    }
}
