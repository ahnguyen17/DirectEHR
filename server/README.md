# EHR Application Backend Server

This is the backend server for the Electronic Health Record (EHR) application. It provides a REST API for data persistence.

## Features

- RESTful API for patients, notes, orders, vitals, lab tests, lab results, and diagnostics
- JSON file-based data storage
- CORS support for cross-origin requests
- Simple and lightweight implementation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Initialize the data files with default data (optional):
   ```
   node initData.js
   ```

## Running the Server

Start the server in development mode with automatic restart on file changes:
```
npm run dev
```

Or start the server in production mode:
```
npm start
```

The server will run on port 5000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Patients

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get a patient by ID
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/patients/:patientId/notes` - Get notes for a patient
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/patients/:patientId/orders` - Get orders for a patient
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

### Vitals

- `GET /api/vitals` - Get all vitals
- `GET /api/patients/:patientId/vitals` - Get vitals for a patient
- `POST /api/vitals` - Create a new vitals record
- `PUT /api/vitals/:id` - Update a vitals record
- `DELETE /api/vitals/:id` - Delete a vitals record

### Lab Tests

- `GET /api/lab-tests` - Get all lab tests
- `POST /api/lab-tests` - Create a new lab test
- `PUT /api/lab-tests/:id` - Update a lab test

### Lab Results

- `GET /api/lab-results` - Get all lab results
- `GET /api/patients/:patientId/lab-results` - Get lab results for a patient
- `POST /api/lab-results` - Create a new lab result
- `PUT /api/lab-results/:id` - Update a lab result

### Diagnostics

- `GET /api/diagnostics` - Get all diagnostics
- `GET /api/patients/:patientId/diagnostics` - Get diagnostics for a patient
- `POST /api/diagnostics` - Create a new diagnostic
- `PUT /api/diagnostics/:id` - Update a diagnostic
- `DELETE /api/diagnostics/:id` - Delete a diagnostic

## Data Storage

The server stores data in JSON files in the `data` directory:

- `patients.json` - Patient data
- `notes.json` - Clinical notes
- `orders.json` - Medical orders
- `vitals.json` - Vital signs
- `lab_tests.json` - Lab test definitions
- `lab_results.json` - Lab test results
- `diagnostics.json` - Patient diagnoses

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses include a JSON object with a `message` field describing the error.
