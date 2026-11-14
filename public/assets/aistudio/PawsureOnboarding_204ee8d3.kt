package com.example.pawsure

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Cream = Color(0xFFFFF9E8)
private val Yellow = Color(0xFFFFD21A)
private val Ink = Color(0xFF202020)

private enum class Page { WELCOME, ROLES, REGISTER, LOGIN, DASHBOARD }
enum class Persona(val label: String) {
    OWNER("Pet Owner"), FRIEND("Friend"), HELPER("Helper"), COORDINATOR("Community Coordinator")
}

// UI demo only. Replace with verified server-side authentication and persistence.
@Composable
fun PawsureOnboarding() {
    var page by remember { mutableStateOf(Page.WELCOME) }
    var role by remember { mutableStateOf(Persona.OWNER) }
    var name by remember { mutableStateOf("") }
    var mobile by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var society by remember { mutableStateOf("") }
    var tower by remember { mutableStateOf("") }
    var flat by remember { mutableStateOf("") }
    var pets by remember { mutableStateOf("") }
    var emergencyContact by remember { mutableStateOf("") }
    var invitation by remember { mutableStateOf("") }
    var availability by remember { mutableStateOf("") }
    var species by remember { mutableStateOf("") }
    var capacity by remember { mutableStateOf("") }
    var serviceArea by remember { mutableStateOf("") }
    var channel by remember { mutableStateOf("App") }
    var nominatedRole by remember { mutableStateOf("") }
    var authorization by remember { mutableStateOf("") }
    var consent by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    var submitted by remember { mutableStateOf(false) }

    MaterialTheme(colorScheme = lightColorScheme(primary = Ink, onPrimary = Color.White, background = Cream)) {
        Column(
            modifier = Modifier.fillMaxSize().background(Cream).verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 30.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            when (page) {
                Page.WELCOME -> {
                    Spacer(Modifier.height(24.dp))
                    // Put your approved mascot image in res/drawable/pawsure_mascot.png.
                    // Uncomment this once the resource exists:
                    // Image(painterResource(R.drawable.pawsure_mascot), null, Modifier.fillMaxWidth().height(220.dp))
                    Text("🐾", fontSize = 76.sp, modifier = Modifier.align(Alignment.CenterHorizontally))
                    Text("PAWSURE", fontSize = 38.sp, fontWeight = FontWeight.Black,
                        color = Ink, modifier = Modifier.align(Alignment.CenterHorizontally))
                    Text("Be sure, whoever’s caring.", fontSize = 20.sp, color = Ink,
                        textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
                    Text("Trusted pet care from owners, friends, helpers and communities.",
                        textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
                    Spacer(Modifier.height(20.dp))
                    YellowButton("Get Started") { page = Page.ROLES }
                    TextButton(onClick = { page = Page.LOGIN }, modifier = Modifier.fillMaxWidth()) {
                        Text("Already registered? Log in", color = Ink)
                    }
                }
                Page.ROLES -> {
                    Header("Join Pawsure", "Choose how you want to participate")
                    Persona.entries.forEach { option ->
                        Card(onClick = { role = option; error = ""; page = Page.REGISTER },
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
                            Text(option.label, modifier = Modifier.padding(20.dp), fontWeight = FontWeight.Bold)
                        }
                    }
                    TextButton(onClick = { page = Page.WELCOME }) { Text("Back") }
                }
                Page.REGISTER -> {
                    Header("${role.label} registration", "Create your role profile")
                    Field("Full name", name) { name = it }
                    Field("Mobile number (10 digits)", mobile) { mobile = it.filter(Char::isDigit).take(10) }
                    Field("City", city) { city = it }
                    Field("Verified society / society ID", society) { society = it }
                    when (role) {
                        Persona.OWNER -> {
                            Field("Tower / building", tower) { tower = it }
                            Field("Flat number", flat) { flat = it }
                            Field("Pet name(s) – add full profiles after sign-up", pets) { pets = it }
                            Field("Emergency contact", emergencyContact) { emergencyContact = it }
                        }
                        Persona.FRIEND -> {
                            Field("Invitation / relationship", invitation) { invitation = it }
                            Field("Availability", availability) { availability = it }
                            Field("Species comfortable caring for", species) { species = it }
                            Field("Maximum pets at a time", capacity) { capacity = it.filter(Char::isDigit) }
                        }
                        Persona.HELPER -> {
                            Field("Service area / radius", serviceArea) { serviceArea = it }
                            Field("Species and skills", species) { species = it }
                            Field("Maximum pets at a time", capacity) { capacity = it.filter(Char::isDigit) }
                            Field("Availability", availability) { availability = it }
                            Text("Preferred contact channel")
                            listOf("App", "WhatsApp", "SMS/basic phone").forEach { option ->
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    RadioButton(selected = channel == option, onClick = { channel = option })
                                    Text(option)
                                }
                            }
                        }
                        Persona.COORDINATOR -> {
                            Field("Nominated community role", nominatedRole) { nominatedRole = it }
                            Field("Society authorization reference", authorization) { authorization = it }
                            Text("Coordinator permissions remain pending until approved by an administrator.", color = Ink)
                        }
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(checked = consent, onCheckedChange = { consent = it })
                        Text("I agree to the registration and privacy terms")
                    }
                    if (error.isNotEmpty()) Text(error, color = MaterialTheme.colorScheme.error)
                    YellowButton("Continue") {
                        error = when {
                            name.isBlank() -> "Enter your full name."
                            mobile.length != 10 -> "Enter a valid 10-digit mobile number."
                            city.isBlank() || society.isBlank() -> "City and society are required."
                            role == Persona.OWNER && (pets.isBlank() || emergencyContact.isBlank()) -> "Add pet names and an emergency contact."
                            role == Persona.FRIEND && (availability.isBlank() || species.isBlank() || capacity.toIntOrNull()?.let { it < 1 } != false) -> "Complete availability, species and capacity."
                            role == Persona.HELPER && (serviceArea.isBlank() || species.isBlank() || availability.isBlank() || capacity.toIntOrNull()?.let { it < 1 } != false) -> "Complete service area, skills, availability and capacity."
                            role == Persona.COORDINATOR && (nominatedRole.isBlank() || authorization.isBlank()) -> "Complete your nomination and authorization reference."
                            !consent -> "Consent is required."
                            else -> ""
                        }
                        if (error.isEmpty()) { submitted = true; page = Page.DASHBOARD }
                    }
                    TextButton(onClick = { page = Page.ROLES }) { Text("Change role") }
                }
                Page.LOGIN -> {
                    Header("Welcome back", "Secure login is not connected in this UI demo")
                    Field("Registered mobile number", mobile) { mobile = it.filter(Char::isDigit).take(10) }
                    Text("Connect a real OTP provider and verify the session on your backend before enabling sign-in.")
                    YellowButton("Back to registration") { page = Page.ROLES }
                    TextButton(onClick = { page = Page.WELCOME }) { Text("Back") }
                }
                Page.DASHBOARD -> {
                    Header("Welcome, $name", "${role.label} — registration preview")
                    if (submitted) Text("Profile captured in this screen only. No account has been created on a server.")
                    if (role == Persona.COORDINATOR) Text("Approval status: PENDING. Coordinator privileges are not granted.")
                    YellowButton("Return to welcome") { page = Page.WELCOME }
                }
            }
        }
    }
}

@Composable private fun Header(title: String, subtitle: String) {
    Text(title, fontSize = 27.sp, fontWeight = FontWeight.Bold, color = Ink)
    Text(subtitle, color = Ink)
}

@Composable private fun Field(label: String, value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(value = value, onValueChange = onValueChange, label = { Text(label) },
        modifier = Modifier.fillMaxWidth(), singleLine = true,
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White))
}

@Composable private fun YellowButton(text: String, onClick: () -> Unit) {
    Button(onClick = onClick, modifier = Modifier.fillMaxWidth().height(54.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Yellow, contentColor = Ink),
        shape = RoundedCornerShape(18.dp)) { Text(text, fontWeight = FontWeight.Bold) }
}
