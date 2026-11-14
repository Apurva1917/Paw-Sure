# Keep Kotlin serialization and Hilt generated classes
-keepattributes *Annotation*
-keepclassmembers class * {
    @kotlinx.serialization.SerialName <fields>;
}
