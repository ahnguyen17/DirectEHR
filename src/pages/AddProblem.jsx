import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProblemList } from '../context/ProblemListContext';
import { usePatient } from '../context/PatientContext';

export default function AddProblem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProblem, getProblem, updateProblem } = useProblemList();
  const { patients } = usePatient();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdParam = queryParams.get('patientId');
  const codeParam = queryParams.get('code');
  const descriptionParam = queryParams.get('description');
  const problemId = queryParams.get('id');

  const [isEditing, setIsEditing] = useState(!!problemId);
  const [problem, setProblem] = useState({
    patientId: patientIdParam ? parseInt(patientIdParam) : '',
    code: codeParam || '',
    description: descriptionParam || '',
    date: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: ''
  });

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load problem data when editing
  useEffect(() => {
    if (isEditing && problemId) {
      const existingProblem = getProblem(parseInt(problemId));
      if (existingProblem) {
        setProblem(existingProblem);
      }
    }
  }, [isEditing, problemId, getProblem]);

  // Update patient name when patient ID changes
  useEffect(() => {
    if (problem.patientId) {
      const patient = patients.find(p => p.id === parseInt(problem.patientId));
      setSelectedPatient(patient);
      if (patient) {
        setProblem(prev => ({
          ...prev,
          patientName: patient.name
        }));
      }
    }
  }, [problem.patientId, patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problem.patientId) {
      alert('Please select a patient');
      return;
    }

    const processedProblem = {
      ...problem,
      patientId: parseInt(problem.patientId)
    };

    try {
      if (isEditing) {
        await updateProblem(parseInt(problemId), processedProblem);
        alert('Problem updated successfully');
        // Navigate to the patient's problem list tab
        navigate(`/patients/${processedProblem.patientId}?tab=problems`);
      } else {
        await addProblem(processedProblem);
        alert('Problem added successfully');
        navigate('/problems');
      }
    } catch (error) {
      console.error('Error saving problem:', error);
      alert('Failed to save problem');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem({
      ...problem,
      [name]: value
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Problem' : 'Add Problem'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Problem Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the details of the problem to add to the patient's record.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                    Patient
                  </label>
                  <select
                    id="patientId"
                    name="patientId"
                    value={problem.patientId}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={problem.date}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    ICD-10 Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={problem.code}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={problem.status}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={problem.description}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={problem.notes}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Update Problem' : 'Save Problem'}
          </button>
        </div>
      </form>
    </div>
  );
}
