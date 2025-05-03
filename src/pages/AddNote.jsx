import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export default function AddNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNote, getPatient } = usePatient();
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
      if (id) {
        try {
          const patientData = await getPatient(id);
          setPatient(patientData);
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      }
    };

    fetchPatient();
  }, [id, getPatient]);

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
        patientId: id ? parseInt(id) : null,
        patientName: patient ? patient.name : '',
        ...note,
        content: formattedContent
      };

      await addNote(newNote);
      navigate(id ? `/patients/${id}` : '/notes');
    } catch (error) {
      console.error('Error adding note:', error);
      // You could add error handling UI here
    }
  };

  const handleTemplateChange = (e) => {
    const templateType = e.target.value;

    setNote({
      ...note,
      category: templateType
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {id ? `Add Note for ${patient?.name}` : 'Add New Note'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
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
              rows="15"
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
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.history}
                onChange={(e) => setNote({...note, history: e.target.value})}
                placeholder="History of present illness, past medical history, medications, allergies, etc."
              ></textarea>
            </div>

            <div>
              <label htmlFor="examination" className="block text-sm font-medium text-gray-700">Examination</label>
              <textarea
                id="examination"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.examination}
                onChange={(e) => setNote({...note, examination: e.target.value})}
                placeholder="Physical examination findings, vital signs, etc."
              ></textarea>
            </div>

            <div>
              <label htmlFor="assessment" className="block text-sm font-medium text-gray-700">Assessment</label>
              <textarea
                id="assessment"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.assessment}
                onChange={(e) => setNote({...note, assessment: e.target.value})}
                placeholder="Diagnosis, differential diagnosis, clinical impression"
              ></textarea>
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plan</label>
              <textarea
                id="plan"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={note.plan}
                onChange={(e) => setNote({...note, plan: e.target.value})}
                placeholder="Treatment plan, medications, follow-up, etc."
              ></textarea>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(id ? `/patients/${id}` : '/notes')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">Save Note</button>
        </div>
      </form>
    </div>
  );
}
