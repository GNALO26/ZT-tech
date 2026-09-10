import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/common/ScrollToTop';
import AnalyticsTracker from './components/common/AnalyticsTracker';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import LocationVoiture from './pages/LocationVoiture';
import Formations from './pages/Formations';
import Coaching from './pages/Coaching';
import Vip from './pages/Vip';
import Newsletter from './pages/Newsletter';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Articles from './pages/admin/Articles';
import ArticleEditor from './pages/admin/ArticleEditor';
import Appointments from './pages/admin/Appointments';
import SubscribersAdmin from './pages/admin/Subscribers';
import FormationsAdmin from './pages/admin/FormationsManager';
import VipAdmin from './pages/admin/VipRequests';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsTracker />
          <Routes>
            {/* Public */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/rdv" element={<Appointment />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/location-voiture" element={<LocationVoiture />} />
              <Route path="/formations" element={<Formations />} />
              <Route path="/coaching" element={<Coaching />} />
              <Route path="/vip" element={<Vip />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/mentions-legales" element={<LegalNotice />} />
              <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/articles" element={<Articles />} />
              <Route path="/admin/articles/new" element={<ArticleEditor />} />
              <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
              <Route path="/admin/appointments" element={<Appointments />} />
              <Route path="/admin/subscribers" element={<SubscribersAdmin />} />
              <Route path="/admin/formations" element={<FormationsAdmin />} />
              <Route path="/admin/vip" element={<VipAdmin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}