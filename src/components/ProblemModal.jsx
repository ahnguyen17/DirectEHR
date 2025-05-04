import { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import icd10Codes from '../data/icd10Codes';

export default function ProblemModal({ isOpen, onClose, onSave, problem = null, patients = [] }) {
  const [formData, setFormData] = useState({
    patientId: '',
    code: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: ''
  });
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // If problem is provided, populate the form (for editing)
  useEffect(() => {
    if (problem) {
      setFormData({
        patientId: problem.patientId || '',
        code: problem.code || '',
        description: problem.description || '',
        date: problem.date || new Date().toISOString().split('T')[0],
        status: problem.status || 'Active',
        notes: problem.notes || ''
      });
    } else {
      // Reset form for new entries
      setFormData({
        patientId: '',
        code: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Active',
        notes: ''
      });
    }
  }, [problem]);

  // Add click outside listener to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Filter ICD-10 codes based on description input
    if (name === 'description' && value.trim() !== '') {
      const filtered = icd10Codes.filter(code =>
        code.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCodes(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(filtered.length > 0);
    } else if (name === 'description') {
      setShowSuggestions(false);
    }
  };

  const handleSelectCode = (code, description) => {
    setFormData(prev => ({
      ...prev,
      code: code,
      description: description
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.patientId) {
      alert('Please select a patient');
      return;
    }

    const processedData = {
      ...formData,
      patientId: parseInt(formData.patientId)
    };

    onSave(processedData, problem ? problem.id : null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {problem ? 'Edit Problem' : 'Add Problem'}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient selection - only show if not editing or if no patient is pre-selected */}
          {(!problem || !problem.patientId) && (
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
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
          )}

          {/* Problem Description with Auto-suggestion */}
          <div className="relative" ref={suggestionRef}>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <p className="text-xs text-gray-500 mb-1">Start typing to see matching ICD-10 codes</p>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Type problem description..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                {filteredCodes.map((item) => (
                  <div
                    key={item.code}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                    onClick={() => handleSelectCode(item.code, item.description)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">{item.code}:</span>
                      <span className="text-gray-700 truncate">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Problem Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              ICD-10 Code
            </label>
            <p className="text-xs text-gray-500 mb-1">Auto-filled when selecting from suggestions</p>
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {problem ? 'Update Problem' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
