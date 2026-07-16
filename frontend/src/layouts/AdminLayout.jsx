import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, LogOut, Menu, X } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Bouton menu mobile */}
      <div className="lg:hidden bg-white p-4 flex justify-between items-center shadow">
        <h1 className="font-bold text-primary">ZT Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white w-full lg:w-64 shadow-lg lg:min-h-screen ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-6 border-b hidden lg:block">
          <h2 className="text-2xl font-bold text-primary">ZT Admin</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 w-full"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}