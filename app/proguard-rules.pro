# اپ از reflection استفاده نمی‌کند، پس قواعد کم و ساده‌اند.

# اکتیویتی‌ها و گیرنده‌ها از مانیفست نام‌برده می‌شوند
-keep class ir.ascend.app.StartActivity { *; }
-keep class ir.ascend.app.MainActivity { *; }
-keep class ir.ascend.app.AlarmRx { *; }
-keep class ir.ascend.app.BootRx { *; }
-keep class ir.ascend.app.ActionRx { *; }
-keep class ir.ascend.app.Widget { *; }

# پل جاوااسکریپت با نام از WebView صدا زده می‌شود
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# حذف لاگ‌های دیباگ از نسخهٔ نهایی
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

-dontwarn kotlin.**
