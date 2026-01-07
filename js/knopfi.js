gsap.registerPlugin(ScrollTrigger);

// --- MOBILE DETECTION ---
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 1024;
}

// Zeige Overlay bei mobilen Geräten
if (isMobileDevice()) {
    const overlay = document.getElementById('mobile-overlay');
    if (overlay) {
        overlay.classList.add('show');
        // Verhindere Scrollen auf mobilen Geräten
        document.body.style.overflow = 'hidden';
    }
}

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

    // Text einblenden, bevor Straße ganz verschwindet (bei 0.5)
    walkTimeline.to(".text_fallen", {
        opacity: 1,
        duration: 0.2,
        ease: "none"
    }, 0.5);

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

// 1. Text einblenden vor dem Schuh
schuhTimeline.to(".text_schuh", {
    opacity: 1,
    duration: 0.1,
    ease: "none"
}, 0);

// 2. Schuh einblenden links kurz nach dem Text
schuhTimeline.to(schuh, {
    opacity: 1,
    duration: 0.1,
    ease: "none"
}, 0.05);

// 3. Schuh bewegt sich und dreht sich gleichzeitig zum Knopf (kick)
schuhTimeline.to(schuh, {
    left: "0%",
    rotation: 0,
    duration: 0.5,
    ease: "power1.inOut"
}, 0.15);

// 4. Text ausblenden während Schuh sich bewegt
schuhTimeline.to(".text_schuh", {
    opacity: 0,
    duration: 0.2,
    ease: "none"
}, 0.15);

// 5. Knopf beginnt nach rechts zu rollen beim Impact
schuhTimeline.to(knopf, {
    left: "40%",
    rotation: "+=720",
    duration: 0.4,
    ease: "power1.out"
}, 0.55);

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

// 3. Knopf bleibt an Position und dreht sich weiter
mauerTimeline.to(knopf, {
    rotation: "+=1080",
    duration: 0.5,
    ease: "none"
}, 0);

// 4. Wahrzeichen einblenden nacheinander
mauerTimeline.to("#muenster", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 0.5);

mauerTimeline.to("#bundeshaus", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 0.6);

mauerTimeline.to("#zytglogge", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 0.7);

// 5. Knopf dreht sich weiter an seiner Position
mauerTimeline.to(knopf, {
    rotation: "+=1440",
    duration: 0.5,
    ease: "none"
}, 0.5);

// 6. Text einblenden
mauerTimeline.to(".text_mauer", {
    opacity: 1,
    duration: 0.2,
    ease: "none"
}, 0.8);

// --- TREPPE SZENE (KNOPF ROLLT WEITER IN NÄCHSTEN CONTAINER) ---

// Erstelle Spacer für Treppe-Animation
const treppeSpacer = document.createElement('div');
treppeSpacer.id = 'treppe-spacer';
document.querySelector('main').appendChild(treppeSpacer);

// Timeline für Treppe-Animation
const treppeTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#treppe-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// 1. Beide Container zusammen nach links schieben (Panorama-Effekt)
treppeTimeline.to(".container_mauer", {
    left: "-100%",
    duration: 1,
    ease: "none"
}, 0);

treppeTimeline.to(".container_treppe", {
    left: "0%",
    pointerEvents: "all",
    duration: 1,
    ease: "none"
}, 0);

// 2. Knopf rollt weiter während Container sich bewegen
treppeTimeline.to(knopf, {
    rotation: "+=1080",
    duration: 1,
    ease: "none"
}, 0);

// 2.5 Text einblenden wenn wir bei der Treppe sind
treppeTimeline.to(".text_treppe", {
    opacity: 1,
    duration: 0.2,
    ease: "none"
}, 0.7);

// 3. Knopf fällt die Treppe hinunter (4 Stufen) - nach der Container-Bewegung
// Erste Stufe
treppeTimeline.to(knopf, {
    top: "65vh",
    left: "35%",
    rotation: "+=180",
    duration: 0.05,
    ease: "power2.in"
}, 0.7);

// Zweite Stufe
treppeTimeline.to(knopf, {
    top: "80vh",
    left: "40%",
    rotation: "+=180",
    duration: 0.05,
    ease: "power2.in"
}, 0.8);

// Dritte Stufe
treppeTimeline.to(knopf, {
    top: "87vh",
    left: "45%",
    rotation: "+=180",
    duration: 0.05,
    ease: "power2.in"
}, 0.9);

// Text ausblenden am Ende der Treppe-Szene
treppeTimeline.to(".text_treppe", {
    opacity: 0,
    duration: 0.2,
    ease: "none"
}, 1.5);

// --- KATZE SZENE (NACH TREPPE) ---

// Erstelle Spacer für Katze-Animation
const katzeSpacer = document.createElement('div');
katzeSpacer.id = 'katze-spacer';
document.querySelector('main').appendChild(katzeSpacer);

// Timeline für Katze-Animation
const katzeTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#katze-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// 1. Knopf rollt weiter nach rechts
katzeTimeline.to(knopf, {
    left: "70%",
    rotation: "+=1080",
    duration: 0.5,
    ease: "none"
}, 0);

// 2. Mauer bewegt sich nach links (mehr Platz für Katze rechts)
katzeTimeline.to(".container_treppe", {
    left: "-30%",
    duration: 0.5,
    ease: "none"
}, 0);

// mauer_2 und mauer_3 bewegen sich mit dem Container mit
katzeTimeline.to("#mauer_2", {
    x: 0,
    duration: 0.5,
    ease: "none"
}, 0);

katzeTimeline.to("#mauer_3", {
    x: 0,
    duration: 0.5,
    ease: "none"
}, 0);

// 3. Katze schiebt sich von unten nach oben an der Position des Knopfes
katzeTimeline.to(".container_katze", {
    top: "0%",
    pointerEvents: "all",
    duration: 0.3,
    ease: "none"
}, 0.5);


// 4. Container_katze und Knopf gehen zusammen hinter der Mauer nach unten
// Knopf geht hinter die Mauer (z-index ändern)
katzeTimeline.set(knopf, {
    zIndex: 2
}, 1.5);

katzeTimeline.to(".container_katze", {
    top: "100%",
    duration: 0.3,
    ease: "none"
}, 1.5);

katzeTimeline.to(knopf, {
    top: "150vh",
    duration: 0.3,
    ease: "none"
}, 1.5);

// 5. Mauer zur Seite schieben und Aussicht zeigen
katzeTimeline.to(".container_treppe", {
    left: "-100%",
    duration: 0.5,
    ease: "none"
}, 2);

katzeTimeline.to("#aussicht", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 2);

// Text erscheint mit der Aussicht
katzeTimeline.to(".text_aussicht", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 2);

// 6. Container_katze und Knopf kommen wieder nach oben
katzeTimeline.to(".container_katze", {
    top: "0%",
    duration: 0.5,
    ease: "none"
}, 2.5);

katzeTimeline.to(knopf, {
    top: "87vh",
    duration: 0.5,
    ease: "none"
}, 2.5);

// Knopf kommt wieder vor die Mauer (z-index ändern nach der Bewegung)
katzeTimeline.set(knopf, {
    zIndex: 100
}, 3);

// 7. Katze verschwindet wieder nach unten, Knopf bleibt
katzeTimeline.to(".container_katze", {
    top: "100%",
    duration: 0.5,
    ease: "none"
}, 4);



// --- VOGELPERSPEKTIVE SZENE (NACH AUSSICHT) ---

// Erstelle Spacer für Vogelperspektive-Animation
const vogelperspektiveSpacer = document.createElement('div');
vogelperspektiveSpacer.id = 'vogelperspektive-spacer';
document.querySelector('main').appendChild(vogelperspektiveSpacer);

// Timeline für Vogelperspektive-Animation
const vogelperspektiveTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#vogelperspektive-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// 1. Knopf fällt nach unten
vogelperspektiveTimeline.to(knopf, {
    top: "120vh",
    rotation: "+=720",
    duration: 0.3,
    ease: "power2.in"
}, 0);

// 2. Alle Elemente gleichzeitig ausblenden (nachdem Knopf gefallen ist)
vogelperspektiveTimeline.to("#aussicht", {
    opacity: 0,
    duration: 0.3,
    ease: "none"
}, 0.3);

vogelperspektiveTimeline.to(".text_aussicht", {
    opacity: 0,
    duration: 0.3,
    ease: "none"
}, 0.3);

vogelperspektiveTimeline.to(".container_treppe", {
    opacity: 0,
    duration: 0.3,
    ease: "none"
}, 0.3);

vogelperspektiveTimeline.to(knopf, {
    opacity: 0,
    duration: 0.3,
    ease: "none"
}, 0.3);

// 3. Vogelperspektive einblenden nach dem Ausblenden
vogelperspektiveTimeline.to(".container_vogelperspektive", {
    opacity: 1,
    pointerEvents: "all",
    duration: 0.5,
    ease: "none"
}, 0.3);

// 4. Rosa Knopf fällt von oben ins Bild (nachdem Vogelperspektive eingeblendet wurde)
vogelperspektiveTimeline.set(knopf, {
    top: "-8vh",
    left: "40%",
    transform: "translateX(-50%) scale(15)",
    opacity: 1,
    rotation: 0,
    zIndex: 40
}, 0.8);

vogelperspektiveTimeline.to(knopf, {
    top: "50vh",
    rotation: 1440,
    duration: 0.5,
    ease: "power2.in"
}, 0.8);

// 5. Hand kommt von rechts ins Bild
const hand = document.querySelector("#hand");

// Z-index für Hand explizit setzen (höchster z-index - über allem)
vogelperspektiveTimeline.set(hand, {
    zIndex: 9999
}, 2);

vogelperspektiveTimeline.to(hand, {
    opacity: 1,
    right: "10%",
    scale: 1.5,
    duration: 1,
    ease: "power2.out"
}, 2);

// 6. Hand und Knopf gehen zusammen nach rechts aus dem Bild
vogelperspektiveTimeline.to(hand, {
    right: "-100%",
    duration: 0.8,
    ease: "power1.in"
}, 3);

vogelperspektiveTimeline.to(knopf, {
    left: "150%",
    duration: 0.8,
    ease: "power1.in"
}, 3);

// --- NÄHMASCHINE SZENE (NACH VOGELPERSPEKTIVE) ---

// Erstelle Spacer für Nähmaschine-Animation
const naehenSpacer = document.createElement('div');
naehenSpacer.id = 'naehen-spacer';
document.querySelector('main').appendChild(naehenSpacer);

// Timeline für Nähmaschine-Animation
const naehenTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#naehen-spacer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
    }
});

// 1. Vogelperspektive ausblenden und Nähmaschine einblenden beim Scrollen
naehenTimeline.to(".container_vogelperspektive", {
    opacity: 0,
    pointerEvents: "none",
    duration: 0.3,
    ease: "none"
}, 0);

naehenTimeline.to(".container_naehen", {
    opacity: 1,
    pointerEvents: "all",
    duration: 0.3,
    ease: "none"
}, 0);

// Nadel-Animation (wie Walk-Cycle)
const nadelImg = document.querySelector("#nadel_gif");
const nadelFrameCount = 28; // 28 Frames
const nadelLoopCount = 3; // Anzahl der Wiederholungen
const nadelTotalFrames = nadelFrameCount * nadelLoopCount;

// Array mit Nadel-Frame-Pfaden erstellen
const nadelImages = [];
for (let i = 1; i <= nadelFrameCount; i++) {
    nadelImages.push(`images/skizzen/nadel gif/Nadel_Frame${i}.png`);
}

// Nadel-Bilder vorladen
nadelImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

let nadelPlayhead = { frame: 0 };

// Nadel-Animation beim Scrollen (Frames wechseln)
naehenTimeline.to(nadelPlayhead, {
    frame: nadelTotalFrames - 1,
    ease: "none",
    duration: 0.7, // Animation läuft 70% der Timeline
    onUpdate: () => {
        const currentFrameIndex = Math.floor(nadelPlayhead.frame) % nadelFrameCount;
        if (nadelImg && nadelImg.src !== nadelImages[currentFrameIndex]) {
            nadelImg.src = nadelImages[currentFrameIndex];
        }
    }
}, 0);

// Container_naehen beginnt zu verblassen während Nadel-Animation noch läuft
naehenTimeline.to(".container_naehen", {
    opacity: 0,
    pointerEvents: "none",
    duration: 0.3,
    ease: "none"
}, 0.6); // Startet bei 60% der Timeline

// --- TEDDY SZENE (NACH NÄHMASCHINE) ---

// Erstelle Spacer für Teddy-Animation
const teddySpacer = document.createElement('div');
teddySpacer.id = 'teddy-spacer';
document.querySelector('main').appendChild(teddySpacer);

// Timeline für Teddy-Animation
const teddyTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#teddy-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// Teddy einblenden (container_naehen verblasst bereits in naehenTimeline)
teddyTimeline.to("#teddy", {
    opacity: 1,
    pointerEvents: "all",
    duration: 0.3,
    ease: "none"
}, 0);

// Text neben Teddy einblenden
teddyTimeline.to(".text_teddy", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 0);

// --- FIN SZENE (NACH TEDDY) ---

// Erstelle Spacer für Fin-Animation
const finSpacer = document.createElement('div');
finSpacer.id = 'fin-spacer';
document.querySelector('main').appendChild(finSpacer);

// Timeline für Fin-Animation
const finTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#fin-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// Teddy und Text ausblenden
finTimeline.to("#teddy", {
    opacity: 0,
    pointerEvents: "none",
    duration: 0.3,
    ease: "none"
}, 0);

finTimeline.to(".text_teddy", {
    opacity: 0,
    duration: 0.3,
    ease: "none"
}, 0);

// "la fin" einblenden
finTimeline.to("h2", {
    opacity: 1,
    duration: 0.3,
    ease: "none"
}, 0.3);
