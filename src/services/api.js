// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function with error handling
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Patient API functions
export const patientApi = {
  // Get all patients
  getAll: () => apiRequest('/patients'),
  
  // Get a patient by ID
  getById: (id) => apiRequest(`/patients/${id}`),
  
  // Create a new patient
  create: (patient) => apiRequest('/patients', 'POST', patient),
  
  // Update a patient
  update: (id, patient) => apiRequest(`/patients/${id}`, 'PUT', patient),
  
  // Delete a patient
  delete: (id) => apiRequest(`/patients/${id}`, 'DELETE'),
};

// Notes API functions
export const noteApi = {
  // Get all notes
  getAll: () => apiRequest('/notes'),
  
  // Get notes for a patient
  getByPatientId: (patientId) => apiRequest(`/patients/${patientId}/notes`),
  
  // Create a new note
  create: (note) => apiRequest('/notes', 'POST', note),
  
  // Update a note
  update: (id, note) => apiRequest(`/notes/${id}`, 'PUT', note),
  
  // Delete a note
  delete: (id) => apiRequest(`/notes/${id}`, 'DELETE'),
};

// Orders API functions
export const orderApi = {
  // Get all orders
  getAll: () => apiRequest('/orders'),
  
  // Get orders for a patient
  getByPatientId: (patientId) => apiRequest(`/patients/${patientId}/orders`),
  
  // Create a new order
  create: (order) => apiRequest('/orders', 'POST', order),
  
  // Update an order
  update: (id, order) => apiRequest(`/orders/${id}`, 'PUT', order),
  
  // Delete an order
  delete: (id) => apiRequest(`/orders/${id}`, 'DELETE'),
};

// Vitals API functions
export const vitalApi = {
  // Get all vitals
  getAll: () => apiRequest('/vitals'),
  
  // Get vitals for a patient
  getByPatientId: (patientId) => apiRequest(`/patients/${patientId}/vitals`),
  
  // Create a new vitals record
  create: (vitals) => apiRequest('/vitals', 'POST', vitals),
  
  // Update a vitals record
  update: (id, vitals) => apiRequest(`/vitals/${id}`, 'PUT', vitals),
  
  // Delete a vitals record
  delete: (id) => apiRequest(`/vitals/${id}`, 'DELETE'),
};

// Lab Tests API functions
export const labTestApi = {
  // Get all lab tests
  getAll: () => apiRequest('/lab-tests'),
  
  // Create a new lab test
  create: (labTest) => apiRequest('/lab-tests', 'POST', labTest),
  
  // Update a lab test
  update: (id, labTest) => apiRequest(`/lab-tests/${id}`, 'PUT', labTest),
};

// Lab Results API functions
export const labResultApi = {
  // Get all lab results
  getAll: () => apiRequest('/lab-results'),
  
  // Get lab results for a patient
  getByPatientId: (patientId) => apiRequest(`/patients/${patientId}/lab-results`),
  
  // Create a new lab result
  create: (labResult) => apiRequest('/lab-results', 'POST', labResult),
  
  // Update a lab result
  update: (id, labResult) => apiRequest(`/lab-results/${id}`, 'PUT', labResult),
};

// Diagnostics API functions
export const diagnosticApi = {
  // Get all diagnostics
  getAll: () => apiRequest('/diagnostics'),
  
  // Get diagnostics for a patient
  getByPatientId: (patientId) => apiRequest(`/patients/${patientId}/diagnostics`),
  
  // Create a new diagnostic
  create: (diagnostic) => apiRequest('/diagnostics', 'POST', diagnostic),
  
  // Update a diagnostic
  update: (id, diagnostic) => apiRequest(`/diagnostics/${id}`, 'PUT', diagnostic),
  
  // Delete a diagnostic
  delete: (id) => apiRequest(`/diagnostics/${id}`, 'DELETE'),
};
