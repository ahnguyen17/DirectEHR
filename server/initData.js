import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const VITALS_FILE = path.join(DATA_DIR, 'vitals.json');
const LAB_TESTS_FILE = path.join(DATA_DIR, 'lab_tests.json');
const LAB_RESULTS_FILE = path.join(DATA_DIR, 'lab_results.json');
const DIAGNOSTICS_FILE = path.join(DATA_DIR, 'diagnostics.json');

// Default data
const defaultPatients = [
  { id: 1, name: 'James Wilson', dob: '1980-05-15', gender: 'Male', mrn: 'MRN123456', address: '123 Main St, Anytown, USA', phone: '(555) 123-4567' },
  { id: 2, name: 'Sarah Johnson', dob: '1993-08-21', gender: 'Female', mrn: 'MRN789012', address: '456 Oak Ave, Somecity, USA', phone: '(555) 234-5678' },
  { id: 3, name: 'Robert Davis', dob: '1958-12-03', gender: 'Male', mrn: 'MRN345678', address: '789 Pine Rd, Otherville, USA', phone: '(555) 345-6789' },
  { id: 4, name: 'Emily Chen', dob: '1987-04-10', gender: 'Female', mrn: 'MRN901234', address: '101 Cedar St, Newtown, USA', phone: '(555) 456-7890' }
];

const defaultNotes = [
  {
    id: 1,
    patientId: 1,
    patientName: 'James Wilson',
    date: '2025-04-30',
    title: 'Initial Consultation',
    content: 'Patient presents with elevated blood pressure. Discussed lifestyle modifications and medication options.',
    provider: 'Dr. Smith'
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'James Wilson',
    date: '2025-04-15',
    title: 'Follow-up Visit',
    content: 'Blood pressure improved. Continue current medication regimen.',
    provider: 'Dr. Smith'
  },
  {
    id: 3,
    patientId: 2,
    patientName: 'Sarah Johnson',
    date: '2025-04-22',
    title: 'Annual Physical',
    content: 'Patient is in good health. Recommended routine blood work.',
    provider: 'Dr. Johnson'
  }
];

const defaultOrders = [
  {
    id: 1,
    patientId: 1,
    patientName: 'James Wilson',
    date: '2025-04-30',
    type: 'Blood Test',
    status: 'Pending',
    dueDate: '2025-05-10',
    details: 'Comprehensive metabolic panel and A1C'
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'James Wilson',
    date: '2025-03-15',
    type: 'Chest X-Ray',
    status: 'Completed',
    completedDate: '2025-03-22',
    results: 'Normal findings, no abnormalities detected'
  },
  {
    id: 3,
    patientId: 2,
    patientName: 'Sarah Johnson',
    date: '2025-04-22',
    type: 'Mammogram',
    status: 'Scheduled',
    dueDate: '2025-05-15',
    details: 'Routine screening'
  }
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
    date: '2025-04-15',
    bp: '130/85',
    pulse: 75,
    temp: 98.8,
    weight: 182,
    height: 70,
    bmi: 26.1,
    oxygenSaturation: 97,
    respiratoryRate: 18,
    pain: 1
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
  }
];

const defaultLabTests = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology' },
  { id: 2, name: 'Basic Metabolic Panel', category: 'Chemistry' },
  { id: 3, name: 'Lipid Panel', category: 'Chemistry' },
  { id: 4, name: 'Hemoglobin A1C', category: 'Endocrinology' },
  { id: 5, name: 'Thyroid Stimulating Hormone (TSH)', category: 'Endocrinology' },
  { id: 6, name: 'Liver Function Tests', category: 'Chemistry' },
  { id: 7, name: 'Urinalysis', category: 'Urology' }
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

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log(`Data directory created at ${DATA_DIR}`);
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Initialize data files with default data
async function initializeDataFile(filePath, defaultData) {
  try {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    console.log(`Created data file: ${filePath}`);
  } catch (error) {
    console.error(`Error creating data file ${filePath}:`, error);
  }
}

// Initialize all data files
async function initializeData() {
  await ensureDataDir();
  
  await initializeDataFile(PATIENTS_FILE, defaultPatients);
  await initializeDataFile(NOTES_FILE, defaultNotes);
  await initializeDataFile(ORDERS_FILE, defaultOrders);
  await initializeDataFile(VITALS_FILE, defaultVitals);
  await initializeDataFile(LAB_TESTS_FILE, defaultLabTests);
  await initializeDataFile(LAB_RESULTS_FILE, defaultLabResults);
  await initializeDataFile(DIAGNOSTICS_FILE, defaultDiagnostics);
  
  console.log('All data files initialized with default data');
}

// Run the initialization
initializeData().catch(error => {
  console.error('Failed to initialize data:', error);
});
