package ir.ascend.app

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import java.util.Locale

/**
 * ورودی صوتی برای ژورنال.
 *
 * از تشخیص گفتار خود اندروید استفاده می‌کند (آفلاین اگر بستهٔ فارسی نصب باشد).
 * نتیجه با callback به موتور وب برمی‌گردد.
 */
object Voice {
    const val REQ = 4711

    /** آیا سرویس تشخیص گفتار روی این دستگاه هست؟ */
    fun available(act: Activity): Boolean = try {
        act.packageManager.queryIntentActivities(
            Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0
        ).isNotEmpty()
    } catch (e: Exception) { false }

    fun start(act: Activity, prompt: String) {
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                     RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "fa-IR")
            putExtra(RecognizerIntent.EXTRA_PROMPT, prompt)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
            /* اگر بستهٔ آفلاین فارسی نصب باشد بدون اینترنت کار می‌کند.
               اپ مجوز اینترنت ندارد، پس آنلاین اصلاً گزینه نیست. */
            putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
        }
        try { act.startActivityForResult(i, REQ) }
        catch (e: Exception) { /* سرویس نیست — سمت وب پیام می‌دهد */ }
    }

    /** متن شنیده‌شده را از نتیجه بیرون می‌کشد */
    fun extract(data: Intent?): String =
        data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
            ?.firstOrNull().orEmpty()
}
