import { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const PatientContext = createContext();

// Default mock data
const defaultPatients = [
  { id: 1, name: 'James Wilson', dob: '1980-05-15', gender: 'Male', mrn: 'MRN123456', address: '123 Main St, Anytown, USA', phone: '(555) 123-4567' },
  { id: 2, name: 'Sarah Johnson', dob: '1993-08-21', gender: 'Female', mrn: 'MRN789012', address: '456 Oak Ave, Somecity, USA', phone: '(555) 234-5678' },
  { id: 3, name: 'Robert Davis', dob: '1958-12-03', gender: 'Male', mrn: 'MRN345678', address: '789 Pine Rd, Otherville, USA', phone: '(555) 345-6789' },
  { id: 4, name: 'Emily Chen', dob: '1987-04-10', gender: 'Female', mrn: 'MRN901234', address: '101 Cedar St, Newtown, USA', phone: '(555) 456-7890' },
  { id: 5, name: 'Michael Thompson', dob: '1975-06-22', gender: 'Male', mrn: 'MRN567890', address: '202 Maple Dr, Lastcity, USA', phone: '(555) 567-8901' },
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

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        // Load patients
        const storedPatients = localStorage.getItem('ehr_patients');
        const parsedPatients = storedPatients ? JSON.parse(storedPatients) : defaultPatients;
        setPatients(parsedPatients);

        // Load notes
        const storedNotes = localStorage.getItem('ehr_notes');
        const parsedNotes = storedNotes ? JSON.parse(storedNotes) : defaultNotes;
        setNotes(parsedNotes);

        // Load orders
        const storedOrders = localStorage.getItem('ehr_orders');
        const parsedOrders = storedOrders ? JSON.parse(storedOrders) : defaultOrders;
        setOrders(parsedOrders);

        // Load vitals
        const storedVitals = localStorage.getItem('ehr_vitals');
        const parsedVitals = storedVitals ? JSON.parse(storedVitals) : defaultVitals;
        setVitals(parsedVitals);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
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

  // Save data to localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Add a new patient
  const addPatient = (patient) => {
    const newPatient = {
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
      ...patient
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    saveToLocalStorage('ehr_patients', updatedPatients);
    return newPatient;
  };

  // Get a patient by ID
  const getPatient = (id) => {
    return patients.find(patient => patient.id === parseInt(id));
  };

  // Update a patient
  const updatePatient = (id, updatedData) => {
    const updatedPatients = patients.map(patient =>
      patient.id === parseInt(id) ? { ...patient, ...updatedData } : patient
    );
    setPatients(updatedPatients);
    saveToLocalStorage('ehr_patients', updatedPatients);
    return getPatient(id);
  };

  // Delete a patient
  const deletePatient = (id) => {
    const updatedPatients = patients.filter(patient => patient.id !== parseInt(id));
    setPatients(updatedPatients);
    saveToLocalStorage('ehr_patients', updatedPatients);
  };

  // Add a new note
  const addNote = (note) => {
    const newNote = {
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      ...note
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveToLocalStorage('ehr_notes', updatedNotes);
    return newNote;
  };

  // Get notes for a patient
  const getPatientNotes = (patientId) => {
    return notes.filter(note => note.patientId === parseInt(patientId));
  };

  // Update a note
  const updateNote = (id, updatedData) => {
    const updatedNotes = notes.map(note =>
      note.id === parseInt(id) ? { ...note, ...updatedData } : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage('ehr_notes', updatedNotes);
    return notes.find(note => note.id === parseInt(id));
  };

  // Delete a note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== parseInt(id));
    setNotes(updatedNotes);
    saveToLocalStorage('ehr_notes', updatedNotes);
  };

  // Add a new order
  const addOrder = (order) => {
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...order
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveToLocalStorage('ehr_orders', updatedOrders);
    return newOrder;
  };

  // Get orders for a patient
  const getPatientOrders = (patientId) => {
    return orders.filter(order => order.patientId === parseInt(patientId));
  };

  // Update an order
  const updateOrder = (id, updatedData) => {
    const updatedOrders = orders.map(order =>
      order.id === parseInt(id) ? { ...order, ...updatedData } : order
    );
    setOrders(updatedOrders);
    saveToLocalStorage('ehr_orders', updatedOrders);
    return orders.find(order => order.id === parseInt(id));
  };

  // Delete an order
  const deleteOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== parseInt(id));
    setOrders(updatedOrders);
    saveToLocalStorage('ehr_orders', updatedOrders);
  };

  // Add new vitals
  const addVitals = (vitalsData) => {
    const newVitals = {
      id: vitals.length > 0 ? Math.max(...vitals.map(v => v.id)) + 1 : 1,
      ...vitalsData
    };
    const updatedVitals = [...vitals, newVitals];
    setVitals(updatedVitals);
    saveToLocalStorage('ehr_vitals', updatedVitals);
    return newVitals;
  };

  // Get vitals for a patient
  const getPatientVitals = (patientId) => {
    return vitals.filter(v => v.patientId === parseInt(patientId));
  };

  // Update vitals
  const updateVitals = (id, updatedData) => {
    const updatedVitalsArray = vitals.map(v =>
      v.id === parseInt(id) ? { ...v, ...updatedData } : v
    );
    setVitals(updatedVitalsArray);
    saveToLocalStorage('ehr_vitals', updatedVitalsArray);
    return vitals.find(v => v.id === parseInt(id));
  };

  // Delete vitals
  const deleteVitals = (id) => {
    const updatedVitals = vitals.filter(v => v.id !== parseInt(id));
    setVitals(updatedVitals);
    saveToLocalStorage('ehr_vitals', updatedVitals);
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