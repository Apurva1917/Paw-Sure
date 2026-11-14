package com.pawsure.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material.icons.rounded.Sos
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.pawsure.app.R
import com.pawsure.app.domain.model.*
import com.pawsure.app.ui.theme.PawsureColors

enum class PawsureButtonVariant {
    PRIMARY_YELLOW,
    SECONDARY_PEACH,
    URGENT_CORAL,
    OUTLINED
}

/**
 * 1. PawsureButton — Minimum 48dp touch target, rounded pill corners.
 */
@Composable
fun PawsureButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: PawsureButtonVariant = PawsureButtonVariant.PRIMARY_YELLOW,
    enabled: Boolean = true,
    leadingIcon: ImageVector? = null
) {
    val containerColor = when (variant) {
        PawsureButtonVariant.PRIMARY_YELLOW -> PawsureColors.VibrantYellow
        PawsureButtonVariant.SECONDARY_PEACH -> PawsureColors.SoftPeachAccent
        PawsureButtonVariant.URGENT_CORAL -> PawsureColors.UrgentCoral
        PawsureButtonVariant.OUTLINED -> Color.Transparent
    }
    val contentColor = when (variant) {
        PawsureButtonVariant.URGENT_CORAL -> PawsureColors.PureWhiteCard
        else -> PawsureColors.CharcoalText
    }

    Button(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(24.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = containerColor,
            contentColor = contentColor,
            disabledContainerColor = PawsureColors.DividerSand,
            disabledContentColor = PawsureColors.MutedCharcoalText
        ),
        border = if (variant == PawsureButtonVariant.OUTLINED) {
            BorderStroke(1.5.dp, PawsureColors.CharcoalText)
        } else null,
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 14.dp),
        modifier = modifier.defaultMinSize(minHeight = 48.dp)
    ) {
        if (leadingIcon != null) {
            Icon(
                imageVector = leadingIcon,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

/**
 * 2. PawsureCard — Rounded card container with 24dp corners and subtle sand border.
 */
@Composable
fun PawsureCard(
    modifier: Modifier = Modifier,
    containerColor: Color = PawsureColors.PureWhiteCard,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val shape = RoundedCornerShape(24.dp)
    val border = BorderStroke(1.dp, PawsureColors.DividerSand)
    if (onClick != null) {
        Card(
            onClick = onClick,
            shape = shape,
            colors = CardDefaults.cardColors(containerColor = containerColor),
            border = border,
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = modifier
        ) {
            Column(modifier = Modifier.padding(16.dp), content = content)
        }
    } else {
        Card(
            shape = shape,
            colors = CardDefaults.cardColors(containerColor = containerColor),
            border = border,
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = modifier
        ) {
            Column(modifier = Modifier.padding(16.dp), content = content)
        }
    }
}

/**
 * 3. StatusChip — Semantic pill badge for CareTaskStatus and EvidenceStatus.
 */
@Composable
fun StatusChip(
    label: String,
    backgroundColor: Color,
    contentColor: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(50),
        color = backgroundColor,
        modifier = modifier
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = contentColor,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun CareTaskStatusChip(status: CareTaskStatus, modifier: Modifier = Modifier) {
    val (bg, fg) = when (status) {
        CareTaskStatus.COMPLETED -> PawsureColors.ConfirmedGreenSurface to PawsureColors.ConfirmedGreen
        CareTaskStatus.IN_PROGRESS,
        CareTaskStatus.ACCEPTED,
        CareTaskStatus.AWAITING_CONFIRMATION -> PawsureColors.LikelyAmberSurface to PawsureColors.LikelyAmber
        CareTaskStatus.INTERRUPTED,
        CareTaskStatus.ESCALATED,
        CareTaskStatus.DELAYED -> PawsureColors.NotConfirmedRedSurface to PawsureColors.NotConfirmedRed
        else -> PawsureColors.NeutralSlateSurface to PawsureColors.NeutralSlate
    }
    StatusChip(label = status.label, backgroundColor = bg, contentColor = fg, modifier = modifier)
}

/**
 * 4. PetProfileCard — Displays pet photo, species/breed, age, and key care note.
 */
@Composable
fun PetProfileCard(
    pet: PetProfile,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    selected: Boolean = false
) {
    PawsureCard(
        onClick = onClick,
        containerColor = if (selected) PawsureColors.SoftYellow else PawsureColors.PureWhiteCard,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(72.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(PawsureColors.SoftPeachAccent)
            ) {
                val localRes = when (pet.photoResName) {
                    "pet_bruno" -> R.drawable.pet_bruno
                    "pet_luna" -> R.drawable.pet_luna
                    "caregiver_walk" -> R.drawable.caregiver_walk
                    else -> null
                }
                when {
                    localRes != null -> Image(
                        painter = painterResource(id = localRes),
                        contentDescription = "${pet.name} photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    !pet.photoUrl.isNullOrBlank() -> AsyncImage(
                        model = pet.photoUrl,
                        contentDescription = "${pet.name} photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    else -> Cute3DPetIllustration(
                        species = pet.species,
                        size = 64.dp
                    )
                }
            }
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = pet.name,
                        style = MaterialTheme.typography.titleMedium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    StatusChip(
                        label = pet.species.displayName,
                        backgroundColor = PawsureColors.SoftPeachAccent,
                        contentColor = PawsureColors.CharcoalText
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${pet.breed} • ${pet.ageLabel}",
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                if (pet.specialCareRequirements.isNotBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = pet.specialCareRequirements,
                        style = MaterialTheme.typography.labelMedium,
                        color = PawsureColors.MutedCharcoalText,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

/**
 * 5. CareTaskCard — Shows task type, due time, caregiver, evidence state, and status.
 */
@Composable
fun CareTaskCard(
    task: CareTask,
    petNames: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    PawsureCard(
        onClick = onClick,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = task.taskType.label,
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.weight(1f)
            )
            CareTaskStatusChip(status = task.status)
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "$petNames • Due ${task.dueTimeLabel}",
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = task.instructions,
            style = MaterialTheme.typography.bodyLarge,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
        Spacer(modifier = Modifier.height(10.dp))
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = task.assignedCaregiverName ?: "Awaiting eligible caregiver",
                style = MaterialTheme.typography.labelMedium,
                color = PawsureColors.MutedCharcoalText
            )
            val evidenceLabel = task.evidence?.status?.label ?: EvidenceStatus.MISSING.label
            Text(
                text = "Evidence: $evidenceLabel",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = if (task.evidence?.status == EvidenceStatus.CONFIRMED) {
                    PawsureColors.ConfirmedGreen
                } else {
                    PawsureColors.LikelyAmber
                }
            )
        }
    }
}

/**
 * 6. CaregiverCard — Shows Friend/Helper eligibility, capacity, society, and mock ETA disclosure.
 */
@Composable
fun CaregiverCard(
    caregiver: CaregiverProfile,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier
) {
    PawsureCard(
        onClick = onSelect,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = caregiver.displayName,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = "${caregiver.societyName} • ${caregiver.role.name.replace('_', ' ')}",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            StatusChip(
                label = caregiver.availabilityStatus.name,
                backgroundColor = if (caregiver.availabilityStatus == CaregiverAvailabilityStatus.ACTIVE) {
                    PawsureColors.ConfirmedGreenSurface
                } else {
                    PawsureColors.LikelyAmberSurface
                },
                contentColor = if (caregiver.availabilityStatus == CaregiverAvailabilityStatus.ACTIVE) {
                    PawsureColors.ConfirmedGreen
                } else {
                    PawsureColors.LikelyAmber
                }
            )
        }
        Spacer(modifier = Modifier.height(10.dp))
        val etaText = if (caregiver.simulatedEtaMinutes != null) {
            "~${caregiver.simulatedEtaMinutes} min ETA (Simulated estimate)"
        } else {
            "ETA unavailable"
        }
        Text(
            text = "Capacity: ${caregiver.activeAssignedPetsCount}/${caregiver.maxPetCapacity} pets • $etaText",
            style = MaterialTheme.typography.labelMedium,
            color = PawsureColors.MutedCharcoalText
        )
    }
}

/**
 * 7. EmergencyBanner — High-contrast coral alert banner for interruptions & escalations.
 */
@Composable
fun EmergencyBanner(
    title: String,
    message: String,
    actionLabel: String,
    onActionClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(24.dp),
        color = PawsureColors.UrgentCoralSurface,
        border = BorderStroke(1.5.dp, PawsureColors.UrgentCoral),
        modifier = modifier
            .fillMaxWidth()
            .semantics { contentDescription = "Urgent alert: $title" }
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(PawsureColors.UrgentCoral)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.WarningAmber,
                        contentDescription = null,
                        tint = PawsureColors.PureWhiteCard
                    )
                }
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    color = PawsureColors.CharcoalText
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = message,
                style = MaterialTheme.typography.bodyMedium,
                color = PawsureColors.CharcoalText
            )
            Spacer(modifier = Modifier.height(12.dp))
            PawsureButton(
                text = actionLabel,
                onClick = onActionClick,
                variant = PawsureButtonVariant.URGENT_CORAL,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

/**
 * 8. EvidenceCard — Displays photo, note, completion timestamp, and explicit evidence verification status.
 */
@Composable
fun EvidenceCard(
    evidence: CareEvidence?,
    onConfirmClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val currentStatus = evidence?.status ?: EvidenceStatus.MISSING
    val (bg, fg) = when (currentStatus) {
        EvidenceStatus.CONFIRMED -> PawsureColors.ConfirmedGreenSurface to PawsureColors.ConfirmedGreen
        EvidenceStatus.SUBMITTED,
        EvidenceStatus.AWAITING_OWNER_CONFIRMATION -> PawsureColors.LikelyAmberSurface to PawsureColors.LikelyAmber
        EvidenceStatus.MISSING,
        EvidenceStatus.INCOMPLETE -> PawsureColors.NotConfirmedRedSurface to PawsureColors.NotConfirmedRed
    }

    PawsureCard(modifier = modifier.fillMaxWidth()) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "Care Evidence",
                style = MaterialTheme.typography.titleMedium
            )
            StatusChip(label = currentStatus.label, backgroundColor = bg, contentColor = fg)
        }
        Spacer(modifier = Modifier.height(10.dp))
        if (evidence == null) {
            Text(
                text = "No evidence uploaded yet. Missing evidence is never treated as completed care.",
                style = MaterialTheme.typography.bodyMedium
            )
        } else {
            if (!evidence.photoUri.isNullOrBlank()) {
                AsyncImage(
                    model = evidence.photoUri,
                    contentDescription = "Submitted care evidence photo",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                        .clip(RoundedCornerShape(16.dp))
                )
                Spacer(modifier = Modifier.height(10.dp))
            }
            if (!evidence.note.isNullOrBlank()) {
                Text(
                    text = evidence.note,
                    style = MaterialTheme.typography.bodyLarge
                )
            }
            if (currentStatus == EvidenceStatus.AWAITING_OWNER_CONFIRMATION && onConfirmClick != null) {
                Spacer(modifier = Modifier.height(12.dp))
                PawsureButton(
                    text = "Confirm Task Completion",
                    onClick = onConfirmClick,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

/**
 * Pill-shaped horizontal category filter chip matching the reference yellow/ivory style.
 */
@Composable
fun CategoryFilterChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    leadingIcon: ImageVector? = null
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(50),
        color = if (selected) PawsureColors.VibrantYellow else PawsureColors.PureWhiteCard,
        border = if (selected) null else BorderStroke(1.dp, PawsureColors.DividerSand),
        shadowElevation = if (selected) 4.dp else 1.dp,
        modifier = modifier.defaultMinSize(minHeight = 44.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
        ) {
            if (leadingIcon != null) {
                Icon(
                    imageVector = leadingIcon,
                    contentDescription = null,
                    tint = PawsureColors.CharcoalText,
                    modifier = Modifier.size(16.dp)
                )
            }
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = if (selected) FontWeight.ExtraBold else FontWeight.SemiBold
                ),
                color = PawsureColors.CharcoalText,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

/**
 * Always-accessible Emergency SOS pill button for Screen 2 and Screen 3.
 */
@Composable
fun EmergencySosButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(50),
        color = PawsureColors.UrgentCoral,
        shadowElevation = 4.dp,
        modifier = modifier
            .defaultMinSize(minHeight = 48.dp)
            .semantics { contentDescription = "Emergency SOS assistance" }
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Icon(
                imageVector = Icons.Rounded.Sos,
                contentDescription = null,
                tint = PawsureColors.PureWhiteCard,
                modifier = Modifier.size(18.dp)
            )
            Text(
                text = "SOS",
                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.ExtraBold),
                color = PawsureColors.PureWhiteCard
            )
        }
    }
}

data class BottomNavDestination(
    val route: String,
    val label: String,
    val icon: ImageVector
)

/**
 * 9. BottomNavigationBar — Floating pill-shaped navigation bar with soft drop shadow
 * and vibrant yellow active indicator matching the reference dashboard.
 */
@Composable
fun BottomNavigationBar(
    destinations: List<BottomNavDestination>,
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Surface(
            shape = RoundedCornerShape(30.dp),
            color = PawsureColors.PureWhiteCard,
            border = BorderStroke(1.dp, PawsureColors.DividerSand),
            shadowElevation = 12.dp,
            modifier = Modifier
                .fillMaxWidth()
                .shadow(
                    elevation = 14.dp,
                    shape = RoundedCornerShape(30.dp),
                    ambientColor = PawsureColors.SoftShadowTint,
                    spotColor = PawsureColors.SoftShadowTint
                )
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceEvenly,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 8.dp)
            ) {
                destinations.forEach { dest ->
                    val selected = currentRoute == dest.route
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier
                            .weight(1f)
                            .defaultMinSize(minHeight = 48.dp)
                            .clip(RoundedCornerShape(22.dp))
                            .background(if (selected) PawsureColors.VibrantYellow else Color.Transparent)
                            .clickable { onNavigate(dest.route) }
                            .padding(vertical = 8.dp, horizontal = 4.dp)
                    ) {
                        Icon(
                            imageVector = dest.icon,
                            contentDescription = dest.label,
                            tint = if (selected) PawsureColors.CharcoalText else PawsureColors.MutedCharcoalText,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = dest.label,
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = if (selected) FontWeight.ExtraBold else FontWeight.Medium
                            ),
                            color = if (selected) PawsureColors.CharcoalText else PawsureColors.MutedCharcoalText,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}
