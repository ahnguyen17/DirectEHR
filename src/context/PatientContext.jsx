import { createContext, useState, useContext, useEffect } from 'react';
import { patientApi, noteApi, orderApi, vitalApi } from '../services/api';

// Create a context
const PatientContext = createContext();

// Default mock data
const defaultPatients = [
  {
    id: 1,
    name: 'James Wilson',
    dob: '1980-05-15',
    gender: 'Male',
    mrn: 'MRN123456',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    insurance: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS12345678',
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: [
      { condition: 'Hypertension', diagnosedDate: '2018-03-15', status: 'Active', type: 'Medical' },
      { condition: 'Type 2 Diabetes', diagnosedDate: '2019-07-22', status: 'Active', type: 'Medical' },
      { condition: 'Appendectomy', diagnosedDate: '2010-05-10', status: 'Resolved', type: 'Surgical' }
    ],
    familyHistory: [
      { relation: 'Father', condition: 'Hypertension' },
      { relation: 'Mother', condition: 'Type 2 Diabetes' },
      { relation: 'Sister', condition: 'Asthma' }
    ],
    socialHistory: {
      tobaccoUse: 'Never smoker',
      alcoholUse: 'Social drinker, 1-2 drinks per week',
      exercise: 'Moderate, walks 30 minutes 3 times per week',
      diet: 'Follows diabetic diet, low carbohydrate',
      occupation: 'Software Engineer'
    },
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2018-04-01' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2019-08-15' }
    ]
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    dob: '1993-08-21',
    gender: 'Female',
    mrn: 'MRN789012',
    address: '456 Oak Ave, Somecity, USA',
    phone: '(555) 234-5678',
    insurance: 'Aetna',
    policyNumber: 'AET87654321',
    allergies: ['Sulfa drugs'],
    medicalHistory: [
      { condition: 'Asthma', diagnosedDate: '2005-06-12', status: 'Active', type: 'Medical' },
      { condition: 'Knee arthroscopy', diagnosedDate: '2022-02-15', status: 'Resolved', type: 'Surgical' }
    ],
    familyHistory: [
      { relation: 'Mother', condition: 'Breast Cancer' },
      { relation: 'Maternal Grandmother', condition: 'Osteoporosis' }
    ],
    socialHistory: {
      tobaccoUse: 'Never smoker',
      alcoholUse: 'Occasional, 2-3 drinks per month',
      exercise: 'Active, runs 5 miles 3 times per week',
      diet: 'Vegetarian',
      occupation: 'Physical Therapist'
    },
    medications: [
      { name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', startDate: '2005-06-15' }
    ]
  },
  {
    id: 3,
    name: 'Robert Davis',
    dob: '1958-12-03',
    gender: 'Male',
    mrn: 'MRN345678',
    address: '789 Pine Rd, Otherville, USA',
    phone: '(555) 345-6789',
    insurance: 'Medicare',
    policyNumber: 'MED12345678',
    allergies: ['Latex', 'Ibuprofen'],
    medicalHistory: [
      { condition: 'COPD', diagnosedDate: '2010-11-30', status: 'Active', type: 'Medical' },
      { condition: 'Coronary Artery Disease', diagnosedDate: '2015-08-17', status: 'Active', type: 'Medical' },
      { condition: 'Hip Replacement', diagnosedDate: '2018-09-05', status: 'Resolved', type: 'Surgical' }
    ],
    familyHistory: [
      { relation: 'Father', condition: 'Heart Disease, died at 62' },
      { relation: 'Brother', condition: 'COPD' }
    ],
    socialHistory: {
      tobaccoUse: 'Former smoker, quit in 2010, 30 pack-year history',
      alcoholUse: 'None',
      exercise: 'Limited due to COPD, short walks daily',
      diet: 'Low sodium',
      occupation: 'Retired Construction Worker'
    },
    medications: [
      { name: 'Spiriva', dosage: '18mcg', frequency: 'Once daily', startDate: '2010-12-15' },
      { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', startDate: '2015-09-01' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', startDate: '2015-09-01' }
    ]
  },
  {
    id: 4,
    name: 'Emily Chen',
    dob: '1987-04-10',
    gender: 'Female',
    mrn: 'MRN901234',
    address: '101 Cedar St, Newtown, USA',
    phone: '(555) 456-7890',
    insurance: 'United Healthcare',
    policyNumber: 'UHC98765432',
    allergies: [],
    medicalHistory: [
      { condition: 'Migraine', diagnosedDate: '2015-03-22', status: 'Active', type: 'Medical' },
      { condition: 'Anxiety', diagnosedDate: '2018-05-10', status: 'Active', type: 'Medical' }
    ],
    familyHistory: [
      { relation: 'Mother', condition: 'Migraine' },
      { relation: 'Father', condition: 'Hypertension' }
    ],
    socialHistory: {
      tobaccoUse: 'Never smoker',
      alcoholUse: 'Rare, less than 1 drink per month',
      exercise: 'Yoga 2 times per week',
      diet: 'Balanced, avoids triggers for migraines',
      occupation: 'Graphic Designer'
    },
    medications: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraine', startDate: '2015-04-05' },
      { name: 'Propranolol', dosage: '20mg', frequency: 'Twice daily', startDate: '2015-05-10' }
    ]
  },
  {
    id: 5,
    name: 'Michael Thompson',
    dob: '1975-06-22',
    gender: 'Male',
    mrn: 'MRN567890',
    address: '202 Maple Dr, Lastcity, USA',
    phone: '(555) 567-8901',
    insurance: 'Cigna',
    policyNumber: 'CIG45678901',
    allergies: ['Codeine'],
    medicalHistory: [
      { condition: 'Mitral Valve Regurgitation', diagnosedDate: '2020-02-10', status: 'Active', type: 'Medical' },
      { condition: 'Appendectomy', diagnosedDate: '1995-08-15', status: 'Resolved', type: 'Surgical' }
    ],
    familyHistory: [
      { relation: 'Father', condition: 'Heart Valve Disease' },
      { relation: 'Paternal Grandfather', condition: 'Heart Failure' }
    ],
    socialHistory: {
      tobaccoUse: 'Never smoker',
      alcoholUse: 'Moderate, 5-6 drinks per week',
      exercise: 'Regular, gym 3 times per week',
      diet: 'Mediterranean diet',
      occupation: 'High School Teacher'
    },
    medications: [
      { name: 'Lisinopril', dosage: '5mg', frequency: 'Once daily', startDate: '2020-03-01' }
    ]
  },
];

const defaultNotes = [
  { id: 1, patientId: 1, patientName: 'James Wilson', date: '2025-04-30', title: 'Routine Check-up', content: 'Patient presents for routine follow-up for hypertension and diabetes. Both conditions appear well-controlled with current medication regimen. Blood pressure is 125/82, which is within target range. A1C is 6.7%, showing good glycemic control.' },
  { id: 2, patientId: 1, patientName: 'James Wilson', date: '2025-03-15', title: 'Medication Review', content: 'Reviewed current medications with patient. No reported side effects from Lisinopril or Metformin. Patient reports taking medications as prescribed. Refilled both medications for 90 days.' },
  { id: 3, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-22', title: 'Annual Physical', content: 'Patient presents for annual physical examination. Overall in good health. Blood pressure 118/75, pulse 68, temperature 98.6. All systems reviewed with no concerning findings. Recommended continued exercise regimen and healthy diet.' },
  { id: 4, patientId: 3, patientName: 'Robert Davis', date: '2025-04-15', title: 'Follow-up Visit', content: 'Follow-up for COPD. Patient reports slight improvement in breathing with new inhaler. Still experiences shortness of breath with moderate exertion. Oxygen saturation 94% at rest. Discussed smoking cessation strategies.' },
  { id: 5, patientId: 4, patientName: 'Emily Chen', date: '2025-04-10', title: 'New Patient Visit', content: 'Initial consultation with new patient. Medical history taken. Patient reports occasional migraine headaches, otherwise healthy. Family history significant for hypertension and diabetes. Created care plan for migraine management.' },
];

const defaultOrders = [
  { id: 1, patientId: 1, patientName: 'James Wilson', date: '2025-04-30', type: 'Laboratory Test', status: 'Pending', dueDate: '2025-05-10', details: 'Comprehensive metabolic panel and A1C' },
  { id: 2, patientId: 1, patientName: 'James Wilson', date: '2025-03-15', type: 'Imaging', status: 'Completed', completedDate: '2025-03-22', results: 'Chest X-Ray: Normal findings, no abnormalities detected' },
  { id: 3, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-22', type: 'Imaging', status: 'Scheduled', dueDate: '2025-05-15', details: 'MRI - Right Knee: Evaluate for meniscus tear' },
  { id: 4, patientId: 3, patientName: 'Robert Davis', date: '2025-04-15', type: 'Imaging', status: 'Completed', completedDate: '2025-04-20', results: 'CT Scan - Chest: Stable COPD, no acute findings' },
  { id: 5, patientId: 4, patientName: 'Emily Chen', date: '2025-04-10', type: 'Medication', status: 'Active', details: 'Sumatriptan 50mg, as needed for migraines, 9 tablets, 3 refills' },
  { id: 6, patientId: 5, patientName: 'Michael Thompson', date: '2025-04-05', type: 'Procedure', status: 'Pending', dueDate: '2025-05-05', details: 'Echocardiogram: Follow-up for mitral valve regurgitation' },
  { id: 7, patientId: 2, patientName: 'Sarah Johnson', date: '2025-04-01', type: 'Laboratory Test', status: 'Completed', completedDate: '2025-04-03', results: 'CBC: Within normal limits' },
];

const defaultVitals = [
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

// Create a provider component
export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [notes, setNotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on initial render
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load patients
        const patientsData = await patientApi.getAll();
        setPatients(patientsData.length > 0 ? patientsData : defaultPatients);

        // Load notes
        const notesData = await noteApi.getAll();
        setNotes(notesData.length > 0 ? notesData : defaultNotes);

        // Load orders
        const ordersData = await orderApi.getAll();
        setOrders(ordersData.length > 0 ? ordersData : defaultOrders);

        // Load vitals
        const vitalsData = await vitalApi.getAll();
        setVitals(vitalsData.length > 0 ? vitalsData : defaultVitals);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data from API:', error);
        // Fallback to default data if there's an error
        setPatients(defaultPatients);
        setNotes(defaultNotes);
        setOrders(defaultOrders);
        setVitals(defaultVitals);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Add a new patient
  const addPatient = async (patient) => {
    try {
      const newPatient = await patientApi.create(patient);
      setPatients([...patients, newPatient]);
      return newPatient;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };

  // Get a patient by ID
  const getPatient = async (id) => {
    try {
      // First check if we have it in state
      const cachedPatient = patients.find(patient => patient.id === parseInt(id));
      if (cachedPatient) return cachedPatient;

      // If not, fetch from API
      return await patientApi.getById(id);
    } catch (error) {
      console.error(`Error getting patient ${id}:`, error);
      throw error;
    }
  };

  // Update a patient
  const updatePatient = async (id, updatedData) => {
    try {
      const updatedPatient = await patientApi.update(id, updatedData);
      setPatients(patients.map(patient =>
        patient.id === parseInt(id) ? updatedPatient : patient
      ));
      return updatedPatient;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  };

  // Delete a patient
  const deletePatient = async (id) => {
    try {
      await patientApi.delete(id);
      setPatients(patients.filter(patient => patient.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  };

  // Add a new note
  const addNote = async (note) => {
    try {
      const newNote = await noteApi.create(note);
      setNotes([...notes, newNote]);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  // Get notes for a patient
  const getPatientNotes = async (patientId) => {
    try {
      // First check if we have them in state
      const cachedNotes = notes.filter(note => note.patientId === parseInt(patientId));
      if (cachedNotes.length > 0) return cachedNotes;

      // If not, fetch from API
      return await noteApi.getByPatientId(patientId);
    } catch (error) {
      console.error(`Error getting notes for patient ${patientId}:`, error);
      throw error;
    }
  };

  // Update a note
  const updateNote = async (id, updatedData) => {
    try {
      const updatedNote = await noteApi.update(id, updatedData);
      setNotes(notes.map(note =>
        note.id === parseInt(id) ? updatedNote : note
      ));
      return updatedNote;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      throw error;
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await noteApi.delete(id);
      setNotes(notes.filter(note => note.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      throw error;
    }
  };

  // Add a new order
  const addOrder = async (order) => {
    try {
      const newOrder = await orderApi.create(order);
      setOrders([...orders, newOrder]);
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  // Get orders for a patient
  const getPatientOrders = async (patientId) => {
    try {
      // First check if we have them in state
      const cachedOrders = orders.filter(order => order.patientId === parseInt(patientId));
      if (cachedOrders.length > 0) return cachedOrders;

      // If not, fetch from API
      return await orderApi.getByPatientId(patientId);
    } catch (error) {
      console.error(`Error getting orders for patient ${patientId}:`, error);
      throw error;
    }
  };

  // Update an order
  const updateOrder = async (id, updatedData) => {
    try {
      const updatedOrder = await orderApi.update(id, updatedData);
      setOrders(orders.map(order =>
        order.id === parseInt(id) ? updatedOrder : order
      ));
      return updatedOrder;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  };

  // Delete an order
  const deleteOrder = async (id) => {
    try {
      await orderApi.delete(id);
      setOrders(orders.filter(order => order.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  };

  // Add new vitals
  const addVitals = async (vitalsData) => {
    try {
      const newVitals = await vitalApi.create(vitalsData);
      setVitals([...vitals, newVitals]);
      return newVitals;
    } catch (error) {
      console.error('Error adding vitals:', error);
      throw error;
    }
  };

  // Get vitals for a patient
  const getPatientVitals = async (patientId) => {
    try {
      // First check if we have them in state
      const cachedVitals = vitals.filter(v => v.patientId === parseInt(patientId));
      if (cachedVitals.length > 0) return cachedVitals;

      // If not, fetch from API
      return await vitalApi.getByPatientId(patientId);
    } catch (error) {
      console.error(`Error getting vitals for patient ${patientId}:`, error);
      throw error;
    }
  };

  // Update vitals
  const updateVitals = async (id, updatedData) => {
    try {
      const updatedVitals = await vitalApi.update(id, updatedData);
      setVitals(vitals.map(v =>
        v.id === parseInt(id) ? updatedVitals : v
      ));
      return updatedVitals;
    } catch (error) {
      console.error(`Error updating vitals ${id}:`, error);
      throw error;
    }
  };

  // Delete vitals
  const deleteVitals = async (id) => {
    try {
      await vitalApi.delete(id);
      setVitals(vitals.filter(v => v.id !== parseInt(id)));
    } catch (error) {
      console.error(`Error deleting vitals ${id}:`, error);
      throw error;
    }
  };

  const value = {
    patients,
    notes,
    orders,
    vitals,
    loading,
    addPatient,
    getPatient,
    updatePatient,
    deletePatient,
    addNote,
    getPatientNotes,
    updateNote,
    deleteNote,
    addOrder,
    getPatientOrders,
    updateOrder,
    deleteOrder,
    addVitals,
    getPatientVitals,
    updateVitals,
    deleteVitals
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

// Custom hook to use the patient context
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}