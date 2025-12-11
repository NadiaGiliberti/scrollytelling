gsap.registerPlugin(ScrollTrigger);

// Verhindert Layout-Shift beim Pinning
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});

// Timeline für Container mit Mantel-Zoom und Ausblenden
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container_mantel",
    start: "top top",
    end: "+=2000",
    scrub: 1,
    pin: true,
    markers: true,
  }
});

tl.to("#mantel", {
  scale: 5,
  transformOrigin: "center center",
}, 0)
  .to(".container_mantel", {
    opacity: 0,
  }, 0);

// Video Frame-by-Frame scrubbing - OPTIMIERT
const video = document.querySelector("#frau_walk");

if (video) {
  // Video-Eigenschaften setzen
  video.pause();
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true; // Wichtig für mobile Geräte
  
  // Funktion zum Initialisieren des Video-Scrubbing
  function initVideoScrub() {
    const duration = video.duration;
    
    console.log("🎬 Video Duration:", duration, "Sekunden");
    console.log("Video readyState:", video.readyState);
    
    if (duration && !isNaN(duration) && duration > 0) {
      console.log("✅ Video Scrubbing initialisiert - ", duration, "Sekunden");
      
      // Setze Video auf Start
      video.currentTime = 0;
      
      // LÖSUNG: Passe die Scroll-Distanz an die Video-Länge an
      // Je länger das Video, desto mehr Scroll-Distanz brauchst du
      const scrollDistance = window.innerHeight * (duration / 3); // ca. 0.33vh pro Video-Sekunde - schnellere Animation
      // Bei 14 Sekunden Video = ca. 4.7 Viewports Scroll-Distanz
      
      // Straßen-Animation parallel zum Video
      const strasse = document.querySelector("#strasse_frontal");

      // GSAP Timeline für synchronisierte Animationen
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".container_walk",
          start: "top top",
          end: () => `+=${scrollDistance}px`,
          pin: true,
          scrub: 0.1, // Minimal smoothing für bessere Performance
          markers: true,
          anticipatePin: 1,
        }
      });

      // Video scrubbing via GSAP (bessere Performance)
      tl.to(video, {
        currentTime: duration,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          console.log(`📍 Video Time: ${video.currentTime.toFixed(2)}s / ${duration.toFixed(2)}s`);
        }
      }, 0);

      // Straßen-Animation parallel
      if (strasse) {
        tl.fromTo(strasse,
          { x: "100%" },  // Start: rechts außerhalb
          {
            x: "-100%",   // Ende: links außerhalb
            duration: 1,
            ease: "none"
          },
          0  // Startet gleichzeitig mit Video (am Position 0 der Timeline)
        );
      }
      
      // ScrollTrigger refreshen nach Initialisierung
      ScrollTrigger.refresh();
      
    } else {
      console.error("❌ Video duration ist nicht verfügbar:", duration);
    }
  }
  
  // Mehrere Event-Listener für bessere Kompatibilität
  let initialized = false;
  
  const tryInit = () => {
    if (!initialized && video.readyState >= 1) {
      initialized = true;
      initVideoScrub();
    }
  };
  
  // Sofort prüfen ob bereits geladen
  tryInit();
  
  // Event Listener
  video.addEventListener("loadedmetadata", tryInit);
  video.addEventListener("loadeddata", tryInit);
  video.addEventListener("canplay", tryInit);
  video.addEventListener("canplaythrough", tryInit);
  
  // Force load
  video.load();
  
  // Fallback nach 2 Sekunden
  setTimeout(() => {
    if (!initialized) {
      console.warn("⚠️ Video lädt langsam, versuche trotzdem zu initialisieren...");
      tryInit();
    }
  }, 2000);
  
} else {
  console.error("❌ Video-Element #frau_walk nicht gefunden");
}