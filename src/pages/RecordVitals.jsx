import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export default function RecordVitals() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, addVitals } = usePatient();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdParam = queryParams.get('patientId');

  const [vitals, setVitals] = useState({
    patientId: patientIdParam ? parseInt(patientIdParam) : '',
    date: new Date().toISOString().split('T')[0],
    bp: '',
    pulse: '',
    temp: '',
    weight: '',
    height: '',
    bmi: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    pain: '0'
  });

  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (vitals.patientId) {
      const patient = patients.find(p => p.id === parseInt(vitals.patientId));
      setSelectedPatient(patient);
      if (patient) {
        setVitals(prev => ({
          ...prev,
          patientName: patient.name
        }));
      }
    }
  }, [vitals.patientId, patients]);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (vitals.weight && vitals.height) {
      // BMI formula: weight (kg) / (height (m))^2
      // Convert weight from pounds to kg
      const weightInKg = parseFloat(vitals.weight) * 0.453592;
      // Convert height from inches to meters
      const heightInM = parseFloat(vitals.height) * 0.0254;

      if (weightInKg > 0 && heightInM > 0) {
        const bmi = (weightInKg / (heightInM * heightInM)).toFixed(1);
        setVitals(prev => ({
          ...prev,
          bmi
        }));
      }
    }
  }, [vitals.weight, vitals.height]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals({
      ...vitals,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vitals.patientId) {
      alert('Please select a patient');
      return;
    }

    // Format numeric fields
    const formattedVitals = {
      ...vitals,
      patientId: parseInt(vitals.patientId),
      pulse: vitals.pulse ? parseInt(vitals.pulse) : null,
      temp: vitals.temp ? parseFloat(vitals.temp) : null,
      weight: vitals.weight ? parseFloat(vitals.weight) : null,
      height: vitals.height ? parseFloat(vitals.height) : null,
      bmi: vitals.bmi ? parseFloat(vitals.bmi) : null,
      oxygenSaturation: vitals.oxygenSaturation ? parseInt(vitals.oxygenSaturation) : null,
      respiratoryRate: vitals.respiratoryRate ? parseInt(vitals.respiratoryRate) : null,
      pain: vitals.pain ? parseInt(vitals.pain) : 0
    };

    // Add the vitals
    addVitals(formattedVitals);

    // Navigate to the patient detail page or vitals page
    if (patientIdParam) {
      navigate(`/patients/${patientIdParam}`);
    } else {
      navigate('/vitals');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Record Vitals</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Patient Selection */}
          <div className="md:col-span-2">
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
            <select
              id="patientId"
              name="patientId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={vitals.patientId}
              onChange={handleChange}
              required
              disabled={!!patientIdParam}
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (DOB: {new Date(patient.dob).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={vitals.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Blood Pressure */}
            <div>
              <label htmlFor="bp" className="block text-sm font-medium text-gray-700">Blood Pressure</label>
              <input
                type="text"
                id="bp"
                name="bp"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.bp}
                onChange={handleChange}
                placeholder="120/80"
              />
              <p className="mt-1 text-xs text-gray-500">Format: systolic/diastolic (e.g., 120/80)</p>
            </div>

            {/* Pulse */}
            <div>
              <label htmlFor="pulse" className="block text-sm font-medium text-gray-700">Pulse (bpm)</label>
              <input
                type="number"
                id="pulse"
                name="pulse"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.pulse}
                onChange={handleChange}
                min="0"
                max="300"
              />
            </div>

            {/* Temperature */}
            <div>
              <label htmlFor="temp" className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
              <input
                type="number"
                id="temp"
                name="temp"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.temp}
                onChange={handleChange}
                min="90"
                max="110"
                step="0.1"
              />
            </div>

            {/* Oxygen Saturation */}
            <div>
              <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">Oxygen Saturation (%)</label>
              <input
                type="number"
                id="oxygenSaturation"
                name="oxygenSaturation"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.oxygenSaturation}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            {/* Respiratory Rate */}
            <div>
              <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">Respiratory Rate (breaths/min)</label>
              <input
                type="number"
                id="respiratoryRate"
                name="respiratoryRate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.respiratoryRate}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            {/* Pain Level */}
            <div>
              <label htmlFor="pain" className="block text-sm font-medium text-gray-700">Pain Level (0-10)</label>
              <input
                type="range"
                id="pain"
                name="pain"
                className="mt-1 block w-full"
                value={vitals.pain}
                onChange={handleChange}
                min="0"
                max="10"
                step="1"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 (No Pain)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
              <p className="mt-1 text-center text-sm font-medium">Current: {vitals.pain}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Measurements</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.weight}
                onChange={handleChange}
                min="0"
                max="1000"
              />
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (inches)</label>
              <input
                type="number"
                id="height"
                name="height"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={vitals.height}
                onChange={handleChange}
                min="0"
                max="120"
              />
            </div>

            {/* BMI (calculated) */}
            <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">BMI (calculated)</label>
              <input
                type="text"
                id="bmi"
                name="bmi"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                value={vitals.bmi}
                readOnly
              />
              {vitals.bmi && (
                <p className="mt-1 text-xs text-gray-500">
                  {parseFloat(vitals.bmi) < 18.5 ? 'Underweight' :
                   parseFloat(vitals.bmi) < 25 ? 'Normal weight' :
                   parseFloat(vitals.bmi) < 30 ? 'Overweight' : 'Obese'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(patientIdParam ? `/patients/${patientIdParam}` : '/vitals')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Save Vitals</button>
        </div>
      </form>
    </div>
  );
}
