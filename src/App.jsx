import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import AddPatient from './pages/AddPatient';
import NotesPage from './pages/NotesPage';
import AddNote from './pages/AddNote';
import OrdersPage from './pages/OrdersPage';
import AddOrder from './pages/AddOrder';
import VitalsPage from './pages/VitalsPage';
import RecordVitals from './pages/RecordVitals';

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
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;