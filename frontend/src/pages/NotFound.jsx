import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Helmet>
        <title>Page introuvable | ZT Technologies</title>
      </Helmet>
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oups, la page que vous cherchez n'existe pas.</p>
      <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Retour à l'accueil</Link>
    </div>
  );
}