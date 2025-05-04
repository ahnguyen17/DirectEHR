import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  FilmIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useDiagnostics } from '../context/DiagnosticsContext';

export default function DiagnosticsPage() {
  const { diagnostics } = useDiagnostics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patientFilter, setPatientFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDiagnostics = diagnostics.filter(diagnostic => {
    // Handle the case where properties might be undefined
    const study = diagnostic.study || '';
    const result = diagnostic.result || '';
    const patientName = diagnostic.patientName || '';
    const status = diagnostic.status || '';
    const type = diagnostic.type || '';

    const matchesSearch =
      study.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPatient =
      patientFilter === '' ||
      patientName.toLowerCase().includes(patientFilter.toLowerCase());

    const matchesType =
      typeFilter === 'all' ||
      type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPatient && matchesType;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 lg:mb-0">Diagnostics</h1>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
                placeholder="Search studies..."
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="imaging">Imaging</option>
              <option value="study">Studies</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="ordered">Ordered</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/diagnostics/new"
              className="btn btn-primary inline-flex items-center justify-center w-full lg:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Order New Study
            </Link>
          </div>
        </div>
      </div>

      {/* Imaging & Studies Table */}
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
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study
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
                      <div className="flex items-center">
                        {diagnostic.type === 'Imaging' ? (
                          <FilmIcon className="h-5 w-5 text-blue-500 mr-1" />
                        ) : (
                          <DocumentMagnifyingGlassIcon className="h-5 w-5 text-purple-500 mr-1" />
                        )}
                        {diagnostic.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {diagnostic.study}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        diagnostic.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        diagnostic.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        diagnostic.status === 'Ordered' ? 'bg-yellow-100 text-yellow-800' :
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
                    No diagnostic studies found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Studies */}
      <div className="mt-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Common Diagnostic Studies</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { type: 'Imaging', study: 'Chest X-ray', icon: <FilmIcon className="h-6 w-6 text-blue-600" aria-hidden="true" /> },
            { type: 'Imaging', study: 'CT Scan - Head', icon: <FilmIcon className="h-6 w-6 text-blue-600" aria-hidden="true" /> },
            { type: 'Imaging', study: 'MRI - Brain', icon: <FilmIcon className="h-6 w-6 text-blue-600" aria-hidden="true" /> },
            { type: 'Study', study: 'Electrocardiogram (ECG)', icon: <HeartIcon className="h-6 w-6 text-purple-600" aria-hidden="true" /> },
            { type: 'Study', study: 'Pulmonary Function Test', icon: <DocumentMagnifyingGlassIcon className="h-6 w-6 text-purple-600" aria-hidden="true" /> },
            { type: 'Study', study: 'Echocardiogram', icon: <HeartIcon className="h-6 w-6 text-purple-600" aria-hidden="true" /> }
          ].map((study, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    {study.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{study.type}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-sm text-gray-900">{study.study}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/diagnostics/new?type=${study.type}&study=${encodeURIComponent(study.study)}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Order this study
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
