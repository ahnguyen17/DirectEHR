import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import NotesPage from './pages/NotesPage';
import AddNote from './pages/AddNote';
import OrdersPage from './pages/OrdersPage';
import AddOrder from './pages/AddOrder';
import VitalsPage from './pages/VitalsPage';
import RecordVitals from './pages/RecordVitals';

// Lazy load the new components
const LabsPage = React.lazy(() => import('./pages/LabsPage'));
const AddLabOrder = React.lazy(() => import('./pages/AddLabOrder'));
const LabResultEntry = React.lazy(() => import('./pages/LabResultEntry'));
const DiagnosticsPage = React.lazy(() => import('./pages/DiagnosticsPage'));
const AddDiagnostic = React.lazy(() => import('./pages/AddDiagnostic'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="patients">
            <Route index element={<PatientList />} />
            <Route path=":id" element={<PatientDetail />} />
            <Route path="new" element={<AddPatient />} />
            <Route path=":id/edit" element={<EditPatient />} />
            <Route path=":id/vitals" element={<RecordVitals />} />
            <Route path=":id/notes/new" element={<AddNote />} />
            <Route path=":id/orders/new" element={<AddOrder />} />
          </Route>

          <Route path="notes">
            <Route index element={<NotesPage />} />
            <Route path="new" element={<AddNote />} />
          </Route>

          <Route path="orders">
            <Route index element={<OrdersPage />} />
            <Route path="new" element={<AddOrder />} />
          </Route>

          <Route path="vitals">
            <Route index element={<VitalsPage />} />
            <Route path="new" element={<RecordVitals />} />
          </Route>

          <Route path="labs">
            <Route index element={
              <Suspense fallback={<div className="text-center p-6">Loading Labs...</div>}>
                <LabsPage />
              </Suspense>
            } />
            <Route path="new" element={
              <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
                <AddLabOrder />
              </Suspense>
            } />
            <Route path=":id/results" element={
              <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
                <LabResultEntry />
              </Suspense>
            } />
          </Route>

          <Route path="diagnostics">
            <Route index element={
              <Suspense fallback={<div className="text-center p-6">Loading Diagnostics...</div>}>
                <DiagnosticsPage />
              </Suspense>
            } />
            <Route path="new" element={
              <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
                <AddDiagnostic />
              </Suspense>
            } />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;