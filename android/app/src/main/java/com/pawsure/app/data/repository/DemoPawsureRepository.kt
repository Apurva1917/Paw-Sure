package com.pawsure.app.data.repository

import com.pawsure.app.domain.model.*
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Deterministic in-memory & offline-first sample repository preserving all
 * existing Pawsure business rules across Owner, Friend, Helper, and Coordinator roles.
 */
@Singleton
class DemoPawsureRepository @Inject constructor() {

    fun getInitialPets(): List<PetProfile> = listOf(
        PetProfile(
            petId = "pet-bruno-1",
            ownerId = "owner-neha-1",
            name = "Bruno",
            species = PetSpecies.DOG,
            breed = "Golden Retriever",
            ageLabel = "3 yrs",
            photoResName = "pet_bruno",
            societyName = "Green Glen Layout • Tower 4",
            foodInstructions = "1.5 cups Royal Canin Adult + warm water at 8:00 AM & 7:00 PM. No grapes, chocolate, or spiced food.",
            medicationInstructions = "Omega-3 coat supplement capsule with morning meal.",
            vaccinationRecords = listOf(
                "Rabies Booster — Verified (Due Nov 2026)",
                "DHPPiL 9-in-1 — Verified (Valid until Mar 2027)",
                "Quarterly Deworming — Up to date"
            ),
            specialCareRequirements = "Use front-clip harness only. Mild leash reactivity near male dogs.",
            emergencyVetContactName = "Dr. Ananya Rao (Cessna Lifeline)",
            emergencyVetPhone = "+91 80 4110 2233"
        ),
        PetProfile(
            petId = "pet-luna-1",
            ownerId = "owner-neha-1",
            name = "Luna",
            species = PetSpecies.CAT,
            breed = "Indie / Domestic Shorthair",
            ageLabel = "2 yrs",
            photoResName = "pet_luna",
            societyName = "Green Glen Layout • Tower 4",
            foodInstructions = "1 pouch wet food at 8:30 AM, 40g dry kibble at 6:30 PM. Fresh ceramic water bowl only.",
            medicationInstructions = "No active medications.",
            vaccinationRecords = listOf(
                "FVRCP Core Vaccine — Verified (Valid until Jan 2027)",
                "Anti-Rabies — Verified"
            ),
            specialCareRequirements = "Indoor only — confirm balcony safety mesh is latched before leaving.",
            emergencyVetContactName = "Dr. Ananya Rao (Cessna Lifeline)",
            emergencyVetPhone = "+91 80 4110 2233"
        )
    )

    fun getInitialTasks(): List<CareTask> {
        val now = 1_794_672_000_000L
        return listOf(
            CareTask(
                id = "task-walk-morning",
                requestId = "req-today-1",
                petIds = listOf("pet-bruno-1"),
                taskType = CareTaskType.WALKING,
                instructions = "25-min shaded courtyard walk using front-clip harness.",
                assignedCaregiverId = "helper-sunita-1",
                assignedCaregiverName = "Sunita Sharma (Helper)",
                dueTimeLabel = "08:00 AM",
                status = CareTaskStatus.COMPLETED,
                evidence = CareEvidence(
                    id = "ev-1",
                    taskId = "task-walk-morning",
                    taskCompletionConfirmed = true,
                    note = "Completed walk + gate arrival logged. Hydrated well after walk.",
                    timestampEpochMillis = now - 7_200_000L,
                    status = EvidenceStatus.CONFIRMED
                ),
                ownerConfirmed = true
            ),
            CareTask(
                id = "task-med-midday",
                requestId = "req-today-1",
                petIds = listOf("pet-bruno-1"),
                taskType = CareTaskType.MEDICATION_ASSISTANCE,
                instructions = "Give Omega-3 supplement with lunch check-in and fresh water refill.",
                assignedCaregiverId = "helper-sunita-1",
                assignedCaregiverName = "Sunita Sharma (Helper)",
                dueTimeLabel = "01:30 PM",
                status = CareTaskStatus.AWAITING_CONFIRMATION,
                evidence = CareEvidence(
                    id = "ev-2",
                    taskId = "task-med-midday",
                    taskCompletionConfirmed = true,
                    note = "Uploaded water bowl photo & task confirmation via WhatsApp simulator.",
                    timestampEpochMillis = now - 1_800_000L,
                    status = EvidenceStatus.AWAITING_OWNER_CONFIRMATION
                ),
                ownerConfirmed = false
            ),
            CareTask(
                id = "task-cat-evening",
                requestId = "req-today-1",
                petIds = listOf("pet-luna-1"),
                taskType = CareTaskType.FEEDING,
                instructions = "Evening kibble + scoop litter box + balcony mesh check.",
                assignedCaregiverId = "friend-rohit-2",
                assignedCaregiverName = "Priya Nair (Friend • Tower 3)",
                dueTimeLabel = "06:30 PM",
                status = CareTaskStatus.ACCEPTED,
                evidence = null, // Missing evidence is never auto-marked completed
                ownerConfirmed = false
            )
        )
    }

    fun getInitialCaregivers(): List<CaregiverProfile> = listOf(
        CaregiverProfile(
            id = "helper-sunita-1",
            displayName = "Sunita Sharma",
            role = UserRole.HELPER,
            explicitOptIn = true,
            availabilityStatus = CaregiverAvailabilityStatus.ACTIVE,
            supportedSpecies = setOf(PetSpecies.DOG, PetSpecies.CAT),
            maxPetCapacity = 2,
            activeAssignedPetsCount = 1,
            societyId = "soc-ggl-blr",
            societyName = "Green Glen Layout",
            verifiedLocationCode = "BLR-BELLANDUR-560103",
            skills = setOf("Front-clip leash handling", "Oral supplements"),
            preferredChannel = CommunicationChannel.WHATSAPP,
            simulatedEtaMinutes = 6,
            isEtaMocked = true,
            rating = 4.96
        ),
        CaregiverProfile(
            id = "friend-priya-1",
            displayName = "Priya Nair",
            role = UserRole.FRIEND,
            explicitOptIn = true,
            availabilityStatus = CaregiverAvailabilityStatus.ACTIVE,
            supportedSpecies = setOf(PetSpecies.CAT, PetSpecies.RABBIT, PetSpecies.BIRD),
            maxPetCapacity = 2,
            activeAssignedPetsCount = 1,
            societyId = "soc-ggl-blr",
            societyName = "Green Glen Layout • Tower 3",
            verifiedLocationCode = "BLR-BELLANDUR-560103",
            skills = setOf("Indoor cat safety", "Balcony mesh check"),
            preferredChannel = CommunicationChannel.ANDROID_APP,
            simulatedEtaMinutes = 4,
            isEtaMocked = true,
            rating = 4.92
        )
    )
}
