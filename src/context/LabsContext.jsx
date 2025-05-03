import { createContext, useState, useContext, useEffect } from 'react';

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

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        // Load lab tests
        const storedLabTests = localStorage.getItem('ehr_lab_tests');
        const parsedLabTests = storedLabTests ? JSON.parse(storedLabTests) : defaultLabTests;
        setLabTests(parsedLabTests);

        // Load lab results
        const storedLabResults = localStorage.getItem('ehr_lab_results');
        const parsedLabResults = storedLabResults ? JSON.parse(storedLabResults) : defaultLabResults;
        setLabResults(parsedLabResults);

        setLoading(false);
      } catch (error) {
        console.error('Error loading labs data from localStorage:', error);
        // Fallback to default data if there's an error
        setLabTests(defaultLabTests);
        setLabResults(defaultLabResults);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Add a new lab test
  const addLabTest = (test) => {
    const newTest = {
      id: labTests.length > 0 ? Math.max(...labTests.map(t => t.id)) + 1 : 1,
      ...test
    };
    const updatedLabTests = [...labTests, newTest];
    setLabTests(updatedLabTests);
    saveToLocalStorage('ehr_lab_tests', updatedLabTests);
    return newTest;
  };

  // Get a lab test by ID
  const getLabTest = (id) => {
    return labTests.find(test => test.id === parseInt(id));
  };

  // Update a lab test
  const updateLabTest = (id, updatedData) => {
    const updatedLabTests = labTests.map(test =>
      test.id === parseInt(id) ? { ...test, ...updatedData } : test
    );
    setLabTests(updatedLabTests);
    saveToLocalStorage('ehr_lab_tests', updatedLabTests);
    return getLabTest(id);
  };

  // Delete a lab test
  const deleteLabTest = (id) => {
    const updatedLabTests = labTests.filter(test => test.id !== parseInt(id));
    setLabTests(updatedLabTests);
    saveToLocalStorage('ehr_lab_tests', updatedLabTests);
  };

  // Add a new lab result
  const addLabResult = (result) => {
    const newResult = {
      id: labResults.length > 0 ? Math.max(...labResults.map(r => r.id)) + 1 : 1,
      ...result
    };
    const updatedLabResults = [...labResults, newResult];
    setLabResults(updatedLabResults);
    saveToLocalStorage('ehr_lab_results', updatedLabResults);
    return newResult;
  };

  // Get lab results for a patient
  const getPatientLabResults = (patientId) => {
    return labResults.filter(result => result.patientId === parseInt(patientId));
  };

  // Get a lab result by ID
  const getLabResult = (id) => {
    return labResults.find(result => result.id === parseInt(id));
  };

  // Update a lab result
  const updateLabResult = (id, updatedData) => {
    const updatedLabResults = labResults.map(result =>
      result.id === parseInt(id) ? { ...result, ...updatedData } : result
    );
    setLabResults(updatedLabResults);
    saveToLocalStorage('ehr_lab_results', updatedLabResults);
    return getLabResult(id);
  };

  // Delete a lab result
  const deleteLabResult = (id) => {
    const updatedLabResults = labResults.filter(result => result.id !== parseInt(id));
    setLabResults(updatedLabResults);
    saveToLocalStorage('ehr_lab_results', updatedLabResults);
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
