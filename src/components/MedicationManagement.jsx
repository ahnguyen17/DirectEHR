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

  // Extract medication orders from all orders
  useEffect(() => {
    if (patient && patient.orders) {
      const medOrders = patient.orders.filter(order =>
        order.type === 'Medication' &&
        (order.status === 'Active' || order.status === 'Pending')
      );
      setMedicationOrders(medOrders);
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
        <button
          className="btn btn-primary inline-flex items-center"
          onClick={handleAddMedication}
        >
          <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
          {activeTab === 'current' ? 'Add Medication' : 'New Medication Order'}
        </button>
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
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(index)}
                        className="text-red-600 hover:text-red-900"
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
