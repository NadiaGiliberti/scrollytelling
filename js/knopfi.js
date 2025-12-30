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
}, 0.5)
.to("#abfallender_knopf", {
    opacity: 1
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
walkSpacer.style.height = '400vh'; // Volle Länge für Walk + Zoom
walkSpacer.id = 'walk-spacer';
document.querySelector('main').appendChild(walkSpacer);

// Dritter Spacer für den Übergang (wo der Knopf fällt)
const transitionSpacer = document.createElement('div');
transitionSpacer.style.height = '100vh'; // Platz für den Knopf-Fall
transitionSpacer.id = 'transition-spacer';
document.querySelector('main').appendChild(transitionSpacer);

const walkTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#walk-spacer",
        start: "top 80%",
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
    
    // Knopf vergrößert sich mit der Frau
    walkTimeline.to("#abfallender_knopf", {
        scale: 10,
        duration: 0.5,
        ease: "none"
    }, 0.5);
}

// --- KNOPF ANIMATION ---

// Knopf an der Frau befestigen (während der Walk-Animation)
const knopf = document.querySelector("#abfallender_knopf");
const frau = document.querySelector("#frau_walk");

// Positioniere den Knopf relativ zur Frau
function updateKnopfPosition() {
    const frauRect = frau.getBoundingClientRect();
    // Knopf am Mantel positionieren (mittig, etwas unterhalb der Mitte)
    knopf.style.left = (frauRect.left + frauRect.width * 0.73) + 'px';
    knopf.style.top = (frauRect.top + frauRect.height * 0.4) + 'px';
}

// Update während der Walk-Animation
walkTimeline.to({}, {
    duration: 0.5,
    onUpdate: updateKnopfPosition,
    ease: "none"
}, 0);

// 4. Knopf fällt ab während des Zooms
walkTimeline.to(knopf, {
    y: "80vh", // Fällt nach unten
    rotation: 720, // Dreht sich beim Fallen
    duration: 0.4,
    ease: "power2.in"
}, 0.45); // Startet etwas früher als der Zoom

// 5. Walk-Container ausblenden am Ende
walkTimeline.to(".container_walk", {
    opacity: 0,
    pointerEvents: "none",
    duration: 0.2
}, 0.9); // Am Ende der Timeline

// Timeline für den Übergang zum Regen
const transitionTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#transition-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
    }
});

// Regen-Container einblenden
transitionTimeline.to(".container_regen", {
    opacity: 1,
    pointerEvents: "all",
    duration: 0.3
}, 0);

// Knopf fällt weiter
transitionTimeline.to(knopf, {
    y: "120vh",
    rotation: 1440,
    duration: 1,
    ease: "power1.out"
}, 0);