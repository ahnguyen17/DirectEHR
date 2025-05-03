import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    const mockOrders = [
      { id: 1, patientId: 1, patientName: 'James Wilson', date: '2025-04-30', type: 'Blood Test', status: 'Pending', dueDate: '2025-05-10', details: 'Comprehensive metabolic panel and A1C' },
      { id: 2, patientId: 1, patientName: 'James Wilson', date: '2025-03-15', type: 'Chest X-Ray', status: 'Completed', completedDate: '2025-03-22', results: 'Normal findings, no abnormalities detected' },
      { id: 3, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-22', type: 'MRI - Right Knee', status: 'Scheduled', dueDate: '2025-05-15', details: 'Evaluate for meniscus tear' },
      { id: 4, patientId: 3, patientName: 'Robert Davis', date: '2025-04-15', type: 'CT Scan - Chest', status: 'Completed', completedDate: '2025-04-20', results: 'Stable COPD, no acute findings' },
      { id: 5, patientId: 4, patientName: 'Emily Chen', date: '2025-04-10', type: 'Medication - Sumatriptan', status: 'Active', details: '50mg, as needed for migraines, 9 tablets, 3 refills' },
      { id: 6, patientId: 5, patientName: 'Michael Thompson', date: '2025-04-05', type: 'Echocardiogram', status: 'Pending', dueDate: '2025-05-05', details: 'Follow-up for mitral valve regurgitation' },
      { id: 7, patientId: 6, patientName: 'Lisa Rodriguez', date: '2025-04-01', type: 'Laboratory - CBC', status: 'Completed', completedDate: '2025-04-03', results: 'Within normal limits' },
    ];
    
    setOrders(mockOrders);
  }, []);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.details && order.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.results && order.results.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Link
            to="/orders/new"
            className="btn btn-primary inline-flex items-center justify-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Order
          </Link>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due/Completed
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link to={`/patients/${order.patientId}`} className="text-blue-600 hover:text-blue-900">
                        {order.patientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.completedDate ? formatDate(order.completedDate) : (order.dueDate ? formatDate(order.dueDate) : 'N/A')}
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
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}