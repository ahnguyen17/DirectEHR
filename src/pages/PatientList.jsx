import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePatient } from '../context/PatientContext';

export default function PatientList() {
  const { patients, loading } = usePatient();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading patients...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/patients/new"
            className="btn btn-primary inline-flex items-center justify-center min-w-max"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Patient
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md overflow-x-auto">
        <ul className="divide-y divide-gray-200">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <li key={patient.id}>
                <Link to={`/patients/${patient.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UserCircleIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-blue-600">{patient.name}</p>
                          <div className="flex mt-1">
                            <p className="text-sm text-gray-500 mr-4">
                              <span className="font-medium">MRN:</span> {patient.mrn}
                            </p>
                            <p className="text-sm text-gray-500 mr-4">
                              <span className="font-medium">Age:</span> {calculateAge(patient.dob)}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Gender:</span> {patient.gender}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              No patients found matching your search criteria.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}