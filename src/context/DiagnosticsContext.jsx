import { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const DiagnosticsContext = createContext();

// Default mock data
const defaultDiagnostics = [
  {
    id: 1,
    patientId: 1,
    patientName: 'James Wilson',
    code: 'I10',
    description: 'Essential (primary) hypertension',
    date: '2025-04-15',
    status: 'Active',
    notes: 'Patient has been on Lisinopril 10mg daily with good control.',
    provider: 'Dr. Smith'
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'James Wilson',
    code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    date: '2025-04-15',
    status: 'Active',
    notes: 'Well controlled with Metformin 1000mg BID. A1C 6.7%.',
    provider: 'Dr. Smith'
  },
  {
    id: 3,
    patientId: 2,
    patientName: 'Sarah Johnson',
    code: 'G43.909',
    description: 'Migraine, unspecified, not intractable, without status migrainosus',
    date: '2025-04-22',
    status: 'Active',
    notes: 'Experiences migraines approximately twice monthly. Using sumatriptan as needed.',
    provider: 'Dr. Johnson'
  },
  {
    id: 4,
    patientId: 3,
    patientName: 'Robert Davis',
    code: 'J44.9',
    description: 'Chronic obstructive pulmonary disease, unspecified',
    date: '2025-04-15',
    status: 'Active',
    notes: 'COPD with occasional exacerbations. Using albuterol inhaler and tiotropium.',
    provider: 'Dr. Williams'
  }
];

// Create a provider component
export function DiagnosticsProvider({ children }) {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        // Load diagnostics
        const storedDiagnostics = localStorage.getItem('ehr_diagnostics');
        const parsedDiagnostics = storedDiagnostics ? JSON.parse(storedDiagnostics) : defaultDiagnostics;
        setDiagnostics(parsedDiagnostics);
        setLoading(false);
      } catch (error) {
        console.error('Error loading diagnostics from localStorage:', error);
        // Fallback to default data if there's an error
        setDiagnostics(defaultDiagnostics);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('ehr_diagnostics', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving diagnostics to localStorage:', error);
    }
  };

  // Add a new diagnostic
  const addDiagnostic = (diagnostic) => {
    const newDiagnostic = {
      id: diagnostics.length > 0 ? Math.max(...diagnostics.map(d => d.id)) + 1 : 1,
      ...diagnostic
    };
    const updatedDiagnostics = [...diagnostics, newDiagnostic];
    setDiagnostics(updatedDiagnostics);
    saveToLocalStorage(updatedDiagnostics);
    return newDiagnostic;
  };

  // Get diagnostics for a patient
  const getPatientDiagnostics = (patientId) => {
    return diagnostics.filter(diagnostic => diagnostic.patientId === parseInt(patientId));
  };

  // Get a diagnostic by ID
  const getDiagnostic = (id) => {
    return diagnostics.find(diagnostic => diagnostic.id === parseInt(id));
  };

  // Update a diagnostic
  const updateDiagnostic = (id, updatedData) => {
    const updatedDiagnostics = diagnostics.map(diagnostic =>
      diagnostic.id === parseInt(id) ? { ...diagnostic, ...updatedData } : diagnostic
    );
    setDiagnostics(updatedDiagnostics);
    saveToLocalStorage(updatedDiagnostics);
    return getDiagnostic(id);
  };

  // Delete a diagnostic
  const deleteDiagnostic = (id) => {
    const updatedDiagnostics = diagnostics.filter(diagnostic => diagnostic.id !== parseInt(id));
    setDiagnostics(updatedDiagnostics);
    saveToLocalStorage(updatedDiagnostics);
  };

  const value = {
    diagnostics,
    loading,
    addDiagnostic,
    getPatientDiagnostics,
    getDiagnostic,
    updateDiagnostic,
    deleteDiagnostic
  };

  return (
    <DiagnosticsContext.Provider value={value}>
      {children}
    </DiagnosticsContext.Provider>
  );
}

export function useDiagnostics() {
  return useContext(DiagnosticsContext);
}
