import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export default function EditOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders, patients, updateOrder } = usePatient();
  
  const [order, setOrder] = useState({
    patientId: '',
    patientName: '',
    date: '',
    type: '',
    status: '',
    dueDate: '',
    details: '',
    priority: 'Routine',
    results: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Find the order in the context
        const foundOrder = orders.find(o => o.id === parseInt(id));
        
        if (!foundOrder) {
          setNotFound(true);
        } else {
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setErrors({ submit: 'Failed to load order details' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, orders]);
  
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
    
    // Special handling for status changes
    if (name === 'status') {
      // If changing to Completed, set completedDate to today
      if (value === 'Completed' && order.status !== 'Completed') {
        setOrder({
          ...order,
          status: value,
          completedDate: new Date().toISOString().split('T')[0]
        });
      } 
      // If changing from Completed to something else, clear completedDate
      else if (order.status === 'Completed' && value !== 'Completed') {
        const updatedOrder = { ...order, status: value };
        delete updatedOrder.completedDate;
        setOrder(updatedOrder);
      } else {
        setOrder({
          ...order,
          status: value
        });
      }
    } else {
      setOrder({
        ...order,
        [name]: value
      });
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
    
    setLoading(true);
    
    try {
      const updatedOrder = await updateOrder(id, order);
      
      // Navigate to order detail page
      navigate(`/orders/${updatedOrder.id}`);
    } catch (error) {
      console.error('Error updating order:', error);
      setErrors({
        ...errors,
        submit: 'Failed to update order. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }
  
  if (notFound) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500 mb-4">Order not found</div>
        <button 
          onClick={() => navigate('/orders')}
          className="text-blue-500 hover:underline"
        >
          Return to Orders
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Order</h1>
      
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
            disabled={true} // Cannot change patient for existing order
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
          
          {/* Status */}
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
          
          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date {order.status === 'Scheduled' ? '(Required)' : '(Optional)'}
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              className={`mt-1 block w-full border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
              value={order.dueDate || ''}
              onChange={handleChange}
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
          </div>
          
          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="priority"
              name="priority"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={order.priority || 'Routine'}
              onChange={handleChange}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Completed Date (read-only, shown only if status is Completed) */}
          {order.status === 'Completed' && (
            <div>
              <label htmlFor="completedDate" className="block text-sm font-medium text-gray-700">Completed Date</label>
              <input
                type="date"
                id="completedDate"
                name="completedDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                value={order.completedDate || ''}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
          <textarea
            id="details"
            name="details"
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={order.details || ''}
            onChange={handleChange}
            placeholder="Enter order details, instructions, or additional information"
          ></textarea>
        </div>
        
        {/* Results (shown only if status is Completed) */}
        {order.status === 'Completed' && (
          <div>
            <label htmlFor="results" className="block text-sm font-medium text-gray-700">Results</label>
            <textarea
              id="results"
              name="results"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={order.results || ''}
              onChange={handleChange}
              placeholder="Enter order results or findings"
            ></textarea>
          </div>
        )}
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/orders/${id}`)}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
