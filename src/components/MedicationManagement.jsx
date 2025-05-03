import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { usePatient } from '../context/PatientContext';
import MedicationOrderModal from './MedicationOrderModal';

export default function MedicationManagement({ patient, onUpdate }) {
  const { updatePatient, updateOrder } = usePatient();
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [medicationOrders, setMedicationOrders] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);

  // Extract medication orders from all orders and build medication history
  useEffect(() => {
    if (patient) {
      // Get medication orders
      if (patient.orders) {
        const medOrders = patient.orders.filter(order =>
          order.type === 'Medication' &&
          (order.status === 'Active' || order.status === 'Pending')
        );
        setMedicationOrders(medOrders);
      }

      // Build medication history from all sources
      const history = [];

      // Add current medications (all are active)
      if (patient.medications && Array.isArray(patient.medications)) {
        patient.medications.forEach(med => {
          if (med && med.name) { // Ensure the medication has required data
            history.push({
              ...med,
              status: 'Active',
              endDate: null
            });
          }
        });
      }

      // Add medications from the patient's medication history field (if it exists)
      if (patient.medicationHistory && Array.isArray(patient.medicationHistory)) {
        patient.medicationHistory.forEach(med => {
          if (med && med.name) { // Ensure the medication has required data
            // Make sure the medication has a status property
            const medicationWithStatus = {
              ...med,
              status: med.status || 'Inactive', // Default to Inactive if status is not specified
              endDate: med.endDate || null
            };
            history.push(medicationWithStatus);
          }
        });
      }

      // Add medications from completed or cancelled orders
      if (patient.orders && Array.isArray(patient.orders)) {
        const completedMedOrders = patient.orders.filter(order =>
          order.type === 'Medication' &&
          (order.status === 'Completed' || order.status === 'Cancelled')
        );

        completedMedOrders.forEach(order => {
          if (order) {
            const medicationName = order.medicationDetails?.medicationName ||
                                  order.details?.split(',')[0]?.trim() ||
                                  'Unknown Medication';

            // Check if this medication is already in history
            const existingIndex = history.findIndex(med =>
              med.name && med.name.toLowerCase() === medicationName.toLowerCase() &&
              med.status === 'Inactive'
            );

            if (existingIndex === -1) {
              // Add as a new entry
              history.push({
                name: medicationName,
                dosage: order.medicationDetails?.dosage || '',
                frequency: order.medicationDetails?.frequency || '',
                route: order.medicationDetails?.route || 'Oral',
                startDate: order.date || '',
                endDate: order.completedDate || '',
                status: 'Inactive',
                orderId: order.id
              });
            }
          }
        });
      }

      // Sort history by status (Active first) and then by name
      history.sort((a, b) => {
        if (a.status === 'Active' && b.status !== 'Active') return -1;
        if (a.status !== 'Active' && b.status === 'Active') return 1;
        return a.name.localeCompare(b.name);
      });

      setMedicationHistory(history);
    }
  }, [patient]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddMedication = () => {
    setSelectedMedication(null);
    setSelectedOrder(null);
    setShowMedicationModal(true);
  };

  const handleEditMedication = (medication, index) => {
    setSelectedMedication({ ...medication, index });
    setSelectedOrder(null);
    setShowMedicationModal(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setSelectedMedication(null);
    setShowMedicationModal(true);
  };

  const handleDeleteMedication = async (index) => {
    if (window.confirm('Are you sure you want to remove this medication?')) {
      const updatedMedications = [...patient.medications];
      updatedMedications.splice(index, 1);

      try {
        const updatedPatient = { ...patient, medications: updatedMedications };
        await updatePatient(patient.id, updatedPatient);
        onUpdate(updatedPatient);
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  const handleDiscontinueMedication = async (medication, index) => {
    if (window.confirm(`Are you sure you want to discontinue ${medication.name}?`)) {
      // Create a copy of the current medications and remove the discontinued one
      const updatedMedications = [...patient.medications];
      const discontinuedMedication = updatedMedications.splice(index, 1)[0];

      // Add the discontinued medication to the medication history with status "Inactive"
      const discontinuedMedicationHistory = {
        ...discontinuedMedication,
        status: 'Inactive',
        endDate: new Date().toISOString().split('T')[0]
      };

      // Create a new array for medication history that will be stored in the patient object
      // This is separate from the state variable medicationHistory which is derived in useEffect
      const updatedMedicationHistory = [...(patient.medicationHistory || [])];

      // Check if this medication already exists in history
      const existingIndex = updatedMedicationHistory.findIndex(
        med => med.name.toLowerCase() === discontinuedMedication.name.toLowerCase() &&
               med.dosage === discontinuedMedication.dosage
      );

      if (existingIndex >= 0) {
        // Update the existing entry
        updatedMedicationHistory[existingIndex] = discontinuedMedicationHistory;
      } else {
        // Add as a new entry
        updatedMedicationHistory.push(discontinuedMedicationHistory);
      }

      try {
        // Update the patient with the new medications and medication history
        const updatedPatient = {
          ...patient,
          medications: updatedMedications,
          medicationHistory: updatedMedicationHistory
        };

        await updatePatient(patient.id, updatedPatient);
        onUpdate(updatedPatient);
      } catch (error) {
        console.error('Error discontinuing medication:', error);
      }
    }
  };

  const handleRemoveFromHistory = async (index) => {
    if (window.confirm('Are you sure you want to remove this medication from history?')) {
      // Create a copy of the medication history from the patient object
      const updatedMedicationHistory = [...(patient.medicationHistory || [])];

      // Remove the medication from history
      updatedMedicationHistory.splice(index, 1);

      try {
        // Update the patient with the new medication history
        const updatedPatient = {
          ...patient,
          medicationHistory: updatedMedicationHistory
        };

        await updatePatient(patient.id, updatedPatient);
        onUpdate(updatedPatient);
      } catch (error) {
        console.error('Error removing medication from history:', error);
      }
    }
  };

  const handleDiscontinueMedicationFromHistory = async (medication, index) => {
    if (window.confirm(`Are you sure you want to discontinue ${medication.name}?`)) {
      try {
        // Find the medication in the actual patient data
        if (medication.status === 'Active') {
          // Check if this is a current medication
          const currentMedIndex = patient.medications.findIndex(
            med => med.name === medication.name &&
                  med.dosage === medication.dosage &&
                  med.frequency === medication.frequency
          );

          if (currentMedIndex !== -1) {
            // This is a current medication, so we need to discontinue it
            // by removing it from current medications and adding to history
            const updatedMedications = [...patient.medications];
            const discontinuedMedication = updatedMedications.splice(currentMedIndex, 1)[0];

            // Add to medication history
            const discontinuedMedicationHistory = {
              ...discontinuedMedication,
              status: 'Inactive',
              endDate: new Date().toISOString().split('T')[0]
            };

            const updatedMedicationHistory = [...(patient.medicationHistory || [])];
            updatedMedicationHistory.push(discontinuedMedicationHistory);

            // Update patient
            const updatedPatient = {
              ...patient,
              medications: updatedMedications,
              medicationHistory: updatedMedicationHistory
            };

            await updatePatient(patient.id, updatedPatient);
            onUpdate(updatedPatient);
            return;
          }
        }

        // If we get here, we need to find the medication in the history
        let medicationHistoryIndex = -1;

        if (patient.medicationHistory && Array.isArray(patient.medicationHistory)) {
          // Try to find the exact same medication in patient.medicationHistory
          for (let i = 0; i < patient.medicationHistory.length; i++) {
            const histMed = patient.medicationHistory[i];
            if (histMed.name === medication.name &&
                histMed.dosage === medication.dosage &&
                histMed.frequency === medication.frequency) {
              medicationHistoryIndex = i;
              break;
            }
          }
        }

        if (medicationHistoryIndex !== -1) {
          // Create a copy of the medication history from the patient object
          const updatedMedicationHistory = [...(patient.medicationHistory || [])];

          // Update the medication status to Inactive and set end date
          updatedMedicationHistory[medicationHistoryIndex] = {
            ...updatedMedicationHistory[medicationHistoryIndex],
            status: 'Inactive',
            endDate: new Date().toISOString().split('T')[0]
          };

          // Update the patient with the updated medication history
          const updatedPatient = {
            ...patient,
            medicationHistory: updatedMedicationHistory
          };

          await updatePatient(patient.id, updatedPatient);
          onUpdate(updatedPatient);
        } else {
          console.error('Could not find medication in history to discontinue');
        }
      } catch (error) {
        console.error('Error discontinuing medication from history:', error);
      }
    }
  };

  const handleReactivateMedication = async (medication, index) => {
    if (window.confirm(`Are you sure you want to add ${medication.name} to current medications?`)) {
      try {
        // Find the medication in the actual patient.medicationHistory array
        // This is important because the medicationHistory state variable might include
        // medications from other sources that aren't in patient.medicationHistory
        let medicationHistoryIndex = -1;
        let medicationToReactivate = null;

        if (patient.medicationHistory && Array.isArray(patient.medicationHistory)) {
          // Try to find the exact same medication in patient.medicationHistory
          for (let i = 0; i < patient.medicationHistory.length; i++) {
            const histMed = patient.medicationHistory[i];
            if (histMed.name === medication.name &&
                histMed.dosage === medication.dosage &&
                histMed.frequency === medication.frequency) {
              medicationHistoryIndex = i;
              medicationToReactivate = { ...histMed };
              break;
            }
          }
        }

        // If we couldn't find it in patient.medicationHistory, use the medication from the state
        if (medicationHistoryIndex === -1) {
          medicationToReactivate = { ...medication };
          // In this case, we need to check if this medication is from the current medications
          // or from completed orders, and handle accordingly
          if (medication.status === 'Active') {
            // This is already an active medication, no need to reactivate
            console.log('Medication is already active');
            return;
          }
        }

        // Create a copy of the current medications
        const updatedMedications = [...(patient.medications || [])];

        // Add the medication to current medications
        const reactivatedMedication = {
          name: medicationToReactivate.name,
          dosage: medicationToReactivate.dosage,
          frequency: medicationToReactivate.frequency,
          startDate: new Date().toISOString().split('T')[0], // Set new start date
          route: medicationToReactivate.route || 'Oral',
          instructions: medicationToReactivate.instructions || '',
          prescribingProvider: medicationToReactivate.prescribingProvider || '',
          refills: medicationToReactivate.refills || '0'
        };

        // Check if this medication already exists in current medications
        const existingIndex = updatedMedications.findIndex(
          med => med.name.toLowerCase() === reactivatedMedication.name.toLowerCase() &&
                 med.dosage === reactivatedMedication.dosage
        );

        if (existingIndex >= 0) {
          // Update existing medication
          if (window.confirm('This medication already exists in current medications. Do you want to update it?')) {
            updatedMedications[existingIndex] = reactivatedMedication;
          } else {
            return; // User cancelled
          }
        } else {
          // Add as a new medication
          updatedMedications.push(reactivatedMedication);
        }

        // Create a copy of the medication history and remove the reactivated medication if found
        let updatedMedicationHistory = [...(patient.medicationHistory || [])];

        if (medicationHistoryIndex !== -1) {
          // Remove from history if found in patient.medicationHistory
          updatedMedicationHistory.splice(medicationHistoryIndex, 1);
        }

        // Update the patient with the new medications and medication history
        const updatedPatient = {
          ...patient,
          medications: updatedMedications,
          medicationHistory: updatedMedicationHistory
        };

        await updatePatient(patient.id, updatedPatient);
        onUpdate(updatedPatient);

        // Force a refresh of the medication history state
        setActiveTab('current');
        setTimeout(() => {
          setActiveTab('history');
        }, 100);
      } catch (error) {
        console.error('Error reactivating medication:', error);
      }
    }
  };

  const handleSaveMedication = async (medicationData, existingMedication) => {
    try {
      // If we're editing an existing medication
      if (existingMedication) {
        const updatedMedications = [...patient.medications];
        updatedMedications[existingMedication.index] = {
          name: medicationData.medicationDetails.medicationName,
          dosage: medicationData.medicationDetails.dosage,
          frequency: medicationData.medicationDetails.frequency,
          startDate: medicationData.medicationDetails.startDate,
          route: medicationData.medicationDetails.route,
          instructions: medicationData.medicationDetails.instructions,
          prescribingProvider: medicationData.medicationDetails.prescribingProvider,
          refills: medicationData.medicationDetails.refills,
          orderId: medicationData.id // Link to the order if it exists
        };

        const updatedPatient = { ...patient, medications: updatedMedications };
        await updatePatient(patient.id, updatedPatient);
        onUpdate(updatedPatient);
      }
      // If we're editing an existing order
      else if (selectedOrder) {
        // Update the order
        const updatedOrder = {
          ...selectedOrder,
          details: medicationData.details,
          medicationDetails: medicationData.medicationDetails,
          priority: medicationData.priority,
          status: medicationData.status,
          date: medicationData.date
        };

        await updateOrder(selectedOrder.id, updatedOrder);

        // If the checkbox is checked, also update or add to current medications
        if (medicationData.medicationDetails.addToCurrentMedications) {
          // Check if this medication already exists in the list
          const existingIndex = patient.medications.findIndex(
            med => med.orderId === selectedOrder.id
          );

          let updatedMedications = [...patient.medications];
          const newMedication = {
            name: medicationData.medicationDetails.medicationName,
            dosage: medicationData.medicationDetails.dosage,
            frequency: medicationData.medicationDetails.frequency,
            startDate: medicationData.medicationDetails.startDate,
            route: medicationData.medicationDetails.route,
            instructions: medicationData.medicationDetails.instructions,
            prescribingProvider: medicationData.medicationDetails.prescribingProvider,
            refills: medicationData.medicationDetails.refills,
            orderId: selectedOrder.id
          };

          if (existingIndex >= 0) {
            // Update existing medication
            updatedMedications[existingIndex] = newMedication;
          } else {
            // Add new medication
            updatedMedications.push(newMedication);
          }

          const updatedPatient = { ...patient, medications: updatedMedications };
          await updatePatient(patient.id, updatedPatient);
          onUpdate(updatedPatient);
        }
      }
      // If we're creating a new medication order
      else {
        // Create a new order
        const newOrder = {
          patientId: patient.id,
          patientName: patient.name,
          ...medicationData
        };

        const createdOrder = await updatePatient(patient.id, {
          ...patient,
          orders: [...(patient.orders || []), newOrder]
        });

        // If the checkbox is checked, also add to current medications
        if (medicationData.medicationDetails.addToCurrentMedications) {
          const newMedication = {
            name: medicationData.medicationDetails.medicationName,
            dosage: medicationData.medicationDetails.dosage,
            frequency: medicationData.medicationDetails.frequency,
            startDate: medicationData.medicationDetails.startDate,
            route: medicationData.medicationDetails.route,
            instructions: medicationData.medicationDetails.instructions,
            prescribingProvider: medicationData.medicationDetails.prescribingProvider,
            refills: medicationData.medicationDetails.refills,
            orderId: createdOrder.id
          };

          const updatedMedications = [...(patient.medications || []), newMedication];
          const updatedPatient = { ...patient, medications: updatedMedications };
          await updatePatient(patient.id, updatedPatient);
          onUpdate(updatedPatient);
        }
      }
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const handleConvertOrderToMedication = async (order) => {
    try {
      // Extract medication details from the order
      const medicationDetails = order.medicationDetails || {};

      // Create a new medication object
      const newMedication = {
        name: medicationDetails.medicationName || order.details?.split(',')[0]?.trim() || '',
        dosage: medicationDetails.dosage || '',
        frequency: medicationDetails.frequency || '',
        startDate: order.date || new Date().toISOString().split('T')[0],
        route: medicationDetails.route || 'Oral',
        instructions: medicationDetails.instructions || '',
        prescribingProvider: medicationDetails.prescribingProvider || '',
        refills: medicationDetails.refills || '0',
        orderId: order.id // Link to the original order
      };

      // Check if this medication already exists
      const existingIndex = patient.medications.findIndex(
        med => med.orderId === order.id ||
              (med.name.toLowerCase() === newMedication.name.toLowerCase() &&
               med.dosage === newMedication.dosage)
      );

      let updatedMedications = [...(patient.medications || [])];

      if (existingIndex >= 0) {
        // Update existing medication
        if (window.confirm('This medication already exists in the current medications list. Do you want to update it?')) {
          updatedMedications[existingIndex] = newMedication;
        } else {
          return; // User cancelled
        }
      } else {
        // Add new medication
        updatedMedications.push(newMedication);
      }

      // Update the patient with the new medication
      const updatedPatient = { ...patient, medications: updatedMedications };
      await updatePatient(patient.id, updatedPatient);

      // Update the order status to Active if it was Pending
      if (order.status === 'Pending') {
        const updatedOrder = { ...order, status: 'Active' };
        await updateOrder(order.id, updatedOrder);
      }

      onUpdate(updatedPatient);
    } catch (error) {
      console.error('Error converting order to medication:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'current'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('current')}
          >
            Current Medications
          </button>
          <button
            className={`${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('history')}
          >
            Medication History
          </button>
          <button
            className={`${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('orders')}
          >
            Medication Orders
          </button>
        </nav>
      </div>

      {/* Add Medication Button */}
      <div className="flex justify-end mb-4">
        {activeTab !== 'history' && (
          <button
            className="btn btn-primary inline-flex items-center"
            onClick={handleAddMedication}
          >
            <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
            {activeTab === 'current' ? 'Add Medication' : 'New Medication Order'}
          </button>
        )}
      </div>

      {/* Current Medications Tab */}
      {activeTab === 'current' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                  Route
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
              {patient.medications && patient.medications.length > 0 ? (
                patient.medications.map((medication, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medication.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.dosage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.route || 'Oral'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(medication.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditMedication(medication, index)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDiscontinueMedication(medication, index)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                        title="Discontinue"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(index)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No medications recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Medication History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
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
              {medicationHistory && medicationHistory.length > 0 ? (
                medicationHistory.map((medication, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medication.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.dosage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.route || 'Oral'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(medication.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.endDate ? formatDate(medication.endDate) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        medication.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {medication.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {medication.status === 'Active' ? (
                        <button
                          onClick={() => handleDiscontinueMedicationFromHistory(medication, index)}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                          title="Discontinue"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivateMedication(medication, index)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Add to Current Medications"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveFromHistory(index)}
                        className="text-red-600 hover:text-red-900"
                        title="Remove from History"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No medication history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Medication Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicationOrders && medicationOrders.length > 0 ? (
                medicationOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.medicationDetails?.medicationName || order.details?.split(',')[0]?.trim() || 'Medication Order'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {order.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        title="Edit Order"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleConvertOrderToMedication(order)}
                        className="text-green-600 hover:text-green-900"
                        title="Add to Current Medications"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No medication orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Medication Modal */}
      <MedicationOrderModal
        isOpen={showMedicationModal}
        onClose={() => setShowMedicationModal(false)}
        onSave={handleSaveMedication}
        patientId={patient.id}
        existingOrder={selectedOrder}
        existingMedication={selectedMedication}
        currentMedications={patient.medications || []}
      />
    </div>
  );
}
