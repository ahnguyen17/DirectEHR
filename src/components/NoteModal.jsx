import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePatient } from '../context/PatientContext';

export default function NoteModal({ isOpen, onClose, onSave, patientId = null }) {
  const { getPatient } = usePatient();
  const [patient, setPatient] = useState(null);
  const [note, setNote] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Progress Note',
    chiefComplaint: '',
    history: '',
    examination: '',
    assessment: '',
    plan: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (patientId) {
        try {
          const patientData = await getPatient(patientId);
          setPatient(patientData);
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      }
    };

    if (isOpen) {
      fetchPatient();
      // Reset form when modal opens
      setNote({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Progress Note',
        chiefComplaint: '',
        history: '',
        examination: '',
        assessment: '',
        plan: ''
      });
    }
  }, [isOpen, patientId, getPatient]);

  const handleTemplateChange = (e) => {
    const templateType = e.target.value;
    setNote({
      ...note,
      category: templateType
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate content from structured fields if using a template
      let formattedContent = note.content;

      if (note.category !== 'Free Text') {
        formattedContent = `# ${note.title}\n\n`;

        if (note.chiefComplaint) {
          formattedContent += `## Chief Complaint\n${note.chiefComplaint}\n\n`;
        }

        if (note.history) {
          formattedContent += `## History\n${note.history}\n\n`;
        }

        if (note.examination) {
          formattedContent += `## Examination\n${note.examination}\n\n`;
        }

        if (note.assessment) {
          formattedContent += `## Assessment\n${note.assessment}\n\n`;
        }

        if (note.plan) {
          formattedContent += `## Plan\n${note.plan}\n\n`;
        }
      }

      const newNote = {
        patientId: patientId ? parseInt(patientId) : null,
        patientName: patient ? patient.name : '',
        ...note,
        content: formattedContent
      };

      await onSave(newNote);
      onClose();
    } catch (error) {
      console.error('Error adding note:', error);
      // You could add error handling UI here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {patientId ? `Add Note for ${patient?.name}` : 'Add New Note'}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.title}
                onChange={(e) => setNote({...note, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.date}
                onChange={(e) => setNote({...note, date: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Note Type</label>
            <select
              id="category"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={note.category}
              onChange={(e) => handleTemplateChange(e)}
            >
              <option value="Progress Note">Progress Note</option>
              <option value="Consultation">Consultation</option>
              <option value="Procedure Note">Procedure Note</option>
              <option value="History and Physical">History and Physical</option>
              <option value="Discharge Summary">Discharge Summary</option>
              <option value="Free Text">Free Text</option>
            </select>
          </div>

          {note.category === 'Free Text' ? (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                id="content"
                rows="10"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.content}
                onChange={(e) => setNote({...note, content: e.target.value})}
                required
              ></textarea>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700">Chief Complaint</label>
                <textarea
                  id="chiefComplaint"
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={note.chiefComplaint}
                  onChange={(e) => setNote({...note, chiefComplaint: e.target.value})}
                  placeholder="Patient's primary reason for visit"
                ></textarea>
              </div>

              <div>
                <label htmlFor="history" className="block text-sm font-medium text-gray-700">History</label>
                <textarea
                  id="history"
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={note.history}
                  onChange={(e) => setNote({...note, history: e.target.value})}
                  placeholder="Relevant history of present illness, past medical history"
                ></textarea>
              </div>

              <div>
                <label htmlFor="examination" className="block text-sm font-medium text-gray-700">Examination</label>
                <textarea
                  id="examination"
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={note.examination}
                  onChange={(e) => setNote({...note, examination: e.target.value})}
                  placeholder="Physical examination findings"
                ></textarea>
              </div>

              <div>
                <label htmlFor="assessment" className="block text-sm font-medium text-gray-700">Assessment</label>
                <textarea
                  id="assessment"
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={note.assessment}
                  onChange={(e) => setNote({...note, assessment: e.target.value})}
                  placeholder="Diagnosis and assessment of patient's condition"
                ></textarea>
              </div>

              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plan</label>
                <textarea
                  id="plan"
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={note.plan}
                  onChange={(e) => setNote({...note, plan: e.target.value})}
                  placeholder="Treatment plan, medications, follow-up"
                ></textarea>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">Save Note</button>
          </div>
        </form>
      </div>
    </div>
  );
}
