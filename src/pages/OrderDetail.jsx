import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { PencilIcon, ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrder, deleteOrder } = usePatient();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Find the order in the context
        const foundOrder = orders.find(o => o.id === parseInt(id));
        
        if (!foundOrder) {
          setError('Order not found');
        } else {
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, orders]);
  
  const handleStatusChange = async () => {
    if (!newStatus) return;
    
    try {
      let updatedData = { ...order, status: newStatus };
      
      // If status is completed, add completed date
      if (newStatus === 'Completed') {
        updatedData.completedDate = new Date().toISOString().split('T')[0];
      }
      
      const updatedOrder = await updateOrder(order.id, updatedData);
      setOrder(updatedOrder);
      setShowStatusUpdate(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteOrder(order.id);
      navigate('/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <Link to="/orders" className="text-blue-500 hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500 mb-4">Order not found</div>
        <Link to="/orders" className="text-blue-500 hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
        </div>
        
        <div className="flex space-x-3">
          {order.status !== 'Completed' && order.status !== 'Cancelled' && (
            <Link
              to={`/orders/${order.id}/edit`}
              className="btn btn-secondary inline-flex items-center"
            >
              <PencilIcon className="-ml-1 mr-1 h-4 w-4" />
              Edit
            </Link>
          )}
          
          {order.status !== 'Completed' && order.status !== 'Cancelled' && (
            <button
              onClick={() => setShowStatusUpdate(true)}
              className="btn btn-primary"
            >
              Update Status
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Order details card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {order.type}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Order #{order.id}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Patient</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to={`/patients/${order.patientId}`} className="text-blue-600 hover:text-blue-900">
                  {order.patientName}
                </Link>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Order Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(order.date)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(order.dueDate)}
              </dd>
            </div>
            {order.completedDate && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Completed Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(order.completedDate)}
                </dd>
              </div>
            )}
            <div className={`${order.completedDate ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.priority || 'Routine'}
              </dd>
            </div>
            <div className={`${order.completedDate ? 'bg-white' : 'bg-gray-50'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
              <dt className="text-sm font-medium text-gray-500">Details</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {order.details || 'No details provided'}
              </dd>
            </div>
            {order.results && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Results</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                  {order.results}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Status update modal */}
      {showStatusUpdate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Order Status</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowStatusUpdate(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                New Status
              </label>
              <select
                id="newStatus"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select a status</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowStatusUpdate(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary inline-flex items-center"
                onClick={handleStatusChange}
                disabled={!newStatus}
              >
                <CheckIcon className="-ml-1 mr-1 h-4 w-4" />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
