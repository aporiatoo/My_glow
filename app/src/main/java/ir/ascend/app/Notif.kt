package ir.ascend.app

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import org.json.JSONArray
import java.util.Calendar

/**
 * یادآور بلوک‌های برنامه.
 *
 * موتور وب برنامهٔ امروز را با JavascriptInterface می‌دهد،
 * لایهٔ نیتیو برایش AlarmManager می‌چیند. این‌طور حتی وقتی اپ بسته است
 * سر هر بلوک اعلان می‌آید.
 */
object Notif {

    const val CH_BLOCK = "block"
    const val CH_QUIET = "quiet"
    private const val TAG = "AscendNotif"

    /** حداکثر آلارم فعال — از پر شدن صف سیستم جلوگیری می‌کند */
    private const val MAX = 40

    fun ensureChannels(ctx: Context) {
        if (Build.VERSION.SDK_INT < 26) return
        val nm = ctx.getSystemService(NotificationManager::class.java) ?: return

        NotificationChannel(CH_BLOCK, "بلوک‌های برنامه", NotificationManager.IMPORTANCE_HIGH).apply {
            description = "یادآور سر هر بلوک تایم‌لاین"
            enableVibration(true)
            setShowBadge(true)
            nm.createNotificationChannel(this)
        }
        NotificationChannel(CH_QUIET, "یادآور آرام", NotificationManager.IMPORTANCE_LOW).apply {
            description = "یادآورهای کم‌اهمیت، بدون صدا"
            enableVibration(false)
            nm.createNotificationChannel(this)
        }
    }

    /**
     * برنامهٔ امروز را می‌گیرد و آلارم می‌چیند.
     * @param json آرایه‌ای از {s,t,d,ic}  — s دقیقه از نیمه‌شب
     */
    fun schedule(ctx: Context, json: String) {
        ensureChannels(ctx)
        cancelAll(ctx)

        val am = ctx.getSystemService(AlarmManager::class.java) ?: return
        savePlan(ctx, json)

        val arr = try { JSONArray(json) } catch (e: Exception) {
            Log.w(TAG, "bad plan json"); return
        }

        val now = Calendar.getInstance()
        val nowMin = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)
        var n = 0
        val ids = mutableListOf<Int>()

        for (i in 0 until arr.length()) {
            if (n >= MAX) break
            val o = arr.optJSONObject(i) ?: continue
            val s = o.optInt("s", -1)
            if (s < 0) continue
            val title = o.optString("t", "")
            if (title.isEmpty()) continue

            // بلوک‌های گذشتهٔ امروز را رد کن
            if (s <= nowMin) continue

            val at = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, s / 60)
                set(Calendar.MINUTE, s % 60)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            if (at.timeInMillis <= System.currentTimeMillis()) continue

            val rid = 1000 + s                       // شناسهٔ پایدار بر اساس دقیقهٔ شروع
            val pi = PendingIntent.getBroadcast(
                ctx, rid,
                Intent(ctx, AlarmRx::class.java).apply {
                    putExtra("t", title)
                    putExtra("d", o.optString("d", ""))
                    putExtra("ic", o.optString("ic", ""))
                    putExtra("rid", rid)
                },
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            try {
                // اگر مجوز آلارم دقیق نبود، به حالت غیردقیق برگرد — هرگز کرش نکن
                val exact = Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()
                if (exact) {
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at.timeInMillis, pi)
                } else {
                    am.set(AlarmManager.RTC_WAKEUP, at.timeInMillis, pi)
                }
                ids.add(rid); n++
            } catch (e: SecurityException) {
                am.set(AlarmManager.RTC_WAKEUP, at.timeInMillis, pi)
                ids.add(rid); n++
            } catch (e: Exception) {
                Log.w(TAG, "alarm failed: ${e.message}")
            }
        }

        // شناسه‌ها را ذخیره کن تا بعداً بشود لغوشان کرد
        ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE).edit()
            .putString("alarmIds", ids.joinToString(","))
            .putLong("alarmDay", todayKey())
            .putString("planJson", json)   // ویجت از همین می‌خواند
            .apply()
        Widgets.refreshAll(ctx)
        Log.i(TAG, "scheduled $n alarms")
    }

    /** برنامه را برای ویجت ذخیره کن و ویجت را تازه کن */
    fun savePlan(ctx: Context, json: String) {
        ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE).edit()
            .putString("planJson", json).apply()
        Widgets.refreshAll(ctx)
    }

    fun cancelAll(ctx: Context) {
        val p = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
        val raw = p.getString("alarmIds", "") ?: ""
        if (raw.isEmpty()) return
        val am = ctx.getSystemService(AlarmManager::class.java) ?: return
        raw.split(",").forEach { s ->
            val rid = s.trim().toIntOrNull() ?: return@forEach
            val pi = PendingIntent.getBroadcast(
                ctx, rid, Intent(ctx, AlarmRx::class.java),
                PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
            )
            if (pi != null) { am.cancel(pi); pi.cancel() }
        }
        p.edit().remove("alarmIds").apply()
    }

    private fun todayKey(): Long {
        val c = Calendar.getInstance()
        return (c.get(Calendar.YEAR) * 10000 + c.get(Calendar.MONTH) * 100 +
                c.get(Calendar.DAY_OF_MONTH)).toLong()
    }
}

/** آلارم که می‌رسد، اعلان را نشان می‌دهد */
class AlarmRx : BroadcastReceiver() {
    override fun onReceive(ctx: Context, i: Intent) {
        Notif.ensureChannels(ctx)
        val title = i.getStringExtra("t") ?: return
        val desc = i.getStringExtra("d") ?: ""
        val ic = i.getStringExtra("ic") ?: ""
        val rid = i.getIntExtra("rid", 1)

        val open = PendingIntent.getActivity(
            ctx, rid,
            Intent(ctx, MainActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val head = if (ic.isEmpty()) title else "$ic  $title"

        /* دکمهٔ «انجام شد»: بدون باز کردن اپ ثبت می‌شود */
        val donePI = PendingIntent.getBroadcast(
            ctx, rid + 500000,
            Intent(ctx, ActionRx::class.java).apply {
                action = ActionRx.ACT_DONE
                putExtra("rid", rid); putExtra("t", title)
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        /* دکبهٔ «۱۰ دقیقه بعد» */
        val snoozePI = PendingIntent.getBroadcast(
            ctx, rid + 900000,
            Intent(ctx, ActionRx::class.java).apply {
                action = ActionRx.ACT_SNOOZE
                putExtra("rid", rid); putExtra("t", title)
                putExtra("d", desc); putExtra("ic", ic)
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val n = Notification.Builder(ctx, Notif.CH_BLOCK)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle(head)
            .setContentText(desc)
            .setStyle(Notification.BigTextStyle().bigText(desc))
            .setContentIntent(open)
            .setAutoCancel(true)
            .setCategory(Notification.CATEGORY_REMINDER)
            .addAction(Notification.Action.Builder(
                null, "انجام شد", donePI).build())
            .addAction(Notification.Action.Builder(
                null, "۱۰ دقیقه بعد", snoozePI).build())
            .build()

        try {
            ctx.getSystemService(NotificationManager::class.java)?.notify(rid, n)
        } catch (e: SecurityException) {
            // کاربر مجوز اعلان نداده — بی‌صدا رد شو
        }
    }
}

/**
 * اکشن‌های روی خود اعلان.
 * «انجام شد» در صف می‌نشیند و دفعهٔ بعد که اپ باز شد اعمال می‌شود —
 * چون منطق تیک زدن در موتور وب است و اینجا در دسترس نیست.
 */
class ActionRx : BroadcastReceiver() {
    companion object {
        const val ACT_DONE = "ir.ascend.app.DONE"
        const val ACT_SNOOZE = "ir.ascend.app.SNOOZE"
    }

    override fun onReceive(ctx: Context, i: Intent) {
        val rid = i.getIntExtra("rid", 0)
        val title = i.getStringExtra("t") ?: ""
        val nm = ctx.getSystemService(NotificationManager::class.java)

        when (i.action) {
            ACT_DONE -> {
                /* در صف بگذار تا موتور وب هنگام باز شدن اعمالش کند */
                val p = ctx.getSharedPreferences("ascend", Context.MODE_PRIVATE)
                val q = p.getString("pendingDone", "") ?: ""
                val entry = title.replace("|", " ")
                val nq = if (q.isEmpty()) entry else "$q|$entry"
                p.edit().putString("pendingDone", nq).apply()
                nm?.cancel(rid)
                Widgets.refreshAll(ctx)
            }
            ACT_SNOOZE -> {
                nm?.cancel(rid)
                val am = ctx.getSystemService(AlarmManager::class.java) ?: return
                val at = System.currentTimeMillis() + 10 * 60 * 1000
                val pi = PendingIntent.getBroadcast(
                    ctx, rid,
                    Intent(ctx, AlarmRx::class.java).apply {
                        putExtra("t", title)
                        putExtra("d", i.getStringExtra("d") ?: "")
                        putExtra("ic", i.getStringExtra("ic") ?: "")
                        putExtra("rid", rid)
                    },
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                try {
                    if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms())
                        am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
                    else am.set(AlarmManager.RTC_WAKEUP, at, pi)
                } catch (e: Exception) {
                    am.set(AlarmManager.RTC_WAKEUP, at, pi)
                }
            }
        }
    }
}

/** بعد از ریستارت گوشی آلارم‌ها پاک می‌شوند؛ کاربر با باز کردن اپ دوباره می‌چیند */
class BootRx : BroadcastReceiver() {
    override fun onReceive(ctx: Context, i: Intent) {
        if (i.action != Intent.ACTION_BOOT_COMPLETED) return
        Notif.ensureChannels(ctx)
        // برنامهٔ روز در WebView است؛ با اولین باز شدن اپ دوباره چیده می‌شود.
    }
}
