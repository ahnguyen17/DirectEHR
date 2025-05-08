import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BeakerIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLabs } from '../context/LabsContext';

export default function LabsPage() {
  const { labResults, labTests } = useLabs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patientFilter, setPatientFilter] = useState('');

  const filteredResults = labResults.filter(result => {
    const matchesSearch =
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      result.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPatient =
      patientFilter === '' ||
      result.patientName.toLowerCase().includes(patientFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPatient;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0">Laboratory Tests</h1>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
                placeholder="Search labs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
              placeholder="Filter by patient name..."
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-shrink-0 min-w-max">
            <Link
              to="/labs/new"
              className="btn btn-primary inline-flex items-center justify-center w-full"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Order New Lab
            </Link>
          </div>
        </div>
      </div>

      {/* Lab Tests Table */}
      <div className="mt-8">
        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Test
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                      {formatDate(result.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                      <Link to={`/patients/${result.patientId}`} className="text-blue-600 hover:text-blue-900">
                        {result.patientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                      {result.testName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                        result.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        result.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        result.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                      <Link to={`/labs/${result.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      {result.status !== 'Completed' && result.status !== 'Cancelled' && (
                        <Link to={`/labs/${result.id}/results`} className="text-indigo-600 hover:text-indigo-900">
                          Enter Results
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-base text-gray-500">
                    No lab results found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Lab Tests */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Lab Tests</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labTests.map((test) => (
            <div key={test.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <BeakerIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-700 truncate">{test.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-sm text-gray-500">{test.category}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-base text-gray-500">{test.description}</p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/labs/new?testId=${test.id}`}
                    className="text-base font-medium text-blue-600 hover:text-blue-500"
                  >
                    Order this test
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
