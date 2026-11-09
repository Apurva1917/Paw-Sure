import React, { useState, useMemo } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { Pet, SpeciesType } from '../../types/pawsure';
import {
  DOG_BREEDS,
  CAT_BREEDS,
  RABBIT_BREEDS,
  GUINEA_PIG_BREEDS,
  BIRD_BREEDS,
  FISH_BREEDS,
  BRUNO_PHOTO,
  LUNA_PHOTO
} from '../../data/mockData';
import {
  PawPrint,
  Heart,
  Utensils,
  AlertTriangle,
  Phone,
  FileCheck2,
  Search,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Droplets,
  Bird,
  Fish,
  Clock
} from 'lucide-react';

interface PetRegistrationWizardProps {
  initialPet?: Pet;
  onSuccess: (petId: string) => void;
  onCancel: () => void;
}

export const PetRegistrationWizard: React.FC<PetRegistrationWizardProps> = ({
  initialPet,
  onSuccess,
  onCancel
}) => {
  const { addPet, updatePet } = usePawsure();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState(initialPet?.name || '');
  const [species, setSpecies] = useState<SpeciesType>(initialPet?.species || 'dog');
  const [breedSearch, setBreedSearch] = useState('');
  const [breed, setBreed] = useState(initialPet?.breed || 'Golden Retriever');
  const [ageYears, setAgeYears] = useState(initialPet?.ageYears ?? 2);
  const [ageMonths, setAgeMonths] = useState(initialPet?.ageMonths ?? 0);
  const [weightKg, setWeightKg] = useState(initialPet?.weightKg ?? 18);
  const [sex, setSex] = useState<Pet['sex']>(initialPet?.sex || 'Male (Neutered)');
  const [photo, setPhoto] = useState(initialPet?.photo || BRUNO_PHOTO);
  const [microchipNumber, setMicrochipNumber] = useState(initialPet?.microchipNumber || '');

  // Step 2: Species Specific Fields
  const [dogLeash, setDogLeash] = useState(initialPet?.dogSpecifics?.walkLeashType || 'Front-clip harness');
  const [dogPottyFreq, setDogPottyFreq] = useState(initialPet?.dogSpecifics?.pottyFrequencyDaily || 3);
  const [dogSocial, setDogSocial] = useState(initialPet?.dogSpecifics?.dogParkTolerance || 'Selective');

  const [catLitter, setCatLitter] = useState<string>(initialPet?.catSpecifics?.litterBoxType || 'Clumping clay');
  const [catMeshConfirmed, setCatMeshConfirmed] = useState(initialPet?.catSpecifics?.balconySafetyMeshConfirmed ?? true);
  const [catIndoor, setCatIndoor] = useState(initialPet?.catSpecifics?.indoorOnly ?? true);

  const [rabbitHay, setRabbitHay] = useState<string>(initialPet?.rabbitSpecifics?.hayAccessType || 'Unlimited Timothy Hay');
  const [rabbitGiNotes, setRabbitGiNotes] = useState(initialPet?.rabbitSpecifics?.giStasisMonitoringNotes || 'Check daily for regular fecal pellets; alert immediately if no eating for 6 hrs.');

  const [gpVitaminC, setGpVitaminC] = useState<string>(initialPet?.guineaPigSpecifics?.vitaminCSupplement || 'Daily bell pepper slices');
  const [gpBedding, setGpBedding] = useState<string>(initialPet?.guineaPigSpecifics?.beddingType || 'Fleece liners');

  const [birdCoverTime, setBirdCoverTime] = useState(initialPet?.birdSpecifics?.cageCoverTime || '08:30 PM to 07:00 AM');
  const [birdFlightHours, setBirdFlightHours] = useState(initialPet?.birdSpecifics?.outOfCageFlightHours || '1.5 hours supervised in closed room');

  const [fishTankLiters, setFishTankLiters] = useState(initialPet?.fishSpecifics?.tankVolumeLiters || 45);
  const [fishWaterTemp, setFishWaterTemp] = useState(initialPet?.fishSpecifics?.waterTemperatureC || 25);

  const [otherHousing, setOtherHousing] = useState(initialPet?.otherSpecifics?.housingEnvironment || 'Enclosed ventilated terrarium');
  const [otherDiet, setOtherDiet] = useState(initialPet?.otherSpecifics?.specialDietaryNeeds || 'Specialized species feed & fresh greens');
  const [otherHandling, setOtherHandling] = useState(initialPet?.otherSpecifics?.handlingRisksNotes || 'Two-hand gentle support; avoid sudden overhead gestures');

  // Step 3: Behavior & Safety
  const [likesInput, setLikesInput] = useState(initialPet?.likes.join(', ') || 'Tennis ball fetch, ear scratches, tummy rubs');
  const [dislikesInput, setDislikesInput] = useState(initialPet?.dislikes.join(', ') || 'Vacuum cleaner, sudden fireworks, loud pressure cooker');
  const [temperamentInput, setTemperamentInput] = useState(initialPet?.temperament.join(', ') || 'Friendly, gentle, food-motivated');
  const [aggressionTriggersInput, setAggressionTriggersInput] = useState(
    initialPet?.aggressionTriggers.join(', ') || 'Taking marrow bone abruptly; lunging unleashed dogs'
  );
  const [handlingPrecautions, setHandlingPrecautions] = useState(
    initialPet?.handlingPrecautions || 'Always use front-clip harness for evening walks. Give verbal cue "Wait" before opening door.'
  );

  // Step 4: Feeding & Water
  const [foodPreferences, setFoodPreferences] = useState(initialPet?.foodPreferences || 'Royal Canin Maxi mixed with bone broth and warm chicken');
  const [quantityPerMeal, setQuantityPerMeal] = useState(initialPet?.quantityPerMeal || '1.5 cups (180g)');
  const [feedingSchedule, setFeedingSchedule] = useState(initialPet?.feedingSchedule || '8:00 AM & 7:30 PM');
  const [feedingRestrictions, setFeedingRestrictions] = useState(initialPet?.feedingRestrictions || 'Strictly zero onions, chocolate, grapes, raisins or cooked poultry bones');
  const [waterNeedsNotes, setWaterNeedsNotes] = useState(initialPet?.waterNeedsNotes || 'Fresh filtered water refilled thrice daily. Keep bowl in cool shaded corner.');

  // Step 5: Medical
  const [allergiesInput, setAllergiesInput] = useState(initialPet?.allergies.join(', ') || 'Slight sensitivity to artificial chicken byproduct meal');
  const [conditionsInput, setConditionsInput] = useState(initialPet?.medicalConditions.join(', ') || 'Mild hip laxity');
  const [medicationsList, setMedicationsList] = useState(initialPet?.medications || [
    {
      id: 'med-1',
      name: 'Glycoflex Plus Joint Chew',
      dosage: '1 chew tablet',
      frequency: 'Daily with breakfast',
      instructions: 'Give directly by hand before his morning kibble bowl.',
      prescribedBy: 'Dr. Vivek Menon',
      active: true
    }
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  // Step 6: Vet & Contacts
  const [vetName, setVetName] = useState(initialPet?.primaryVet.name || 'Dr. Vivek Menon');
  const [vetClinic, setVetClinic] = useState(initialPet?.primaryVet.clinic || 'Cessna Lifeline Vet Hospital');
  const [vetPhone, setVetPhone] = useState(initialPet?.primaryVet.phone || '+91 80 4115 1234');
  const [vetAddress, setVetAddress] = useState(initialPet?.primaryVet.address || 'Outer Ring Road, Bellandur, Bangalore');
  const [emergencyPhone1, setEmergencyPhone1] = useState(initialPet?.emergencyContacts[0]?.phone || '+91 98450 11223');
  const [emergencyName1, setEmergencyName1] = useState(initialPet?.emergencyContacts[0]?.name || 'Neha Kapoor (Mom)');
  const [homeSecurityCode, setHomeSecurityCode] = useState(initialPet?.securityHomeCode || '4829');

  // Summary
  const [caregiverNotesSummary, setCaregiverNotesSummary] = useState(
    initialPet?.caregiverNotesSummary ||
      'Gentle nature and eager to please. Ring bell softly. Give verbal praise after returning from park. Ensure gate latch clicks.'
  );

  // Searchable Breed Options
  const breedOptions = useMemo(() => {
    let list: string[] = [];
    switch (species) {
      case 'dog':
        list = DOG_BREEDS;
        break;
      case 'cat':
        list = CAT_BREEDS;
        break;
      case 'rabbit':
        list = RABBIT_BREEDS;
        break;
      case 'guinea_pig':
        list = GUINEA_PIG_BREEDS;
        break;
      case 'bird':
        list = BIRD_BREEDS;
        break;
      case 'fish':
        list = FISH_BREEDS;
        break;
      default:
        list = ['Mixed / Other Breed', 'Indie Breed', 'Unknown Breed'];
    }
    if (!breedSearch.trim()) return list;
    return list.filter((b) => b.toLowerCase().includes(breedSearch.toLowerCase()));
  }, [species, breedSearch]);

  const handleAddMed = () => {
    if (!newMedName.trim()) return;
    setMedicationsList((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: newMedName,
        dosage: newMedDosage || '1 dose',
        frequency: newMedFreq || 'Daily',
        instructions: 'Mix with meal treat',
        prescribedBy: vetName,
        active: true
      }
    ]);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
  };

  const handleFinalSubmit = () => {
    if (!name.trim()) {
      alert('Please enter your pet’s name.');
      setStep(1);
      return;
    }

    const likes = likesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const dislikes = dislikesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const temperament = temperamentInput.split(',').map((s) => s.trim()).filter(Boolean);
    const aggressionTriggers = aggressionTriggersInput.split(',').map((s) => s.trim()).filter(Boolean);
    const allergies = allergiesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const medicalConditions = conditionsInput.split(',').map((s) => s.trim()).filter(Boolean);

    const petPayload: Omit<Pet, 'id'> = {
      name,
      species,
      breed,
      ageYears: Number(ageYears),
      ageMonths: Number(ageMonths),
      weightKg: Number(weightKg),
      sex,
      photo: photo || (species === 'cat' ? LUNA_PHOTO : BRUNO_PHOTO),
      microchipNumber: microchipNumber || undefined,
      likes,
      dislikes,
      temperament,
      aggressionTriggers,
      handlingPrecautions,
      foodPreferences,
      quantityPerMeal,
      feedingSchedule,
      feedingRestrictions,
      waterNeedsNotes,
      allergies,
      medicalConditions,
      medications: medicationsList,
      healthRecords: initialPet?.healthRecords || [
        {
          id: `hr-${Date.now()}`,
          type: 'vaccine',
          title: 'Core Annual Booster & Anti-Rabies',
          dateAdministered: '2026-08-14',
          nextDueDate: '2027-08-14',
          vetClinic,
          status: 'valid'
        }
      ],
      primaryVet: {
        name: vetName,
        clinic: vetClinic,
        phone: vetPhone,
        address: vetAddress
      },
      emergencyContacts: [
        {
          id: `ec-1-${Date.now()}`,
          name: emergencyName1,
          relation: 'Primary Pet Parent',
          phone: emergencyPhone1
        }
      ],
      caregiverNotesSummary: caregiverNotesSummary || `${name} is friendly and well-mannered. Follow regular feeding and walk times.`,
      securityHomeCode: homeSecurityCode || '4829',
      dogSpecifics: species === 'dog' ? { walkLeashType: dogLeash as any, pottyFrequencyDaily: dogPottyFreq, dogParkTolerance: dogSocial as any } : undefined,
      catSpecifics: species === 'cat' ? { litterBoxType: catLitter as any, balconySafetyMeshConfirmed: catMeshConfirmed, indoorOnly: catIndoor } : undefined,
      rabbitSpecifics: species === 'rabbit' ? { hayAccessType: rabbitHay as any, giStasisMonitoringNotes: rabbitGiNotes } : undefined,
      guineaPigSpecifics: species === 'guinea_pig' ? { vitaminCSupplement: gpVitaminC as any, beddingType: gpBedding as any } : undefined,
      birdSpecifics: species === 'bird' ? { cageCoverTime: birdCoverTime, outOfCageFlightHours: birdFlightHours } : undefined,
      fishSpecifics: species === 'fish' ? { tankVolumeLiters: fishTankLiters, waterTemperatureC: fishWaterTemp } : undefined,
      otherSpecifics: species === 'other' ? { housingEnvironment: otherHousing, specialDietaryNeeds: otherDiet, handlingRisksNotes: otherHandling } : undefined
    };

    if (initialPet) {
      updatePet({ ...petPayload, id: initialPet.id });
      onSuccess(initialPet.id);
    } else {
      const newId = addPet(petPayload);
      onSuccess(newId);
    }
  };

  const stepsList = [
    { num: 1, title: 'Basics & Breed', icon: PawPrint },
    { num: 2, title: 'Species Specifics', icon: Sparkles },
    { num: 3, title: 'Safety & Behavior', icon: Heart },
    { num: 4, title: 'Diet & Water', icon: Utensils },
    { num: 5, title: 'Medical & Vet', icon: AlertTriangle },
    { num: 6, title: 'Care Card Preview', icon: FileCheck2 }
  ];

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Top Stepper Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EE8267]/20 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
              {initialPet ? 'Edit Profile' : 'Pet Registration Wizard'} · Step {step} of 6
            </span>
            <h1 className="font-heading text-xl font-bold text-[#38223A]">
              {initialPet ? `Update ${initialPet.name}'s Profile` : 'Register Your Pet'}
            </h1>
          </div>
          <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-800 underline">
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {stepsList.map((s) => {
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`h-2 rounded-full transition-all ${
                  isCurrent ? 'bg-[#EE8267] w-full' : isDone ? 'bg-[#A78BFA] w-full' : 'bg-gray-200 w-full'
                }`}
                title={`Step ${s.num}: ${s.title}`}
              />
            );
          })}
        </div>
        <p className="text-xs font-semibold text-[#38223A] mt-2">{stepsList[step - 1].title}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EE8267]/20 space-y-5">
        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-heading text-base font-bold text-[#38223A] flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#EE8267]" />
              Basic Pet Information & Species Selection
            </h2>

            {/* Species Selector (Dogs, Cats, Rabbits, Guinea Pigs, Birds, Fish, Other) */}
            <div>
              <label className="block text-xs font-semibold text-[#38223A] mb-1.5 uppercase">
                Species (All 7 companion categories supported)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
                {[
                  { id: 'dog', label: 'Dog 🐶' },
                  { id: 'cat', label: 'Cat 🐱' },
                  { id: 'rabbit', label: 'Rabbit 🐰' },
                  { id: 'guinea_pig', label: 'Guinea Pig 🐹' },
                  { id: 'bird', label: 'Bird 🦜' },
                  { id: 'fish', label: 'Fish 🐠' },
                  { id: 'other', label: 'Other 🐾' }
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => {
                      setSpecies(s.id as SpeciesType);
                      setBreedSearch('');
                      if (s.id === 'dog') setBreed('Golden Retriever');
                      else if (s.id === 'cat') setBreed('Domestic Shorthair');
                      else if (s.id === 'rabbit') setBreed('Holland Lop');
                      else if (s.id === 'guinea_pig') setBreed('American Guinea Pig');
                      else if (s.id === 'bird') setBreed('Budgerigar (Budgie)');
                      else if (s.id === 'fish') setBreed('Betta (Siamese Fighting Fish)');
                      else if (s.id === 'other') setBreed('Mixed / Exotic Species');
                    }}
                    className={`py-2 px-1 text-center rounded-2xl text-xs font-bold border transition ${
                      species === s.id
                        ? 'bg-[#FFF0E6] border-[#EE8267] text-[#EE8267]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-xs font-semibold text-[#38223A] mb-1">Pet Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bruno, Luna, Clover, Nemo"
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#EE8267]"
              />
            </div>

            {/* Searchable Breed Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#38223A] mb-1">
                Species-Specific Breed Selection (Searchable, including Indie/Mixed/Unknown) *
              </label>
              <div className="relative mb-2">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${species} breeds (e.g. Indie, Mixed, Dwarf)...`}
                  value={breedSearch}
                  onChange={(e) => setBreedSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EE8267]"
                />
              </div>

              <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-2xl p-1.5 grid grid-cols-2 gap-1 bg-[#FFF9F3]/40">
                {breedOptions.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBreed(b)}
                    className={`text-left text-xs px-2.5 py-1.5 rounded-xl transition ${
                      breed === b
                        ? 'bg-[#EE8267] text-white font-bold'
                        : 'hover:bg-gray-100 text-[#38223A]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Selected Breed: <strong className="text-[#EE8267]">{breed}</strong>
              </p>
            </div>

            {/* Age, Weight, Sex */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#38223A] mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#38223A] mb-1">Months</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#38223A] mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#38223A] mb-1">Gender & Altered Status</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as Pet['sex'])}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              >
                <option value="Male (Neutered)">Male (Neutered)</option>
                <option value="Male (Intact)">Male (Intact)</option>
                <option value="Female (Spayed)">Female (Spayed)</option>
                <option value="Female (Intact)">Female (Intact)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: SPECIES SPECIFIC FIELDS */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-heading text-base font-bold text-[#38223A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A78BFA]" />
              Dedicated {species.toUpperCase()} Handling Parameters
            </h2>

            {/* DOG SPECIFICS */}
            {species === 'dog' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block font-semibold mb-1">Walk Leash / Harness Type</label>
                  <select
                    value={dogLeash}
                    onChange={(e) => setDogLeash(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Front-clip harness">Front-clip harness (Reduces pulling)</option>
                    <option value="Standard collar">Standard flat collar</option>
                    <option value="Martingale">Martingale collar</option>
                    <option value="Slip lead">Slip lead</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Daily Potty Reliefs Needed</label>
                    <input
                      type="number"
                      value={dogPottyFreq}
                      onChange={(e) => setDogPottyFreq(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Dog Park Socialization</label>
                    <select
                      value={dogSocial}
                      onChange={(e) => setDogSocial(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="Selective">Selective (Prefers calm dogs)</option>
                      <option value="Loves other dogs">Loves all dogs</option>
                      <option value="Prefers humans only">Prefers humans only</option>
                      <option value="Reactive on leash">Reactive on leash</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* CAT SPECIFICS */}
            {species === 'cat' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block font-semibold mb-1">Litter Box Sand Type</label>
                  <input
                    type="text"
                    value={catLitter}
                    onChange={(e) => setCatLitter(e.target.value)}
                    placeholder="e.g. Clumping bentonite, wood pellets"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="meshCheck"
                    checked={catMeshConfirmed}
                    onChange={(e) => setCatMeshConfirmed(e.target.checked)}
                    className="rounded text-[#EE8267]"
                  />
                  <label htmlFor="meshCheck" className="font-semibold text-gray-700">
                    Balcony Safety Netting / Pigeon Mesh strictly confirmed & latched
                  </label>
                </div>
              </div>
            )}

            {/* RABBIT SPECIFICS */}
            {species === 'rabbit' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block font-semibold mb-1">Hay Access Protocol</label>
                  <input
                    type="text"
                    value={rabbitHay}
                    onChange={(e) => setRabbitHay(e.target.value)}
                    placeholder="e.g. Unlimited fresh Timothy hay 24/7"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">GI Stasis Watch Instructions</label>
                  <textarea
                    rows={2}
                    value={rabbitGiNotes}
                    onChange={(e) => setRabbitGiNotes(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
              </div>
            )}

            {/* GUINEA PIG SPECIFICS */}
            {species === 'guinea_pig' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block font-semibold mb-1">Daily Vitamin C Source (Crucial for Guinea Pigs)</label>
                  <input
                    type="text"
                    value={gpVitaminC}
                    onChange={(e) => setGpVitaminC(e.target.value)}
                    placeholder="e.g. Fresh bell pepper slices, liquid Vitamin C drops"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bedding Type & Spot Cleaning</label>
                  <input
                    type="text"
                    value={gpBedding}
                    onChange={(e) => setGpBedding(e.target.value)}
                    placeholder="e.g. Fleece liners with daily poop sweeping"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
              </div>
            )}

            {/* BIRD SPECIFICS */}
            {species === 'bird' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block font-semibold mb-1">Cage Bedtime Cover Schedule</label>
                  <input
                    type="text"
                    value={birdCoverTime}
                    onChange={(e) => setBirdCoverTime(e.target.value)}
                    placeholder="e.g. Cover cage at 8:30 PM in dark, quiet room"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Supervised Out-of-Cage Flight Time</label>
                  <input
                    type="text"
                    value={birdFlightHours}
                    onChange={(e) => setBirdFlightHours(e.target.value)}
                    placeholder="e.g. 1 hour daily with ceiling fans strictly OFF"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
              </div>
            )}

            {/* FISH SPECIFICS */}
            {species === 'fish' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Aquarium Volume (Liters)</label>
                    <input
                      type="number"
                      value={fishTankLiters}
                      onChange={(e) => setFishTankLiters(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Water Temperature (°C)</label>
                    <input
                      type="number"
                      value={fishWaterTemp}
                      onChange={(e) => setFishWaterTemp(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* OTHER / EXOTIC SPECIES SPECIFICS */}
            {species === 'other' && (
              <div className="space-y-3 text-xs bg-[#FFF9F3] p-4 rounded-2xl border border-gray-200">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                  <span className="font-bold block">Caution for Alternative Companion Species:</span>
                  <span>
                    To ensure safe caregiving by assigned sitters, please specify exact enclosure security, environmental controls, and handling hazards.
                  </span>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Housing / Enclosure Specifications</label>
                  <input
                    type="text"
                    value={otherHousing}
                    onChange={(e) => setOtherHousing(e.target.value)}
                    placeholder="e.g. Temperature regulated terrarium, UV lighting timer"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Specialized Dietary Requirements</label>
                  <input
                    type="text"
                    value={otherDiet}
                    onChange={(e) => setOtherDiet(e.target.value)}
                    placeholder="e.g. Specific insect/greens schedule, fresh water misting"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Handling Precautions & Bite/Stress Risks</label>
                  <textarea
                    rows={2}
                    value={otherHandling}
                    onChange={(e) => setOtherHandling(e.target.value)}
                    placeholder="e.g. Two-hand gentle support; avoid sudden overhead gestures; notify if pet becomes skittish"
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: BEHAVIOR & HANDLING */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading text-base font-bold text-[#38223A] flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Personality, Likes & Aggression Triggers
            </h2>

            <div>
              <label className="block text-xs font-semibold mb-1">Personality & Temperament</label>
              <input
                type="text"
                value={temperamentInput}
                onChange={(e) => setTemperamentInput(e.target.value)}
                placeholder="Gentle, food motivated, energetic"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Likes & Positive Reinforcers</label>
              <input
                type="text"
                value={likesInput}
                onChange={(e) => setLikesInput(e.target.value)}
                placeholder="Tennis ball, cucumber slices, ear rubs"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Dislikes & Fears</label>
              <input
                type="text"
                value={dislikesInput}
                onChange={(e) => setDislikesInput(e.target.value)}
                placeholder="Vacuum cleaner, thunderstorms"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <label className="block text-xs font-bold text-rose-800">
                Aggression Triggers & Reaction Preventions
              </label>
              <textarea
                rows={2}
                value={aggressionTriggersInput}
                onChange={(e) => setAggressionTriggersInput(e.target.value)}
                placeholder="e.g. Taking bone away without treat trade; lunging dogs"
                className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs bg-white"
              />

              <label className="block text-xs font-bold text-rose-800 pt-1">
                Special Handling Rules for Caregiver
              </label>
              <textarea
                rows={2}
                value={handlingPrecautions}
                onChange={(e) => setHandlingPrecautions(e.target.value)}
                placeholder="e.g. Front-clip harness only; verbal cue 'Wait' before door opens"
                className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs bg-white"
              />
            </div>
          </div>
        )}

        {/* STEP 4: FEEDING & WATER */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-heading text-base font-bold text-[#38223A] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#EE8267]" />
              Nutrition, Portions & Water Needs
            </h2>

            <div>
              <label className="block text-xs font-semibold mb-1">Food Brand / Meal Preferences</label>
              <input
                type="text"
                value={foodPreferences}
                onChange={(e) => setFoodPreferences(e.target.value)}
                placeholder="e.g. Royal Canin Maxi mixed with bone broth and chicken"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Quantity Per Meal</label>
                <input
                  type="text"
                  value={quantityPerMeal}
                  onChange={(e) => setQuantityPerMeal(e.target.value)}
                  placeholder="e.g. 1.5 cups (180g)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Feeding Schedule</label>
                <input
                  type="text"
                  value={feedingSchedule}
                  onChange={(e) => setFeedingSchedule(e.target.value)}
                  placeholder="e.g. 8:00 AM & 7:45 PM"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                Strictly Prohibited Foods & Toxic Treats
              </label>
              <input
                type="text"
                value={feedingRestrictions}
                onChange={(e) => setFeedingRestrictions(e.target.value)}
                placeholder="e.g. Strictly zero onions, garlic, chocolate, grapes or cooked bones"
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-rose-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Hydration & Water Needs</span>
              </label>
              <input
                type="text"
                value={waterNeedsNotes}
                onChange={(e) => setWaterNeedsNotes(e.target.value)}
                placeholder="e.g. Fresh filtered bowl refilled thrice daily. Keep in shaded corner."
                className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs bg-blue-50/30"
              />
            </div>
          </div>
        )}

        {/* STEP 5: MEDICAL & VET */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-heading text-base font-bold text-[#38223A] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Medical, Allergies & Primary Veterinarian
            </h2>

            <div>
              <label className="block text-xs font-semibold mb-1">Known Allergies</label>
              <input
                type="text"
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
                placeholder="e.g. Chicken byproduct, pollen itch"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            {/* Active Medications */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
              <label className="block text-xs font-bold text-[#38223A]">Daily Medications</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs bg-white"
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMed}
                    className="p-1.5 rounded-xl bg-[#A78BFA] text-white hover:bg-[#8B5CF6]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {medicationsList.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-white text-xs border border-purple-100">
                  <span><strong>{m.name}</strong> — {m.dosage} ({m.frequency})</span>
                  <button type="button" onClick={() => setMedicationsList((prev) => prev.filter((x) => x.id !== m.id))} className="text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Vet Details */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="block font-semibold mb-1">Vet Hospital / Clinic</label>
                <input
                  type="text"
                  value={vetClinic}
                  onChange={(e) => setVetClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Vet Doctor Phone</label>
                <input
                  type="text"
                  value={vetPhone}
                  onChange={(e) => setVetPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY & CARE CARD PREVIEW */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-[#38223A] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                Caregiver Quick Care Card Preview
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Auto-Generated
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-[#FFF9F3] border-2 border-[#EE8267]/30 space-y-3">
              <div className="flex items-center gap-3">
                <img src={photo} alt={name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#EE8267]" />
                <div>
                  <h3 className="font-heading font-bold text-base text-[#38223A]">
                    {name || 'Pet Name'} ({breed})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Species: <strong>{species.toUpperCase()}</strong> · {ageYears}y {ageMonths}m · {weightKg} kg · {sex}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Food & Times</span>
                  <p className="font-semibold text-[#38223A]">{quantityPerMeal} at {feedingSchedule}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Handling Rule</span>
                  <p className="font-semibold text-[#38223A] line-clamp-2">{handlingPrecautions}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Dietary Restrictions</span>
                <p className="text-rose-900">{feedingRestrictions}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200/60">
                <span>Primary Vet: {vetClinic}</span>
                <span className="font-mono text-[#EE8267] font-bold">Passcode: {homeSecurityCode}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Footer Controls */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !name.trim()) {
                  alert('Please enter pet name.');
                  return;
                }
                setStep(step + 1);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#EE8267] text-white text-xs font-semibold hover:bg-[#E26D50] shadow-sm ml-auto"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>{initialPet ? 'Update Pet Profile' : 'Complete Registration'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
