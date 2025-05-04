import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
  PlusIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { usePatient } from '../context/PatientContext';
import { useLabs } from '../context/LabsContext';
import { useDiagnostics } from '../context/DiagnosticsContext';
import VitalsTrends from '../components/VitalsTrends';
import MedicalHistoryModal from '../components/MedicalHistoryModal';
import FamilyHistoryModal from '../components/FamilyHistoryModal';
import SocialHistoryModal from '../components/SocialHistoryModal';
import AllergyModal from '../components/AllergyModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import MedicationManagement from '../components/MedicationManagement';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal states for history entries
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [showSurgicalHistoryModal, setShowSurgicalHistoryModal] = useState(false);
  const [showFamilyHistoryModal, setShowFamilyHistoryModal] = useState(false);
  const [showSocialHistoryModal, setShowSocialHistoryModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showDeleteEntryModal, setShowDeleteEntryModal] = useState(false);

  // Selected entry for editing or deleting
  const [selectedMedicalEntry, setSelectedMedicalEntry] = useState(null);
  const [selectedSurgicalEntry, setSelectedSurgicalEntry] = useState(null);
  const [selectedFamilyEntry, setSelectedFamilyEntry] = useState(null);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [deleteEntryType, setDeleteEntryType] = useState('');
  const [deleteEntryIndex, setDeleteEntryIndex] = useState(null);

  // State for labs and diagnostics
  const [labResults, setLabResults] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);

  const { getPatient, getPatientNotes, getPatientOrders, getPatientVitals, updatePatient } = usePatient();
  const { getPatientLabResults } = useLabs();
  const { getPatientDiagnostics } = useDiagnostics();

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);

        // Fetch patient data
        const patientData = await getPatient(id);

        if (patientData) {
          // Fetch related data
          const notes = await getPatientNotes(id);
          const orders = await getPatientOrders(id);
          const vitals = await getPatientVitals(id);

          // Create a complete patient object with all related data
          const completePatient = {
            ...patientData,
            notes: notes || [],
            orders: orders || [],
            vitals: vitals || [],
            // Add default medical history and medications if not present
            medicalHistory: patientData.medicalHistory || [
              { condition: 'Hypertension', diagnosedDate: '2018-03-10', status: 'Active' },
              { condition: 'Type 2 Diabetes', diagnosedDate: '2019-05-22', status: 'Active' },
              { condition: 'Appendectomy', diagnosedDate: '2010-11-05', status: 'Resolved' },
            ],
            medications: patientData.medications || [
              { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2018-03-15' },
              { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2019-05-30' },
            ]
          };

          setPatient(completePatient);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, getPatient, getPatientNotes, getPatientOrders, getPatientVitals]);

  // Fetch lab results when patient changes or tab is set to labs
  useEffect(() => {
    const fetchLabResults = async () => {
      if (patient && (activeTab === 'labs' || activeTab === 'overview')) {
        try {
          const results = await getPatientLabResults(patient.id);
          setLabResults(results || []);
        } catch (error) {
          console.error('Error fetching lab results:', error);
          setLabResults([]);
        }
      }
    };

    fetchLabResults();
  }, [patient, activeTab, getPatientLabResults]);

  // Fetch diagnostics when patient changes or tab is set to diagnostics
  useEffect(() => {
    const fetchDiagnostics = async () => {
      if (patient && activeTab === 'diagnostics') {
        try {
          const results = await getPatientDiagnostics(patient.id);
          setDiagnostics(results || []);
        } catch (error) {
          console.error('Error fetching diagnostics:', error);
          setDiagnostics([]);
        }
      }
    };

    fetchDiagnostics();
  }, [patient, activeTab, getPatientDiagnostics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading patient information...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Patient not found</h2>
          <p className="mt-1 text-gray-500">The patient you are looking for could not be found.</p>
          <Link to="/patients" className="mt-4 inline-block btn btn-primary">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  // Medical History Handlers
  const handleAddMedicalHistory = () => {
    setSelectedMedicalEntry(null);
    setShowMedicalHistoryModal(true);
  };

  const handleEditMedicalHistory = (entry) => {
    setSelectedMedicalEntry(entry);
    setShowMedicalHistoryModal(true);
  };

  const handleDeleteMedicalHistory = (entry, index) => {
    setDeleteEntryType('medical');
    setDeleteEntryIndex(index);
    setSelectedMedicalEntry(entry);
    setShowDeleteEntryModal(true);
  };

  const handleSaveMedicalHistory = async (formData, entryId) => {
    try {
      const updatedMedicalHistory = [...(patient.medicalHistory || [])];

      if (entryId !== null) {
        // Edit existing entry
        const index = updatedMedicalHistory.findIndex(entry => entry === selectedMedicalEntry);
        if (index !== -1) {
          updatedMedicalHistory[index] = { ...formData };
        }
      } else {
        // Add new entry
        updatedMedicalHistory.push(formData);
      }

      const updatedPatient = { ...patient, medicalHistory: updatedMedicalHistory };
      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error updating medical history:', error);
    }
  };

  // Surgical History Handlers
  const handleAddSurgicalHistory = () => {
    setSelectedSurgicalEntry(null);
    setShowSurgicalHistoryModal(true);
  };

  const handleEditSurgicalHistory = (entry) => {
    setSelectedSurgicalEntry(entry);
    setShowSurgicalHistoryModal(true);
  };

  const handleDeleteSurgicalHistory = (entry, index) => {
    setDeleteEntryType('surgical');
    setDeleteEntryIndex(index);
    setSelectedSurgicalEntry(entry);
    setShowDeleteEntryModal(true);
  };

  const handleSaveSurgicalHistory = async (formData, entryId) => {
    try {
      const updatedMedicalHistory = [...(patient.medicalHistory || [])];

      if (entryId !== null) {
        // Edit existing entry
        const index = updatedMedicalHistory.findIndex(entry => entry === selectedSurgicalEntry);
        if (index !== -1) {
          updatedMedicalHistory[index] = { ...formData, type: 'Surgical' };
        }
      } else {
        // Add new entry
        updatedMedicalHistory.push({ ...formData, type: 'Surgical' });
      }

      const updatedPatient = { ...patient, medicalHistory: updatedMedicalHistory };
      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error updating surgical history:', error);
    }
  };

  // Family History Handlers
  const handleAddFamilyHistory = () => {
    setSelectedFamilyEntry(null);
    setShowFamilyHistoryModal(true);
  };

  const handleEditFamilyHistory = (entry) => {
    setSelectedFamilyEntry(entry);
    setShowFamilyHistoryModal(true);
  };

  const handleDeleteFamilyHistory = (entry, index) => {
    setDeleteEntryType('family');
    setDeleteEntryIndex(index);
    setSelectedFamilyEntry(entry);
    setShowDeleteEntryModal(true);
  };

  const handleSaveFamilyHistory = async (formData, entryId) => {
    try {
      const updatedFamilyHistory = [...(patient.familyHistory || [])];

      // Ensure relations is an array and not empty
      if (!formData.relations || formData.relations.length === 0) {
        // If using legacy format with single relation, convert it
        if (formData.relation) {
          formData.relations = [formData.relation];
          delete formData.relation;
        } else {
          // Should not happen due to form validation, but just in case
          formData.relations = [];
        }
      }

      if (entryId !== null) {
        // Edit existing entry
        const index = updatedFamilyHistory.findIndex(entry => entry === selectedFamilyEntry);
        if (index !== -1) {
          updatedFamilyHistory[index] = { ...formData };
        }
      } else {
        // Add new entry
        updatedFamilyHistory.push(formData);
      }

      const updatedPatient = { ...patient, familyHistory: updatedFamilyHistory };
      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error updating family history:', error);
    }
  };

  // Social History Handlers
  const handleEditSocialHistory = () => {
    setShowSocialHistoryModal(true);
  };

  const handleSaveSocialHistory = async (formData) => {
    try {
      const updatedPatient = { ...patient, socialHistory: formData };
      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error updating social history:', error);
    }
  };

  // Allergy Handlers
  const handleAddAllergy = () => {
    setSelectedAllergy(null);
    setShowAllergyModal(true);
  };

  const handleEditAllergy = (allergy, index) => {
    setSelectedAllergy(allergy);
    setDeleteEntryIndex(index);
    setShowAllergyModal(true);
  };

  const handleDeleteAllergy = (allergy, index) => {
    setDeleteEntryType('allergy');
    setDeleteEntryIndex(index);
    setSelectedAllergy(allergy);
    setShowDeleteEntryModal(true);
  };

  const handleSaveAllergy = async (allergyData, oldAllergy) => {
    try {
      const updatedAllergies = [...(patient.allergies || [])];

      if (oldAllergy !== null) {
        // Edit existing entry
        const index = updatedAllergies.findIndex(a => {
          // Handle both string format (legacy) and object format
          if (typeof a === 'string' && typeof oldAllergy === 'string') {
            return a === oldAllergy;
          } else if (typeof a === 'string') {
            return a === oldAllergy;
          } else if (typeof oldAllergy === 'string') {
            return a.name === oldAllergy;
          } else {
            return a.name === oldAllergy.name;
          }
        });

        if (index !== -1) {
          updatedAllergies[index] = allergyData;
        }
      } else {
        // Add new entry
        updatedAllergies.push(allergyData);
      }

      const updatedPatient = { ...patient, allergies: updatedAllergies };
      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error updating allergies:', error);
    }
  };

  // Delete Entry Handler
  const handleConfirmDeleteEntry = async () => {
    try {
      let updatedPatient = { ...patient };

      switch (deleteEntryType) {
        case 'medical':
          updatedPatient.medicalHistory = patient.medicalHistory.filter(entry => entry !== selectedMedicalEntry);
          break;
        case 'surgical':
          updatedPatient.medicalHistory = patient.medicalHistory.filter(entry => entry !== selectedSurgicalEntry);
          break;
        case 'family':
          updatedPatient.familyHistory = patient.familyHistory.filter(entry => entry !== selectedFamilyEntry);
          break;
        case 'allergy':
          updatedPatient.allergies = patient.allergies.filter(allergy => allergy !== selectedAllergy);
          break;
        default:
          break;
      }

      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
      setShowDeleteEntryModal(false);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div>
      {/* Patient header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div className="flex items-center">
            <UserCircleIcon className="h-16 w-16 text-gray-400 mr-4" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                <p>{calculateAge(patient.dob)} years ({patient.gender})</p>
                <p>DOB: {formatDate(patient.dob)}</p>
                <p>MRN: {patient.mrn}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to={`/patients/${patient.id}/edit`} className="btn btn-secondary inline-flex items-center">
              <PencilIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${
              activeTab === 'vitals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('vitals')}
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Vitals
          </button>
          <button
            className={`${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('notes')}
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            Notes
          </button>
          <button
            className={`${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
            Orders
          </button>
          <button
            className={`${
              activeTab === 'labs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('labs')}
          >
            <BeakerIcon className="h-4 w-4 mr-1" />
            Labs
          </button>
          <button
            className={`${
              activeTab === 'diagnostics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('diagnostics')}
          >
            <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
            Diagnostics
          </button>
          <button
            className={`${
              activeTab === 'medications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('medications')}
          >
            <BeakerIcon className="h-4 w-4 mr-1" />
            Medications
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Patient Information */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.name}</dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(patient.dob)} ({calculateAge(patient.dob)} years)</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.gender}</dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.address}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.phone}</dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.insurance}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.policyNumber}</dd>
                  </div>
                  {patient.additionalNotes && (
                    <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">{patient.additionalNotes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Medical & Surgical History Column */}
            <div className="space-y-6">
              {/* Medical History */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Medical History</h2>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleAddMedicalHistory}
                  >
                    Add New
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {patient.medicalHistory && patient.medicalHistory
                      .filter(condition => condition.type !== 'Surgical')
                      .map((condition, index) => (
                      <li key={index} className="px-4 py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{condition.condition}</p>
                            <p className="text-sm text-gray-500">Diagnosed: {formatDate(condition.diagnosedDate)}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-4 ${
                              condition.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {condition.status}
                            </span>
                            <button
                              onClick={() => handleEditMedicalHistory(condition)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicalHistory(condition, index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                    {!patient.medicalHistory || patient.medicalHistory.filter(condition => condition.type !== 'Surgical').length === 0 && (
                      <li className="px-4 py-4 text-sm text-gray-500">No medical history recorded</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Surgical History */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Surgical History</h2>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleAddSurgicalHistory}
                  >
                    Add New
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {patient.medicalHistory && patient.medicalHistory
                      .filter(condition => condition.type === 'Surgical')
                      .map((surgery, index) => (
                      <li key={index} className="px-4 py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{surgery.condition}</p>
                            <p className="text-sm text-gray-500">Date: {formatDate(surgery.diagnosedDate)}</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleEditSurgicalHistory(surgery)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSurgicalHistory(surgery, index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                    {!patient.medicalHistory || patient.medicalHistory.filter(condition => condition.type === 'Surgical').length === 0 && (
                      <li className="px-4 py-4 text-sm text-gray-500">No surgical history recorded</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Allergies</h2>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleAddAllergy}
                  >
                    Add New
                  </button>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <ul className="space-y-4">
                      {patient.allergies.map((allergy, index) => (
                        <li key={index} className="flex justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {typeof allergy === 'string' ? allergy : allergy.name}
                            </span>
                            {typeof allergy !== 'string' && allergy.reaction && (
                              <p className="text-sm text-gray-500 mt-1">
                                Reaction: {allergy.reaction}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleEditAllergy(allergy, index)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAllergy(allergy, index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No known allergies</p>
                  )}
                </div>
              </div>
            </div>

            {/* Family & Social History Column */}
            <div className="space-y-6">
              {/* Family History */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Family History</h2>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleAddFamilyHistory}
                  >
                    Add New
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {patient.familyHistory && patient.familyHistory.length > 0 ? (
                      patient.familyHistory.map((item, index) => (
                        <li key={index} className="px-4 py-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.condition}</p>
                              {item.relations ? (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-500 mb-1">Family Members:</p>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {item.relations.map((relation, idx) => (
                                      <li key={idx} className="text-sm text-gray-500">{relation}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">Relation: {item.relation || 'Not specified'}</p>
                              )}
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() => handleEditFamilyHistory(item)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFamilyHistory(item, index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-4 text-sm text-gray-500">No family history recorded</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Social History */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Social History</h2>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleEditSocialHistory}
                  >
                    {patient.socialHistory ? 'Edit' : 'Add New'}
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Tobacco Use</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div>
                          <span className="font-medium">{patient.socialHistory?.tobaccoUse || 'Not recorded'}</span>

                          {patient.socialHistory?.tobaccoUse && patient.socialHistory.tobaccoUse !== 'Never' && (
                            <div className="mt-1 pl-2 border-l-2 border-gray-200">
                              {patient.socialHistory.tobaccoType && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Type:</span> {patient.socialHistory.tobaccoType}
                                </div>
                              )}

                              {patient.socialHistory.tobaccoPackYears && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Pack Years:</span> {patient.socialHistory.tobaccoPackYears}
                                </div>
                              )}

                              {patient.socialHistory.tobaccoFrequency && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Frequency:</span> {patient.socialHistory.tobaccoFrequency}
                                </div>
                              )}

                              {patient.socialHistory.tobaccoQuitDate && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Quit Date:</span> {formatDate(patient.socialHistory.tobaccoQuitDate)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Alcohol Use</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div>
                          <span className="font-medium">{patient.socialHistory?.alcoholUse || 'Not recorded'}</span>

                          {patient.socialHistory?.alcoholUse && patient.socialHistory.alcoholUse !== 'None' && (
                            <div className="mt-1 pl-2 border-l-2 border-gray-200">
                              {patient.socialHistory.alcoholType && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Type:</span> {patient.socialHistory.alcoholType}
                                </div>
                              )}

                              {patient.socialHistory.alcoholDrinksPerWeek && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Drinks Per Week:</span> {patient.socialHistory.alcoholDrinksPerWeek}
                                </div>
                              )}

                              {patient.socialHistory.alcoholFrequency && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Frequency:</span> {patient.socialHistory.alcoholFrequency}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Recreational Drug Use</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div>
                          <span className="font-medium">{patient.socialHistory?.drugUse || 'Not recorded'}</span>

                          {patient.socialHistory?.drugUse && patient.socialHistory.drugUse !== 'Never' && (
                            <div className="mt-1 pl-2 border-l-2 border-gray-200">
                              {patient.socialHistory.drugTypes && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Types:</span> {patient.socialHistory.drugTypes}
                                </div>
                              )}

                              {patient.socialHistory.drugFrequency && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Frequency:</span> {patient.socialHistory.drugFrequency}
                                </div>
                              )}

                              {patient.socialHistory.drugLastUse && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Last Use:</span> {formatDate(patient.socialHistory.drugLastUse)}
                                </div>
                              )}

                              {patient.socialHistory.drugComments && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Comments:</span> {patient.socialHistory.drugComments}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Exercise</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {patient.socialHistory?.exercise || 'Not recorded'}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Diet</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {patient.socialHistory?.diet || 'Not recorded'}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {patient.socialHistory?.occupation || 'Not recorded'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Medications Section */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Current Medications</h2>
              <div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => setActiveTab('medications')}
                >
                  Manage Medications
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.medications && patient.medications.map((medication, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {medication.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medication.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medication.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(medication.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setActiveTab('medications')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!patient.medications || patient.medications.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-sm text-gray-500 text-center">
                        No medications recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'vitals' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Vitals History</h2>
            <Link to={`/patients/${patient.id}/vitals`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              Record New Vitals
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Pressure
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pulse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (lbs)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BMI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.vitals && patient.vitals.map((vital, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(vital.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.bp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.pulse} bpm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.temp}°F
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.weight} lbs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.bmi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vitals Trends Charts */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vitals Trends</h3>
            <VitalsTrends vitals={patient.vitals} />
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Patient Notes</h2>
            <Link to={`/patients/${patient.id}/notes/new`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              Add Note
            </Link>
          </div>

          <div className="space-y-6">
            {patient.notes && patient.notes.length > 0 ? (
              patient.notes.map((note) => (
                <div key={note.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{formatDate(note.date)}</p>
                    </div>
                    <div className="flex">
                      <button className="text-sm text-blue-600 hover:text-blue-500 mr-4">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-500">Delete</button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                <p className="text-gray-500">No notes have been added for this patient.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Orders</h2>
            <Link to={`/patients/${patient.id}/orders/new`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              New Order
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due/Completed Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.orders && patient.orders.length > 0 ? (
                  patient.orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.completedDate ? formatDate(order.completedDate) : (order.dueDate ? formatDate(order.dueDate) : 'N/A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.priority || 'Routine'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {order.details || order.results || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </Link>
                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                          <Link to={`/orders/${order.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found for this patient.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Lab Results</h2>
            <Link to={`/labs/new?patientId=${patient.id}`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              Order New Lab
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {labResults && labResults.length > 0 ? (
              <div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Test
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {labResults.map((result) => (
                          <tr key={result.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatDate(result.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.testName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                result.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {result.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                View Details
                              </button>
                              {result.status !== 'Completed' && (
                                <Link to={`/labs/${result.id}/results`} className="text-blue-600 hover:text-blue-900">
                                  Enter Results
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Lab Result Details */}
                    <div className="p-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Results</h3>

                      {labResults.filter(r => r.status === 'Completed').slice(0, 1).map(result => (
                        <div key={result.id} className="border border-gray-200 rounded-md p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="text-md font-medium text-gray-900">{result.testName}</h4>
                              <p className="text-sm text-gray-500">Date: {formatDate(result.date)}</p>
                            </div>
                          </div>

                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Test
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Result
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Reference Range
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Flag
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {result.results.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {item.value} {item.unit}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {item.referenceRange}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      item.flag === 'Normal' ? 'bg-green-100 text-green-800' :
                                      item.flag === 'High' ? 'bg-red-100 text-red-800' :
                                      item.flag === 'Low' ? 'bg-blue-100 text-blue-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {item.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No lab results found for this patient.</p>
                  </div>
                )}
              </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="medications-tab">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Medication Management</h2>
          </div>

          <MedicationManagement
            patient={patient}
            onUpdate={(updatedPatient) => setPatient(updatedPatient)}
          />
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Diagnostics</h2>
            <Link to={`/diagnostics/new?patientId=${patient.id}`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              Add Diagnostic
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {diagnostics && diagnostics.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {diagnostics.map((diagnostic) => (
                        <tr key={diagnostic.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatDate(diagnostic.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {diagnostic.code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {diagnostic.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              diagnostic.status === 'Active' ? 'bg-green-100 text-green-800' :
                              diagnostic.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {diagnostic.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {diagnostic.provider}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {diagnostic.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No diagnostics found for this patient.</p>
                  </div>
                )}
              </div>
        </div>
      )}



      {/* Medical History Modal */}
      <MedicalHistoryModal
        isOpen={showMedicalHistoryModal}
        onClose={() => setShowMedicalHistoryModal(false)}
        onSave={handleSaveMedicalHistory}
        entry={selectedMedicalEntry}
        type="Medical"
      />

      {/* Surgical History Modal */}
      <MedicalHistoryModal
        isOpen={showSurgicalHistoryModal}
        onClose={() => setShowSurgicalHistoryModal(false)}
        onSave={handleSaveSurgicalHistory}
        entry={selectedSurgicalEntry}
        type="Surgical"
      />

      {/* Family History Modal */}
      <FamilyHistoryModal
        isOpen={showFamilyHistoryModal}
        onClose={() => setShowFamilyHistoryModal(false)}
        onSave={handleSaveFamilyHistory}
        entry={selectedFamilyEntry}
      />

      {/* Social History Modal */}
      <SocialHistoryModal
        isOpen={showSocialHistoryModal}
        onClose={() => setShowSocialHistoryModal(false)}
        onSave={handleSaveSocialHistory}
        socialHistory={patient?.socialHistory}
      />

      {/* Allergy Modal */}
      <AllergyModal
        isOpen={showAllergyModal}
        onClose={() => setShowAllergyModal(false)}
        onSave={handleSaveAllergy}
        allergy={selectedAllergy}
      />

      {/* Delete Entry Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteEntryModal}
        onClose={() => setShowDeleteEntryModal(false)}
        onConfirm={handleConfirmDeleteEntry}
        title={`Delete ${deleteEntryType.charAt(0).toUpperCase() + deleteEntryType.slice(1)} History Entry`}
        message="Are you sure you want to delete this entry? This action cannot be undone."
      />
    </div>
  );
}