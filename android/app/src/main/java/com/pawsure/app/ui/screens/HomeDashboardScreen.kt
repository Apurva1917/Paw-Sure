package com.pawsure.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.outlined.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.pawsure.app.domain.model.*
import com.pawsure.app.ui.components.*
import com.pawsure.app.ui.theme.PawsureColors
import com.pawsure.app.ui.viewmodel.PawsureUiState

/**
 * Screen 2 — Home Dashboard
 * Matches the middle reference layout:
 * - Warm ivory/cream background
 * - Rounded header with owner profile, notifications bell & accessible SOS button
 * - Search bar + vibrant yellow filter button
 * - Horizontal pet category filter pills
 * - Large yellow Find Cover feature banner
 * - Rounded pet profile cards (tap opens Pet Details)
 * - Today's care tasks & explicit evidence status
 * - Floating pill BottomNavigationBar: Today, Find Cover, Friends, Pets, Profile
 */
@Composable
fun HomeDashboardScreen(
    state: PawsureUiState,
    currentNavRoute: String,
    onNavigateBottom: (String) -> Unit,
    onSearchChanged: (String) -> Unit,
    onCategorySelected: (PetSpecies?) -> Unit,
    onOpenPetDetails: (String) -> Unit,
    onOpenFindCover: () -> Unit,
    onConfirmTaskEvidence: (String) -> Unit,
    onTriggerSos: () -> Unit,
    onDismissSos: () -> Unit,
    onSwitchRole: (UserRole) -> Unit,
    onOpenNotifications: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var showFilterSheet by remember { mutableStateOf(false) }

    val bottomDestinations = remember {
        listOf(
            BottomNavDestination("today", "Today", Icons.Rounded.Today),
            BottomNavDestination("find_cover", "Find Cover", Icons.Rounded.Search),
            BottomNavDestination("friends", "Friends", Icons.Rounded.Groups),
            BottomNavDestination("pets", "Pets", Icons.Rounded.Pets),
            BottomNavDestination("profile", "Profile", Icons.Rounded.Person)
        )
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(PawsureColors.WarmCreamBackground)
    ) {
        // Subtle paw-print decoration behind scroll area
        PawPrintPatternOverlay(
            modifier = Modifier.fillMaxSize(),
            pawColor = PawsureColors.SoftYellow.copy(alpha = 0.32f)
        )

        LazyColumn(
            contentPadding = PaddingValues(
                top = 12.dp,
                start = 20.dp,
                end = 20.dp,
                bottom = 108.dp // Clearance for floating bottom nav bar
            ),
            verticalArrangement = Arrangement.spacedBy(18.dp),
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            // 1. Rounded Header with Profile, Notification Bell & Accessible Emergency SOS
            item {
                DashboardHeader(
                    ownerName = state.ownerName,
                    societyLabel = state.societyLabel,
                    unreadNotifications = state.unreadNotificationsCount,
                    onNotificationClick = onOpenNotifications,
                    onProfileClick = { onNavigateBottom("profile") },
                    onSosClick = onTriggerSos
                )
            }

            // Active Emergency SOS Disclosure Dialog / Banner if triggered
            if (state.activeEmergencyMessage != null) {
                item {
                    EmergencyBanner(
                        title = "Emergency Escalation Controls",
                        message = state.activeEmergencyMessage,
                        actionLabel = "Dismiss SOS Alert",
                        onActionClick = onDismissSos
                    )
                }
            }

            // 2. Search Bar + Vibrant Yellow Filter Button
            item {
                SearchAndFilterRow(
                    query = state.searchQuery,
                    onQueryChange = onSearchChanged,
                    onFilterClick = { showFilterSheet = !showFilterSheet }
                )
            }

            if (showFilterSheet) {
                item {
                    RolePreviewCard(
                        activeRole = state.activeRole,
                        onRoleSelected = onSwitchRole
                    )
                }
            }

            // 3. Horizontal Pet Category Chips (Pill-shaped)
            item {
                val categories: List<Pair<PetSpecies?, String>> = listOf(
                    null to "All Pets",
                    PetSpecies.DOG to "Dogs",
                    PetSpecies.CAT to "Cats",
                    PetSpecies.RABBIT to "Rabbits",
                    PetSpecies.GUINEA_PIG to "Guinea pigs",
                    PetSpecies.BIRD to "Birds",
                    PetSpecies.FISH to "Fish"
                )
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(categories) { (species, label) ->
                        CategoryFilterChip(
                            label = label,
                            selected = state.selectedCategory == species,
                            onClick = { onCategorySelected(species) },
                            leadingIcon = if (species == null) Icons.Rounded.Pets else null
                        )
                    }
                }
            }

            // 4. Large Vibrant Yellow Feature Banner Promoting "Find Cover"
            item {
                FindCoverFeatureBanner(
                    societyName = state.societyLabel,
                    eligibleCount = state.eligibleCaregivers.count {
                        it.explicitOptIn && it.availabilityStatus == CaregiverAvailabilityStatus.ACTIVE
                    },
                    onFindCoverClick = onOpenFindCover
                )
            }

            // 5. Rounded Pet Profile Cards Section
            item {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Your Registered Pets",
                        style = MaterialTheme.typography.headlineSmall
                    )
                    TextButton(onClick = { onNavigateBottom("pets") }) {
                        Text(
                            text = "Manage (${state.filteredPets.size})",
                            style = MaterialTheme.typography.labelLarge,
                            color = PawsureColors.CharcoalText
                        )
                    }
                }
            }

            if (state.filteredPets.isEmpty()) {
                item {
                    PawsureCard(containerColor = PawsureColors.PureWhiteCard) {
                        Text(
                            text = "No pets match the current filter or search.",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Clear your category chip or search text to view all registered household pets.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        PawsureButton(
                            text = "Show All Pets",
                            variant = PawsureButtonVariant.SECONDARY_PEACH,
                            onClick = {
                                onCategorySelected(null)
                                onSearchChanged("")
                            },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            } else {
                items(state.filteredPets, key = { it.petId }) { pet ->
                    PetProfileCard(
                        pet = pet,
                        onClick = { onOpenPetDetails(pet.petId) }
                    )
                }
            }

            // 6. Today's Care Tasks & Evidence Status Section
            item {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Today's Care Tasks",
                        style = MaterialTheme.typography.headlineSmall
                    )
                    StatusChip(
                        label = "${state.filteredTasks.size} scheduled",
                        backgroundColor = PawsureColors.SoftYellow,
                        contentColor = PawsureColors.CharcoalText
                    )
                }
            }

            items(state.filteredTasks, key = { it.id }) { task ->
                val petNames = state.pets
                    .filter { it.petId in task.petIds }
                    .joinToString(", ") { it.name }
                    .ifBlank { "Pet" }

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    CareTaskCard(
                        task = task,
                        petNames = petNames,
                        onClick = {
                            task.petIds.firstOrNull()?.let(onOpenPetDetails)
                        }
                    )
                    if (task.evidence?.status == EvidenceStatus.AWAITING_OWNER_CONFIRMATION) {
                        PawsureButton(
                            text = "Review & Confirm ${task.taskType.label}",
                            onClick = { onConfirmTaskEvidence(task.id) },
                            leadingIcon = Icons.Rounded.CheckCircle,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }

        // 7. Floating Pill Bottom Navigation Bar
        BottomNavigationBar(
            destinations = bottomDestinations,
            currentRoute = currentNavRoute,
            onNavigate = onNavigateBottom,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
        )
    }
}

@Composable
private fun DashboardHeader(
    ownerName: String,
    societyLabel: String,
    unreadNotifications: Int,
    onNotificationClick: () -> Unit,
    onProfileClick: () -> Unit,
    onSosClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(26.dp),
        color = PawsureColors.PureWhiteCard,
        border = BorderStroke(1.dp, PawsureColors.DividerSand),
        shadowElevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                Surface(
                    onClick = onProfileClick,
                    shape = CircleShape,
                    color = PawsureColors.SoftYellow,
                    modifier = Modifier.size(48.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Rounded.Person,
                            contentDescription = "Owner profile",
                            tint = PawsureColors.CharcoalText
                        )
                    }
                }
                Column {
                    Text(
                        text = "Hi, ${ownerName.substringBefore(' ')}",
                        style = MaterialTheme.typography.titleMedium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = societyLabel,
                        style = MaterialTheme.typography.bodyMedium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                BadgedBox(
                    badge = {
                        if (unreadNotifications > 0) {
                            Badge(containerColor = PawsureColors.VibrantYellow) {
                                Text(
                                    text = unreadNotifications.toString(),
                                    color = PawsureColors.CharcoalText,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                ) {
                    Surface(
                        onClick = onNotificationClick,
                        shape = CircleShape,
                        color = PawsureColors.WarmCreamBackground,
                        modifier = Modifier.size(48.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Outlined.Notifications,
                                contentDescription = "Notifications",
                                tint = PawsureColors.CharcoalText
                            )
                        }
                    }
                }

                EmergencySosButton(onClick = onSosClick)
            }
        }
    }
}

@Composable
private fun SearchAndFilterRow(
    query: String,
    onQueryChange: (String) -> Unit,
    onFilterClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        OutlinedTextField(
            value = query,
            onValueChange = onQueryChange,
            placeholder = {
                Text(
                    text = "Search pets, care tasks, or sitters...",
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Rounded.Search,
                    contentDescription = null,
                    tint = PawsureColors.MutedCharcoalText
                )
            },
            singleLine = true,
            shape = RoundedCornerShape(24.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = PawsureColors.PureWhiteCard,
                unfocusedContainerColor = PawsureColors.PureWhiteCard,
                focusedBorderColor = PawsureColors.VibrantYellow,
                unfocusedBorderColor = PawsureColors.DividerSand
            ),
            modifier = Modifier
                .weight(1f)
                .defaultMinSize(minHeight = 52.dp)
        )

        Surface(
            onClick = onFilterClick,
            shape = RoundedCornerShape(20.dp),
            color = PawsureColors.VibrantYellow,
            shadowElevation = 4.dp,
            modifier = Modifier.size(52.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = Icons.Rounded.Tune,
                    contentDescription = "Filter roles and preferences",
                    tint = PawsureColors.CharcoalText
                )
            }
        }
    }
}

@Composable
private fun FindCoverFeatureBanner(
    societyName: String,
    eligibleCount: Int,
    onFindCoverClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(28.dp),
        color = PawsureColors.VibrantYellow,
        shadowElevation = 6.dp,
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 8.dp,
                shape = RoundedCornerShape(28.dp),
                ambientColor = PawsureColors.SoftShadowTint,
                spotColor = PawsureColors.SoftShadowTint
            )
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            PawPrintPatternOverlay(
                modifier = Modifier.matchParentSize(),
                pawColor = PawsureColors.PureWhiteCard.copy(alpha = 0.25f)
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp)
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    StatusChip(
                        label = "$eligibleCount ready in $societyName",
                        backgroundColor = PawsureColors.PureWhiteCard.copy(alpha = 0.85f),
                        contentColor = PawsureColors.CharcoalText
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Need trusted cover today?",
                        style = MaterialTheme.typography.headlineSmall,
                        color = PawsureColors.CharcoalText
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Match opted-in Friends & verified Helpers with clear capacity and evidence checks.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = PawsureColors.CharcoalText.copy(alpha = 0.85f)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Surface(
                        onClick = onFindCoverClick,
                        shape = RoundedCornerShape(50),
                        color = PawsureColors.CharcoalText,
                        modifier = Modifier.defaultMinSize(minHeight = 48.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(horizontal = 18.dp, vertical = 12.dp)
                        ) {
                            Text(
                                text = "Find Cover",
                                style = MaterialTheme.typography.labelLarge,
                                color = PawsureColors.VibrantYellow
                            )
                            Icon(
                                imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                                contentDescription = null,
                                tint = PawsureColors.VibrantYellow,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                Cute3DPetIllustration(
                    species = PetSpecies.DOG,
                    size = 112.dp
                )
            }
        }
    }
}

@Composable
private fun RolePreviewCard(
    activeRole: UserRole,
    onRoleSelected: (UserRole) -> Unit
) {
    PawsureCard(containerColor = PawsureColors.IvoryCream) {
        Text(
            text = "Active Role Perspective (Preserved Workflows)",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(UserRole.entries) { role ->
                CategoryFilterChip(
                    label = role.name.replace('_', ' '),
                    selected = activeRole == role,
                    onClick = { onRoleSelected(role) }
                )
            }
        }
    }
}
