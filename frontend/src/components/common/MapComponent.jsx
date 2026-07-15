import { useEffect, useState } from 'react';
import { Navigation } from 'lucide-react';

const ADDRESS = 'Cotonou, Bénin, ZT Technologies';
const LAT = 6.3703;
const LNG = 2.3912;

export default function MapComponent() {
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    if (/android/i.test(ua)) {
      setPlatform('android');
      setIsMobile(true);
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      setPlatform('ios');
      setIsMobile(true);
    }
  }, []);

  const openNavigation = () => {
    if (platform === 'android') {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`, '_blank');
    } else if (platform === 'ios') {
      window.open(`https://maps.apple.com/?q=${encodeURIComponent(ADDRESS)}&sll=${LAT},${LNG}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}`, '_blank');
    }
  };

  return (
    <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d${LNG}!3d${LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjInMTMuMSJOIDLCsDIzJzI4LjMiRQ!5e0!3m2!1sfr!2sbj!4v1690000000000`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Carte de localisation"
      ></iframe>
      {isMobile && (
        <button
          onClick={openNavigation}
          className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          aria-label="Lancer l'itinéraire"
        >
          <Navigation className="w-4 h-4" />
          Itinéraire
        </button>
      )}
    </div>
  );
}