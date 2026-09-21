package ir.ascend.app

import android.app.Activity
import android.graphics.Color
import android.view.Gravity
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import java.io.PrintWriter
import java.io.StringWriter

/**
 * تلهٔ خطا.
 *
 * اگر اپ موقع باز شدن بشکند، به‌جای بسته شدن بی‌صدا، متن کامل خطا را
 * روی صفحه نشان می‌دهد تا بشود علت را دید و رفع کرد.
 */
object Guard {

    /** آخرین خطا را ذخیره می‌کند تا بعد از ری‌استارت هم قابل دیدن باشد */
    fun install(act: Activity) {
        val prev = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { th, e ->
            try {
                act.getSharedPreferences("ascend", Activity.MODE_PRIVATE).edit()
                    .putString("lastCrash", stack(e)).apply()
            } catch (_: Throwable) {}
            prev?.uncaughtException(th, e)
        }
    }

    fun stack(e: Throwable): String {
        val sw = StringWriter()
        e.printStackTrace(PrintWriter(sw))
        return sw.toString()
    }

    /** صفحهٔ نمایش خطا — قابل انتخاب تا بشود کپی/اسکرین‌شات گرفت */
    fun show(act: Activity, where: String, e: Throwable) {
        try {
            act.getSharedPreferences("ascend", Activity.MODE_PRIVATE).edit()
                .putString("lastCrash", "[$where]\n" + stack(e)).apply()
        } catch (_: Throwable) {}

        val d = act.resources.displayMetrics.density
        fun dp(v: Int) = (v * d).toInt()

        val root = LinearLayout(act).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.BLACK)
            setPadding(dp(16), dp(40), dp(16), dp(16))
        }
        root.addView(TextView(act).apply {
            text = "خطا در: $where"
            setTextColor(Color.parseColor("#f4f4f5"))
            textSize = 16f
            gravity = Gravity.START
        })
        root.addView(TextView(act).apply {
            text = "این متن را برای من بفرست تا رفعش کنم."
            setTextColor(Color.parseColor("#8a8a93"))
            textSize = 12f
            setPadding(0, dp(6), 0, dp(12))
        })

        val tv = TextView(act).apply {
            text = stack(e)
            setTextColor(Color.parseColor("#ff6b6b"))
            textSize = 10f
            setTextIsSelectable(true)
            typeface = android.graphics.Typeface.MONOSPACE
        }
        root.addView(ScrollView(act).apply { addView(tv) },
            LinearLayout.LayoutParams(MATCH_PARENT, 0, 1f))

        root.addView(Button(act).apply {
            text = "بستن"
            setOnClickListener { act.finish() }
        }, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))

        act.setContentView(root)
    }
}
