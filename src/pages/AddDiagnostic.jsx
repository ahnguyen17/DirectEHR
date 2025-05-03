import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDiagnostics } from '../context/DiagnosticsContext';
import { usePatient } from '../context/PatientContext';

export default function AddDiagnostic() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addDiagnostic } = useDiagnostics();
  const { patients } = usePatient();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdParam = queryParams.get('patientId');
  const codeParam = queryParams.get('code');
  const descriptionParam = queryParams.get('description');
  
  const [diagnostic, setDiagnostic] = useState({
    patientId: patientIdParam ? parseInt(patientIdParam) : '',
    code: codeParam || '',
    description: descriptionParam || '',
    date: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: '',
    provider: 'Dr. Smith' // Default provider, in a real app this would be the logged-in user
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add Diagnostic</h1>
      
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
        
        {/* Diagnostic Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Diagnostic Code</label>
          <input
            type="text"
            id="code"
            name="code"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.code}
            onChange={handleChange}
            required
            placeholder="e.g., I10, E11.9"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.description}
            onChange={handleChange}
            required
            placeholder="e.g., Essential hypertension"
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
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
            <option value="Inactive">Inactive</option>
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
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={diagnostic.notes}
            onChange={handleChange}
            placeholder="Additional information about the diagnosis"
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
          <button type="submit" className="btn btn-primary">Save Diagnostic</button>
        </div>
      </form>
    </div>
  );
}
