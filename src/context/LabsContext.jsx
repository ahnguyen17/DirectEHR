import { createContext, useState, useContext, useEffect } from 'react';
import { labTestApi, labResultApi } from '../services/api';

// Create a context
const LabsContext = createContext();

// Default mock data
const defaultLabTests = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', description: 'Measures red and white blood cells, platelets, and hemoglobin' },
  { id: 2, name: 'Basic Metabolic Panel', category: 'Chemistry', description: 'Measures glucose, calcium, electrolytes, and kidney function' },
  { id: 3, name: 'Lipid Panel', category: 'Chemistry', description: 'Measures cholesterol and triglycerides' },
  { id: 4, name: 'Hemoglobin A1C', category: 'Endocrinology', description: 'Measures average blood glucose over past 3 months' },
  { id: 5, name: 'Thyroid Stimulating Hormone (TSH)', category: 'Endocrinology', description: 'Measures thyroid function' },
];

const defaultLabResults = [
  {
    id: 1,
    patientId: 1,
    patientName: 'James Wilson',
    testId: 1,
    testName: 'Complete Blood Count (CBC)',
    date: '2025-04-15',
    status: 'Completed',
    results: [
      { name: 'WBC', value: '7.5', unit: 'K/uL', referenceRange: '4.5-11.0', flag: 'Normal' },
      { name: 'RBC', value: '5.2', unit: 'M/uL', referenceRange: '4.5-5.9', flag: 'Normal' },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', flag: 'Normal' },
      { name: 'Hematocrit', value: '42', unit: '%', referenceRange: '41-50', flag: 'Normal' },
      { name: 'Platelets', value: '250', unit: 'K/uL', referenceRange: '150-450', flag: 'Normal' },
    ]
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'James Wilson',
    testId: 3,
    testName: 'Lipid Panel',
    date: '2025-04-15',
    status: 'Completed',
    results: [
      { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', referenceRange: '<200', flag: 'High' },
      { name: 'HDL', value: '45', unit: 'mg/dL', referenceRange: '>40', flag: 'Normal' },
      { name: 'LDL', value: '130', unit: 'mg/dL', referenceRange: '<100', flag: 'High' },
      { name: 'Triglycerides', value: '175', unit: 'mg/dL', referenceRange: '<150', flag: 'High' },
    ]
  },
  {
    id: 3,
    patientId: 2,
    patientName: 'Sarah Johnson',
    testId: 4,
    testName: 'Hemoglobin A1C',
    date: '2025-04-22',
    status: 'Completed',
    results: [
      { name: 'Hemoglobin A1C', value: '5.7', unit: '%', referenceRange: '<5.7', flag: 'Borderline' },
    ]
  }
];

// Create a provider component
export function LabsProvider({ children }) {
  const [labTests, setLabTests] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on initial render
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load lab tests
        const labTestsData = await labTestApi.getAll();
        setLabTests(labTestsData.length > 0 ? labTestsData : defaultLabTests);

        // Load lab results
        const labResultsData = await labResultApi.getAll();
        setLabResults(labResultsData.length > 0 ? labResultsData : defaultLabResults);

        setLoading(false);
      } catch (error) {
        console.error('Error loading labs data from API:', error);
        // Fallback to default data if there's an error
        setLabTests(defaultLabTests);
        setLabResults(defaultLabResults);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Add a new lab test
  const addLabTest = async (test) => {
    try {
      const newTest = await labTestApi.create(test);
      setLabTests([...labTests, newTest]);
      return newTest;
    } catch (error) {
      console.error('Error adding lab test:', error);
      throw error;
    }
  };

  // Get a lab test by ID
  const getLabTest = (id) => {
    // First check if we have it in state
    return labTests.find(test => test.id === parseInt(id));
    // Note: We could fetch from API if not found, but for simplicity we'll use the cached data
  };

  // Update a lab test
  const updateLabTest = async (id, updatedData) => {
    try {
      const updatedTest = await labTestApi.update(id, updatedData);
      setLabTests(labTests.map(test =>
        test.id === parseInt(id) ? updatedTest : test
      ));
      return updatedTest;
    } catch (error) {
      console.error(`Error updating lab test ${id}:`, error);
      throw error;
    }
  };

  // Delete a lab test
  const deleteLabTest = async (id) => {
    try {
      // Note: The server doesn't have a delete endpoint for lab tests,
      // but we'll keep this method for consistency
      setLabTests(labTests.filter(test => test.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting lab test ${id}:`, error);
      throw error;
    }
  };

  // Add a new lab result
  const addLabResult = async (result) => {
    try {
      const newResult = await labResultApi.create(result);
      setLabResults([...labResults, newResult]);
      return newResult;
    } catch (error) {
      console.error('Error adding lab result:', error);
      throw error;
    }
  };

  // Get lab results for a patient
  const getPatientLabResults = async (patientId) => {
    try {
      // First check if we have them in state
      const cachedResults = labResults.filter(result => result.patientId === parseInt(patientId));
      if (cachedResults.length > 0) return cachedResults;

      // If not, fetch from API
      return await labResultApi.getByPatientId(patientId);
    } catch (error) {
      console.error(`Error getting lab results for patient ${patientId}:`, error);
      throw error;
    }
  };

  // Get a lab result by ID
  const getLabResult = (id) => {
    // First check if we have it in state
    return labResults.find(result => result.id === parseInt(id));
    // Note: We could fetch from API if not found, but for simplicity we'll use the cached data
  };

  // Update a lab result
  const updateLabResult = async (id, updatedData) => {
    try {
      const updatedResult = await labResultApi.update(id, updatedData);
      setLabResults(labResults.map(result =>
        result.id === parseInt(id) ? updatedResult : result
      ));
      return updatedResult;
    } catch (error) {
      console.error(`Error updating lab result ${id}:`, error);
      throw error;
    }
  };

  // Delete a lab result
  const deleteLabResult = async (id) => {
    try {
      // Note: The server doesn't have a delete endpoint for lab results,
      // but we'll keep this method for consistency
      setLabResults(labResults.filter(result => result.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting lab result ${id}:`, error);
      throw error;
    }
  };

  const value = {
    labTests,
    labResults,
    loading,
    addLabTest,
    getLabTest,
    updateLabTest,
    deleteLabTest,
    addLabResult,
    getLabResult,
    getPatientLabResults,
    updateLabResult,
    deleteLabResult
  };

  return (
    <LabsContext.Provider value={value}>
      {children}
    </LabsContext.Provider>
  );
}

export function useLabs() {
  return useContext(LabsContext);
}
