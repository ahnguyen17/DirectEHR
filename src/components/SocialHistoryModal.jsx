import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SocialHistoryModal({ isOpen, onClose, onSave, socialHistory = null }) {
  const [formData, setFormData] = useState({
    tobaccoUse: '',
    alcoholUse: '',
    exercise: '',
    diet: '',
    occupation: ''
  });

  // If socialHistory is provided, populate the form (for editing)
  useEffect(() => {
    if (socialHistory) {
      setFormData({
        tobaccoUse: socialHistory.tobaccoUse || '',
        alcoholUse: socialHistory.alcoholUse || '',
        exercise: socialHistory.exercise || '',
        diet: socialHistory.diet || '',
        occupation: socialHistory.occupation || ''
      });
    } else {
      // Reset form for new entries
      setFormData({
        tobaccoUse: '',
        alcoholUse: '',
        exercise: '',
        diet: '',
        occupation: ''
      });
    }
  }, [socialHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {socialHistory ? 'Edit' : 'Add'} Social History
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tobaccoUse" className="block text-sm font-medium text-gray-700 mb-1">
              Tobacco Use
            </label>
            <select
              id="tobaccoUse"
              name="tobaccoUse"
              value={formData.tobaccoUse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select option</option>
              <option value="Never">Never</option>
              <option value="Former">Former</option>
              <option value="Current - Daily">Current - Daily</option>
              <option value="Current - Occasional">Current - Occasional</option>
              <option value="Current - Heavy">Current - Heavy</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="alcoholUse" className="block text-sm font-medium text-gray-700 mb-1">
              Alcohol Use
            </label>
            <select
              id="alcoholUse"
              name="alcoholUse"
              value={formData.alcoholUse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select option</option>
              <option value="None">None</option>
              <option value="Occasional">Occasional</option>
              <option value="Moderate">Moderate</option>
              <option value="Heavy">Heavy</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
              Exercise
            </label>
            <select
              id="exercise"
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select option</option>
              <option value="None">None</option>
              <option value="Light - 1-2 days/week">Light - 1-2 days/week</option>
              <option value="Moderate - 3-4 days/week">Moderate - 3-4 days/week</option>
              <option value="Active - 5+ days/week">Active - 5+ days/week</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-1">
              Diet
            </label>
            <input
              type="text"
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              placeholder="e.g., Regular, Vegetarian, Low-sodium"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {socialHistory ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
