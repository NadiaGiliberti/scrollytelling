gsap.registerPlugin(ScrollTrigger);


// --- SZENE 1 - MANTEL ZOOM  ---

// 1. Erstelle den ersten Spacer (Mantel)
const scrollSpacer = document.createElement('div');
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

// --- SZENE 2 - WALKCYCLE  ---

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
walkSpacer.id = 'walk-spacer';
document.querySelector('main').appendChild(walkSpacer);

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
    knopf.style.left = (frauRect.left + frauRect.width * 0.71) + 'px';
    knopf.style.top = (frauRect.top + frauRect.height * 0.4) + 'px';
}

// Update während der Walk-Animation
walkTimeline.to({}, {
    duration: 0.5,
    onUpdate: updateKnopfPosition,
    ease: "none"
}, 0);

// 4. Knopf fällt bis 75vh
walkTimeline.to(knopf, {
    y: "75vh",
    rotation: 1440,
    duration: 0.4,
    ease: "power2.in"
}, 0.45);

// 5. Walk-Container ausblenden
walkTimeline.to(".container_walk", {
    opacity: 0,
    pointerEvents: "none",
    duration: 0.15
}, 0.75);


// 6. Regen-Container einblenden
walkTimeline.to(".container_regen", {
    opacity: 1,
    pointerEvents: "all",
    duration: 0.15
}, 0.75);

// 7. Knopf verschwindet am Ende von container_walk
walkTimeline.to(knopf, {
    opacity: 0,
    duration: 0.05
}, 0.82);

// 8. Knopf erscheint oben im container_regen
walkTimeline.set(knopf, {
    top: "2vh",
    left: "28%",
    y: 0,
    transform: "translateX(-50%)",
    position: "fixed"
}, 0.85);

walkTimeline.to(knopf, {
    opacity: 1,
    duration: 0.05
}, 0.85);

// 9. Knopf fällt runter im Regen-Container
walkTimeline.to(knopf, {
    top: "58vh",
    rotation: 1800,
    duration: 0.15,
    ease: "power2.in"
}, 0.85);

// ScrollTrigger für das Andocken des Knopfes beim Vorwärts- und Rückwärts-Scrollen
ScrollTrigger.create({
    trigger: "#walk-spacer",
    start: "99% top",
    endTrigger: "body",
    end: "bottom bottom",
    onEnter: () => {
        gsap.set(knopf, { 
            position: "fixed", 
            top: "58vh",
            bottom: "auto",
            left: "28%",
            transform: "translateX(-50%) scale(10)",
            y: 0,
            zIndex: 100,
            opacity: 1
        });
    },
    onLeaveBack: () => {
        gsap.set(knopf, { 
            position: "fixed", 
            top: "auto",
            bottom: "auto",
            left: "auto",
            transform: "none",
            zIndex: 100
        });
    }
});

// --- REGEN ANIMATION ---

// Erstelle Regen-Spacer für die Regen-Animation
const regenSpacer = document.createElement('div');
regenSpacer.id = 'regen-spacer';
document.querySelector('main').appendChild(regenSpacer);

// Erstelle viele Regentropfen
const tropfenAnzahl = 50; // Anzahl der Regentropfen
const tropfen = [];

for (let i = 0; i < tropfenAnzahl; i++) {
    const tropf = document.createElement('img');
    tropf.src = 'images/skizzen/regen.png';
    tropf.className = 'regentropfen';
    tropf.style.width = Math.random() * 40 + 30 + 'px'; // Zufällige Größe zwischen 30-70px
    tropf.style.left = Math.random() * 100 + '%'; // Zufällige horizontale Position
    
    document.body.appendChild(tropf);
    tropfen.push(tropf);
}

// Timeline für Regen-Animation
const regenTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#regen-spacer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
    }
});

// Animiere jeden Tropfen
tropfen.forEach((tropf, index) => {
    const delay = (index / tropfenAnzahl) * 0.8; // Gestaffelte Starts
    const duration = Math.random() * 0.4 + 0.5; // Zufällige Geschwindigkeit (langsamer)
    const fallHöhe = window.innerHeight + 200; // Fällt über den ganzen Bildschirm
    const xBewegung = Math.random() * 100 - 50; // Zufällige horizontale Bewegung (-50 bis +50px)
    
    regenTimeline.to(tropf, {
        opacity: 1,
        y: fallHöhe,
        x: xBewegung,
        duration: duration,
        ease: "none"
    }, delay);
});

// --- SCHUH UND KNOPF ANIMATION (NACH REGEN) ---

// Erstelle Spacer für Schuh-Animation
const schuhSpacer = document.createElement('div');
schuhSpacer.id = 'schuh-spacer';
document.querySelector('main').appendChild(schuhSpacer);

// Timeline für Schuh-Animation
const schuhTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#schuh-spacer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
    }
});

const schuh = document.querySelector("#schuh");

// 1. Schuh einblenden links
schuhTimeline.to(schuh, {
    opacity: 1,
    duration: 0.1,
    ease: "none"
}, 0);

// 2. Schuh bewegt sich und dreht sich gleichzeitig zum Knopf (kick)
schuhTimeline.to(schuh, {
    left: "20%",
    rotation: 0,
    duration: 0.5,
    ease: "power1.inOut"
}, 0.1);

// 3. Knopf beginnt nach rechts zu rollen beim Impact
schuhTimeline.to(knopf, {
    left: "80%",
    rotation: "+=720",
    duration: 0.4,
    ease: "power1.out"
}, 0.5);

// --- MAUER SZENE (KNOPF ROLLT HORIZONTAL IN NÄCHSTEN CONTAINER) ---

// Erstelle Spacer für Mauer-Animation
const mauerSpacer = document.createElement('div');
mauerSpacer.id = 'mauer-spacer';
document.querySelector('main').appendChild(mauerSpacer);

// Timeline für Mauer-Animation
const mauerTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#mauer-spacer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
    }
});

// 1. Schuh ausblenden
mauerTimeline.to(schuh, {
    opacity: 0,
    duration: 0.2,
    ease: "none"
}, 0);

// 2. Beide Container zusammen nach links schieben (Panorama-Effekt)
mauerTimeline.to(".container_regen", {
    left: "-100%",
    duration: 1,
    ease: "none"
}, 0);

mauerTimeline.to(".container_mauer", {
    left: "0%",
    pointerEvents: "all",
    duration: 1,
    ease: "none"
}, 0);

// 3. Knopf rollt weiter nach rechts
mauerTimeline.to(knopf, {
    left: "50%",
    rotation: "+=1080",
    duration: 1,
    ease: "none"
}, 0);