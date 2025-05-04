import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDiagnostics } from '../context/DiagnosticsContext';
import { usePatient } from '../context/PatientContext';
import { FilmIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AddDiagnostic() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addDiagnostic } = useDiagnostics();
  const { patients } = usePatient();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdParam = queryParams.get('patientId');
  const typeParam = queryParams.get('type');
  const studyParam = queryParams.get('study');

  const [diagnostic, setDiagnostic] = useState({
    patientId: patientIdParam ? parseInt(patientIdParam) : '',
    type: typeParam || 'Imaging',
    study: studyParam || '',
    date: new Date().toISOString().split('T')[0],
    status: 'Ordered',
    result: '',
    provider: 'Dr. Smith', // Default provider, in a real app this would be the logged-in user
    orderingProvider: 'Dr. Smith'
  });

  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (diagnostic.patientId) {
      const patient = patients.find(p => p.id === parseInt(diagnostic.patientId));
      setSelectedPatient(patient);
      if (patient) {
        setDiagnostic(prev => ({
          ...prev,
          patientName: patient.name
        }));
      }
    }
  }, [diagnostic.patientId, patients]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!diagnostic.patientId) {
      alert('Please select a patient');
      return;
    }

    const newDiagnostic = {
      ...diagnostic,
      patientId: parseInt(diagnostic.patientId)
    };

    addDiagnostic(newDiagnostic);
    navigate('/diagnostics');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiagnostic({
      ...diagnostic,
      [name]: value
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order Diagnostic Study</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        {/* Patient Selection */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
          <select
            id="patientId"
            name="patientId"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={diagnostic.patientId}
            onChange={handleChange}
            required
            disabled={!!patientIdParam}
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (DOB: {new Date(patient.dob).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="type-imaging"
                name="type"
                type="radio"
                value="Imaging"
                checked={diagnostic.type === 'Imaging'}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="type-imaging" className="ml-2 flex items-center text-sm text-gray-700">
                <FilmIcon className="h-5 w-5 text-blue-500 mr-1" />
                Imaging
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="type-study"
                name="type"
                type="radio"
                value="Study"
                checked={diagnostic.type === 'Study'}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="type-study" className="ml-2 flex items-center text-sm text-gray-700">
                <DocumentMagnifyingGlassIcon className="h-5 w-5 text-purple-500 mr-1" />
                Study
              </label>
            </div>
          </div>
        </div>

        {/* Study */}
        <div>
          <label htmlFor="study" className="block text-sm font-medium text-gray-700">Study</label>
          <input
            type="text"
            id="study"
            name="study"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.study}
            onChange={handleChange}
            required
            placeholder={diagnostic.type === 'Imaging' ? "e.g., Chest X-ray, MRI Brain" : "e.g., ECG, Pulmonary Function Test"}
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={diagnostic.status}
            onChange={handleChange}
          >
            <option value="Ordered">Ordered</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Provider */}
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
          <input
            type="text"
            id="provider"
            name="provider"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.provider}
            onChange={handleChange}
            required
          />
        </div>

        {/* Ordering Provider */}
        <div>
          <label htmlFor="orderingProvider" className="block text-sm font-medium text-gray-700">Ordering Provider</label>
          <input
            type="text"
            id="orderingProvider"
            name="orderingProvider"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.orderingProvider}
            onChange={handleChange}
            required
          />
        </div>

        {/* Result */}
        <div>
          <label htmlFor="result" className="block text-sm font-medium text-gray-700">Result</label>
          <textarea
            id="result"
            name="result"
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.result}
            onChange={handleChange}
            placeholder={diagnostic.status === 'Completed' ? "Enter the result of the study" : "Results will be available after the study is completed"}
          ></textarea>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/diagnostics')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Save Order</button>
        </div>
      </form>
    </div>
  );
}
