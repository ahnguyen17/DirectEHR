import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function MedicationOrderModal({
  isOpen,
  onClose,
  onSave,
  patientId,
  existingOrder = null,
  existingMedication = null,
  currentMedications = []
}) {
  const initialState = {
    medicationName: '',
    dosage: '',
    route: 'Oral',
    frequency: '',
    duration: '',
    quantity: '',
    refills: '0',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
    addToCurrentMedications: true,
    prescribingProvider: '',
    pharmacy: '',
    priority: 'Routine',
    status: 'Pending'
  };

  const [medicationOrder, setMedicationOrder] = useState(initialState);
  const [errors, setErrors] = useState({});

  // If editing an existing order or medication, populate the form
  useEffect(() => {
    if (existingMedication) {
      // If we're editing an existing medication
      setMedicationOrder({
        medicationName: existingMedication.name || '',
        dosage: existingMedication.dosage || '',
        route: existingMedication.route || 'Oral',
        frequency: existingMedication.frequency || '',
        duration: existingMedication.duration || '',
        quantity: existingMedication.quantity || '',
        refills: existingMedication.refills || '0',
        instructions: existingMedication.instructions || '',
        startDate: existingMedication.startDate || new Date().toISOString().split('T')[0],
        addToCurrentMedications: true,
        prescribingProvider: existingMedication.prescribingProvider || '',
        pharmacy: existingMedication.pharmacy || '',
        priority: 'Routine',
        status: 'Active'
      });
    } else if (existingOrder) {
      // Parse the details field if it exists
      let parsedDetails = {};
      if (existingOrder.medicationDetails) {
        parsedDetails = existingOrder.medicationDetails;
      } else if (existingOrder.details) {
        // Try to parse from the details string (for backward compatibility)
        try {
          // This is a simple parsing logic - in a real app, you'd want more robust parsing
          const detailsStr = existingOrder.details;
          const dosageMatch = detailsStr.match(/(\d+\s*\w+)/);
          const frequencyMatch = detailsStr.match(/(once daily|twice daily|as needed|every \d+ hours)/i);
          const quantityMatch = detailsStr.match(/(\d+)\s*tablets?/i);
          const refillsMatch = detailsStr.match(/(\d+)\s*refills?/i);

          parsedDetails = {
            medicationName: existingOrder.details.split(',')[0]?.trim() || '',
            dosage: dosageMatch ? dosageMatch[0] : '',
            frequency: frequencyMatch ? frequencyMatch[0] : '',
            quantity: quantityMatch ? quantityMatch[1] : '',
            refills: refillsMatch ? refillsMatch[1] : '0'
          };
        } catch (e) {
          console.error('Error parsing medication details:', e);
        }
      }

      setMedicationOrder({
        medicationName: parsedDetails.medicationName || existingOrder.details?.split(',')[0]?.trim() || '',
        dosage: parsedDetails.dosage || '',
        route: parsedDetails.route || 'Oral',
        frequency: parsedDetails.frequency || '',
        duration: parsedDetails.duration || '',
        quantity: parsedDetails.quantity || '',
        refills: parsedDetails.refills || '0',
        instructions: parsedDetails.instructions || '',
        startDate: existingOrder.date || new Date().toISOString().split('T')[0],
        addToCurrentMedications: parsedDetails.addToCurrentMedications !== false,
        prescribingProvider: parsedDetails.prescribingProvider || '',
        pharmacy: parsedDetails.pharmacy || '',
        priority: existingOrder.priority || 'Routine',
        status: existingOrder.status || 'Pending'
      });
    } else {
      setMedicationOrder(initialState);
    }
  }, [existingOrder, existingMedication]);

  const routeOptions = [
    'Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical',
    'Inhalation', 'Rectal', 'Nasal', 'Ophthalmic', 'Otic', 'Other'
  ];

  const frequencyOptions = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every morning', 'Every evening', 'Every 4 hours', 'Every 6 hours',
    'Every 8 hours', 'Every 12 hours', 'As needed', 'Other'
  ];

  const priorityOptions = [
    { value: 'Routine', label: 'Routine' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'STAT', label: 'STAT (Immediate)' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicationOrder({
      ...medicationOrder,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!medicationOrder.medicationName) {
      newErrors.medicationName = 'Medication name is required';
    }

    if (!medicationOrder.dosage) {
      newErrors.dosage = 'Dosage is required';
    }

    if (!medicationOrder.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if this medication already exists in current medications (excluding the one being edited)
    const medicationExists = currentMedications.some(
      med => med.name.toLowerCase() === medicationOrder.medicationName.toLowerCase() &&
             (!existingMedication || med !== existingMedication)
    );

    // Create the order object
    const orderData = {
      type: 'Medication',
      details: `${medicationOrder.medicationName}, ${medicationOrder.dosage}, ${medicationOrder.frequency}${
        medicationOrder.quantity ? `, ${medicationOrder.quantity} units` : ''
      }${medicationOrder.refills !== '0' ? `, ${medicationOrder.refills} refills` : ''}`,
      medicationDetails: {
        ...medicationOrder
      },
      priority: medicationOrder.priority,
      status: medicationOrder.status,
      date: medicationOrder.startDate
    };

    // If adding to current medications and it already exists, confirm with user
    if (medicationOrder.addToCurrentMedications && medicationExists && !existingMedication) {
      if (window.confirm('This medication already exists in the patient\'s current medications. Do you want to update it?')) {
        onSave(orderData, existingMedication || existingOrder);
        onClose();
      }
    } else {
      onSave(orderData, existingMedication || existingOrder);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {existingMedication ? 'Edit Medication' : existingOrder ? 'Edit Medication Order' : 'Add Medication'}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medication Name */}
            <div className="col-span-2">
              <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name*
              </label>
              <input
                type="text"
                id="medicationName"
                name="medicationName"
                value={medicationOrder.medicationName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.medicationName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.medicationName && <p className="mt-1 text-sm text-red-500">{errors.medicationName}</p>}
            </div>

            {/* Dosage */}
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                Dosage*
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={medicationOrder.dosage}
                onChange={handleChange}
                placeholder="e.g., 10mg, 500mg, 5mL"
                className={`w-full px-3 py-2 border ${errors.dosage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.dosage && <p className="mt-1 text-sm text-red-500">{errors.dosage}</p>}
            </div>

            {/* Route */}
            <div>
              <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                Route
              </label>
              <select
                id="route"
                name="route"
                value={medicationOrder.route}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {routeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency*
              </label>
              <select
                id="frequency"
                name="frequency"
                value={medicationOrder.frequency}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.frequency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.frequency && <p className="mt-1 text-sm text-red-500">{errors.frequency}</p>}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={medicationOrder.duration}
                onChange={handleChange}
                placeholder="e.g., 7 days, 2 weeks, 1 month"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={medicationOrder.quantity}
                onChange={handleChange}
                placeholder="e.g., 30 tablets, 1 bottle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Refills */}
            <div>
              <label htmlFor="refills" className="block text-sm font-medium text-gray-700 mb-1">
                Refills
              </label>
              <input
                type="number"
                id="refills"
                name="refills"
                min="0"
                value={medicationOrder.refills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={medicationOrder.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Prescribing Provider */}
            <div>
              <label htmlFor="prescribingProvider" className="block text-sm font-medium text-gray-700 mb-1">
                Prescribing Provider
              </label>
              <input
                type="text"
                id="prescribingProvider"
                name="prescribingProvider"
                value={medicationOrder.prescribingProvider}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Pharmacy */}
            <div>
              <label htmlFor="pharmacy" className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy
              </label>
              <input
                type="text"
                id="pharmacy"
                name="pharmacy"
                value={medicationOrder.pharmacy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={medicationOrder.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={medicationOrder.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            <div className="col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows="3"
                value={medicationOrder.instructions}
                onChange={handleChange}
                placeholder="Special instructions for the patient"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            {/* Add to Current Medications Checkbox */}
            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addToCurrentMedications"
                  name="addToCurrentMedications"
                  checked={medicationOrder.addToCurrentMedications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="addToCurrentMedications" className="ml-2 block text-sm text-gray-900">
                  Add to patient's current medications list
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                When checked, this medication will be added to the patient's current medications list in the overview page.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {existingMedication ? 'Update Medication' : existingOrder ? 'Update Order' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
