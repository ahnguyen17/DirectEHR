import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export default function AddPatient() {
  const navigate = useNavigate();
  const { addPatient } = usePatient();

  const [patient, setPatient] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    mrn: '',
    address: '',
    phone: '',
    email: '',
    insurance: '',
    policyNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    primaryCareProvider: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format allergies as an array
    const formattedPatient = {
      ...patient,
      allergies: patient.allergies ? patient.allergies.split(',').map(allergy => allergy.trim()) : []
    };

    // Add the patient
    const newPatient = addPatient(formattedPatient);

    // Navigate to the patient detail page
    navigate(`/patients/${newPatient.id}`);
  };

  const generateMRN = () => {
    const prefix = 'MRN';
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setPatient({
      ...patient,
      mrn: `${prefix}${randomDigits}`
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New Patient</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Patient Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={patient.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={patient.dob}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={patient.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* MRN */}
          <div>
            <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">Medical Record Number (MRN)</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="mrn"
                name="mrn"
                className="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm p-2"
                value={patient.mrn}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm"
                onClick={generateMRN}
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.address}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.email}
                onChange={handleChange}
                placeholder="patient@example.com"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.emergencyContact}
                onChange={handleChange}
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">Emergency Phone</label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.emergencyPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Insurance Provider */}
            <div>
              <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
              <input
                type="text"
                id="insurance"
                name="insurance"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.insurance}
                onChange={handleChange}
              />
            </div>

            {/* Policy Number */}
            <div>
              <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">Policy Number</label>
              <input
                type="text"
                id="policyNumber"
                name="policyNumber"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.policyNumber}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Allergies */}
            <div className="md:col-span-2">
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies (comma separated)</label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.allergies}
                onChange={handleChange}
                placeholder="Penicillin, Peanuts, etc."
              />
            </div>

            {/* Primary Care Provider */}
            <div className="md:col-span-2">
              <label htmlFor="primaryCareProvider" className="block text-sm font-medium text-gray-700">Primary Care Provider</label>
              <input
                type="text"
                id="primaryCareProvider"
                name="primaryCareProvider"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.primaryCareProvider}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/patients')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Add Patient</button>
        </div>
      </form>
    </div>
  );
}
