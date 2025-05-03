import { createContext, useState, useContext, useEffect } from 'react';
import { diagnosticApi } from '../services/api';

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

  // Load data from API on initial render
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load diagnostics
        const diagnosticsData = await diagnosticApi.getAll();
        setDiagnostics(diagnosticsData.length > 0 ? diagnosticsData : defaultDiagnostics);
        setLoading(false);
      } catch (error) {
        console.error('Error loading diagnostics from API:', error);
        // Fallback to default data if there's an error
        setDiagnostics(defaultDiagnostics);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Add a new diagnostic
  const addDiagnostic = async (diagnostic) => {
    try {
      const newDiagnostic = await diagnosticApi.create(diagnostic);
      setDiagnostics([...diagnostics, newDiagnostic]);
      return newDiagnostic;
    } catch (error) {
      console.error('Error adding diagnostic:', error);
      throw error;
    }
  };

  // Get diagnostics for a patient
  const getPatientDiagnostics = async (patientId) => {
    try {
      // First check if we have them in state
      const cachedDiagnostics = diagnostics.filter(diagnostic => diagnostic.patientId === parseInt(patientId));
      if (cachedDiagnostics.length > 0) return cachedDiagnostics;

      // If not, fetch from API
      return await diagnosticApi.getByPatientId(patientId);
    } catch (error) {
      console.error(`Error getting diagnostics for patient ${patientId}:`, error);
      throw error;
    }
  };

  // Get a diagnostic by ID
  const getDiagnostic = (id) => {
    // First check if we have it in state
    return diagnostics.find(diagnostic => diagnostic.id === parseInt(id));
    // Note: We could fetch from API if not found, but for simplicity we'll use the cached data
  };

  // Update a diagnostic
  const updateDiagnostic = async (id, updatedData) => {
    try {
      const updatedDiagnostic = await diagnosticApi.update(id, updatedData);
      setDiagnostics(diagnostics.map(diagnostic =>
        diagnostic.id === parseInt(id) ? updatedDiagnostic : diagnostic
      ));
      return updatedDiagnostic;
    } catch (error) {
      console.error(`Error updating diagnostic ${id}:`, error);
      throw error;
    }
  };

  // Delete a diagnostic
  const deleteDiagnostic = async (id) => {
    try {
      await diagnosticApi.delete(id);
      setDiagnostics(diagnostics.filter(diagnostic => diagnostic.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting diagnostic ${id}:`, error);
      throw error;
    }
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
