import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Politique de confidentialité | ZT-Voyage</title>
        <meta name="description" content="Politique de confidentialité de ZT-Voyage." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Collecte des données</h2>
          <p>
            Nous collectons les données suivantes lorsque vous utilisez notre formulaire de rendez-vous ou notre chat : nom, prénom, email, numéro de téléphone, ville, type de visa, pays de destination.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Finalité du traitement</h2>
          <p>
            Ces données sont utilisées uniquement pour organiser votre rendez-vous, vous envoyer une confirmation (email ou WhatsApp) et vous contacter en cas de modification. Elles ne sont jamais vendues ni cédées à des tiers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Base légale</h2>
          <p>
            Le traitement repose sur votre consentement (case à cocher implicite lors de la prise de rendez-vous) et sur l'exécution de nos services.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Durée de conservation</h2>
          <p>
            Les données sont conservées pendant 12 mois après le rendez-vous, puis archivées conformément à la réglementation béninoise.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Vos droits</h2>
          <p>
            Conformément à la loi, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Pour l'exercer, contactez-nous à <a href="mailto:contact@zt-voyage.bj" className="text-primary underline">contact@zt-voyage.bj</a>.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p>
            Nous utilisons un cookie de session strictement nécessaire à l'authentification de l'administration. Aucun cookie publicitaire ou de suivi n'est déposé.
          </p>
        </section>
      </div>
    </div>
  );
}