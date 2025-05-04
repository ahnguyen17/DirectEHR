import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SocialHistoryModal({ isOpen, onClose, onSave, socialHistory = null }) {
  const [formData, setFormData] = useState({
    tobaccoUse: '',
    tobaccoPackYears: '',
    tobaccoQuitDate: '',
    tobaccoType: '',
    tobaccoFrequency: '',
    alcoholUse: '',
    alcoholDrinksPerWeek: '',
    alcoholType: '',
    alcoholFrequency: '',
    drugUse: '',
    drugTypes: '',
    drugFrequency: '',
    drugLastUse: '',
    drugComments: '',
    exercise: '',
    diet: '',
    occupation: ''
  });

  // If socialHistory is provided, populate the form (for editing)
  useEffect(() => {
    if (socialHistory) {
      setFormData({
        tobaccoUse: socialHistory.tobaccoUse || '',
        tobaccoPackYears: socialHistory.tobaccoPackYears || '',
        tobaccoQuitDate: socialHistory.tobaccoQuitDate || '',
        tobaccoType: socialHistory.tobaccoType || '',
        tobaccoFrequency: socialHistory.tobaccoFrequency || '',
        alcoholUse: socialHistory.alcoholUse || '',
        alcoholDrinksPerWeek: socialHistory.alcoholDrinksPerWeek || '',
        alcoholType: socialHistory.alcoholType || '',
        alcoholFrequency: socialHistory.alcoholFrequency || '',
        drugUse: socialHistory.drugUse || '',
        drugTypes: socialHistory.drugTypes || '',
        drugFrequency: socialHistory.drugFrequency || '',
        drugLastUse: socialHistory.drugLastUse || '',
        drugComments: socialHistory.drugComments || '',
        exercise: socialHistory.exercise || '',
        diet: socialHistory.diet || '',
        occupation: socialHistory.occupation || ''
      });
    } else {
      // Reset form for new entries
      setFormData({
        tobaccoUse: '',
        tobaccoPackYears: '',
        tobaccoQuitDate: '',
        tobaccoType: '',
        tobaccoFrequency: '',
        alcoholUse: '',
        alcoholDrinksPerWeek: '',
        alcoholType: '',
        alcoholFrequency: '',
        drugUse: '',
        drugTypes: '',
        drugFrequency: '',
        drugLastUse: '',
        drugComments: '',
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

          {/* Additional tobacco fields that appear conditionally */}
          {formData.tobaccoUse && formData.tobaccoUse !== 'Never' && (
            <div className="pl-4 border-l-2 border-gray-200 mb-4">
              {formData.tobaccoUse === 'Former' && (
                <div className="mb-4">
                  <label htmlFor="tobaccoQuitDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Quit Date
                  </label>
                  <input
                    type="date"
                    id="tobaccoQuitDate"
                    name="tobaccoQuitDate"
                    value={formData.tobaccoQuitDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="tobaccoType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="tobaccoType"
                  name="tobaccoType"
                  value={formData.tobaccoType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="Cigarettes">Cigarettes</option>
                  <option value="Cigars">Cigars</option>
                  <option value="Pipe">Pipe</option>
                  <option value="Smokeless">Smokeless</option>
                  <option value="E-cigarettes">E-cigarettes</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>

              {formData.tobaccoType === 'Cigarettes' || formData.tobaccoType === 'Multiple' ? (
                <div className="mb-4">
                  <label htmlFor="tobaccoPackYears" className="block text-sm font-medium text-gray-700 mb-1">
                    Pack Years
                  </label>
                  <input
                    type="number"
                    id="tobaccoPackYears"
                    name="tobaccoPackYears"
                    value={formData.tobaccoPackYears}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="e.g., 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="tobaccoFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    id="tobaccoFrequency"
                    name="tobaccoFrequency"
                    value={formData.tobaccoFrequency}
                    onChange={handleChange}
                    placeholder="e.g., 2 cigars per week"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          )}

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

          {/* Additional alcohol fields that appear conditionally */}
          {formData.alcoholUse && formData.alcoholUse !== 'None' && (
            <div className="pl-4 border-l-2 border-gray-200 mb-4">
              <div className="mb-4">
                <label htmlFor="alcoholDrinksPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
                  Drinks Per Week
                </label>
                <input
                  type="number"
                  id="alcoholDrinksPerWeek"
                  name="alcoholDrinksPerWeek"
                  value={formData.alcoholDrinksPerWeek}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="e.g., 7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="alcoholType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="alcoholType"
                  name="alcoholType"
                  value={formData.alcoholType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="Beer">Beer</option>
                  <option value="Wine">Wine</option>
                  <option value="Spirits">Spirits</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="alcoholFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  id="alcoholFrequency"
                  name="alcoholFrequency"
                  value={formData.alcoholFrequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Social occasions only">Social occasions only</option>
                </select>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="drugUse" className="block text-sm font-medium text-gray-700 mb-1">
              Recreational Drug Use
            </label>
            <select
              id="drugUse"
              name="drugUse"
              value={formData.drugUse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select option</option>
              <option value="Never">Never</option>
              <option value="Former">Former</option>
              <option value="Current">Current</option>
            </select>
          </div>

          {/* Additional drug use fields that appear conditionally */}
          {formData.drugUse && formData.drugUse !== 'Never' && (
            <div className="pl-4 border-l-2 border-gray-200 mb-4">
              <div className="mb-4">
                <label htmlFor="drugTypes" className="block text-sm font-medium text-gray-700 mb-1">
                  Types (comma separated)
                </label>
                <input
                  type="text"
                  id="drugTypes"
                  name="drugTypes"
                  value={formData.drugTypes}
                  onChange={handleChange}
                  placeholder="e.g., Cannabis, MDMA, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="drugFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  id="drugFrequency"
                  name="drugFrequency"
                  value={formData.drugFrequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Rarely">Rarely</option>
                </select>
              </div>

              {formData.drugUse === 'Former' && (
                <div className="mb-4">
                  <label htmlFor="drugLastUse" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Use Date
                  </label>
                  <input
                    type="date"
                    id="drugLastUse"
                    name="drugLastUse"
                    value={formData.drugLastUse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="drugComments" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Comments
                </label>
                <textarea
                  id="drugComments"
                  name="drugComments"
                  rows="2"
                  value={formData.drugComments}
                  onChange={handleChange}
                  placeholder="Any additional information about drug use..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

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
