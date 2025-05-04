import { createContext, useState, useContext, useEffect } from 'react';
import { problemListApi } from '../services/api';

// Create a context
const ProblemListContext = createContext();

// Default mock data
const defaultProblemList = [
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
    code: 'J45.909',
    description: 'Unspecified asthma, uncomplicated',
    date: '2025-04-10',
    status: 'Active',
    notes: 'Uses albuterol inhaler as needed. Last exacerbation 3 months ago.',
    provider: 'Dr. Johnson'
  },
  {
    id: 4,
    patientId: 3,
    patientName: 'Robert Davis',
    code: 'J44.9',
    description: 'Chronic obstructive pulmonary disease, unspecified',
    date: '2025-04-05',
    status: 'Active',
    notes: 'On tiotropium and albuterol. Oxygen saturation 94% on room air.',
    provider: 'Dr. Williams'
  },
  {
    id: 5,
    patientId: 3,
    patientName: 'Robert Davis',
    code: 'I25.10',
    description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
    date: '2025-04-05',
    status: 'Active',
    notes: 'On aspirin and atorvastatin. Last stress test 6 months ago was negative.',
    provider: 'Dr. Williams'
  }
];

// Create a provider component
export function ProblemListProvider({ children }) {
  const [problemList, setProblemList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on initial render
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load problem list
        const problemListData = await problemListApi.getAll();
        setProblemList(problemListData.length > 0 ? problemListData : defaultProblemList);
        setLoading(false);
      } catch (error) {
        console.error('Error loading problem list from API:', error);
        // Fallback to default data if there's an error
        setProblemList(defaultProblemList);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Add a new problem
  const addProblem = async (problem) => {
    try {
      const newProblem = await problemListApi.create(problem);
      setProblemList([...problemList, newProblem]);
      return newProblem;
    } catch (error) {
      console.error('Error adding problem:', error);
      throw error;
    }
  };

  // Get problems for a patient
  const getPatientProblems = async (patientId) => {
    try {
      // First check if we have them in state
      const cachedProblems = problemList.filter(problem => problem.patientId === parseInt(patientId));
      if (cachedProblems.length > 0) return cachedProblems;

      // If not, fetch from API
      return await problemListApi.getByPatientId(patientId);
    } catch (error) {
      console.error(`Error getting problems for patient ${patientId}:`, error);
      throw error;
    }
  };

  // Get a problem by ID
  const getProblem = (id) => {
    // First check if we have it in state
    return problemList.find(problem => problem.id === parseInt(id));
    // Note: We could fetch from API if not found, but for simplicity we'll use the cached data
  };

  // Update a problem
  const updateProblem = async (id, updatedProblem) => {
    try {
      const updated = await problemListApi.update(id, updatedProblem);
      setProblemList(problemList.map(problem => 
        problem.id === parseInt(id) ? updated : problem
      ));
      return updated;
    } catch (error) {
      console.error(`Error updating problem ${id}:`, error);
      throw error;
    }
  };

  // Delete a problem
  const deleteProblem = async (id) => {
    try {
      await problemListApi.delete(id);
      setProblemList(problemList.filter(problem => problem.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting problem ${id}:`, error);
      throw error;
    }
  };

  const value = {
    problemList,
    loading,
    addProblem,
    getPatientProblems,
    getProblem,
    updateProblem,
    deleteProblem
  };

  return (
    <ProblemListContext.Provider value={value}>
      {children}
    </ProblemListContext.Provider>
  );
}

export function useProblemList() {
  return useContext(ProblemListContext);
}
