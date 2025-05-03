import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function VitalsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    const mockPatients = [
      { 
        id: 1, 
        name: 'James Wilson', 
        dob: '1980-05-15',
        latestVitals: {
          date: '2025-04-30',
          bp: '125/82',
          pulse: 72,
          temp: 98.6,
          weight: 180,
          height: 70,
          bmi: 25.8
        }
      },
      { 
        id: 2, 
        name: 'Sarah Johnson', 
        dob: '1993-08-21',
        latestVitals: {
          date: '2025-04-22',
          bp: '118/75',
          pulse: 68,
          temp: 98.6,
          weight: 145,
          height: 64,
          bmi: 24.9
        }
      },
      { 
        id: 3, 
        name: 'Robert Davis', 
        dob: '1958-12-03',
        latestVitals: {
          date: '2025-04-15',
          bp: '145/88',
          pulse: 80,
          temp: 98.8,
          weight: 192,
          height: 71,
          bmi: 26.8
        }
      },
      { 
        id: 4, 
        name: 'Emily Chen', 
        dob: '1987-04-10',
        latestVitals: {
          date: '2025-04-10',
          bp: '110/70',
          pulse: 65,
          temp: 98.4,
          weight: 135,
          height: 63,
          bmi: 23.9
        }
      },
      { 
        id: 5, 
        name: 'Michael Thompson', 
        dob: '1975-06-22',
        latestVitals: {
          date: '2025-04-05',
          bp: '138/85',
          pulse: 75,
          temp: 98.7,
          weight: 210,
          height: 73,
          bmi: 27.7
        }
      },
    ];
    
    setPatients(mockPatients);
  }, []);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getBpStatus = (bp) => {
    if (!bp) return 'normal';
    
    const systolic = parseInt(bp.split('/')[0]);
    const diastolic = parseInt(bp.split('/')[1]);
    
    if (systolic >= 140 || diastolic >= 90) {
      return 'high';
    } else if (systolic >= 120 || diastolic >= 80) {
      return 'elevated';
    } else {
      return 'normal';
    }
  };
  
  const getBmiStatus = (bmi) => {
    if (!bmi) return 'normal';
    
    if (bmi < 18.5) {
      return 'underweight';
    } else if (bmi < 25) {
      return 'normal';
    } else if (bmi < 30) {
      return 'overweight';
    } else {
      return 'obese';
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Vitals</h1>
        <div className="mt-4 md:mt-0 relative">
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
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Vitals</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Pressure
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pulse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BMI
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const bpStatus = getBpStatus(patient.latestVitals.bp);
                    const bmiStatus = getBmiStatus(patient.latestVitals.bmi);
                    
                    return (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-blue-600">
                                <Link to={`/patients/${patient.id}`} className="hover:underline">
                                  {patient.name}
                                </Link>
                              </div>
                              <div className="text-sm text-gray-500">
                                {calculateAge(patient.dob)} years
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(patient.latestVitals.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                              bpStatus === 'high' ? 'bg-red-100 text-red-800' : 
                              bpStatus === 'elevated' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {patient.latestVitals.bp}
                            </span>
                            <span className="text-sm text-gray-500">
                              {bpStatus === 'high' ? 'High' : 
                               bpStatus === 'elevated' ? 'Elevated' : 
                               'Normal'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.latestVitals.pulse} bpm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.latestVitals.temp}°F
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.latestVitals.weight} lbs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                              bmiStatus === 'obese' ? 'bg-red-100 text-red-800' : 
                              bmiStatus === 'overweight' ? 'bg-yellow-100 text-yellow-800' : 
                              bmiStatus === 'underweight' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {patient.latestVitals.bmi}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {bmiStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/patients/${patient.id}/vitals`} className="text-blue-600 hover:text-blue-900">
                            View trends
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No patients found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Vitals Outliers</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* High Blood Pressure Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-red-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <ChartBarIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">High Blood Pressure</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">3 patients</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-red-50 px-4 py-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        <Link to={`/patients/3`} className="font-medium text-red-700 underline">
                          Robert Davis
                        </Link>
                        : 145/88 mmHg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* High BMI Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-yellow-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Elevated BMI</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">4 patients</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-yellow-50 px-4 py-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <Link to={`/patients/5`} className="font-medium text-yellow-700 underline">
                          Michael Thompson
                        </Link>
                        : BMI 27.7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Abnormal Temperature Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Temperature Alerts</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">1 patient</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-blue-50 px-4 py-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <Link to={`/patients/3`} className="font-medium text-blue-700 underline">
                          Robert Davis
                        </Link>
                        : 98.8°F
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}