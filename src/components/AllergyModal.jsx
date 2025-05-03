import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AllergyModal({ isOpen, onClose, onSave, allergy = null }) {
  const [allergyData, setAllergyData] = useState({
    name: '',
    reaction: ''
  });

  // If allergy is provided, populate the form (for editing)
  useEffect(() => {
    if (allergy) {
      // Handle both string format (legacy) and object format
      if (typeof allergy === 'string') {
        setAllergyData({
          name: allergy,
          reaction: ''
        });
      } else {
        setAllergyData({
          name: allergy.name || '',
          reaction: allergy.reaction || ''
        });
      }
    } else {
      // Reset form for new entries
      setAllergyData({
        name: '',
        reaction: ''
      });
    }
  }, [allergy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllergyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(allergyData, allergy);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {allergy ? 'Edit' : 'Add'} Allergy
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Allergy
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={allergyData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reaction" className="block text-sm font-medium text-gray-700 mb-1">
              Reaction
            </label>
            <input
              type="text"
              id="reaction"
              name="reaction"
              value={allergyData.reaction}
              onChange={handleChange}
              placeholder="e.g., Rash, Hives, Anaphylaxis"
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
              {allergy ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
