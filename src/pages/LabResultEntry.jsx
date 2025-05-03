import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLabs } from '../context/LabsContext';

export default function LabResultEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labResults, getLabResult, labTests } = useLabs();
  
  const [labResult, setLabResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultValues, setResultValues] = useState([]);
  
  useEffect(() => {
    const result = getLabResult(id);
    if (result) {
      setLabResult(result);
      
      // Initialize result values based on the test type
      if (result.testId === 1) { // CBC
        setResultValues([
          { name: 'WBC', value: '', unit: 'K/uL', referenceRange: '4.5-11.0', flag: 'Normal' },
          { name: 'RBC', value: '', unit: 'M/uL', referenceRange: '4.5-5.9', flag: 'Normal' },
          { name: 'Hemoglobin', value: '', unit: 'g/dL', referenceRange: '13.5-17.5', flag: 'Normal' },
          { name: 'Hematocrit', value: '', unit: '%', referenceRange: '41-50', flag: 'Normal' },
          { name: 'Platelets', value: '', unit: 'K/uL', referenceRange: '150-450', flag: 'Normal' },
        ]);
      } else if (result.testId === 2) { // Basic Metabolic Panel
        setResultValues([
          { name: 'Glucose', value: '', unit: 'mg/dL', referenceRange: '70-99', flag: 'Normal' },
          { name: 'Calcium', value: '', unit: 'mg/dL', referenceRange: '8.5-10.2', flag: 'Normal' },
          { name: 'Sodium', value: '', unit: 'mmol/L', referenceRange: '135-145', flag: 'Normal' },
          { name: 'Potassium', value: '', unit: 'mmol/L', referenceRange: '3.5-5.0', flag: 'Normal' },
          { name: 'CO2', value: '', unit: 'mmol/L', referenceRange: '23-29', flag: 'Normal' },
          { name: 'Chloride', value: '', unit: 'mmol/L', referenceRange: '96-106', flag: 'Normal' },
          { name: 'BUN', value: '', unit: 'mg/dL', referenceRange: '7-20', flag: 'Normal' },
          { name: 'Creatinine', value: '', unit: 'mg/dL', referenceRange: '0.6-1.2', flag: 'Normal' },
        ]);
      } else if (result.testId === 3) { // Lipid Panel
        setResultValues([
          { name: 'Total Cholesterol', value: '', unit: 'mg/dL', referenceRange: '<200', flag: 'Normal' },
          { name: 'HDL', value: '', unit: 'mg/dL', referenceRange: '>40', flag: 'Normal' },
          { name: 'LDL', value: '', unit: 'mg/dL', referenceRange: '<100', flag: 'Normal' },
          { name: 'Triglycerides', value: '', unit: 'mg/dL', referenceRange: '<150', flag: 'Normal' },
        ]);
      } else if (result.testId === 4) { // Hemoglobin A1C
        setResultValues([
          { name: 'Hemoglobin A1C', value: '', unit: '%', referenceRange: '<5.7', flag: 'Normal' },
        ]);
      } else if (result.testId === 5) { // TSH
        setResultValues([
          { name: 'TSH', value: '', unit: 'mIU/L', referenceRange: '0.4-4.0', flag: 'Normal' },
        ]);
      } else {
        // Generic placeholder for other tests
        setResultValues([
          { name: 'Result', value: '', unit: '', referenceRange: '', flag: 'Normal' },
        ]);
      }
    }
    setLoading(false);
  }, [id, getLabResult]);
  
  const handleValueChange = (index, value) => {
    const newValues = [...resultValues];
    newValues[index].value = value;
    
    // Automatically set flag based on reference range
    const refRange = newValues[index].referenceRange;
    if (refRange.startsWith('<')) {
      const threshold = parseFloat(refRange.substring(1));
      newValues[index].flag = parseFloat(value) < threshold ? 'Normal' : 'High';
    } else if (refRange.startsWith('>')) {
      const threshold = parseFloat(refRange.substring(1));
      newValues[index].flag = parseFloat(value) > threshold ? 'Normal' : 'Low';
    } else if (refRange.includes('-')) {
      const [min, max] = refRange.split('-').map(parseFloat);
      const numValue = parseFloat(value);
      if (numValue < min) {
        newValues[index].flag = 'Low';
      } else if (numValue > max) {
        newValues[index].flag = 'High';
      } else {
        newValues[index].flag = 'Normal';
      }
    }
    
    setResultValues(newValues);
  };
  
  const handleFlagChange = (index, flag) => {
    const newValues = [...resultValues];
    newValues[index].flag = flag;
    setResultValues(newValues);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the lab result with the entered values
    const updatedResult = {
      ...labResult,
      status: 'Completed',
      results: resultValues,
      completedDate: new Date().toISOString().split('T')[0]
    };
    
    // In a real app, this would call an API to update the result
    // For now, we'll just navigate back to the labs page
    navigate('/labs');
  };
  
  if (loading) {
    return <div className="text-center p-6">Loading lab test...</div>;
  }
  
  if (!labResult) {
    return <div className="text-center p-6">Lab test not found</div>;
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Enter Lab Results</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Test Information</h2>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Patient</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{labResult.patientName}</dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Test</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{labResult.testName}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Order Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(labResult.date)}</dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  labResult.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {labResult.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference Range
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flag
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resultValues.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={result.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    required
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.referenceRange}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={result.flag}
                    onChange={(e) => handleFlagChange(index, e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Critical">Critical</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/labs')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Save Results</button>
        </div>
      </form>
    </div>
  );
}
