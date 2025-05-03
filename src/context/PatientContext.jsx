import { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const PatientContext = createContext();

// Create a provider component
export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [notes, setNotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll use mock data
    const mockPatients = [
      { id: 1, name: 'James Wilson', dob: '1980-05-15', gender: 'Male', mrn: 'MRN123456', address: '123 Main St, Anytown, USA', phone: '(555) 123-4567' },
      { id: 2, name: 'Sarah Johnson', dob: '1993-08-21', gender: 'Female', mrn: 'MRN789012', address: '456 Oak Ave, Somecity, USA', phone: '(555) 234-5678' },
      { id: 3, name: 'Robert Davis', dob: '1958-12-03', gender: 'Male', mrn: 'MRN345678', address: '789 Pine Rd, Otherville, USA', phone: '(555) 345-6789' },
      { id: 4, name: 'Emily Chen', dob: '1987-04-10', gender: 'Female', mrn: 'MRN901234', address: '101 Cedar St, Newtown, USA', phone: '(555) 456-7890' },
      { id: 5, name: 'Michael Thompson', dob: '1975-06-22', gender: 'Male', mrn: 'MRN567890', address: '202 Maple Dr, Lastcity, USA', phone: '(555) 567-8901' },
    ];
    
    const mockNotes = [
      { id: 1, patientId: 1, patientName: 'James Wilson', date: '2025-04-30', title: 'Routine Check-up', content: 'Patient presents for routine follow-up for hypertension and diabetes. Both conditions appear well-controlled with current medication regimen. Blood pressure is 125/82, which is within target range. A1C is 6.7%, showing good glycemic control.' },
      { id: 2, patientId: 1, patientName: 'James Wilson', date: '2025-03-15', title: 'Medication Review', content: 'Reviewed current medications with patient. No reported side effects from Lisinopril or Metformin. Patient reports taking medications as prescribed. Refilled both medications for 90 days.' },
      { id: 3, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-22', title: 'Annual Physical', content: 'Patient presents for annual physical examination. Overall in good health. Blood pressure 118/75, pulse 68, temperature 98.6. All systems reviewed with no concerning findings. Recommended continued exercise regimen and healthy diet.' },
      { id: 4, patientId: 3, patientName: 'Robert Davis', date: '2025-04-15', title: 'Follow-up Visit', content: 'Follow-up for COPD. Patient reports slight improvement in breathing with new inhaler. Still experiences shortness of breath with moderate exertion. Oxygen saturation 94% at rest. Discussed smoking cessation strategies.' },
      { id: 5, patientId: 4, patientName: 'Emily Chen', date: '2025-04-10', title: 'New Patient Visit', content: 'Initial consultation with new patient. Medical history taken. Patient reports occasional migraine headaches, otherwise healthy. Family history significant for hypertension and diabetes. Created care plan for migraine management.' },
    ];
    
    const mockOrders = [
      { id: 1, patientId: 1, patientName: 'James Wilson', date: '2025-04-30', type: 'Laboratory Test', status: 'Pending', dueDate: '2025-05-10', details: 'Comprehensive metabolic panel and A1C' },
      { id: 2, patientId: 1, patientName: 'James Wilson', date: '2025-03-15', type: 'Imaging', status: 'Completed', completedDate: '2025-03-22', results: 'Chest X-Ray: Normal findings, no abnormalities detected' },
      { id: 3, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-22', type: 'Imaging', status: 'Scheduled', dueDate: '2025-05-15', details: 'MRI - Right Knee: Evaluate for meniscus tear' },
      { id: 4, patientId: 3, patientName: 'Robert Davis', date: '2025-04-15', type: 'Imaging', status: 'Completed', completedDate: '2025-04-20', results: 'CT Scan - Chest: Stable COPD, no acute findings' },
      { id: 5, patientId: 4, patientName: 'Emily Chen', date: '2025-04-10', type: 'Medication', status: 'Active', details: 'Sumatriptan 50mg, as needed for migraines, 9 tablets, 3 refills' },
      { id: 6, patientId: 5, patientName: 'Michael Thompson', date: '2025-04-05', type: 'Procedure', status: 'Pending', dueDate: '2025-05-05', details: 'Echocardiogram: Follow-up for mitral valve regurgitation' },
      { id: 7, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-01', type: 'Laboratory Test', status: 'Completed', completedDate: '2025-04-03', results: 'CBC: Within normal limits' },
    ];
    
    const mockVitals = [
      { 
        id: 1, 
        patientId: 1, 
        patientName: 'James Wilson',
        date: '2025-04-30',
        bp: '125/82',
        pulse: 72,
        temp: 98.6,
        weight: 180,
        height: 70,
        bmi: 25.8,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        pain: 0
      },
      { 
        id: 2, 
        patientId: 1, 
        patientName: 'James Wilson',
        date: '2025-03-15',
        bp: '130/85',
        pulse: 75,
        temp: 98.4,
        weight: 182,
        height: 70,
        bmi: 26.1,
        oxygenSaturation: 97,
        respiratoryRate: 16,
        pain: 0
      },
      { 
        id: 3, 
        patientId: 2, 
        patientName: 'Sarah Johnson',
        date: '2025-04-22',
        bp: '118/75',
        pulse: 68,
        temp: 98.6,
        weight: 145,
        height: 64,
        bmi: 24.9,
        oxygenSaturation: 99,
        respiratoryRate: 14,
        pain: 0
      },
      { 
        id: 4, 
        patientId: 3, 
        patientName: 'Robert Davis',
        date: '2025-04-15',
        bp: '145/88',
        pulse: 80,
        temp: 98.8,
        weight: 192,
        height: 71,
        bmi: 26.8,
        oxygenSaturation: 94,
        respiratoryRate: 18,
        pain: 2
      },
      { 
        id: 5, 
        patientId: 4, 
        patientName: 'Emily Chen',
        date: '2025-04-10',
        bp: '110/70',
        pulse: 65,
        temp: 98.4,
        weight: 135,
        height: 63,
        bmi: 23.9,
        oxygenSaturation: 99,
        respiratoryRate: 14,
        pain: 3
      },
    ];
    
    setPatients(mockPatients);
    setNotes(mockNotes);
    setOrders(mockOrders);
    setVitals(mockVitals);
    setLoading(false);
  }, []);
  
  // Add a new patient
  const addPatient = (patient) => {
    const newPatient = {
      id: patients.length + 1,
      ...patient
    };
    setPatients([...patients, newPatient]);
    return newPatient;
  };
  
  // Get a patient by ID
  const getPatient = (id) => {
    return patients.find(patient => patient.id === parseInt(id));
  };
  
  // Add a new note
  const addNote = (note) => {
    const newNote = {
      id: notes.length + 1,
      ...note
    };
    setNotes([...notes, newNote]);
    return newNote;
  };
  
  // Get notes for a patient
  const getPatientNotes = (patientId) => {
    return notes.filter(note => note.patientId === parseInt(patientId));
  };
  
  // Add a new order
  const addOrder = (order) => {
    const newOrder = {
      id: orders.length + 1,
      ...order
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };
  
  // Get orders for a patient
  const getPatientOrders = (patientId) => {
    return orders.filter(order => order.patientId === parseInt(patientId));
  };
  
  // Add new vitals
  const addVitals = (vitalsData) => {
    const newVitals = {
      id: vitals.length + 1,
      ...vitalsData
    };
    setVitals([...vitals, newVitals]);
    return newVitals;
  };
  
  // Get vitals for a patient
  const getPatientVitals = (patientId) => {
    return vitals.filter(v => v.patientId === parseInt(patientId));
  };
  
  const value = {
    patients,
    notes,
    orders,
    vitals,
    loading,
    addPatient,
    getPatient,
    addNote,
    getPatientNotes,
    addOrder,
    getPatientOrders,
    addVitals,
    getPatientVitals
  };
  
  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

// Custom hook to use the patient context
export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}