import { Helmet } from 'react-helmet-async';

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ZT-Voyage",
    "description": "Agence de services administratifs et voyages à Cotonou, Bénin. Visas, études, documents.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Quartier Zongo",
      "addressLocality": "Cotonou",
      "addressCountry": "BJ"
    },
    "telephone": "+22952431717",
    "url": "https://zt-voyage.com",
    "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-13:00"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}