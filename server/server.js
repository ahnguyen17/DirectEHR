import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const VITALS_FILE = path.join(DATA_DIR, 'vitals.json');
const LAB_TESTS_FILE = path.join(DATA_DIR, 'lab_tests.json');
const LAB_RESULTS_FILE = path.join(DATA_DIR, 'lab_results.json');
const DIAGNOSTICS_FILE = path.join(DATA_DIR, 'diagnostics.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log(`Data directory created at ${DATA_DIR}`);
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Initialize data files with default data if they don't exist
async function initializeDataFile(filePath, defaultData) {
  try {
    await fs.access(filePath);
    console.log(`Data file exists: ${filePath}`);
  } catch (error) {
    // File doesn't exist, create it with default data
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    console.log(`Created data file: ${filePath}`);
  }
}

// Initialize all data files
async function initializeData() {
  await ensureDataDir();
  
  // Default data (empty arrays for now, will be populated on first request if empty)
  const defaultData = [];
  
  await initializeDataFile(PATIENTS_FILE, defaultData);
  await initializeDataFile(NOTES_FILE, defaultData);
  await initializeDataFile(ORDERS_FILE, defaultData);
  await initializeDataFile(VITALS_FILE, defaultData);
  await initializeDataFile(LAB_TESTS_FILE, defaultData);
  await initializeDataFile(LAB_RESULTS_FILE, defaultData);
  await initializeDataFile(DIAGNOSTICS_FILE, defaultData);
}

// Helper function to read data from a file
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
}

// Helper function to write data to a file
async function writeData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    return false;
  }
}

// Generate a new ID for an entity
function generateId(items) {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// API Routes

// Patients
app.get('/api/patients', async (req, res) => {
  const patients = await readData(PATIENTS_FILE);
  res.json(patients);
});

app.get('/api/patients/:id', async (req, res) => {
  const patients = await readData(PATIENTS_FILE);
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  res.json(patient);
});

app.post('/api/patients', async (req, res) => {
  const patients = await readData(PATIENTS_FILE);
  const newPatient = {
    id: generateId(patients),
    ...req.body
  };
  
  patients.push(newPatient);
  await writeData(PATIENTS_FILE, patients);
  
  res.status(201).json(newPatient);
});

app.put('/api/patients/:id', async (req, res) => {
  const patients = await readData(PATIENTS_FILE);
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  const updatedPatient = {
    ...patients[index],
    ...req.body,
    id: parseInt(req.params.id) // Ensure ID doesn't change
  };
  
  patients[index] = updatedPatient;
  await writeData(PATIENTS_FILE, patients);
  
  res.json(updatedPatient);
});

app.delete('/api/patients/:id', async (req, res) => {
  const patients = await readData(PATIENTS_FILE);
  const filteredPatients = patients.filter(p => p.id !== parseInt(req.params.id));
  
  if (filteredPatients.length === patients.length) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  await writeData(PATIENTS_FILE, filteredPatients);
  res.json({ message: 'Patient deleted successfully' });
});

// Notes
app.get('/api/notes', async (req, res) => {
  const notes = await readData(NOTES_FILE);
  res.json(notes);
});

app.get('/api/patients/:patientId/notes', async (req, res) => {
  const notes = await readData(NOTES_FILE);
  const patientNotes = notes.filter(note => note.patientId === parseInt(req.params.patientId));
  res.json(patientNotes);
});

app.post('/api/notes', async (req, res) => {
  const notes = await readData(NOTES_FILE);
  const newNote = {
    id: generateId(notes),
    ...req.body
  };
  
  notes.push(newNote);
  await writeData(NOTES_FILE, notes);
  
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', async (req, res) => {
  const notes = await readData(NOTES_FILE);
  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  const updatedNote = {
    ...notes[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  notes[index] = updatedNote;
  await writeData(NOTES_FILE, notes);
  
  res.json(updatedNote);
});

app.delete('/api/notes/:id', async (req, res) => {
  const notes = await readData(NOTES_FILE);
  const filteredNotes = notes.filter(n => n.id !== parseInt(req.params.id));
  
  if (filteredNotes.length === notes.length) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  await writeData(NOTES_FILE, filteredNotes);
  res.json({ message: 'Note deleted successfully' });
});

// Orders
app.get('/api/orders', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  res.json(orders);
});

app.get('/api/patients/:patientId/orders', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const patientOrders = orders.filter(order => order.patientId === parseInt(req.params.patientId));
  res.json(patientOrders);
});

app.post('/api/orders', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const newOrder = {
    id: generateId(orders),
    ...req.body
  };
  
  orders.push(newOrder);
  await writeData(ORDERS_FILE, orders);
  
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  const updatedOrder = {
    ...orders[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  orders[index] = updatedOrder;
  await writeData(ORDERS_FILE, orders);
  
  res.json(updatedOrder);
});

app.delete('/api/orders/:id', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const filteredOrders = orders.filter(o => o.id !== parseInt(req.params.id));
  
  if (filteredOrders.length === orders.length) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  await writeData(ORDERS_FILE, filteredOrders);
  res.json({ message: 'Order deleted successfully' });
});

// Vitals
app.get('/api/vitals', async (req, res) => {
  const vitals = await readData(VITALS_FILE);
  res.json(vitals);
});

app.get('/api/patients/:patientId/vitals', async (req, res) => {
  const vitals = await readData(VITALS_FILE);
  const patientVitals = vitals.filter(vital => vital.patientId === parseInt(req.params.patientId));
  res.json(patientVitals);
});

app.post('/api/vitals', async (req, res) => {
  const vitals = await readData(VITALS_FILE);
  const newVitals = {
    id: generateId(vitals),
    ...req.body
  };
  
  vitals.push(newVitals);
  await writeData(VITALS_FILE, vitals);
  
  res.status(201).json(newVitals);
});

app.put('/api/vitals/:id', async (req, res) => {
  const vitals = await readData(VITALS_FILE);
  const index = vitals.findIndex(v => v.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Vitals record not found' });
  }
  
  const updatedVitals = {
    ...vitals[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  vitals[index] = updatedVitals;
  await writeData(VITALS_FILE, vitals);
  
  res.json(updatedVitals);
});

app.delete('/api/vitals/:id', async (req, res) => {
  const vitals = await readData(VITALS_FILE);
  const filteredVitals = vitals.filter(v => v.id !== parseInt(req.params.id));
  
  if (filteredVitals.length === vitals.length) {
    return res.status(404).json({ message: 'Vitals record not found' });
  }
  
  await writeData(VITALS_FILE, filteredVitals);
  res.json({ message: 'Vitals record deleted successfully' });
});

// Lab Tests
app.get('/api/lab-tests', async (req, res) => {
  const labTests = await readData(LAB_TESTS_FILE);
  res.json(labTests);
});

app.post('/api/lab-tests', async (req, res) => {
  const labTests = await readData(LAB_TESTS_FILE);
  const newLabTest = {
    id: generateId(labTests),
    ...req.body
  };
  
  labTests.push(newLabTest);
  await writeData(LAB_TESTS_FILE, labTests);
  
  res.status(201).json(newLabTest);
});

app.put('/api/lab-tests/:id', async (req, res) => {
  const labTests = await readData(LAB_TESTS_FILE);
  const index = labTests.findIndex(lt => lt.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Lab test not found' });
  }
  
  const updatedLabTest = {
    ...labTests[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  labTests[index] = updatedLabTest;
  await writeData(LAB_TESTS_FILE, labTests);
  
  res.json(updatedLabTest);
});

// Lab Results
app.get('/api/lab-results', async (req, res) => {
  const labResults = await readData(LAB_RESULTS_FILE);
  res.json(labResults);
});

app.get('/api/patients/:patientId/lab-results', async (req, res) => {
  const labResults = await readData(LAB_RESULTS_FILE);
  const patientLabResults = labResults.filter(result => result.patientId === parseInt(req.params.patientId));
  res.json(patientLabResults);
});

app.post('/api/lab-results', async (req, res) => {
  const labResults = await readData(LAB_RESULTS_FILE);
  const newLabResult = {
    id: generateId(labResults),
    ...req.body
  };
  
  labResults.push(newLabResult);
  await writeData(LAB_RESULTS_FILE, labResults);
  
  res.status(201).json(newLabResult);
});

app.put('/api/lab-results/:id', async (req, res) => {
  const labResults = await readData(LAB_RESULTS_FILE);
  const index = labResults.findIndex(lr => lr.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Lab result not found' });
  }
  
  const updatedLabResult = {
    ...labResults[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  labResults[index] = updatedLabResult;
  await writeData(LAB_RESULTS_FILE, labResults);
  
  res.json(updatedLabResult);
});

// Diagnostics
app.get('/api/diagnostics', async (req, res) => {
  const diagnostics = await readData(DIAGNOSTICS_FILE);
  res.json(diagnostics);
});

app.get('/api/patients/:patientId/diagnostics', async (req, res) => {
  const diagnostics = await readData(DIAGNOSTICS_FILE);
  const patientDiagnostics = diagnostics.filter(diagnostic => diagnostic.patientId === parseInt(req.params.patientId));
  res.json(patientDiagnostics);
});

app.post('/api/diagnostics', async (req, res) => {
  const diagnostics = await readData(DIAGNOSTICS_FILE);
  const newDiagnostic = {
    id: generateId(diagnostics),
    ...req.body
  };
  
  diagnostics.push(newDiagnostic);
  await writeData(DIAGNOSTICS_FILE, diagnostics);
  
  res.status(201).json(newDiagnostic);
});

app.put('/api/diagnostics/:id', async (req, res) => {
  const diagnostics = await readData(DIAGNOSTICS_FILE);
  const index = diagnostics.findIndex(d => d.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Diagnostic not found' });
  }
  
  const updatedDiagnostic = {
    ...diagnostics[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  diagnostics[index] = updatedDiagnostic;
  await writeData(DIAGNOSTICS_FILE, diagnostics);
  
  res.json(updatedDiagnostic);
});

app.delete('/api/diagnostics/:id', async (req, res) => {
  const diagnostics = await readData(DIAGNOSTICS_FILE);
  const filteredDiagnostics = diagnostics.filter(d => d.id !== parseInt(req.params.id));
  
  if (filteredDiagnostics.length === diagnostics.length) {
    return res.status(404).json({ message: 'Diagnostic not found' });
  }
  
  await writeData(DIAGNOSTICS_FILE, filteredDiagnostics);
  res.json({ message: 'Diagnostic deleted successfully' });
});

// Initialize data and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize data:', error);
});
