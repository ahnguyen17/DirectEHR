import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setRecentPatients([
      { id: 1, name: 'James Wilson', age: 45, lastVisit: '2025-04-30' },
      { id: 2, name: 'Sarah Johnson', age: 32, lastVisit: '2025-04-28' },
      { id: 3, name: 'Robert Davis', age: 67, lastVisit: '2025-04-25' },
    ]);
    
    setUpcomingOrders([
      { id: 1, patientName: 'James Wilson', type: 'Blood Test', dueDate: '2025-05-05' },
      { id: 2, patientName: 'Sarah Johnson', type: 'X-Ray', dueDate: '2025-05-07' },
      { id: 3, patientName: 'Robert Davis', type: 'Medication Renewal', dueDate: '2025-05-10' },
    ]);
  }, []);
  
  const stats = [
    { id: 1, name: 'Total Patients', value: '124', icon: UserCircleIcon, color: 'bg-blue-500' },
    { id: 2, name: 'Pending Orders', value: '18', icon: ClipboardDocumentListIcon, color: 'bg-yellow-500' },
    { id: 3, name: 'Recent Notes', value: '47', icon: DocumentTextIcon, color: 'bg-green-500' },
    { id: 4, name: 'Critical Alerts', value: '3', icon: ChartBarIcon, color: 'bg-red-500' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Patients */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Patients</h2>
          <Link to="/patients" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentPatients.map((patient) => (
              <li key={patient.id}>
                <Link to={`/patients/${patient.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.age} years old</p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Upcoming Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Orders</h2>
          <Link to="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {upcomingOrders.map((order) => (
              <li key={order.id}>
                <Link to={`/orders/${order.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{order.type}</p>
                        <p className="text-sm text-gray-500">Patient: {order.patientName}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">Due: {order.dueDate}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}