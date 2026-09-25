package ir.ascend.app

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.*
import android.app.Activity

/**
 * استارت‌منوی آغازین — ۵ مرحله.
 * تا وقتی START زده نشود، اپ وارد حالت عادی نمی‌شود.
 */
class StartActivity : Activity() {

    private lateinit var prefs: android.content.SharedPreferences
    private var step = 0
    private lateinit var host: FrameLayout
    private lateinit var dots: LinearLayout
    private lateinit var title: TextView
    private lateinit var next: Button
    private lateinit var back: TextView

    /* فونت فارسی از assets — بدون این، استارت‌منو با فونت پیش‌فرض
       سیستم رندر می‌شد که برای فارسی ضعیف است */
    private val fontR: Typeface by lazy {
        try { Typeface.createFromAsset(assets, "font/vazir.ttf") }
        catch (e: Exception) { Typeface.DEFAULT }
    }
    private val fontB: Typeface by lazy {
        try { Typeface.createFromAsset(assets, "font/vazir_bold.ttf") }
        catch (e: Exception) { Typeface.DEFAULT_BOLD }
    }

    private val INK = Color.parseColor("#f4f4f5")
    private val DIM = Color.parseColor("#8a8a93")
    private val DIM2 = Color.parseColor("#5c5c66")
    private val BR = Color.parseColor("#26ffffff")
    private val BR2 = Color.parseColor("#3dffffff")
    private val GLASS = Color.parseColor("#12ffffff")

    private val titles = arrayOf(
        "به سیستم خوش آمدی",
        "تدارکات سری اول",
        "تأیید پروفایل",
        "مجوزهای لازم",
        "آماده‌ای؟"
    )

    override fun onCreate(s: Bundle?) {
        super.onCreate(s)
        Guard.install(this)
        try { build(s) } catch (e: Throwable) { Guard.show(this, "StartActivity", e) }
    }

    private fun build(s: Bundle?) {
        prefs = getSharedPreferences("ascend", Context.MODE_PRIVATE)
        if (prefs.getBoolean("started", false)) { launchMain(); return }

        window.statusBarColor = Color.BLACK
        window.navigationBarColor = Color.BLACK

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.BLACK)
            layoutDirection = View.LAYOUT_DIRECTION_RTL
        }

        // ---- header ----
        title = TextView(this).apply {
            textSize = 19f
            setTextColor(INK)
            typeface = fontB
            setPadding(dp(20), dp(18), dp(20), dp(6))
        }
        dots = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(dp(20), 0, dp(20), dp(12))
        }
        repeat(5) {
            dots.addView(View(this).apply {
                layoutParams = LinearLayout.LayoutParams(0, dp(3), 1f).apply {
                    marginEnd = dp(5)
                }
            })
        }

        host = FrameLayout(this)

        // ---- footer ----
        back = TextView(this).apply {
            text = "بازگشت"
            setTextColor(DIM)
            textSize = 13f
            gravity = Gravity.CENTER
            setPadding(dp(16), dp(13), dp(16), dp(13))
            setOnClickListener { if (step > 0) { step--; render() } }
        }
        next = Button(this).apply {
            setTextColor(Color.BLACK)
            textSize = 14f
            typeface = fontB
            background = roundBg(INK, 0, dp(13))
            stateListAnimator = null
            setOnClickListener { onNext() }
        }
        val footer = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(dp(16), dp(10), dp(16), dp(16))
            addView(back, LinearLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT))
            addView(next, LinearLayout.LayoutParams(0, dp(50), 1f).apply { marginStart = dp(10) })
        }

        root.addView(title, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))
        root.addView(dots, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))
        root.addView(host, LinearLayout.LayoutParams(MATCH_PARENT, 0, 1f))
        root.addView(footer, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))
        applyFont(root)
        setContentView(root)

        root.setOnApplyWindowInsetsListener { v, insets ->
            @Suppress("DEPRECATION")
            v.setPadding(0, insets.systemWindowInsetTop, 0, insets.systemWindowInsetBottom)
            insets
        }
        render()
    }

    private fun onNext() {
        if (step == 4) { finishSetup(); return }
        step++; render()
    }

    private fun render() {
        title.text = titles[step]
        for (i in 0 until dots.childCount) {
            dots.getChildAt(i).setBackgroundColor(if (i <= step) INK else BR)
        }
        back.visibility = if (step == 0) View.INVISIBLE else View.VISIBLE
        next.text = when (step) { 4 -> "START"; 1 -> "تهیه کردم، ادامه"; else -> "ادامه" }
        host.removeAllViews()
        val page = when (step) {
            0 -> pageWelcome(); 1 -> pageKit(); 2 -> pageProfile(); 3 -> pagePerms(); else -> pageStart()
        }
        applyFont(page)
        host.addView(page)
    }

    // ---------- صفحهٔ ۱ ----------
    private fun pageWelcome(): View {
        val c = col()
        c.addView(body("این یک اپ انگیزشی نیست. یک سیستم داده‌محور است که برنامهٔ دقیقهٔ‌به‌دقیقهٔ تو را می‌سازد و پیشرفتت را با عدد می‌سنجد."))
        listOf(
            "◷" to "تایم‌لاین روزانه — برنامهٔ دقیقه‌به‌دقیقه که با مدرسه، تمرین فوتبال و رویدادها بازنویسی می‌شود",
            "⚔" to "کوئست و استت — XP، لِوِل و استریک برای کارهای روزانه",
            "▦" to "سیستم درسی — برنامهٔ هفتگی بر پایهٔ ضریب×سختی، معدل وزنی و توصیهٔ رشته",
            "◆" to "درخت مهارت — ۲۶ گره که فقط با دادهٔ واقعی تو باز می‌شوند",
            "◫" to "راهنمای تصویری — برای هر روتین، مثال و گام‌های دقیق و اینفوگرافیک"
        ).forEach { (ic, t) -> c.addView(row(ic, t)) }
        c.addView(hint("همهٔ داده‌ها فقط روی همین گوشی ذخیره می‌شود. اپ به اینترنت دسترسی ندارد."))
        return scroll(c)
    }

    // ---------- صفحهٔ ۲: تدارکات ----------
    private fun pageKit(): View {
        val c = col()
        c.addView(body("قبل از شروع این اقلام را تهیه کن. بدون این‌ها بعضی روتین‌ها اجرا نمی‌شوند. قیمت‌ها تخمینی است."))

        val sumView = TextView(this).apply {
            setTextColor(INK); textSize = 13f; typeface = fontB
            setPadding(dp(13), dp(11), dp(13), dp(11))
            background = roundBg(GLASS, BR2, dp(12))
        }
        c.addView(sumView, lp().apply { bottomMargin = dp(12) })

        fun refresh() {
            val checked = Kit.bySeries(1).filter { prefs.getBoolean("kit_" + it.id, false) }
            val left = Kit.bySeries(1).filter { !prefs.getBoolean("kit_" + it.id, false) && it.tier == 0 }
            val tail = if (left.isEmpty()) "\n✓ همهٔ اقلام ضروری آماده است"
                       else "\n⚠ ${fa(left.size)} قلم ضروری باقی مانده"
            sumView.text = "تهیه‌شده: ${fa(checked.size)} از ${fa(Kit.bySeries(1).size)}" +
                    "   ·   جمع کل: ${fa(Kit.total(1) / 1000)} هزار تومان" + tail
        }
        refresh()

        for (tier in 0..2) {
            val items = Kit.bySeries(1).filter { it.tier == tier }
            if (items.isEmpty()) continue
            c.addView(sectionLabel(Kit.TIER[tier] + " · " + fa(items.size) + " قلم"))
            items.forEach { it0 ->
                val key = "kit_" + it0.id
                val box = LinearLayout(this).apply {
                    orientation = LinearLayout.HORIZONTAL
                    setPadding(dp(12), dp(11), dp(12), dp(11))
                    background = roundBg(GLASS, BR, dp(12))
                }
                val tick = TextView(this).apply {
                    textSize = 13f; gravity = Gravity.CENTER
                    width = dp(26); height = dp(26)
                }
                fun paint() {
                    val on = prefs.getBoolean(key, false)
                    tick.text = if (on) "✓" else ""
                    tick.setTextColor(Color.BLACK)
                    tick.background = if (on) roundBg(INK, 0, dp(8)) else roundBg(0, BR2, dp(8))
                }
                paint()
                val txt = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
                txt.addView(TextView(this).apply {
                    text = it0.name; setTextColor(INK); textSize = 14f
                    typeface = fontB
                })
                txt.addView(TextView(this).apply {
                    text = it0.why; setTextColor(DIM); textSize = 11.5f
                    setLineSpacing(dp(4).toFloat(), 1f)
                    setPadding(0, dp(3), 0, 0)
                })
                val meta = StringBuilder("≈ ${fa(it0.price / 1000)} هزار تومان")
                if (it0.alt.isNotEmpty()) meta.append("  ·  جایگزین: ${it0.alt}")
                txt.addView(TextView(this).apply {
                    text = meta.toString(); setTextColor(DIM2); textSize = 10.5f
                    setPadding(0, dp(4), 0, 0)
                })
                box.addView(tick, LinearLayout.LayoutParams(dp(26), dp(26)).apply {
                    marginEnd = dp(11); topMargin = dp(2)
                })
                box.addView(txt, LinearLayout.LayoutParams(0, WRAP_CONTENT, 1f))
                box.setOnClickListener {
                    prefs.edit().putBoolean(key, !prefs.getBoolean(key, false)).apply()
                    paint(); refresh()
                }
                c.addView(box, lp().apply { bottomMargin = dp(8) })
            }
        }

        c.addView(sectionLabel("سری دوم — بعداً لازم می‌شود"))
        Kit.bySeries(2).forEach {
            c.addView(TextView(this).apply {
                text = "•  ${it.name}  —  ≈ ${fa(it.price / 1000)} هزار"
                setTextColor(DIM2); textSize = 12f
                setPadding(dp(4), dp(5), dp(4), dp(5))
            })
        }
        c.addView(hint("می‌توانی بدون اقلام اختیاری شروع کنی. این فهرست بعداً هم در تب «بیشتر» در دسترس است."))
        return scroll(c)
    }

    // ---------- صفحهٔ ۳: پروفایل ----------
    private fun pageProfile(): View {
        val c = col()
        c.addView(body("این مقادیر پایهٔ محاسبات برنامه‌اند. بعداً در تب پروفایل قابل تغییرند."))
        val fields = listOf(
            Triple("سن", "prof_age", "۱۴ سال"),
            Triple("پایه", "prof_grade", "نهم"),
            Triple("قد", "prof_h", "۱۷۰ cm"),
            Triple("بیداری", "prof_wake", "۰۵:۰۰"),
            Triple("خواب", "prof_sleep", "۲۱:۰۰"),
            Triple("روزهای فوتبال", "prof_foot", "یکشنبه، سه‌شنبه، پنجشنبه")
        )
        fields.forEach { (label, _, v) ->
            val r = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(dp(13), dp(13), dp(13), dp(13))
                background = roundBg(GLASS, BR, dp(12))
            }
            r.addView(TextView(this).apply {
                text = label; setTextColor(DIM); textSize = 13f
            }, LinearLayout.LayoutParams(0, WRAP_CONTENT, 1f))
            r.addView(TextView(this).apply {
                text = v; setTextColor(INK); textSize = 13f
                typeface = fontB
            })
            c.addView(r, lp().apply { bottomMargin = dp(8) })
        }
        c.addView(hint("ساعت بیداری ۰۵:۰۰ است نه ۰۴:۰۰ — در ۱۴ سالگی کمتر از ۸ ساعت خواب مستقیماً روی رشد قد و تمرکز اثر منفی دارد."))
        return scroll(c)
    }

    // ---------- صفحهٔ ۴: مجوزها ----------
    private fun pagePerms(): View {
        val c = col()
        c.addView(body("اپ بدون این مجوزها هم کار می‌کند، ولی بعضی قابلیت‌ها غیرفعال می‌مانند. همه اختیاری‌اند."))
        listOf(
            Triple("اعلان‌ها", "یادآور سر هر بلوک برنامه و کوئست‌های عقب‌افتاده", true),
            Triple("آمار استفاده", "برای سنجش واقعی زمان صفحه‌نمایش و سقف ۴۵ دقیقه‌ای", false),
            Triple("دسترس‌پذیری", "بلاک کردن اپ‌ها و سایت‌های مضر", false),
            Triple("ذخیره‌سازی", "عکس پیشرفت ماهانه — فقط روی گوشی", false)
        ).forEach { (t, d, req) ->
            val box = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(dp(13), dp(12), dp(13), dp(12))
                background = roundBg(GLASS, BR, dp(12))
            }
            box.addView(TextView(this).apply {
                text = t + if (req) "" else "   (اختیاری)"
                setTextColor(INK); textSize = 14f; typeface = fontB
            })
            box.addView(TextView(this).apply {
                text = d; setTextColor(DIM); textSize = 11.5f
                setPadding(0, dp(3), 0, 0); setLineSpacing(dp(4).toFloat(), 1f)
            })
            c.addView(box, lp().apply { bottomMargin = dp(8) })
        }
        val b = Button(this).apply {
            text = "درخواست مجوز اعلان"
            setTextColor(INK); textSize = 13f
            background = roundBg(0, BR2, dp(12)); stateListAnimator = null
            setOnClickListener {
                if (Build.VERSION.SDK_INT >= 33) {
                    requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 1)
                } else toast("در این نسخهٔ اندروید نیازی نیست")
            }
        }
        c.addView(b, lp().apply { topMargin = dp(6); height = dp(48) })
        c.addView(hint("اپ مجوز اینترنت ندارد. هیچ داده‌ای از گوشی خارج نمی‌شود."))
        return scroll(c)
    }

    // ---------- صفحهٔ ۵ ----------
    private fun pageStart(): View {
        val c = col()
        val left = Kit.bySeries(1).count { !prefs.getBoolean("kit_" + it.id, false) && it.tier == 0 }
        c.addView(TextView(this).apply {
            text = if (left == 0) "◆" else "◷"
            setTextColor(INK); textSize = 44f; gravity = Gravity.CENTER
            setPadding(0, dp(24), 0, dp(10))
        })
        c.addView(body(
            if (left == 0) "همهٔ اقلام ضروری آماده است. با زدن START روز اول شروع می‌شود و برنامه از همین لحظه ساخته می‌شود."
            else "هنوز ${fa(left)} قلم ضروری تهیه نشده. می‌توانی شروع کنی، ولی بعضی روتین‌ها ناقص اجرا می‌شوند."
        ))
        c.addView(sectionLabel("قوانین ثابت سیستم"))
        listOf(
            "کدو و بادمجان در هیچ وعده‌ای نمی‌آید",
            "تلگرام بلاک نمی‌شود — فقط سقف ۴۵ دقیقه",
            "باشگاه تو فوتبال است؛ هیچ بلوک بدن‌سازی در برنامه نیست",
            "تمرین قدرتی فعلاً خانگی با وزن بدن",
            "فوتبال: یکشنبه، سه‌شنبه، پنجشنبه ۱۴:۰۰–۱۵:۳۰"
        ).forEach { c.addView(row("·", it)) }
        return scroll(c)
    }

    private fun finishSetup() {
        prefs.edit()
            .putBoolean("started", true)
            .putLong("startDate", System.currentTimeMillis())
            .apply()
        launchMain()
    }

    private fun launchMain() {
        startActivity(Intent(this, MainActivity::class.java))
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        finish()
    }

    // ---------- helpers ----------
    /** فونت را روی کل درخت ویو اعمال می‌کند — تضمین می‌کند هیچ متنی جا نماند */
    private fun applyFont(v: View) {
        when (v) {
            is android.view.ViewGroup -> for (i in 0 until v.childCount) applyFont(v.getChildAt(i))
            is TextView -> if (v.typeface !== fontB) v.typeface = fontR
        }
    }

    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()
    private fun lp() = LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT)
    private fun col() = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(16), dp(4), dp(16), dp(20))
    }
    private fun scroll(v: View) = ScrollView(this).apply {
        isVerticalScrollBarEnabled = false
        addView(v)
    }
    private fun body(t: String) = TextView(this).apply {
        text = t; setTextColor(Color.parseColor("#d6d6db")); textSize = 13.5f
        setLineSpacing(dp(7).toFloat(), 1f)
        setPadding(0, 0, 0, dp(14))
    }
    private fun hint(t: String) = TextView(this).apply {
        text = t; setTextColor(DIM2); textSize = 11.5f
        setLineSpacing(dp(5).toFloat(), 1f)
        setPadding(dp(2), dp(14), dp(2), 0)
    }
    private fun sectionLabel(t: String) = TextView(this).apply {
        text = t; setTextColor(DIM); textSize = 11f
        typeface = fontB
        setPadding(dp(2), dp(16), dp(2), dp(8))
    }
    private fun row(ic: String, t: String): View {
        val r = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(dp(2), dp(7), dp(2), dp(7))
        }
        r.addView(TextView(this).apply {
            text = ic; setTextColor(INK); textSize = 13f
            width = dp(24); gravity = Gravity.CENTER
        })
        r.addView(TextView(this).apply {
            text = t; setTextColor(Color.parseColor("#c9c9d0")); textSize = 12.5f
            setLineSpacing(dp(5).toFloat(), 1f)
        }, LinearLayout.LayoutParams(0, WRAP_CONTENT, 1f).apply { marginStart = dp(6) })
        return r
    }
    private fun roundBg(fill: Int, stroke: Int, radius: Int) = GradientDrawable().apply {
        cornerRadius = radius.toFloat()
        setColor(fill)
        if (stroke != 0) setStroke(dp(1), stroke)
    }
    private fun toast(s: String) = Toast.makeText(this, s, Toast.LENGTH_SHORT).show()

    private fun fa(n: Int): String {
        val d = charArrayOf('۰','۱','۲','۳','۴','۵','۶','۷','۸','۹')
        return n.toString().map { if (it.isDigit()) d[it - '0'] else it }.joinToString("")
    }
}
