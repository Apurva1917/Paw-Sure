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
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.outlined.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.pawsure.app.R
import com.pawsure.app.domain.model.PetProfile
import com.pawsure.app.ui.components.*
import com.pawsure.app.ui.theme.PawsureColors

/**
 * Screen 3 — Pet Details
 * Recreates the third reference screen:
 * - Vibrant yellow upper background (#FFD21A)
 * - Decorative paw prints
 * - Large centered 3D-style pet illustration (with toggle to inspect real photo)
 * - Rounded white/ivory bottom sheet with rounded information cards:
 *   Pet name, species, breed, age, feeding, medication & care requirements, emergency vet, vaccines
 * - Dedicated 48dp+ actions for Edit Pet, Create Care Request, and Health Records
 */
@Composable
fun PetDetailsScreen(
    pet: PetProfile,
    onBack: () -> Unit,
    onEditPet: (String) -> Unit,
    onCreateCareRequest: (String) -> Unit,
    onOpenHealthRecords: (String) -> Unit,
    onTriggerSos: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showRealPhoto by remember { mutableStateOf(false) }
    val hasPhoto = pet.photoResName != null || !pet.photoUrl.isNullOrBlank()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(PawsureColors.VibrantYellow)
    ) {
        // Decorative paw prints across the vibrant yellow hero header
        PawPrintPatternOverlay(
            modifier = Modifier
                .fillMaxWidth()
                .height(340.dp),
            pawColor = PawsureColors.PureWhiteCard.copy(alpha = 0.28f)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            // Top bar with Back + Illustration/Photo Toggle + Accessible SOS
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                Surface(
                    onClick = onBack,
                    shape = CircleShape,
                    color = PawsureColors.PureWhiteCard,
                    shadowElevation = 4.dp,
                    modifier = Modifier.size(48.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                            contentDescription = "Back to dashboard",
                            tint = PawsureColors.CharcoalText
                        )
                    }
                }

                if (hasPhoto) {
                    Surface(
                        onClick = { showRealPhoto = !showRealPhoto },
                        shape = RoundedCornerShape(50),
                        color = PawsureColors.PureWhiteCard.copy(alpha = 0.9f),
                        modifier = Modifier.defaultMinSize(minHeight = 44.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Icon(
                                imageVector = if (showRealPhoto) Icons.Rounded.AutoAwesome else Icons.Rounded.PhotoCamera,
                                contentDescription = null,
                                tint = PawsureColors.CharcoalText,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = if (showRealPhoto) "3D View" else "Real Photo",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                color = PawsureColors.CharcoalText
                            )
                        }
                    }
                }

                EmergencySosButton(onClick = onTriggerSos)
            }

            // Large Centered Pet Illustration / Photo Hero
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(210.dp)
            ) {
                if (showRealPhoto && hasPhoto) {
                    val photoRes = when (pet.photoResName) {
                        "pet_bruno" -> R.drawable.pet_bruno
                        "pet_luna" -> R.drawable.pet_luna
                        "caregiver_walk" -> R.drawable.caregiver_walk
                        else -> null
                    }
                    Surface(
                        shape = RoundedCornerShape(36.dp),
                        border = BorderStroke(5.dp, PawsureColors.PureWhiteCard),
                        shadowElevation = 10.dp,
                        modifier = Modifier.size(178.dp)
                    ) {
                        if (photoRes != null) {
                            Image(
                                painter = painterResource(id = photoRes),
                                contentDescription = "${pet.name} photo",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        } else {
                            AsyncImage(
                                model = pet.photoUrl,
                                contentDescription = "${pet.name} photo",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        }
                    }
                } else {
                    Cute3DPetIllustration(
                        species = pet.species,
                        size = 200.dp
                    )
                }
            }

            // Rounded Cream/White Bottom Sheet with Information Cards & Actions
            Surface(
                shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp),
                color = PawsureColors.WarmCreamBackground,
                shadowElevation = 12.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .navigationBarsPadding()
                        .padding(horizontal = 20.dp, vertical = 22.dp)
                ) {
                    // Header Info: Name, Species, Breed, Age
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = pet.name,
                                style = MaterialTheme.typography.displaySmall,
                                color = PawsureColors.CharcoalText
                            )
                            Text(
                                text = "${pet.breed} • ${pet.ageLabel}",
                                style = MaterialTheme.typography.bodyLarge,
                                color = PawsureColors.MutedCharcoalText
                            )
                        }
                        StatusChip(
                            label = pet.species.displayName,
                            backgroundColor = PawsureColors.SoftYellow,
                            contentColor = PawsureColors.CharcoalText
                        )
                    }

                    // Key Summary Pills
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        MetricTile(
                            label = "Society",
                            value = pet.societyName.substringBefore('•').trim(),
                            modifier = Modifier.weight(1f)
                        )
                        MetricTile(
                            label = "Vaccines",
                            value = "${pet.vaccinationRecords.size} on file",
                            modifier = Modifier.weight(1f)
                        )
                    }

                    // Special Care Requirements Card
                    if (pet.specialCareRequirements.isNotBlank()) {
                        DetailInfoCard(
                            icon = Icons.Outlined.Shield,
                            title = "Special Care & Precautions",
                            body = pet.specialCareRequirements,
                            accentColor = PawsureColors.SoftPeachAccent
                        )
                    }

                    // Food Instructions Card
                    DetailInfoCard(
                        icon = Icons.Outlined.Restaurant,
                        title = "Feeding & Hydration Instructions",
                        body = pet.foodInstructions,
                        accentColor = PawsureColors.PaleButterYellow
                    )

                    // Medication Instructions Card
                    DetailInfoCard(
                        icon = Icons.Outlined.Medication,
                        title = "Medication Instructions",
                        body = pet.medicationInstructions,
                        accentColor = PawsureColors.PureWhiteCard
                    )

                    // Emergency Veterinary Contact Card
                    DetailInfoCard(
                        icon = Icons.Outlined.LocalHospital,
                        title = "Emergency Veterinary Contact",
                        body = "${pet.emergencyVetContactName}\n${pet.emergencyVetPhone}",
                        accentColor = PawsureColors.UrgentCoralSurface
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // Primary Action: Create Care Request
                    PawsureButton(
                        text = "Create Care Request for ${pet.name}",
                        onClick = { onCreateCareRequest(pet.petId) },
                        leadingIcon = Icons.Rounded.AddTask,
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Secondary Row Actions: Edit Pet & Health Records
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        PawsureButton(
                            text = "Edit Pet",
                            onClick = { onEditPet(pet.petId) },
                            variant = PawsureButtonVariant.SECONDARY_PEACH,
                            leadingIcon = Icons.Outlined.Edit,
                            modifier = Modifier.weight(1f)
                        )
                        PawsureButton(
                            text = "Health Records",
                            onClick = { onOpenHealthRecords(pet.petId) },
                            variant = PawsureButtonVariant.OUTLINED,
                            leadingIcon = Icons.Outlined.MedicalInformation,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun MetricTile(
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    PawsureCard(
        containerColor = PawsureColors.PureWhiteCard,
        modifier = modifier
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = PawsureColors.MutedCharcoalText
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
            color = PawsureColors.CharcoalText
        )
    }
}

@Composable
private fun DetailInfoCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    body: String,
    accentColor: androidx.compose.ui.graphics.Color
) {
    PawsureCard(
        containerColor = PawsureColors.PureWhiteCard,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(accentColor)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = PawsureColors.CharcoalText
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = body,
                    style = MaterialTheme.typography.bodyMedium,
                    color = PawsureColors.CharcoalText
                )
            }
        }
    }
}
