package com.pawsure.app.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val PawsureTypography = Typography(
    displaySmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        color = PawsureColors.CharcoalText
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        color = PawsureColors.CharcoalText
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 17.sp,
        lineHeight = 24.sp,
        color = PawsureColors.CharcoalText
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 15.sp,
        lineHeight = 22.sp,
        color = PawsureColors.CharcoalText
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = PawsureColors.MutedCharcoalText
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = PawsureColors.CharcoalText
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        color = PawsureColors.CharcoalText
    )
)

val PawsureShapes = Shapes(
    small = RoundedCornerShape(14.dp),
    medium = RoundedCornerShape(20.dp),
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(28.dp)
)

private val PawsureLightColorScheme = lightColorScheme(
    primary = PawsureColors.VibrantYellow,
    onPrimary = PawsureColors.CharcoalText,
    primaryContainer = PawsureColors.SoftYellow,
    onPrimaryContainer = PawsureColors.CharcoalText,
    secondary = PawsureColors.SoftPeachAccent,
    onSecondary = PawsureColors.CharcoalText,
    tertiary = PawsureColors.UrgentCoral,
    onTertiary = PawsureColors.PureWhiteCard,
    background = PawsureColors.WarmCreamBackground,
    onBackground = PawsureColors.CharcoalText,
    surface = PawsureColors.PureWhiteCard,
    onSurface = PawsureColors.CharcoalText,
    surfaceVariant = PawsureColors.SoftPeachAccent,
    onSurfaceVariant = PawsureColors.MutedCharcoalText,
    error = PawsureColors.UrgentCoral,
    onError = PawsureColors.PureWhiteCard,
    outline = PawsureColors.DividerSand
)

@Composable
fun PawsureTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = PawsureLightColorScheme,
        typography = PawsureTypography,
        shapes = PawsureShapes,
        content = content
    )
}
