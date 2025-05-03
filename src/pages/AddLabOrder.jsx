import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLabs } from '../context/LabsContext';
import { usePatient } from '../context/PatientContext';

export default function AddLabOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { labTests, addLabResult } = useLabs();
  const { patients } = usePatient();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdParam = queryParams.get('patientId');
  const testIdParam = queryParams.get('testId');
  
  const [order, setOrder] = useState({
    patientId: patientIdParam ? parseInt(patientIdParam) : '',
    testId: testIdParam ? parseInt(testIdParam) : '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    priority: 'Routine',
    notes: ''
  });
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  
  useEffect(() => {
    if (order.patientId) {
      const patient = patients.find(p => p.id === parseInt(order.patientId));
      setSelectedPatient(patient);
      if (patient) {
        setOrder(prev => ({
          ...prev,
          patientName: patient.name
        }));
      }
    }
    
    if (order.testId) {
      const test = labTests.find(t => t.id === parseInt(order.testId));
      setSelectedTest(test);
      if (test) {
        setOrder(prev => ({
          ...prev,
          testName: test.name
        }));
      }
    }
  }, [order.patientId, order.testId, patients, labTests]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!order.patientId || !order.testId) {
      alert('Please select both a patient and a test');
      return;
    }
    
    const newLabOrder = {
      ...order,
      patientId: parseInt(order.patientId),
      testId: parseInt(order.testId),
      results: []
    };
    
    addLabResult(newLabOrder);
    navigate('/labs');
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value
    });
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order New Lab Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        {/* Patient Selection */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
          <select
            id="patientId"
            name="patientId"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={order.patientId}
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
        
        {/* Test Selection */}
        <div>
          <label htmlFor="testId" className="block text-sm font-medium text-gray-700">Lab Test</label>
          <select
            id="testId"
            name="testId"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={order.testId}
            onChange={handleChange}
            required
            disabled={!!testIdParam}
          >
            <option value="">Select a test</option>
            {labTests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.name} ({test.category})
              </option>
            ))}
          </select>
          
          {selectedTest && (
            <p className="mt-2 text-sm text-gray-500">{selectedTest.description}</p>
          )}
        </div>
        
        {/* Order Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Order Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={order.date}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            name="priority"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={order.priority}
            onChange={handleChange}
          >
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="STAT">STAT (Immediate)</option>
          </select>
        </div>
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={order.notes}
            onChange={handleChange}
            placeholder="Any special instructions or clinical information"
          ></textarea>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/labs')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Order Lab Test</button>
        </div>
      </form>
    </div>
  );
}
