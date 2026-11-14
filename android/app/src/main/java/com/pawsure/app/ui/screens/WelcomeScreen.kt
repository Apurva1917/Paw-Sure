package com.pawsure.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.VerifiedUser
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pawsure.app.R
import com.pawsure.app.ui.components.*
import com.pawsure.app.ui.theme.PawsureColors

/**
 * Screen 1 — Welcome
 * Recreates the organic pet-photo collage composition on warm ivory cream (#FFF9E8)
 * with Pawsure branding, "Be sure, whoever's caring." headline, trusted care copy,
 * and large vibrant yellow Get Started CTA.
 */
@Composable
fun WelcomeScreen(
    onGetStarted: () -> Unit,
    modifier: Modifier = Modifier,
    onOpenOnboarding: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(PawsureColors.WarmCreamBackground)
    ) {
        // Subtle paw-print pattern backdrop
        PawPrintPatternOverlay(
            modifier = Modifier.fillMaxSize(),
            pawColor = PawsureColors.SoftYellow.copy(alpha = 0.55f)
        )

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 18.dp)
        ) {
            // Top Pawsure Brand Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                PawsureBrandBadge()
                StatusChip(
                    label = "Verified Care",
                    backgroundColor = PawsureColors.PureWhiteCard,
                    contentColor = PawsureColors.CharcoalText
                )
            }

            Spacer(modifier = Modifier.height(22.dp))

            // Organic Pet-Photo Collage in Upper Section
            OrganicPetPhotoCollage(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(330.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Rounded Cream/White Editorial Copy Card + Headline
            Text(
                text = "Be sure, whoever's caring.",
                style = MaterialTheme.typography.displaySmall,
                textAlign = TextAlign.Center,
                color = PawsureColors.CharcoalText
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Arrange trusted society care with opted-in Friends and verified Helpers. Track photo & voice evidence, manage multi-pet routines, and activate backup cover seamlessly.",
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center,
                color = PawsureColors.MutedCharcoalText
            )

            Spacer(modifier = Modifier.height(18.dp))

            // Preserved multi-role & channel transparency pills
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
                modifier = Modifier.fillMaxWidth()
            ) {
                StatusChip(
                    label = "Owner • Friend • Helper",
                    backgroundColor = PawsureColors.SoftYellow,
                    contentColor = PawsureColors.CharcoalText
                )
                StatusChip(
                    label = "Society-First",
                    backgroundColor = PawsureColors.SoftPeachAccent,
                    contentColor = PawsureColors.CharcoalText
                )
            }

            Spacer(modifier = Modifier.weight(1f, fill = true))
            Spacer(modifier = Modifier.height(24.dp))

            // Large Vibrant Yellow Get Started CTA Button (min 56dp touch height)
            Button(
                onClick = onGetStarted,
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = PawsureColors.VibrantYellow,
                    contentColor = PawsureColors.CharcoalText
                ),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(58.dp)
            ) {
                Text(
                    text = "Get Started",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(PawsureColors.CharcoalText)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                        contentDescription = null,
                        tint = PawsureColors.VibrantYellow,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            if (onOpenOnboarding != null) {
                Spacer(modifier = Modifier.height(6.dp))
                TextButton(
                    onClick = onOpenOnboarding,
                    modifier = Modifier
                        .fillMaxWidth()
                        .defaultMinSize(minHeight = 48.dp)
                ) {
                    Text(
                        text = "Register by role (Owner, Friend, Helper, Coordinator)",
                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                        color = PawsureColors.CharcoalText
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Icon(
                    imageVector = Icons.Rounded.VerifiedUser,
                    contentDescription = null,
                    tint = PawsureColors.ConfirmedGreen,
                    modifier = Modifier.size(16.dp)
                )
                Text(
                    text = "Evidence-verified routines • Emergency escalation ready",
                    style = MaterialTheme.typography.labelMedium,
                    color = PawsureColors.MutedCharcoalText
                )
            }
        }
    }
}

@Composable
private fun OrganicPetPhotoCollage(
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        // Large soft yellow organic backdrop circle
        Box(
            modifier = Modifier
                .size(230.dp)
                .align(Alignment.Center)
                .clip(CircleShape)
                .background(PawsureColors.SoftYellow.copy(alpha = 0.72f))
        )

        // Small decorative yellow & peach accent dots
        Box(
            modifier = Modifier
                .size(28.dp)
                .align(Alignment.TopEnd)
                .offset(x = (-22).dp, y = 16.dp)
                .clip(CircleShape)
                .background(PawsureColors.VibrantYellow)
        )
        Box(
            modifier = Modifier
                .size(20.dp)
                .align(Alignment.BottomStart)
                .offset(x = 24.dp, y = (-26).dp)
                .clip(CircleShape)
                .background(PawsureColors.SoftPeachAccent)
        )

        // Left organic rounded pill photo (Bruno)
        Surface(
            shape = RoundedCornerShape(46.dp),
            border = BorderStroke(4.dp, PawsureColors.PureWhiteCard),
            shadowElevation = 10.dp,
            modifier = Modifier
                .width(156.dp)
                .height(216.dp)
                .align(Alignment.TopStart)
                .offset(x = 12.dp, y = 12.dp)
                .rotate(-4f)
        ) {
            Image(
                painter = painterResource(id = R.drawable.pet_bruno),
                contentDescription = "Bruno the Golden Retriever",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }

        // Top-right organic circular/squircle photo (Luna)
        Surface(
            shape = RoundedCornerShape(42.dp),
            border = BorderStroke(4.dp, PawsureColors.PureWhiteCard),
            shadowElevation = 10.dp,
            modifier = Modifier
                .size(142.dp)
                .align(Alignment.TopEnd)
                .offset(x = (-10).dp, y = 26.dp)
                .rotate(5f)
        ) {
            Image(
                painter = painterResource(id = R.drawable.pet_luna),
                contentDescription = "Luna the indoor cat",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }

        // Bottom-right organic photo tile (Caregiver Walk)
        Surface(
            shape = RoundedCornerShape(36.dp),
            border = BorderStroke(4.dp, PawsureColors.VibrantYellow),
            shadowElevation = 12.dp,
            modifier = Modifier
                .width(164.dp)
                .height(142.dp)
                .align(Alignment.BottomEnd)
                .offset(x = (-16).dp, y = (-6).dp)
                .rotate(-2f)
        ) {
            Image(
                painter = painterResource(id = R.drawable.caregiver_walk),
                contentDescription = "Verified caregiver walk check-in",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }

        // Floating yellow care check pill badge
        Surface(
            shape = RoundedCornerShape(50),
            color = PawsureColors.PureWhiteCard,
            shadowElevation = 8.dp,
            border = BorderStroke(1.5.dp, PawsureColors.VibrantYellow),
            modifier = Modifier
                .align(Alignment.BottomStart)
                .offset(x = 18.dp, y = (-12).dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(PawsureColors.ConfirmedGreen)
                )
                Text(
                    text = "Live Photo Proof",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                    color = PawsureColors.CharcoalText
                )
            }
        }
    }
}
