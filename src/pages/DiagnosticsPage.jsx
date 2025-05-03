import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDiagnostics } from '../context/DiagnosticsContext';

export default function DiagnosticsPage() {
  const { diagnostics } = useDiagnostics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patientFilter, setPatientFilter] = useState('');
  
  const filteredDiagnostics = diagnostics.filter(diagnostic => {
    const matchesSearch = 
      diagnostic.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      diagnostic.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesPatient = 
      patientFilter === '' ||
      diagnostic.patientName.toLowerCase().includes(patientFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPatient;
  });
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Diagnostics</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
              placeholder="Search diagnostics..."
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
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link
            to="/diagnostics/new"
            className="btn btn-primary inline-flex items-center justify-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Diagnostic
          </Link>
        </div>
      </div>
      
      {/* Diagnostics Table */}
      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDiagnostics.length > 0 ? (
                filteredDiagnostics.map((diagnostic) => (
                  <tr key={diagnostic.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(diagnostic.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link to={`/patients/${diagnostic.patientId}`} className="text-blue-600 hover:text-blue-900">
                        {diagnostic.patientName}
                      </Link>
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
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {diagnostic.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {diagnostic.provider}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No diagnostics found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Common Diagnoses */}
      <div className="mt-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Common Diagnoses</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { code: 'I10', description: 'Essential (primary) hypertension' },
            { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
            { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
            { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
            { code: 'M54.5', description: 'Low back pain' },
            { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus' }
          ].map((diagnosis, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{diagnosis.code}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-sm text-gray-900">{diagnosis.description}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/diagnostics/new?code=${diagnosis.code}&description=${encodeURIComponent(diagnosis.description)}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Add this diagnosis
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
