package com.pawsure.app.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.pawsure.app.ui.components.CaregiverCard
import com.pawsure.app.ui.components.PawsureButton
import com.pawsure.app.ui.components.PawsureButtonVariant
import com.pawsure.app.ui.components.StatusChip
import com.pawsure.app.ui.screens.HomeDashboardScreen
import com.pawsure.app.ui.screens.PersonaOnboardingScreen
import com.pawsure.app.ui.screens.PetDetailsScreen
import com.pawsure.app.ui.screens.WelcomeScreen
import com.pawsure.app.ui.theme.PawsureColors
import com.pawsure.app.ui.viewmodel.PawsureMainViewModel

object PawsureRoutes {
    const val WELCOME = "welcome"
    const val ONBOARDING = "onboarding"
    const val TODAY = "today"
    const val PET_DETAILS = "pet_details/{petId}"

    fun petDetails(petId: String): String = "pet_details/$petId"
}

private enum class SecondaryOverlay {
    FIND_COVER,
    FRIENDS,
    PROFILE,
    NOTIFICATIONS,
    EDIT_PET,
    CREATE_CARE_REQUEST,
    HEALTH_RECORDS
}

@Composable
fun PawsureNavHost(
    modifier: Modifier = Modifier,
    viewModel: PawsureMainViewModel = hiltViewModel()
) {
    val navController = rememberNavController()
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    var activeBottomTab by remember { mutableStateOf("today") }
    var activeOverlay by remember { mutableStateOf<SecondaryOverlay?>(null) }
    var overlayPetId by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(uiState.statusBannerMessage) {
        val msg = uiState.statusBannerMessage
        if (msg != null) {
            snackbarHostState.showSnackbar(message = msg)
            viewModel.dismissStatusBanner()
        }
    }

    Scaffold(
        containerColor = PawsureColors.WarmCreamBackground,
        snackbarHost = {
            SnackbarHost(hostState = snackbarHostState) { data ->
                Snackbar(
                    snackbarData = data,
                    containerColor = PawsureColors.CharcoalText,
                    contentColor = PawsureColors.PureWhiteCard,
                    shape = RoundedCornerShape(18.dp)
                )
            }
        },
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = PawsureRoutes.WELCOME,
            modifier = Modifier
                .fillMaxSize()
                .padding(PaddingValues(bottom = 0.dp)) // Edge-to-edge handled per screen
        ) {
            // Screen 1 — Welcome
            composable(PawsureRoutes.WELCOME) {
                WelcomeScreen(
                    onGetStarted = {
                        activeBottomTab = "today"
                        navController.navigate(PawsureRoutes.TODAY) {
                            popUpTo(PawsureRoutes.WELCOME) { inclusive = true }
                        }
                    },
                    onOpenOnboarding = {
                        navController.navigate(PawsureRoutes.ONBOARDING)
                    }
                )
            }

            // Persona Onboarding & Role Registration
            composable(PawsureRoutes.ONBOARDING) {
                PersonaOnboardingScreen(
                    onBackToWelcome = { navController.popBackStack() },
                    onContinueToDashboard = { fullName, role, society ->
                        viewModel.applyOnboardingProfile(fullName, role, society)
                        activeBottomTab = "today"
                        navController.navigate(PawsureRoutes.TODAY) {
                            popUpTo(PawsureRoutes.WELCOME) { inclusive = true }
                        }
                    }
                )
            }

            // Screen 2 — Home Dashboard
            composable(PawsureRoutes.TODAY) {
                HomeDashboardScreen(
                    state = uiState,
                    currentNavRoute = activeBottomTab,
                    onNavigateBottom = { route ->
                        activeBottomTab = route
                        when (route) {
                            "today" -> Unit
                            "find_cover" -> activeOverlay = SecondaryOverlay.FIND_COVER
                            "friends" -> activeOverlay = SecondaryOverlay.FRIENDS
                            "pets" -> {
                                val firstPetId = uiState.pets.firstOrNull()?.petId
                                if (firstPetId != null) {
                                    navController.navigate(PawsureRoutes.petDetails(firstPetId))
                                }
                            }
                            "profile" -> activeOverlay = SecondaryOverlay.PROFILE
                        }
                    },
                    onSearchChanged = viewModel::onSearchQueryChanged,
                    onCategorySelected = viewModel::onCategorySelected,
                    onOpenPetDetails = { petId ->
                        navController.navigate(PawsureRoutes.petDetails(petId))
                    },
                    onOpenFindCover = {
                        activeBottomTab = "find_cover"
                        activeOverlay = SecondaryOverlay.FIND_COVER
                    },
                    onConfirmTaskEvidence = viewModel::confirmTaskEvidence,
                    onTriggerSos = viewModel::triggerEmergencySos,
                    onDismissSos = viewModel::dismissEmergencySos,
                    onSwitchRole = viewModel::onRoleChanged,
                    onOpenNotifications = { activeOverlay = SecondaryOverlay.NOTIFICATIONS },
                    modifier = Modifier.padding(
                        start = innerPadding.calculateStartPadding(androidx.compose.ui.unit.LayoutDirection.Ltr),
                        end = innerPadding.calculateEndPadding(androidx.compose.ui.unit.LayoutDirection.Ltr)
                    )
                )
            }

            // Screen 3 — Pet Details
            composable(
                route = PawsureRoutes.PET_DETAILS,
                arguments = listOf(navArgument("petId") { type = NavType.StringType })
            ) { backStackEntry ->
                val petId = backStackEntry.arguments?.getString("petId").orEmpty()
                val pet = viewModel.getPetById(petId)
                if (pet != null) {
                    PetDetailsScreen(
                        pet = pet,
                        onBack = {
                            activeBottomTab = "today"
                            navController.popBackStack()
                        },
                        onEditPet = { id ->
                            overlayPetId = id
                            activeOverlay = SecondaryOverlay.EDIT_PET
                        },
                        onCreateCareRequest = { id ->
                            overlayPetId = id
                            activeOverlay = SecondaryOverlay.CREATE_CARE_REQUEST
                        },
                        onOpenHealthRecords = { id ->
                            overlayPetId = id
                            activeOverlay = SecondaryOverlay.HEALTH_RECORDS
                        },
                        onTriggerSos = {
                            viewModel.triggerEmergencySos()
                            navController.popBackStack()
                        }
                    )
                }
            }
        }
    }

    // Preserved domain action dialogs (keeps scope focused on the 3 redesigned screens)
    val selectedPet = overlayPetId?.let { viewModel.getPetById(it) } ?: uiState.pets.firstOrNull()
    when (activeOverlay) {
        SecondaryOverlay.FIND_COVER -> {
            AlertDialog(
                onDismissRequest = {
                    activeOverlay = null
                    activeBottomTab = "today"
                },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = "Eligible Caregivers • ${uiState.societyLabel.substringBefore('•').trim()}",
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.verticalScroll(rememberScrollState())
                    ) {
                        Text(
                            text = "Only opted-in Friends and verified Helpers with open capacity in your society are shown. ETAs are simulated estimates.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        uiState.eligibleCaregivers.forEach { caregiver ->
                            CaregiverCard(
                                caregiver = caregiver,
                                onSelect = {
                                    viewModel.notifyCaregiverSelected(caregiver.displayName)
                                    activeOverlay = null
                                    activeBottomTab = "today"
                                }
                            )
                        }
                    }
                },
                confirmButton = {
                    PawsureButton(
                        text = "Close",
                        onClick = {
                            activeOverlay = null
                            activeBottomTab = "today"
                        }
                    )
                }
            )
        }

        SecondaryOverlay.FRIENDS -> {
            AlertDialog(
                onDismissRequest = {
                    activeOverlay = null
                    activeBottomTab = "today"
                },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = "Trusted Friends & Helpers",
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.verticalScroll(rememberScrollState())
                    ) {
                        Text(
                            text = "Consent-based caregiver network. Helpers receive simplified WhatsApp/basic-phone task prompts; Friends coordinate via the app.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        uiState.eligibleCaregivers.forEach { caregiver ->
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
                                        text = "${caregiver.preferredChannel.label} • Opt-in: ${if (caregiver.explicitOptIn) "Confirmed" else "Pending"}",
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                }
                                StatusChip(
                                    label = caregiver.role.name,
                                    backgroundColor = PawsureColors.SoftYellow,
                                    contentColor = PawsureColors.CharcoalText
                                )
                            }
                        }
                    }
                },
                confirmButton = {
                    PawsureButton(
                        text = "Done",
                        onClick = {
                            activeOverlay = null
                            activeBottomTab = "today"
                        }
                    )
                }
            )
        }

        SecondaryOverlay.PROFILE -> {
            AlertDialog(
                onDismissRequest = {
                    activeOverlay = null
                    activeBottomTab = "today"
                },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = uiState.ownerName,
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.verticalScroll(rememberScrollState())
                    ) {
                        Text(
                            text = "Society: ${uiState.societyLabel}",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Active Role: ${uiState.activeRole.name.replace('_', ' ')}",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Text(
                            text = "WhatsApp/SMS notifications and live emergency dispatch are explicitly marked simulated in offline demo mode.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                },
                confirmButton = {
                    PawsureButton(
                        text = "Role Registration",
                        onClick = {
                            activeOverlay = null
                            activeBottomTab = "today"
                            navController.navigate(PawsureRoutes.ONBOARDING)
                        }
                    )
                },
                dismissButton = {
                    PawsureButton(
                        text = "Done",
                        variant = PawsureButtonVariant.OUTLINED,
                        onClick = {
                            activeOverlay = null
                            activeBottomTab = "today"
                        }
                    )
                }
            )
        }

        SecondaryOverlay.NOTIFICATIONS -> {
            AlertDialog(
                onDismissRequest = { activeOverlay = null },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = "Care Alerts",
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.verticalScroll(rememberScrollState())
                    ) {
                        uiState.notifications.forEach { alert ->
                            Row(
                                verticalAlignment = Alignment.Top,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.NotificationsActive,
                                    contentDescription = null,
                                    tint = PawsureColors.LikelyAmber,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text(
                                    text = alert,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                        }
                    }
                },
                confirmButton = {
                    PawsureButton(
                        text = "Mark Read",
                        onClick = {
                            viewModel.markNotificationsRead()
                            activeOverlay = null
                        }
                    )
                }
            )
        }

        SecondaryOverlay.EDIT_PET -> if (selectedPet != null) {
            AlertDialog(
                onDismissRequest = { activeOverlay = null },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = "Edit ${selectedPet.name}'s Profile",
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Text(
                        text = "Pet registration editor (species, breed, feeding schedule, aggression triggers, medications, and emergency vet) stays connected to Room persistence.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                },
                confirmButton = {
                    PawsureButton(
                        text = "OK",
                        onClick = { activeOverlay = null }
                    )
                }
            )
        }

        SecondaryOverlay.CREATE_CARE_REQUEST -> if (selectedPet != null) {
            AlertDialog(
                onDismissRequest = { activeOverlay = null },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = "New Care Request • ${selectedPet.name}",
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.verticalScroll(rememberScrollState())
                    ) {
                        Text(
                            text = "Supports single or multi-pet scheduling with mandatory evidence verification (missing evidence never marks completed).",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        StatusChip(
                            label = "Society: ${selectedPet.societyName}",
                            backgroundColor = PawsureColors.SoftYellow,
                            contentColor = PawsureColors.CharcoalText
                        )
                    }
                },
                confirmButton = {
                    PawsureButton(
                        text = "Find Eligible Cover",
                        leadingIcon = Icons.Rounded.Search,
                        onClick = { activeOverlay = SecondaryOverlay.FIND_COVER }
                    )
                },
                dismissButton = {
                    PawsureButton(
                        text = "Cancel",
                        variant = PawsureButtonVariant.OUTLINED,
                        onClick = { activeOverlay = null }
                    )
                }
            )
        }

        SecondaryOverlay.HEALTH_RECORDS -> if (selectedPet != null) {
            AlertDialog(
                onDismissRequest = { activeOverlay = null },
                containerColor = PawsureColors.PureWhiteCard,
                shape = RoundedCornerShape(28.dp),
                title = {
                    Text(
                        text = "${selectedPet.name}'s Health & Vaccines",
                        style = MaterialTheme.typography.headlineSmall
                    )
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.verticalScroll(rememberScrollState())
                    ) {
                        selectedPet.vaccinationRecords.forEach { record ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Verified,
                                    contentDescription = null,
                                    tint = PawsureColors.ConfirmedGreen,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text(
                                    text = record,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Vet: ${selectedPet.emergencyVetContactName} (${selectedPet.emergencyVetPhone})",
                            style = MaterialTheme.typography.labelMedium,
                            color = PawsureColors.MutedCharcoalText
                        )
                    }
                },
                confirmButton = {
                    PawsureButton(
                        text = "Close",
                        onClick = { activeOverlay = null }
                    )
                }
            )
        }

        null -> Unit
    }
}
