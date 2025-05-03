import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setTimeout(() => {
      // Mock patient data
      const mockPatient = {
        id: parseInt(id),
        name: 'James Wilson',
        dob: '1980-05-15',
        gender: 'Male',
        mrn: 'MRN123456',
        address: '123 Main St, Anytown, USA',
        phone: '(555) 123-4567',
        insurance: 'Blue Cross Blue Shield',
        policyNumber: 'BCBS987654321',
        allergies: ['Penicillin', 'Peanuts'],
        medicalHistory: [
          { condition: 'Hypertension', diagnosedDate: '2018-03-10', status: 'Active' },
          { condition: 'Type 2 Diabetes', diagnosedDate: '2019-05-22', status: 'Active' },
          { condition: 'Appendectomy', diagnosedDate: '2010-11-05', status: 'Resolved' },
        ],
        medications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2018-03-15' },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2019-05-30' },
        ],
        vitals: [
          { date: '2025-04-30', bp: '125/82', pulse: 72, temp: 98.6, weight: 180, height: 70, bmi: 25.8 },
          { date: '2025-03-15', bp: '130/85', pulse: 75, temp: 98.4, weight: 182, height: 70, bmi: 26.1 },
          { date: '2025-01-22', bp: '128/84', pulse: 74, temp: 98.7, weight: 185, height: 70, bmi: 26.5 },
        ],
        notes: [
          { id: 1, date: '2025-04-30', title: 'Routine Check-up', content: 'Patient presents for routine follow-up for hypertension and diabetes. Both conditions appear well-controlled with current medication regimen. Blood pressure is 125/82, which is within target range. A1C is 6.7%, showing good glycemic control.' },
          { id: 2, date: '2025-03-15', title: 'Medication Review', content: 'Reviewed current medications with patient. No reported side effects from Lisinopril or Metformin. Patient reports taking medications as prescribed. Refilled both medications for 90 days.' },
        ],
        orders: [
          { id: 1, date: '2025-04-30', type: 'Blood Test', status: 'Pending', dueDate: '2025-05-10', details: 'Comprehensive metabolic panel and A1C' },
          { id: 2, date: '2025-03-15', type: 'Chest X-Ray', status: 'Completed', completedDate: '2025-03-22', results: 'Normal findings, no abnormalities detected' },
        ],
      };
      
      setPatient(mockPatient);
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading patient information...</div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Patient not found</h2>
          <p className="mt-1 text-gray-500">The patient you are looking for could not be found.</p>
          <Link to="/patients" className="mt-4 inline-block btn btn-primary">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }
  
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
  
  return (
    <div>
      {/* Patient header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div className="flex items-center">
            <UserCircleIcon className="h-16 w-16 text-gray-400 mr-4" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                <p>{calculateAge(patient.dob)} years ({patient.gender})</p>
                <p>DOB: {formatDate(patient.dob)}</p>
                <p>MRN: {patient.mrn}</p>
              </div>
            </div>
          </div>
          <Link to={`/patients/${patient.id}/edit`} className="btn btn-secondary inline-flex items-center">
            <PencilIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${
              activeTab === 'vitals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('vitals')}
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Vitals
          </button>
          <button
            className={`${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('notes')}
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            Notes
          </button>
          <button
            className={`${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
            Orders
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Patient Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.name}</dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(patient.dob)} ({calculateAge(patient.dob)} years)</dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.gender}</dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.address}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.phone}</dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.insurance}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.policyNumber}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Allergies & Medical History */}
          <div>
            {/* Allergies */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Allergies</h2>
                <button className="text-sm text-blue-600 hover:text-blue-500">Add New</button>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {patient.allergies.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.allergies.map((allergy, index) => (
                      <li key={index} className="text-sm text-gray-700">{allergy}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No known allergies</p>
                )}
              </div>
            </div>
            
            {/* Medical History */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Medical History</h2>
                <button className="text-sm text-blue-600 hover:text-blue-500">Add New</button>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {patient.medicalHistory.map((condition, index) => (
                    <li key={index} className="px-4 py-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{condition.condition}</p>
                          <p className="text-sm text-gray-500">Diagnosed: {formatDate(condition.diagnosedDate)}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          condition.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {condition.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Medications */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Current Medications</h2>
              <button className="text-sm text-blue-600 hover:text-blue-500">Add Medication</button>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.medications.map((medication, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {medication.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medication.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medication.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(medication.startDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'vitals' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Vitals History</h2>
            <button className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              Record New Vitals
            </button>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Temperature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (lbs)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BMI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.vitals.map((vital, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(vital.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.bp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.pulse} bpm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.temp}°F
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.weight} lbs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.bmi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Vitals Charts would go here in a real implementation */}
          <div className="mt-6 p-6 bg-white shadow sm:rounded-lg">
            <p className="text-gray-500">Vitals trend charts would be displayed here using Chart.js</p>
          </div>
        </div>
      )}
      
      {activeTab === 'notes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Patient Notes</h2>
            <Link to={`/patients/${patient.id}/notes/new`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              Add Note
            </Link>
          </div>
          
          <div className="space-y-6">
            {patient.notes.length > 0 ? (
              patient.notes.map((note) => (
                <div key={note.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{formatDate(note.date)}</p>
                    </div>
                    <div className="flex">
                      <button className="text-sm text-blue-600 hover:text-blue-500 mr-4">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-500">Delete</button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                <p className="text-gray-500">No notes have been added for this patient.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Orders</h2>
            <Link to={`/patients/${patient.id}/orders/new`} className="btn btn-primary inline-flex items-center">
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              New Order
            </Link>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.dueDate ? formatDate(order.dueDate) : (order.completedDate ? formatDate(order.completedDate) : 'N/A')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.details || order.results || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}