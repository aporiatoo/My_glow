package ir.ascend.app

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

/**
 * پل Health Connect برای خواندن خودکار خواب و قدم.
 *
 * چرا اینقدر محافظه‌کارانه: کتابخانهٔ رسمی Health Connect به androidx وابسته است
 * و ما عمداً androidx نداریم. پس فقط تشخیص می‌دهیم نصب هست یا نه و کاربر را
 * به آن می‌فرستیم؛ خواندن واقعی داده نیازمند افزودن وابستگی است.
 *
 * تا آن زمان، ثبت دستی خواب در اپ کار می‌کند و این کلاس فقط مسیر را باز نگه می‌دارد.
 */
object Health {
    private const val PKG = "com.google.android.apps.healthdata"

    /** آیا Health Connect روی دستگاه نصب است؟ */
    fun installed(ctx: Context): Boolean = try {
        ctx.packageManager.getPackageInfo(PKG, 0); true
    } catch (e: PackageManager.NameNotFoundException) { false }
      catch (e: Exception) { false }

    /** باز کردن Health Connect یا صفحهٔ نصبش */
    fun open(act: Activity) {
        try {
            val i = act.packageManager.getLaunchIntentForPackage(PKG)
            if (i != null) { act.startActivity(i); return }
        } catch (e: Exception) { }
        /* نصب نیست — صفحهٔ فروشگاه. اپ مجوز اینترنت ندارد ولی Intent بیرونی آزاد است. */
        try {
            act.startActivity(Intent(Intent.ACTION_VIEW,
                android.net.Uri.parse("market://details?id=$PKG")))
        } catch (e: Exception) { }
    }

    /**
     * وضعیت برای نمایش در اپ.
     * "ready" نصب است · "missing" نیست · "unsupported" اندروید قدیمی
     */
    fun status(ctx: Context): String = when {
        android.os.Build.VERSION.SDK_INT < 28 -> "unsupported"
        installed(ctx) -> "ready"
        else -> "missing"
    }
}
