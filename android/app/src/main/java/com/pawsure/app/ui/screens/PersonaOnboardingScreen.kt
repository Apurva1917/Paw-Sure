package com.pawsure.app.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.VerifiedUser
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.pawsure.app.domain.model.UserRole
import com.pawsure.app.ui.components.PawsureBrandBadge
import com.pawsure.app.ui.components.PawsureButton
import com.pawsure.app.ui.components.PawsureButtonVariant
import com.pawsure.app.ui.components.PawsureCard
import com.pawsure.app.ui.components.StatusChip
import com.pawsure.app.ui.theme.PawsureColors

private enum class OnboardingStep { ROLES, REGISTER, LOGIN, SUMMARY }

enum class OnboardingPersona(val label: String, val domainRole: UserRole) {
    OWNER("Pet Owner", UserRole.PET_OWNER),
    FRIEND("Friend", UserRole.FRIEND),
    HELPER("Helper", UserRole.HELPER),
    COORDINATOR("Community Coordinator", UserRole.COMMUNITY_COORDINATOR)
}

/**
 * QC-verified Persona Onboarding & Registration flow.
 * - Uses PawsureTheme tokens (no nested primary overrides)
 * - Handles system BackHandler cleanly across steps
 * - Applies statusBarsPadding, navigationBarsPadding, and imePadding
 * - Enforces 48dp+ accessible touch targets on radio/checkbox rows
 * - Caps capacity and validates 10-digit mobile numbers cleanly
 * - Never grants Community Coordinator privileges without administrator approval
 */
@Composable
fun PersonaOnboardingScreen(
    onBackToWelcome: () -> Unit,
    onContinueToDashboard: (fullName: String, role: UserRole, society: String) -> Unit,
    modifier: Modifier = Modifier
) {
    var step by rememberSaveable { mutableStateOf(OnboardingStep.ROLES) }
    var selectedPersona by rememberSaveable { mutableStateOf(OnboardingPersona.OWNER) }

    var name by rememberSaveable { mutableStateOf("") }
    var mobile by rememberSaveable { mutableStateOf("") }
    var city by rememberSaveable { mutableStateOf("") }
    var society by rememberSaveable { mutableStateOf("") }
    var tower by rememberSaveable { mutableStateOf("") }
    var flat by rememberSaveable { mutableStateOf("") }
    var pets by rememberSaveable { mutableStateOf("") }
    var emergencyContact by rememberSaveable { mutableStateOf("") }
    var invitation by rememberSaveable { mutableStateOf("") }
    var availability by rememberSaveable { mutableStateOf("") }
    var species by rememberSaveable { mutableStateOf("") }
    var capacity by rememberSaveable { mutableStateOf("") }
    var serviceArea by rememberSaveable { mutableStateOf("") }
    var channel by rememberSaveable { mutableStateOf("App") }
    var nominatedRole by rememberSaveable { mutableStateOf("") }
    var authorization by rememberSaveable { mutableStateOf("") }
    var consent by rememberSaveable { mutableStateOf(false) }
    var error by rememberSaveable { mutableStateOf("") }
    var submitted by rememberSaveable { mutableStateOf(false) }

    fun handleBack() {
        error = ""
        when (step) {
            OnboardingStep.ROLES -> onBackToWelcome()
            OnboardingStep.REGISTER -> step = OnboardingStep.ROLES
            OnboardingStep.LOGIN -> step = OnboardingStep.ROLES
            OnboardingStep.SUMMARY -> step = OnboardingStep.REGISTER
        }
    }

    BackHandler(onBack = ::handleBack)

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(PawsureColors.WarmCreamBackground)
            .statusBarsPadding()
            .navigationBarsPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Top navigation & brand header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Surface(
                onClick = ::handleBack,
                shape = RoundedCornerShape(50),
                color = PawsureColors.PureWhiteCard,
                border = BorderStroke(1.dp, PawsureColors.DividerSand),
                modifier = Modifier.size(48.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                        contentDescription = "Back",
                        tint = PawsureColors.CharcoalText
                    )
                }
            }
            PawsureBrandBadge()
        }

        when (step) {
            OnboardingStep.ROLES -> {
                OnboardingHeader(
                    title = "Join Pawsure",
                    subtitle = "Choose how you want to participate in your society"
                )
                OnboardingPersona.entries.forEach { option ->
                    PawsureCard(
                        onClick = {
                            if (selectedPersona != option) {
                                consent = false
                                submitted = false
                            }
                            selectedPersona = option
                            error = ""
                            step = OnboardingStep.REGISTER
                        },
                        containerColor = PawsureColors.PureWhiteCard,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = option.label,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                val subtitle = when (option) {
                                    OnboardingPersona.OWNER -> "Register pets, routines & emergency contacts"
                                    OnboardingPersona.FRIEND -> "Opt-in neighbour helping on invitation"
                                    OnboardingPersona.HELPER -> "Society helper with WhatsApp / basic-phone prompts"
                                    OnboardingPersona.COORDINATOR -> "Requires administrator verification"
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = subtitle,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                            if (option == OnboardingPersona.COORDINATOR) {
                                StatusChip(
                                    label = "Approval req.",
                                    backgroundColor = PawsureColors.LikelyAmberSurface,
                                    contentColor = PawsureColors.LikelyAmber
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))
                TextButton(
                    onClick = {
                        error = ""
                        step = OnboardingStep.LOGIN
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .defaultMinSize(minHeight = 48.dp)
                ) {
                    Text(
                        text = "Already registered? Log in",
                        style = MaterialTheme.typography.labelLarge,
                        color = PawsureColors.CharcoalText
                    )
                }
            }

            OnboardingStep.REGISTER -> {
                OnboardingHeader(
                    title = "${selectedPersona.label} registration",
                    subtitle = "Create your role profile (local preview — no backend session yet)"
                )
                OnboardingField(
                    label = "Full name",
                    value = name,
                    capitalization = KeyboardCapitalization.Words
                ) { name = it }

                OnboardingField(
                    label = "Mobile number (10 digits)",
                    value = mobile,
                    keyboardType = KeyboardType.Phone
                ) { mobile = it.filter(Char::isDigit).take(10) }

                OnboardingField(
                    label = "City",
                    value = city,
                    capitalization = KeyboardCapitalization.Words
                ) { city = it }

                OnboardingField(
                    label = "Verified society / society ID",
                    value = society,
                    capitalization = KeyboardCapitalization.Words
                ) { society = it }

                when (selectedPersona) {
                    OnboardingPersona.OWNER -> {
                        OnboardingField("Tower / building", tower) { tower = it }
                        OnboardingField("Flat number", flat) { flat = it }
                        OnboardingField("Pet name(s) – add full profiles after sign-up", pets) { pets = it }
                        OnboardingField("Emergency contact (name & phone)", emergencyContact) {
                            emergencyContact = it
                        }
                    }
                    OnboardingPersona.FRIEND -> {
                        OnboardingField("Invitation / relationship", invitation) { invitation = it }
                        OnboardingField("Availability (e.g. Weekdays 6–9 PM)", availability) {
                            availability = it
                        }
                        OnboardingField("Species comfortable caring for", species) { species = it }
                        OnboardingField(
                            label = "Maximum pets at a time (1–10)",
                            value = capacity,
                            keyboardType = KeyboardType.Number
                        ) { capacity = it.filter(Char::isDigit).take(2) }
                    }
                    OnboardingPersona.HELPER -> {
                        OnboardingField("Service area / radius", serviceArea) { serviceArea = it }
                        OnboardingField("Species and skills", species) { species = it }
                        OnboardingField(
                            label = "Maximum pets at a time (1–10)",
                            value = capacity,
                            keyboardType = KeyboardType.Number
                        ) { capacity = it.filter(Char::isDigit).take(2) }
                        OnboardingField("Availability", availability) { availability = it }

                        Text(
                            text = "Preferred contact channel",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Column(modifier = Modifier.selectableGroup()) {
                            listOf(
                                "App",
                                "WhatsApp (Simulator)",
                                "SMS / basic phone (Simulator)"
                            ).forEach { option ->
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .defaultMinSize(minHeight = 48.dp)
                                        .selectable(
                                            selected = channel == option,
                                            onClick = { channel = option },
                                            role = Role.RadioButton
                                        )
                                        .padding(horizontal = 4.dp)
                                ) {
                                    RadioButton(
                                        selected = channel == option,
                                        onClick = null,
                                        colors = RadioButtonDefaults.colors(
                                            selectedColor = PawsureColors.CharcoalText
                                        )
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = option,
                                        style = MaterialTheme.typography.bodyLarge
                                    )
                                }
                            }
                        }
                    }
                    OnboardingPersona.COORDINATOR -> {
                        OnboardingField("Nominated community role", nominatedRole) {
                            nominatedRole = it
                        }
                        OnboardingField("Society authorization reference", authorization) {
                            authorization = it
                        }
                        PawsureCard(containerColor = PawsureColors.LikelyAmberSurface) {
                            Text(
                                text = "Coordinator permissions remain PENDING until verified and approved by an administrator.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = PawsureColors.CharcoalText
                            )
                        }
                    }
                }

                // Accessible 48dp+ consent checkbox row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .defaultMinSize(minHeight = 48.dp)
                        .toggleable(
                            value = consent,
                            onValueChange = { consent = it },
                            role = Role.Checkbox
                        )
                        .padding(horizontal = 4.dp)
                ) {
                    Checkbox(
                        checked = consent,
                        onCheckedChange = null,
                        colors = CheckboxDefaults.colors(
                            checkedColor = PawsureColors.CharcoalText,
                            checkmarkColor = PawsureColors.VibrantYellow
                        )
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "I agree to the registration and privacy terms",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }

                if (error.isNotEmpty()) {
                    PawsureCard(containerColor = PawsureColors.NotConfirmedRedSurface) {
                        Text(
                            text = error,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = PawsureColors.NotConfirmedRed
                        )
                    }
                }

                PawsureButton(
                    text = "Continue",
                    onClick = {
                        val parsedCapacity = capacity.toIntOrNull()
                        val hasDistinctDigits = mobile.isNotEmpty() && !mobile.all { it == mobile.first() }
                        error = when {
                            name.trim().length < 2 -> "Enter your full name."
                            mobile.length != 10 || !hasDistinctDigits -> "Enter a valid 10-digit mobile number."
                            city.isBlank() || society.isBlank() -> "City and society are required."
                            selectedPersona == OnboardingPersona.OWNER &&
                                (pets.isBlank() || emergencyContact.isBlank()) ->
                                "Add pet names and an emergency contact."
                            selectedPersona == OnboardingPersona.FRIEND &&
                                (availability.isBlank() || species.isBlank() || parsedCapacity == null || parsedCapacity !in 1..10) ->
                                "Complete availability, species, and capacity (1–10)."
                            selectedPersona == OnboardingPersona.HELPER &&
                                (serviceArea.isBlank() || species.isBlank() || availability.isBlank() || parsedCapacity == null || parsedCapacity !in 1..10) ->
                                "Complete service area, skills, availability, and capacity (1–10)."
                            selectedPersona == OnboardingPersona.COORDINATOR &&
                                (nominatedRole.isBlank() || authorization.isBlank()) ->
                                "Complete your nomination and authorization reference."
                            !consent -> "Consent is required before continuing."
                            else -> ""
                        }
                        if (error.isEmpty()) {
                            submitted = true
                            step = OnboardingStep.SUMMARY
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                )

                PawsureButton(
                    text = "Change role",
                    variant = PawsureButtonVariant.OUTLINED,
                    onClick = {
                        error = ""
                        step = OnboardingStep.ROLES
                    },
                    modifier = Modifier.fillMaxWidth()
                )
            }

            OnboardingStep.LOGIN -> {
                OnboardingHeader(
                    title = "Welcome back",
                    subtitle = "Secure OTP login is not connected in this offline UI preview"
                )
                OnboardingField(
                    label = "Registered mobile number",
                    value = mobile,
                    keyboardType = KeyboardType.Phone
                ) { mobile = it.filter(Char::isDigit).take(10) }

                PawsureCard(containerColor = PawsureColors.PureWhiteCard) {
                    Text(
                        text = "Connect a verified OTP provider and validate the session on your backend before enabling sign-in.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = PawsureColors.CharcoalText
                    )
                }

                PawsureButton(
                    text = "Go to registration",
                    onClick = { step = OnboardingStep.ROLES },
                    modifier = Modifier.fillMaxWidth()
                )
                PawsureButton(
                    text = "Preview dashboard (Demo)",
                    variant = PawsureButtonVariant.SECONDARY_PEACH,
                    onClick = { onContinueToDashboard("Neha Kapoor", UserRole.PET_OWNER, "Green Glen Layout • Tower 4") },
                    modifier = Modifier.fillMaxWidth()
                )
            }

            OnboardingStep.SUMMARY -> {
                OnboardingHeader(
                    title = "Welcome, ${name.trim()}",
                    subtitle = "${selectedPersona.label} — registration preview"
                )
                if (submitted) {
                    PawsureCard(containerColor = PawsureColors.PureWhiteCard) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.VerifiedUser,
                                contentDescription = null,
                                tint = PawsureColors.ConfirmedGreen
                            )
                            Text(
                                text = "Profile captured locally in this screen only. No server account has been created yet.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = PawsureColors.CharcoalText
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Society: ${society.trim()} (${city.trim()})",
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }
                if (selectedPersona == OnboardingPersona.COORDINATOR) {
                    PawsureCard(containerColor = PawsureColors.LikelyAmberSurface) {
                        Text(
                            text = "Approval status: PENDING_ADMIN_APPROVAL. Coordinator privileges are NOT granted until approved by an administrator.",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = PawsureColors.CharcoalText
                        )
                    }
                }
                PawsureButton(
                    text = "Open Home Dashboard",
                    onClick = {
                        // Never grant Coordinator privileges from client-side onboarding alone
                        val effectiveRole = if (selectedPersona == OnboardingPersona.COORDINATOR) {
                            UserRole.PET_OWNER
                        } else {
                            selectedPersona.domainRole
                        }
                        onContinueToDashboard(name.trim(), effectiveRole, society.trim())
                    },
                    modifier = Modifier.fillMaxWidth()
                )
                PawsureButton(
                    text = "Edit registration",
                    variant = PawsureButtonVariant.OUTLINED,
                    onClick = { step = OnboardingStep.REGISTER },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Composable
private fun OnboardingHeader(title: String, subtitle: String) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineSmall,
            color = PawsureColors.CharcoalText
        )
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = PawsureColors.MutedCharcoalText
        )
    }
}

@Composable
private fun OnboardingField(
    label: String,
    value: String,
    keyboardType: KeyboardType = KeyboardType.Text,
    capitalization: KeyboardCapitalization = KeyboardCapitalization.Sentences,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = keyboardType,
            capitalization = capitalization
        ),
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = PawsureColors.PureWhiteCard,
            unfocusedContainerColor = PawsureColors.PureWhiteCard,
            focusedBorderColor = PawsureColors.VibrantYellow,
            unfocusedBorderColor = PawsureColors.DividerSand,
            focusedLabelColor = PawsureColors.CharcoalText,
            cursorColor = PawsureColors.CharcoalText
        ),
        modifier = Modifier.fillMaxWidth()
    )
}
