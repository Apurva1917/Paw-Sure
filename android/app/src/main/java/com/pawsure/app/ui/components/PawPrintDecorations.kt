package com.pawsure.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pawsure.app.domain.model.PetSpecies
import com.pawsure.app.ui.theme.PawsureColors

/**
 * Retained Pawsure emblem + wordmark across redesigned screens.
 */
@Composable
fun PawsureBrandBadge(
    modifier: Modifier = Modifier,
    darkContent: Boolean = true
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        modifier = modifier
    ) {
        Surface(
            shape = RoundedCornerShape(14.dp),
            color = PawsureColors.VibrantYellow,
            shadowElevation = 4.dp,
            modifier = Modifier.size(40.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = Icons.Rounded.Favorite,
                    contentDescription = "Pawsure emblem",
                    tint = PawsureColors.CharcoalText,
                    modifier = Modifier.size(22.dp)
                )
            }
        }
        Column {
            Text(
                text = "Pawsure",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold),
                color = if (darkContent) PawsureColors.CharcoalText else PawsureColors.PureWhiteCard
            )
            Text(
                text = "TRUSTED SOCIETY PET CARE",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = PawsureColors.MutedCharcoalText
            )
        }
    }
}

/**
 * Subtle scatter of rotated paw-print silhouettes drawn smoothly on Canvas.
 */
@Composable
fun PawPrintPatternOverlay(
    modifier: Modifier = Modifier,
    pawColor: Color = PawsureColors.DeepMarigoldYellow.copy(alpha = 0.22f)
) {
    Canvas(modifier = modifier) {
        val spots = listOf(
            Triple(0.14f, 0.16f, -18f),
            Triple(0.84f, 0.12f, 22f),
            Triple(0.22f, 0.45f, 15f),
            Triple(0.88f, 0.42f, -24f),
            Triple(0.10f, 0.78f, 28f),
            Triple(0.82f, 0.76f, -14f)
        )
        spots.forEach { (xRatio, yRatio, angle) ->
            val center = Offset(size.width * xRatio, size.height * yRatio)
            rotate(degrees = angle, pivot = center) {
                drawPawPrint(center = center, scale = 1.0f, color = pawColor)
            }
        }
    }
}

private fun DrawScope.drawPawPrint(
    center: Offset,
    scale: Float,
    color: Color
) {
    val padW = 26f * scale
    val padH = 22f * scale
    drawOval(
        color = color,
        topLeft = Offset(center.x - padW / 2f, center.y - padH / 2f + 6f * scale),
        size = Size(padW, padH)
    )
    val toeOffsets = listOf(
        Offset(-16f * scale, -14f * scale),
        Offset(-6f * scale, -22f * scale),
        Offset(6f * scale, -22f * scale),
        Offset(16f * scale, -14f * scale)
    )
    toeOffsets.forEach { offset ->
        drawOval(
            color = color,
            topLeft = Offset(center.x + offset.x - 5f * scale, center.y + offset.y - 6.5f * scale),
            size = Size(10f * scale, 13f * scale)
        )
    }
}

/**
 * Cute 3D-styled layered pet hero illustration used on Screen 3 (Pet Details)
 * and promotional banner accents, rendered cleanly in Compose Canvas + shapes.
 */
@Composable
fun Cute3DPetIllustration(
    species: PetSpecies,
    size: Dp = 180.dp,
    modifier: Modifier = Modifier
) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier.size(size)
    ) {
        // Soft ground shadow beneath 3D pet character
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 8.dp)
                .width(size * 0.65f)
                .height(22.dp)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            PawsureColors.CharcoalText.copy(alpha = 0.18f),
                            Color.Transparent
                        )
                    )
                )
        )

        // Warm halo ring behind character
        Box(
            modifier = Modifier
                .size(size * 0.84f)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            PawsureColors.PureWhiteCard.copy(alpha = 0.65f),
                            PawsureColors.SoftYellow.copy(alpha = 0.15f)
                        )
                    )
                )
        )

        Canvas(
            modifier = Modifier
                .size(size * 0.78f)
                .padding(bottom = 8.dp)
        ) {
            val w = this.size.width
            val h = this.size.height
            val coatPrimary = when (species) {
                PetSpecies.DOG -> Color(0xFFE7A95A)
                PetSpecies.CAT -> Color(0xFFF3ECE2)
                PetSpecies.RABBIT -> Color(0xFFF7EFE7)
                PetSpecies.GUINEA_PIG -> Color(0xFFD99862)
                PetSpecies.BIRD -> Color(0xFF7DD3FC)
                PetSpecies.FISH -> Color(0xFFFB923C)
            }
            val coatHighlight = when (species) {
                PetSpecies.DOG -> Color(0xFFF6CE88)
                PetSpecies.CAT -> Color(0xFFFFFFFF)
                PetSpecies.RABBIT -> Color(0xFFFFFFFF)
                PetSpecies.GUINEA_PIG -> Color(0xFFF4C59D)
                PetSpecies.BIRD -> Color(0xFFBAE6FD)
                PetSpecies.FISH -> Color(0xFFFDBA74)
            }
            val earAccent = when (species) {
                PetSpecies.DOG -> Color(0xFFB57234)
                PetSpecies.CAT -> Color(0xFFF4A99E)
                PetSpecies.RABBIT -> Color(0xFFF4A99E)
                PetSpecies.GUINEA_PIG -> Color(0xFF8C532B)
                PetSpecies.BIRD -> Color(0xFFFFD21A)
                PetSpecies.FISH -> Color(0xFFFDE047)
            }

            // Left & right ears
            if (species == PetSpecies.RABBIT) {
                drawOval(
                    color = coatPrimary,
                    topLeft = Offset(w * 0.24f, h * 0.02f),
                    size = Size(w * 0.18f, h * 0.40f)
                )
                drawOval(
                    color = earAccent,
                    topLeft = Offset(w * 0.28f, h * 0.08f),
                    size = Size(w * 0.10f, h * 0.28f)
                )
                drawOval(
                    color = coatPrimary,
                    topLeft = Offset(w * 0.58f, h * 0.02f),
                    size = Size(w * 0.18f, h * 0.40f)
                )
                drawOval(
                    color = earAccent,
                    topLeft = Offset(w * 0.62f, h * 0.08f),
                    size = Size(w * 0.10f, h * 0.28f)
                )
            } else {
                drawOval(
                    color = earAccent,
                    topLeft = Offset(w * 0.12f, h * 0.14f),
                    size = Size(w * 0.22f, h * 0.30f)
                )
                drawOval(
                    color = earAccent,
                    topLeft = Offset(w * 0.66f, h * 0.14f),
                    size = Size(w * 0.22f, h * 0.30f)
                )
            }

            // Rounded torso with 3D highlight gradient
            drawOval(
                brush = Brush.verticalGradient(listOf(coatHighlight, coatPrimary)),
                topLeft = Offset(w * 0.23f, h * 0.52f),
                size = Size(w * 0.54f, h * 0.42f)
            )

            // Cute collar (Coral / Yellow)
            drawRoundRect(
                color = PawsureColors.UrgentCoral,
                topLeft = Offset(w * 0.30f, h * 0.57f),
                size = Size(w * 0.40f, h * 0.08f),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(20f, 20f)
            )
            // Gold collar tag
            drawCircle(
                color = PawsureColors.VibrantYellow,
                radius = w * 0.045f,
                center = Offset(w * 0.50f, h * 0.65f)
            )

            // 3D Head sphere
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(coatHighlight, coatPrimary),
                    center = Offset(w * 0.44f, h * 0.30f),
                    radius = w * 0.35f
                ),
                radius = w * 0.29f,
                center = Offset(w * 0.50f, h * 0.38f)
            )

            // Snout / Muzzle patch
            drawOval(
                color = Color(0xFFFFF8EE),
                topLeft = Offset(w * 0.35f, h * 0.39f),
                size = Size(w * 0.30f, h * 0.19f)
            )

            // Expressive eyes with glossy catchlight
            listOf(0.39f, 0.61f).forEach { eyeX ->
                drawCircle(
                    color = PawsureColors.CharcoalText,
                    radius = w * 0.036f,
                    center = Offset(w * eyeX, h * 0.36f)
                )
                drawCircle(
                    color = Color.White,
                    radius = w * 0.013f,
                    center = Offset(w * eyeX - w * 0.011f, h * 0.348f)
                )
            }

            // Rosy cheeks
            drawCircle(
                color = PawsureColors.UrgentCoral.copy(alpha = 0.38f),
                radius = w * 0.042f,
                center = Offset(w * 0.31f, h * 0.43f)
            )
            drawCircle(
                color = PawsureColors.UrgentCoral.copy(alpha = 0.38f),
                radius = w * 0.042f,
                center = Offset(w * 0.69f, h * 0.43f)
            )

            // Glossy nose
            drawOval(
                color = PawsureColors.CharcoalText,
                topLeft = Offset(w * 0.455f, h * 0.415f),
                size = Size(w * 0.09f, h * 0.06f)
            )
        }
    }
}
