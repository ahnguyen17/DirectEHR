import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatient, updatePatient } = usePatient();
  const [loading, setLoading] = useState(true);
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
    primaryCareProvider: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const patientData = await getPatient(id);

        // Format allergies as a string for the form
        let allergiesString = '';
        if (Array.isArray(patientData.allergies)) {
          allergiesString = patientData.allergies.map(allergy => {
            // Handle both string format (legacy) and object format
            if (typeof allergy === 'string') {
              return allergy;
            } else {
              return allergy.name;
            }
          }).join(', ');
        } else if (patientData.allergies) {
          allergiesString = patientData.allergies;
        }

        setPatient({
          ...patientData,
          allergies: allergiesString
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, getPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Format allergies as an array of objects with name and reaction properties
      const formattedPatient = {
        ...patient,
        allergies: patient.allergies
          ? patient.allergies.split(',').map(allergy => ({
              name: allergy.trim(),
              reaction: ''  // Default empty reaction for allergies added via the simple form
            }))
          : []
      };

      // Update the patient
      await updatePatient(id, formattedPatient);

      // Navigate to the patient detail page
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error updating patient:', error);
      // You could add error handling UI here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading patient information...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Patient</h1>

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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={patient.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* MRN */}
          <div>
            <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">Medical Record Number (MRN)</label>
            <input
              type="text"
              id="mrn"
              name="mrn"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={patient.mrn}
              onChange={handleChange}
              required
              readOnly
            />
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.phone}
                onChange={handleChange}
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
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.emergencyPhone}
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

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patient.additionalNotes || ''}
                onChange={handleChange}
                placeholder="Enter any additional information about the patient here..."
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/patients/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
