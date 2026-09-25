package ir.ascend.app

import android.annotation.SuppressLint
import android.graphics.Color
import android.content.Intent
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
                /* بدون این دو، لینک با target=_blank هیچ کاری نمی‌کند */
                setSupportMultipleWindows(true)
                javaScriptCanOpenWindowsAutomatically = true
                allowFileAccess = false
                allowContentAccess = false
                // بدون دسترسی شبکه — مانیفست هم INTERNET ندارد
                blockNetworkLoads = true
                blockNetworkImage = true
            }
            overScrollMode = View.OVER_SCROLL_NEVER
            isVerticalScrollBarEnabled = false

            /* لینک‌های target=_blank اینجا گرفته می‌شوند و به مرورگر می‌روند */
            webChromeClient = object : android.webkit.WebChromeClient() {
                override fun onCreateWindow(
                    view: WebView, isDialog: Boolean, isUserGesture: Boolean,
                    resultMsg: android.os.Message
                ): Boolean {
                    val href = view.handler?.let { android.os.Message.obtain(it) }
                    view.requestFocusNodeHref(href)
                    val url = href?.data?.getString("url")
                    if (!url.isNullOrEmpty()) {
                        openExternal(android.net.Uri.parse(url))
                        return false
                    }
                    /* اگر آدرس در دسترس نبود، از WebView موقت بگیر */
                    val tmp = WebView(this@MainActivity)
                    tmp.webViewClient = object : WebViewClient() {
                        override fun shouldOverrideUrlLoading(
                            v2: WebView, r2: WebResourceRequest
                        ): Boolean {
                            openExternal(r2.url)
                            tmp.destroy()
                            return true
                        }
                    }
                    (resultMsg.obj as? WebView.WebViewTransport)?.webView = tmp
                    resultMsg.sendToTarget()
                    return true
                }
            }

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
                    openExternal(u)
                    return true
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
            /** خلاصهٔ محاسبه‌شده برای ویجت‌ها */
            @JavascriptInterface
            fun saveWidget(json: String) {
                getSharedPreferences("ascend", MODE_PRIVATE).edit()
                    .putString("widgetData", json).apply()
                runOnUiThread { Widgets.refreshAll(this@MainActivity) }
            }
            @JavascriptInterface
            fun planOnly(planJson: String) {
                runOnUiThread { Notif.savePlan(this@MainActivity, planJson) }
            }
            @JavascriptInterface
            fun isNative(): Boolean = true

            /* ---- ورودی صوتی ---- */
            @JavascriptInterface
            fun voiceAvailable(): Boolean = Voice.available(this@MainActivity)
            @JavascriptInterface
            fun voiceStart(prompt: String) {
                runOnUiThread { Voice.start(this@MainActivity, prompt) }
            }

            /* ---- قفل بیومتریک ---- */
            @JavascriptInterface
            fun lockAvailable(): Boolean = Lock.available(this@MainActivity)
            @JavascriptInterface
            fun lockPrompt(title: String, sub: String, cbId: String) {
                runOnUiThread {
                    Lock.prompt(this@MainActivity, title, sub) { ok ->
                        web.evaluateJavascript(
                            "window.lockResult&&window.lockResult('" + cbId + "'," + ok + ")", null)
                    }
                }
            }

            /* ---- Health Connect ---- */
            @JavascriptInterface
            fun healthStatus(): String = Health.status(this@MainActivity)
            @JavascriptInterface
            fun healthOpen() { runOnUiThread { Health.open(this@MainActivity) } }

            /* ---- بلاکر ---- */
            @JavascriptInterface
            fun blockerEnabled(): Boolean = Blocker.enabled(this@MainActivity)
            @JavascriptInterface
            fun blockerSettings() { runOnUiThread { Blocker.openSettings(this@MainActivity) } }
            @JavascriptInterface
            fun blockerSave(json: String) { Blocker.saveRules(this@MainActivity, json) }
            @JavascriptInterface
            fun blockerUsed(pkg: String): Int = Blocker.usedToday(this@MainActivity, pkg)
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

    override fun onActivityResult(req: Int, res: Int, data: Intent?) {
        super.onActivityResult(req, res, data)
        when (req) {
            Voice.REQ -> {
                val txt = if (res == RESULT_OK) Voice.extract(data) else ""
                val safe = txt.replace("\\", "").replace("'", "\u2019").replace("\n", " ")
                web.evaluateJavascript("window.voiceResult&&window.voiceResult('$safe')", null)
            }
            Lock.REQ -> {
                Lock.pending?.invoke(res == RESULT_OK)
                Lock.pending = null
            }
        }
    }

    /** باز کردن آدرس در مرورگر یا اپ مربوطه */
    private fun openExternal(u: android.net.Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, u)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (e: Exception) {
            android.widget.Toast.makeText(this,
                "مرورگری برای باز کردن این لینک نیست",
                android.widget.Toast.LENGTH_SHORT).show()
        }
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
