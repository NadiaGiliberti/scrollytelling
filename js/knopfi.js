// GSAP und ScrollTrigger importieren
import { gsap } from './gsap.min.js';
import { ScrollTrigger } from './ScrollTrigger.min.js';

// ScrollTrigger Plugin registrieren
gsap.registerPlugin(ScrollTrigger);

// Mantel Zoom-Animation
gsap.to("#mantel", {
  scale: 2.5, // Zoom-Faktor (2.5x größer)
  transformOrigin: "center center", // Zoom von der Mitte aus
  ease: "none", // Linearer Verlauf beim Scrollen
  scrollTrigger: {
    trigger: ".container_mantel", // Element das die Animation triggert
    start: "top top", // Start wenn Container-Top am Viewport-Top ist
    end: "bottom top", // Ende wenn Container-Bottom am Viewport-Top ist
    scrub: 1, // Smooth scrubbing, 1 Sekunde Verzögerung
    pin: true, // Element "festpinnen" während des Scrollens
    anticipatePin: 1, // Verhindert Sprünge beim Pinning
    markers: false // Auf true setzen zum Debuggen
  }
});

// Optional: Video-Container Animation
gsap.from(".container_walk", {
  opacity: 0,
  y: 100,
  scrollTrigger: {
    trigger: ".container_walk",
    start: "top 80%",
    end: "top 50%",
    scrub: true,
    markers: false
  }
});