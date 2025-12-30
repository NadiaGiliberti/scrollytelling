gsap.registerPlugin(ScrollTrigger);

// 1. Erstelle den ersten Spacer (Mantel)
const scrollSpacer = document.createElement('div');
scrollSpacer.style.height = '200vh';
scrollSpacer.id = 'scroll-spacer';
document.querySelector('main').prepend(scrollSpacer);

// Timeline für Mantel-Zoom
let tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#scroll-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

tl.to("#mantel", {
    scale: 5,
    transformOrigin: "center center",
}, 0)
.to(".container_mantel", {
    opacity: 0,
    pointerEvents: "none"
}, 0.5)
.to(".container_walk", {
    opacity: 1,
    pointerEvents: "all"
}, 0.5);

// --- BILD-SEQUENZ LOGIK ---

const walkImg = document.querySelector("#frau_walk");
const frameCount = 10; // Deine 10 Bilder pro Schrittzyklus

// ANPASSUNG DER GESCHWINDIGKEIT:
// Ein kleinerer loopCount bedeutet, sie macht weniger Schritte auf der gleichen Distanz -> sie wirkt langsamer.
const loopCount = 5;  
const totalFrames = frameCount * loopCount;

// Array mit Pfaden erstellen
const images = [];
for (let i = 1; i <= frameCount; i++) {
    images.push(`images/skizzen/vanilla_walk/vanilla_walk_${i}.png`);
}

// Bilder vorladen
images.forEach(src => {
    const img = new Image();
    img.src = src;
});

let playhead = { frame: 0 };

// Zweiter Spacer (Die Länge des Spaziergangs)
const walkSpacer = document.createElement('div');
walkSpacer.style.height = '400vh'; // Distanz etwas verkürzt für angenehmeres Tempo
walkSpacer.id = 'walk-spacer';
document.querySelector('main').appendChild(walkSpacer);

const walkTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#walk-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
    }
});

// 1. Die Lauf-Animation (Soll über die gesamte Timeline gehen -> duration: 1)
walkTimeline.to(playhead, {
    frame: totalFrames - 1,
    ease: "none",
    duration: 1, // Volle Länge der Timeline
    onUpdate: () => {
        const currentFrameIndex = Math.floor(playhead.frame) % frameCount;
        if (walkImg.src !== images[currentFrameIndex]) {
            walkImg.src = images[currentFrameIndex];
        }
    }
}, 0); // Startet bei 0

// 2. Die Straße (Soll nur die ersten 60% der Zeit fahren)
const strasse = document.querySelector("#strasse_frontal");
if (strasse) {
    walkTimeline.fromTo(strasse,
        { x: "100%" },
        { 
            x: "-100%", 
            duration: 0.6, // Fährt etwas länger als die Hälfte
            ease: "none" 
        },
        0 // Startet auch bei 0
    );

    // 3. Der Zoom auf die Frau (Startet bei 0.5 und geht bis zum Ende)
    walkTimeline.to("#frau_walk", {
        scale: 10,
        y: "90%",
        transformOrigin: "center center",
        duration: 0.5, // Die zweite Hälfte der Timeline
        ease: "none"
    }, 0.5); // Startet bei der Hälfte (0.5) der Timeline
}