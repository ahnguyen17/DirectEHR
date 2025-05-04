import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePatient } from '../context/PatientContext';
import NoteModal from '../components/NoteModal';

export default function NotesPage() {
  const { addNote, notes: allNotes } = usePatient();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    // Use notes from PatientContext
    setNotes(allNotes);
  }, [allNotes]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPatient =
      filterPatient === '' ||
      note.patientName.toLowerCase().includes(filterPatient.toLowerCase());

    return matchesSearch && matchesPatient;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 lg:mb-0">Patient Notes</h1>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
              placeholder="Filter by patient name..."
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowNoteModal(true)}
              className="btn btn-primary inline-flex items-center justify-center w-full lg:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Note
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-4" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-medium text-blue-600">
                      <Link to={`/notes/${note.id}`} className="hover:underline">
                        {note.title}
                      </Link>
                    </h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="font-medium">Patient:</span>
                        <Link to={`/patients/${note.patientId}`} className="ml-1 text-blue-600 hover:underline">
                          {note.patientName}
                        </Link>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>Date: {formatDate(note.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {note.content}
                </p>
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/notes/${note.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View full note
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
            <p className="mt-1 text-gray-500">No notes match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={addNote}
        patientId={null}
      />
    </div>
  );
}