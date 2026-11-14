package com.pawsure.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.pawsure.app.data.repository.DemoPawsureRepository
import com.pawsure.app.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import javax.inject.Inject

data class PawsureUiState(
    val ownerName: String = "Neha Kapoor",
    val societyLabel: String = "Green Glen Layout • Tower 4",
    val activeRole: UserRole = UserRole.PET_OWNER,
    val searchQuery: String = "",
    val selectedCategory: PetSpecies? = null,
    val pets: List<PetProfile> = emptyList(),
    val tasks: List<CareTask> = emptyList(),
    val eligibleCaregivers: List<CaregiverProfile> = emptyList(),
    val unreadNotificationsCount: Int = 2,
    val notifications: List<String> = listOf(
        "Sunita Sharma uploaded a water bowl photo for Bruno — awaiting owner confirmation.",
        "Priya Nair accepted Luna's 6:30 PM feeding & balcony mesh check."
    ),
    val activeEmergencyMessage: String? = null,
    val statusBannerMessage: String? = null
) {
    val filteredPets: List<PetProfile>
        get() = pets.filter { pet ->
            val matchesCategory = selectedCategory == null || pet.species == selectedCategory
            val q = searchQuery.trim().lowercase()
            val matchesQuery = q.isEmpty() ||
                pet.name.lowercase().contains(q) ||
                pet.breed.lowercase().contains(q) ||
                pet.species.displayName.lowercase().contains(q)
            matchesCategory && matchesQuery
        }

    val filteredTasks: List<CareTask>
        get() {
            val matchingPetIds = filteredPets.map { it.petId }.toSet()
            val q = searchQuery.trim().lowercase()
            return tasks.filter { task ->
                val matchesPet = task.petIds.any { it in matchingPetIds }
                val matchesQuery = q.isEmpty() ||
                    task.taskType.label.lowercase().contains(q) ||
                    task.instructions.lowercase().contains(q) ||
                    (task.assignedCaregiverName?.lowercase()?.contains(q) == true)
                matchesPet || (q.isNotEmpty() && matchesQuery)
            }
        }
}

@HiltViewModel
class PawsureMainViewModel @Inject constructor(
    private val repository: DemoPawsureRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        PawsureUiState(
            pets = repository.getInitialPets(),
            tasks = repository.getInitialTasks(),
            eligibleCaregivers = repository.getInitialCaregivers()
        )
    )
    val uiState: StateFlow<PawsureUiState> = _uiState.asStateFlow()

    fun onSearchQueryChanged(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun onCategorySelected(species: PetSpecies?) {
        _uiState.update { it.copy(selectedCategory = species) }
    }

    fun onRoleChanged(role: UserRole) {
        _uiState.update {
            it.copy(
                activeRole = role,
                statusBannerMessage = "Switched perspective to ${role.name.replace('_', ' ')}"
            )
        }
    }

    fun applyOnboardingProfile(fullName: String, role: UserRole, society: String) {
        _uiState.update { state ->
            state.copy(
                ownerName = fullName.ifBlank { state.ownerName },
                societyLabel = society.ifBlank { state.societyLabel },
                activeRole = role,
                statusBannerMessage = "Local preview loaded for ${fullName.ifBlank { state.ownerName }}."
            )
        }
    }

    fun getPetById(petId: String): PetProfile? {
        return _uiState.value.pets.firstOrNull { it.petId == petId }
            ?: _uiState.value.pets.firstOrNull()
    }

    fun confirmTaskEvidence(taskId: String) {
        _uiState.update { state ->
            val updatedTasks = state.tasks.map { task ->
                if (task.id == taskId && task.evidence != null) {
                    // Only confirm if caregiver evidence exists; missing evidence never auto-completes.
                    task.copy(
                        status = CareTaskStatus.COMPLETED,
                        ownerConfirmed = true,
                        evidence = task.evidence.copy(status = EvidenceStatus.CONFIRMED)
                    )
                } else {
                    task
                }
            }
            state.copy(
                tasks = updatedTasks,
                statusBannerMessage = "Owner confirmed care task completion."
            )
        }
    }

    fun notifyCaregiverSelected(displayName: String) {
        _uiState.update {
            it.copy(
                statusBannerMessage = "Selected $displayName (Demo preview — connect backend to send request)."
            )
        }
    }

    fun markNotificationsRead() {
        _uiState.update {
            it.copy(unreadNotificationsCount = 0)
        }
    }

    fun triggerEmergencySos() {
        _uiState.update {
            it.copy(
                activeEmergencyMessage = "SOS Escalation Ready: Authorized emergency vet (Dr. Ananya Rao) and society backup contacts can be alerted immediately. Live emergency dispatch remains disabled until carrier integration is configured."
            )
        }
    }

    fun dismissEmergencySos() {
        _uiState.update { it.copy(activeEmergencyMessage = null) }
    }

    fun dismissStatusBanner() {
        _uiState.update { it.copy(statusBannerMessage = null) }
    }
}
