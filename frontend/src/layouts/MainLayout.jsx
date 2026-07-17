import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Chatbot from '../components/common/Chatbot';
import BackToTop from '../components/common/BackToTop';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Chatbot />
    </div>
  );
}