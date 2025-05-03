import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import MedicationOrderModal from '../components/MedicationOrderModal';

export default function AddOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: patientIdFromParams } = useParams();
  const { patients, addOrder, getPatient } = usePatient();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromQuery = queryParams.get('patientId');

  // Determine patient ID from params or query
  const initialPatientId = patientIdFromParams || patientIdFromQuery || '';

  const [order, setOrder] = useState({
    patientId: initialPatientId ? parseInt(initialPatientId) : '',
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    status: 'Pending',
    dueDate: '',
    details: '',
    priority: 'Routine'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  // Set patient name when patient ID changes
  useEffect(() => {
    if (order.patientId) {
      const selectedPatient = patients.find(p => p.id === parseInt(order.patientId));
      if (selectedPatient) {
        setOrder(prev => ({
          ...prev,
          patientName: selectedPatient.name
        }));

        // Fetch complete patient data for medication modal
        const fetchPatientData = async () => {
          try {
            const patientData = await getPatient(selectedPatient.id);
            setCurrentPatient(patientData);
          } catch (error) {
            console.error('Error fetching patient data:', error);
          }
        };

        fetchPatientData();
      }
    }
  }, [order.patientId, patients, getPatient]);

  const orderTypes = [
    { value: 'Laboratory', label: 'Laboratory Test' },
    { value: 'Imaging', label: 'Imaging' },
    { value: 'Medication', label: 'Medication' },
    { value: 'Procedure', label: 'Procedure' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'Routine', label: 'Routine' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'STAT', label: 'STAT (Immediate)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value
    });

    // If type is changed to Medication, show the medication modal
    if (name === 'type' && value === 'Medication' && order.patientId) {
      setShowMedicationModal(true);
      return;
    }

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

    if (!order.patientId) {
      newErrors.patientId = 'Patient is required';
    }

    if (!order.type) {
      newErrors.type = 'Order type is required';
    }

    if (!order.date) {
      newErrors.date = 'Order date is required';
    }

    if (order.status === 'Scheduled' && !order.dueDate) {
      newErrors.dueDate = 'Due date is required for scheduled orders';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If it's a medication order, show the medication modal
    if (order.type === 'Medication') {
      setShowMedicationModal(true);
      return;
    }

    setLoading(true);

    try {
      const newOrder = {
        ...order,
        patientId: parseInt(order.patientId)
      };

      await addOrder(newOrder);

      // Navigate back to patient detail page or orders page
      if (order.patientId) {
        navigate(`/patients/${order.patientId}`);
      } else {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({
        ...errors,
        submit: 'Failed to create order. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMedicationOrder = async (medicationData, existingOrder) => {
    setLoading(true);

    try {
      const newOrder = {
        ...order,
        patientId: parseInt(order.patientId),
        ...medicationData
      };

      await addOrder(newOrder);

      // Navigate back to patient detail page or orders page
      if (order.patientId) {
        navigate(`/patients/${order.patientId}`);
      } else {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error creating medication order:', error);
      setErrors({
        ...errors,
        submit: 'Failed to create medication order. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Order</h1>

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        {/* Patient Selection */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
          <select
            id="patientId"
            name="patientId"
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.patientId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            value={order.patientId}
            onChange={handleChange}
            disabled={!!patientIdFromParams}
          >
            <option value="">Select a patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (MRN: {patient.mrn})
              </option>
            ))}
          </select>
          {errors.patientId && <p className="mt-1 text-sm text-red-500">{errors.patientId}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Order Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Order Type</label>
            <select
              id="type"
              name="type"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
              value={order.type}
              onChange={handleChange}
            >
              <option value="">Select order type</option>
              {orderTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* Order Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Order Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
              value={order.date}
              onChange={handleChange}
            />
            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Status - Only show if not a medication order */}
          {order.type !== 'Medication' && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={order.status}
                onChange={handleChange}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Due Date - Only show if not a medication order */}
          {order.type !== 'Medication' && (
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date {order.status === 'Scheduled' ? '(Required)' : '(Optional)'}
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className={`mt-1 block w-full border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                value={order.dueDate}
                onChange={handleChange}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
            </div>
          )}

          {/* Priority - Only show if not a medication order */}
          {order.type !== 'Medication' && (
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                name="priority"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={order.priority}
                onChange={handleChange}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Details - Only show if not a medication order */}
        {order.type !== 'Medication' && (
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
            <textarea
              id="details"
              name="details"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={order.details}
              onChange={handleChange}
              placeholder="Enter order details, instructions, or additional information"
            ></textarea>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(patientIdFromParams ? `/patients/${patientIdFromParams}` : '/orders')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>

      {/* Medication Order Modal */}
      {showMedicationModal && currentPatient && (
        <MedicationOrderModal
          isOpen={showMedicationModal}
          onClose={() => setShowMedicationModal(false)}
          onSave={handleSaveMedicationOrder}
          patientId={parseInt(order.patientId)}
          currentMedications={currentPatient.medications || []}
        />
      )}
    </div>
  );
}
