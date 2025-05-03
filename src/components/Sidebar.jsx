import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UserCircleIcon, 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, to: '/' },
  { name: 'Patients', icon: UserCircleIcon, to: '/patients' },
  { name: 'Vitals', icon: ChartBarIcon, to: '/vitals' },
  { name: 'Notes', icon: DocumentTextIcon, to: '/notes' },
  { name: 'Orders', icon: ClipboardDocumentListIcon, to: '/orders' },
];

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-50 flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">EHR App</h1>
        <button
          type="button"
          className="p-2 rounded-md text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-16">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`flex items-center px-4 py-3 my-1 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-6 w-6 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-2xl font-bold text-blue-600">EHR App</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`group flex items-center px-4 py-3 rounded-md ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-6 w-6 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>© 2025 EHR App</p>
              <p>Version 1.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}