gsap.registerPlugin(ScrollTrigger);

// Verhindert Layout-Shift beim Pinning
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});

// Erstelle einen Scroll-Spacer für die erste Animation
const scrollSpacer = document.createElement('div');
scrollSpacer.style.height = '200vh';
scrollSpacer.id = 'scroll-spacer';
document.querySelector('main').prepend(scrollSpacer);

// Timeline für Container mit Mantel-Zoom und Crossfade
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scroll-spacer",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
  }
});

// Mantel Zoom und Ausblenden
tl.to("#mantel", {
  scale: 5,
  transformOrigin: "center center",
}, 0)
  .to(".container_mantel", {
    opacity: 0,
  }, 0.5)
  .to(".container_walk", {
    opacity: 1,
  }, 0.5);

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

      // Erstelle einen zweiten Scroll-Spacer für die Walk-Animation
      const walkSpacer = document.createElement('div');
      walkSpacer.style.height = `${scrollDistance}px`;
      walkSpacer.id = 'walk-spacer';
      document.querySelector('main').appendChild(walkSpacer);

      // GSAP Timeline für synchronisierte Animationen
      const walkTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#walk-spacer",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1, // Minimal smoothing für bessere Performance
        }
      });

      // Video scrubbing via GSAP (bessere Performance)
      walkTimeline.to(video, {
        currentTime: duration,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          console.log(`📍 Video Time: ${video.currentTime.toFixed(2)}s / ${duration.toFixed(2)}s`);
        }
      }, 0);

      // Straßen-Animation parallel
      if (strasse) {
        walkTimeline.fromTo(strasse,
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