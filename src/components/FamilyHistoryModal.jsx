import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function FamilyHistoryModal({ isOpen, onClose, onSave, entry = null }) {
  const [formData, setFormData] = useState({
    condition: '',
    relations: []
  });

  // If entry is provided, populate the form (for editing)
  useEffect(() => {
    if (entry) {
      setFormData({
        condition: entry.condition || '',
        relations: Array.isArray(entry.relations) ? [...entry.relations] :
                  (entry.relation ? [entry.relation] : []) // Handle legacy data format
      });
    } else {
      // Reset form for new entries
      setFormData({
        condition: '',
        relations: []
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRelation = () => {
    setFormData(prev => ({
      ...prev,
      relations: [...prev.relations, '']
    }));
  };

  const handleRelationChange = (index, value) => {
    const updatedRelations = [...formData.relations];
    updatedRelations[index] = value;
    setFormData(prev => ({
      ...prev,
      relations: updatedRelations
    }));
  };

  const handleRemoveRelation = (index) => {
    const updatedRelations = formData.relations.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      relations: updatedRelations
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out any empty relations
    const filteredRelations = formData.relations.filter(relation => relation.trim() !== '');
    const dataToSave = {
      ...formData,
      relations: filteredRelations
    };
    onSave(dataToSave, entry ? entry.id : null);
    onClose();
  };

  if (!isOpen) return null;

  const relationOptions = [
    { value: "", label: "Select relation" },
    { value: "Mother", label: "Mother" },
    { value: "Father", label: "Father" },
    { value: "Sister", label: "Sister" },
    { value: "Brother", label: "Brother" },
    { value: "Grandmother (Maternal)", label: "Grandmother (Maternal)" },
    { value: "Grandfather (Maternal)", label: "Grandfather (Maternal)" },
    { value: "Grandmother (Paternal)", label: "Grandmother (Paternal)" },
    { value: "Grandfather (Paternal)", label: "Grandfather (Paternal)" },
    { value: "Aunt", label: "Aunt" },
    { value: "Uncle", label: "Uncle" },
    { value: "Other", label: "Other" }
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {entry ? 'Edit' : 'Add'} Family History
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
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <input
              type="text"
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Family Members
              </label>
              <button
                type="button"
                onClick={handleAddRelation}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Member
              </button>
            </div>

            {formData.relations.length === 0 && (
              <div className="text-sm text-gray-500 mb-2">
                No family members added. Click "Add Member" to add affected family members.
              </div>
            )}

            {formData.relations.map((relation, index) => (
              <div key={index} className="flex items-center mb-2">
                <select
                  value={relation}
                  onChange={(e) => handleRelationChange(index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {relationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveRelation(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            {formData.relations.length === 0 && (
              <button
                type="button"
                onClick={handleAddRelation}
                className="mt-2 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Family Member
              </button>
            )}
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
              disabled={formData.relations.length === 0}
            >
              {entry ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
