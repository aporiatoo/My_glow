import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

/**
 * کلید امضا از keystore.properties یا متغیرهای محیطی CI خوانده می‌شود.
 * اگر هیچ‌کدام نبود، به کلید دیباگ برمی‌گردد تا بیلد محلی نشکند.
 *
 * مهم: کلید باید بین نسخه‌ها ثابت بماند، وگرنه اندروید هر بیلد را
 * اپ جداگانه می‌بیند و برای به‌روزرسانی باید نسخهٔ قبلی حذف شود.
 */
val keystoreProps = Properties().apply {
    val f = rootProject.file("keystore.properties")
    if (f.exists()) f.inputStream().use { load(it) }
}

fun secret(key: String, env: String): String? =
    keystoreProps.getProperty(key) ?: System.getenv(env)

val hasReleaseKey = secret("storeFile", "KEYSTORE_FILE") != null

android {
    namespace = "ir.ascend.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "ir.ascend.app"
        minSdk = 26
        targetSdk = 34
        versionCode = (System.getenv("VERSION_CODE") ?: "1").toInt()
        versionName = System.getenv("VERSION_NAME") ?: "1.0"
    }

    signingConfigs {
        if (hasReleaseKey) {
            create("release") {
                storeFile = file(secret("storeFile", "KEYSTORE_FILE")!!)
                storePassword = secret("storePassword", "KEYSTORE_PASSWORD")
                keyAlias = secret("keyAlias", "KEY_ALIAS")
                keyPassword = secret("keyPassword", "KEY_PASSWORD")
                enableV1Signing = true
                enableV2Signing = true
                enableV3Signing = true
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = if (hasReleaseKey)
                signingConfigs.getByName("release")
            else
                signingConfigs.getByName("debug")
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    packaging {
        resources.excludes += setOf("META-INF/*", "kotlin/**", "**.kotlin_builtins")
        // تصاویر webp از قبل فشرده‌اند؛ فشرده‌سازی دوباره فقط لود را کند می‌کند
        androidResources.noCompress += listOf("webp", "html")
    }

    lint {
        abortOnError = false
        checkReleaseBuilds = false
    }
}

dependencies {
    // عمداً بدون androidx — اپ فقط از APIهای خود اندروید استفاده می‌کند.
}
