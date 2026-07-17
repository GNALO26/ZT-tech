import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/admin/articles', label: 'Articles', icon: FileText },
    { to: '/admin/appointments', label: 'Rendez-vous', icon: Calendar },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">ZT Admin</h2>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map(link => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Barre supérieure mobile */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-primary">ZT Admin</h1>
          <div className="w-6" /> {/* espaceur */}
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}