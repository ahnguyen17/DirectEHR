import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1 relative overflow-y-auto focus:outline-none pt-16 md:pt-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}