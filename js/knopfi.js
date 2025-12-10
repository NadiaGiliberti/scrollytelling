gsap.registerPlugin(ScrollTrigger);

// Verhindert Layout-Shift beim Pinning
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});

// Mantel Zoom-Animation
gsap.to("#mantel", {
  scale: 2.5,
  transformOrigin: "center center",
  ease: "none",
  scrollTrigger: {
    trigger: ".container_mantel",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    pin: ".mantel-wrapper",
    pinSpacing: true,
    anticipatePin: 1,
    markers: false,
  }
});

// Walk Container einblenden
gsap.to(".container_walk", {
  opacity: 1,
  visibility: "visible",
  scrollTrigger: {
    trigger: ".container_walk",
    start: "top bottom",
    end: "top 90%",
    scrub: 0.5,
  }
});

// Video Frame-by-Frame scrubbing - VERBESSERT
const video = document.querySelector("#frau_walk");

// Stelle sicher, dass das Video existiert
if (video) {
  // Video vorbereiten
  video.pause();
  video.currentTime = 0;
  
  // Funktion zum Initialisieren des Video-Scrubbing
  function initVideoScrub() {
    console.log("Video Duration:", video.duration); // Debug
    
    if (video.duration && !isNaN(video.duration)) {
      gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: ".container_walk",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          markers: false, // Setze auf true zum Debuggen
          onUpdate: (self) => {
            // Optional: Zeige aktuelle Position im Console
            console.log("Scroll Progress:", self.progress);
          }
        }
      });
    } else {
      console.error("Video duration ist nicht verfügbar");
    }
  }
  
  // Mehrere Event-Listener für bessere Kompatibilität
  if (video.readyState >= 1) {
    // Video ist bereits geladen
    initVideoScrub();
  } else {
    // Warte auf Video-Metadaten
    video.addEventListener("loadedmetadata", initVideoScrub);
    video.addEventListener("loadeddata", initVideoScrub);
    video.addEventListener("canplay", () => {
      if (!video.duration || isNaN(video.duration)) {
        console.warn("Video duration noch nicht verfügbar bei canplay");
      }
    });
  }
  
  // Force load des Videos
  video.load();
} else {
  console.error("Video-Element #frau_walk nicht gefunden");
}