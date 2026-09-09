import { Helmet } from 'react-helmet-async';

export default function LocalBusinessSchema() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "ZT-Voyage",
    "description": "Agence de voyages et de services administratifs à Cotonou, Bénin. Visas, études, formations.",
    "url": "https://zt-voyage.com",
    "telephone": "+2290152431717",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Quartier Djidjè",
      "addressLocality": "Cotonou",
      "addressCountry": "BJ"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/ztvoyage",
      "https://www.instagram.com/ztvoyage"
    ]
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quels services propose ZT-Voyage ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nous proposons des services de visas, de documents administratifs, d'études à l'étranger, ainsi que des formations et du coaching personnalisé."
        }
      },
      {
        "@type": "Question",
        "name": "Comment prendre rendez-vous ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vous pouvez prendre rendez-vous directement sur notre site via la page Rendez-vous, ou nous contacter sur WhatsApp au +229 01 52 43 17 17."
        }
      },
      {
        "@type": "Question",
        "name": "Où se situe l'agence ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Notre agence est située à Cotonou, Quartier Djidjè, Bénin."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </Helmet>
  );
}