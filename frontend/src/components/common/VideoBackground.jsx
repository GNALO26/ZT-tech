import { useEffect, useState, useCallback } from 'react';

export default function VideoBackground({ videoSrcs, posterSrc, children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // Passer à une vidéo aléatoire (différente de l'actuelle)
  const switchVideo = useCallback(() => {
    if (!videoSrcs || videoSrcs.length <= 1) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * videoSrcs.length);
    } while (newIndex === currentIndex);
    setNextIndex(newIndex);
    setIsTransitioning(true);
  }, [videoSrcs, currentIndex]);

  // Fin de la transition
  const onTransitionEnd = () => {
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
      setNextIndex(null);
      setIsTransitioning(false);
    }
  };

  // Changement automatique toutes les 8 secondes
  useEffect(() => {
    if (isMobile || !videoSrcs || videoSrcs.length <= 1) return;
    const interval = setInterval(switchVideo, 8000);
    return () => clearInterval(interval);
  }, [switchVideo, isMobile, videoSrcs]);

  const currentVideo = videoSrcs?.[currentIndex] || videoSrcs?.[0];
  const nextVideo = nextIndex !== null ? videoSrcs[nextIndex] : null;

  // Sur mobile ou absence de vidéo : image fixe
  if (isMobile || !currentVideo) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <img src={posterSrc} alt="Fond" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-accent/70" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Vidéo principale */}
      <video
        key={currentIndex}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: isTransitioning ? 0 : 1 }}
        onEnded={onTransitionEnd}
      >
        <source src={currentVideo} type="video/mp4" />
      </video>

      {/* Vidéo suivante (fondu entrant) */}
      {nextVideo && (
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: isTransitioning ? 1 : 0 }}
          onLoadedData={(e) => e.target.play()}
        >
          <source src={nextVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay dégradé rouge → anthracite */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-accent/70" />
      <div className="relative z-10 flex items-center justify-center h-full px-4">{children}</div>
    </div>
  );
}