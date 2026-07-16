import { Helmet } from 'react-helmet-async';

export default function LegalNotice() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Mentions légales | ZT-Voyage</title>
        <meta name="description" content="Mentions légales du site ZT-Voyage." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Éditeur du site</h2>
          <p>
            <strong>ZT‑Voyage</strong><br />
            Siège social : Cotonou, Quartier Zongo, Bénin<br />
            Téléphone : +229 52 43 17 17<br />
            Email : contact@zt-voyage.bj<br />
            Directeur de la publication : [Nom du responsable]
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Hébergement</h2>
          <p>
            <strong>Netlify, Inc.</strong><br />
            44 Montgomery Street, Suite 300, San Francisco, California 94104, États-Unis
          </p>
          <p>
            <strong>Render Services, Inc.</strong><br />
            100 Broadway, Suite 300, Oakland, CA 94607, États-Unis
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de ZT‑Voyage. Toute reproduction est interdite sans autorisation préalable.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Limitation de responsabilité</h2>
          <p>
            ZT‑Voyage s'efforce de fournir des informations exactes, mais ne peut garantir l'absence d'erreurs ou d'omissions. L'utilisateur est seul responsable de l'usage qu'il fait des informations.
          </p>
        </section>
      </div>
    </div>
  );
}