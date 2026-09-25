package ir.ascend.app

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.hardware.biometrics.BiometricPrompt
import android.os.Build
import android.os.CancellationSignal

/**
 * قفل بیومتریک برای بخش‌های خصوصی (ژورنال، پاکی).
 *
 * از BiometricPrompt خود اندروید استفاده می‌کند — بدون androidx.
 * اگر دستگاه اثر انگشت نداشت، به قفل صفحه (پین/الگو) برمی‌گردد.
 * اگر هیچ‌کدام نبود، بی‌سروصدا اجازه می‌دهد — قفلی که راه ورود ندارد بی‌فایده است.
 */
object Lock {

    /** آیا اصلاً راهی برای احراز هویت هست؟ */
    fun available(ctx: Context): Boolean = try {
        val km = ctx.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
        km.isDeviceSecure
    } catch (e: Exception) { false }

    /**
     * @param onResult true یعنی تأیید شد یا اصلاً قفلی در کار نیست
     */
    fun prompt(act: Activity, title: String, sub: String, onResult: (Boolean) -> Unit) {
        if (!available(act)) { onResult(true); return }

        if (Build.VERSION.SDK_INT >= 28) {
            try {
                val b = BiometricPrompt.Builder(act)
                    .setTitle(title)
                    .setSubtitle(sub)
                if (Build.VERSION.SDK_INT >= 30) {
                    /* اجازهٔ پین/الگو به‌عنوان جایگزین اثر انگشت */
                    b.setAllowedAuthenticators(
                        android.hardware.biometrics.BiometricManager.Authenticators.BIOMETRIC_WEAK or
                        android.hardware.biometrics.BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                } else {
                    @Suppress("DEPRECATION")
                    b.setDeviceCredentialAllowed(true)
                }
                b.build().authenticate(
                    CancellationSignal(),
                    act.mainExecutor,
                    object : BiometricPrompt.AuthenticationCallback() {
                        override fun onAuthenticationSucceeded(r: BiometricPrompt.AuthenticationResult?) {
                            act.runOnUiThread { onResult(true) }
                        }
                        override fun onAuthenticationError(code: Int, msg: CharSequence?) {
                            act.runOnUiThread { onResult(false) }
                        }
                        override fun onAuthenticationFailed() { /* تلاش ناموفق — پرامپت باز می‌ماند */ }
                    })
                return
            } catch (e: Exception) { /* به مسیر پایین برو */ }
        }

        /* اندروید ۸ و ۹ بدون BiometricPrompt: قفل صفحهٔ سیستم */
        try {
            val km = act.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            @Suppress("DEPRECATION")
            val i = km.createConfirmDeviceCredentialIntent(title, sub)
            if (i != null) { act.startActivityForResult(i, REQ); pending = onResult; return }
        } catch (e: Exception) { }
        onResult(true)
    }

    const val REQ = 4712
    var pending: ((Boolean) -> Unit)? = null
}
