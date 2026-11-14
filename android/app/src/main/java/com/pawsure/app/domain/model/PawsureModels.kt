package com.pawsure.app.domain.model

/**
 * Core domain models for Pawsure Android MVP.
 * Preserves business rules from the web prototype while supporting
 * native multi-pet care requests, Friend/Helper eligibility, and emergency handovers.
 */

enum class UserRole {
    PET_OWNER,
    FRIEND,
    HELPER,
    COMMUNITY_COORDINATOR
}

enum class PetSpecies(val displayName: String) {
    DOG("Dog"),
    CAT("Cat"),
    RABBIT("Rabbit"),
    GUINEA_PIG("Guinea pig"),
    BIRD("Bird"),
    FISH("Fish")
}

enum class CareTaskType(val label: String) {
    FEEDING("Feeding"),
    FRESH_WATER("Fresh water"),
    WALKING("Walking"),
    MEDICATION_ASSISTANCE("Medication assistance"),
    BASIC_CHECK_IN("Basic check-in"),
    PET_OBSERVATION("Pet observation"),
    CUSTOM("Other owner-defined task")
}

enum class CareTaskStatus(val label: String) {
    DRAFT("Draft"),
    SEARCHING("Searching"),
    OFFERED("Offered"),
    ACCEPTED("Accepted"),
    IN_PROGRESS("In Progress"),
    DELAYED("Delayed"),
    INTERRUPTED("Interrupted"),
    AWAITING_CONFIRMATION("Awaiting Confirmation"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    ESCALATED("Escalated")
}

enum class EvidenceStatus(val label: String) {
    SUBMITTED("Submitted"),
    MISSING("Missing"),
    INCOMPLETE("Incomplete"),
    AWAITING_OWNER_CONFIRMATION("Awaiting owner confirmation"),
    CONFIRMED("Confirmed")
}

enum class CaregiverAvailabilityStatus {
    ACTIVE,
    PAUSED,
    UNAVAILABLE
}

enum class CommunicationChannel(val label: String) {
    ANDROID_APP("Android app"),
    WHATSAPP("WhatsApp (Simulator)"),
    SMS_BASIC_PHONE("SMS / Basic phone (Simulator)"),
    AUTOMATED_IVR("Automated voice / IVR (Simulator)")
}

data class PetProfile(
    val petId: String,
    val ownerId: String,
    val name: String,
    val species: PetSpecies,
    val breed: String,
    val ageLabel: String,
    val photoUrl: String? = null,
    val photoResName: String? = null,
    val societyName: String = "Green Glen Layout • Tower 4",
    val foodInstructions: String,
    val medicationInstructions: String,
    val vaccinationRecords: List<String> = emptyList(),
    val specialCareRequirements: String = "",
    val emergencyVetContactName: String,
    val emergencyVetPhone: String
)

data class CareEvidence(
    val id: String,
    val taskId: String,
    val photoUri: String? = null,
    val taskCompletionConfirmed: Boolean,
    val note: String? = null,
    val timestampEpochMillis: Long,
    val status: EvidenceStatus
)

data class CareEvent(
    val eventId: String,
    val taskId: String,
    val status: CareTaskStatus,
    val actorRole: UserRole,
    val summary: String,
    val timestampEpochMillis: Long
)

data class CareTask(
    val id: String,
    val requestId: String,
    val petIds: List<String>,
    val taskType: CareTaskType,
    val instructions: String,
    val assignedCaregiverId: String? = null,
    val assignedCaregiverName: String? = null,
    val dueTimeLabel: String,
    val status: CareTaskStatus,
    val evidenceRequired: Boolean = true,
    val evidence: CareEvidence? = null,
    val completionTimestampEpochMillis: Long? = null,
    val ownerConfirmationRequired: Boolean = true,
    val ownerConfirmed: Boolean = false,
    val eventHistory: List<CareEvent> = emptyList()
)

data class CaregiverProfile(
    val id: String,
    val displayName: String,
    val role: UserRole,
    val explicitOptIn: Boolean,
    val availabilityStatus: CaregiverAvailabilityStatus,
    val supportedSpecies: Set<PetSpecies>,
    val maxPetCapacity: Int,
    val activeAssignedPetsCount: Int = 0,
    val societyId: String,
    val societyName: String,
    val verifiedLocationCode: String,
    val skills: Set<String> = emptySet(),
    val preferredChannel: CommunicationChannel = CommunicationChannel.ANDROID_APP,
    val simulatedEtaMinutes: Int? = null,
    val isEtaMocked: Boolean = true,
    val rating: Double = 4.9
)
