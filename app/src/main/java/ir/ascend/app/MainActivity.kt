package ir.ascend.app

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.app.Activity
import android.content.res.AssetManager
import java.io.InputStream

class MainActivity : Activity() {

    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(s: Bundle?) {
        super.onCreate(s)
        Guard.install(this)
        try { build(s) } catch (e: Throwable) { Guard.show(this, "MainActivity", e) }
    }

    private fun build(s: Bundle?) {
        // اگر هنوز استارت‌منو کامل نشده، برگرد
        val prefs = getSharedPreferences("ascend", MODE_PRIVATE)
        if (!prefs.getBoolean("started", false)) {
            startActivity(android.content.Intent(this, StartActivity::class.java))
            finish(); return
        }

        window.statusBarColor = Color.BLACK
        window.navigationBarColor = Color.BLACK


        web = WebView(this).apply {
            setBackgroundColor(Color.BLACK)
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true          // localStorage: ascend.v2
                databaseEnabled = true
                loadsImagesAutomatically = true
                cacheMode = WebSettings.LOAD_NO_CACHE
                textZoom = 100                    // مانع تغییر اندازه با فونت سیستم
                mediaPlaybackRequiresUserGesture = true
                allowFileAccess = false
                allowContentAccess = false
                // بدون دسترسی شبکه — مانیفست هم INTERNET ندارد
                blockNetworkLoads = true
                blockNetworkImage = true
            }
            overScrollMode = View.OVER_SCROLL_NEVER
            isVerticalScrollBarEnabled = false

            webViewClient = object : WebViewClient() {
                /** assets را زیر origin امن سرو می‌کند (file:// محدودیت localStorage دارد) */
                override fun shouldInterceptRequest(
                    v: WebView, req: WebResourceRequest
                ): WebResourceResponse? {
                    val u = req.url
                    if (u.host != "ascend.local") return null
                    val path = u.path?.removePrefix("/assets/") ?: return null
                    if (path.isEmpty() || path.contains("..")) return null
                    return try {
                        val mime = when {
                            path.endsWith(".html") -> "text/html"
                            path.endsWith(".js") -> "application/javascript"
                            path.endsWith(".css") -> "text/css"
                            else -> "application/octet-stream"
                        }
                        WebResourceResponse(mime, "utf-8", assets.open(path))
                    } catch (e: Exception) { null }
                }

                // لینک یوتیوب راهنما در مرورگر بیرونی باز شود، نه داخل اپ
                override fun shouldOverrideUrlLoading(
                    v: WebView, req: WebResourceRequest
                ): Boolean {
                    val u = req.url
                    if (u.host == "ascend.local") return false
                    return try {
                        startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, u))
                        true
                    } catch (e: Exception) { true }
                }
            }
        }
        // ---- پل نیتیو: موتور وب برنامهٔ روز را می‌دهد، نیتیو آلارم می‌چیند ----
        web.addJavascriptInterface(object {
            @JavascriptInterface
            fun schedule(planJson: String) {
                runOnUiThread { Notif.schedule(this@MainActivity, planJson) }
            }
            @JavascriptInterface
            fun cancelAll() {
                runOnUiThread { Notif.cancelAll(this@MainActivity) }
            }
            /** فقط برنامه را برای ویجت ذخیره کن، بدون چیدن آلارم */
            @JavascriptInterface
            fun planOnly(planJson: String) {
                runOnUiThread { Notif.savePlan(this@MainActivity, planJson) }
            }
            @JavascriptInterface
            fun isNative(): Boolean = true
            /** لرزش کوتاه برای بازخورد لمسی */
            @JavascriptInterface
            fun buzz(ms: Int) {
                try {
                    val v = if (Build.VERSION.SDK_INT >= 31) {
                        (getSystemService(android.content.Context.VIBRATOR_MANAGER_SERVICE)
                            as android.os.VibratorManager).defaultVibrator
                    } else {
                        @Suppress("DEPRECATION")
                        getSystemService(android.content.Context.VIBRATOR_SERVICE) as android.os.Vibrator
                    }
                    v.vibrate(android.os.VibrationEffect.createOneShot(
                        ms.toLong().coerceIn(5, 60),
                        android.os.VibrationEffect.DEFAULT_AMPLITUDE))
                } catch (e: Exception) { }
            }
            /** کارهایی که از روی اعلان «انجام شد» خورده‌اند */
            @JavascriptInterface
            fun takePending(): String {
                val p = getSharedPreferences("ascend", MODE_PRIVATE)
                val q = p.getString("pendingDone", "") ?: ""
                if (q.isNotEmpty()) p.edit().remove("pendingDone").apply()
                return q
            }
        }, "Native")

        setContentView(web)
        web.loadUrl("https://ascend.local/assets/ASCEND.html")

    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // اجازه بده روتر داخلی اپ اول بازگشت را بگیرد
        web.evaluateJavascript(
            "(function(){if(window.goBackApp)return goBackApp();return false})()"
        ) { r ->
            if (r != "true") {
                if (web.canGoBack()) web.goBack() else finish()
            }
        }
    }

    override fun onPause() { super.onPause(); web.onPause() }
    override fun onResume() { super.onResume(); web.onResume() }
    override fun onDestroy() { web.destroy(); super.onDestroy() }
}
