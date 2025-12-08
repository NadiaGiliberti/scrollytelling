// Knopf-Regen Effekt
function createKnopfRain() {
    const numberOfKnopf = 100; // Anzahl der fallenden Knöpfe
    
    for (let i = 0; i < numberOfKnopf; i++) {
        const knopf = document.createElement('img');
        knopf.src = 'images/skizzen/knopf_weiss_transparent.png';
        knopf.classList.add('falling_knopf');
        
        // Zufällige Größe für Variation
        const size = Math.random() * 5 + 10; // zwischen 10% und 15%
        knopf.style.width = size + '%';
        
        // Zufällige horizontale Position (angepasst, damit Knöpfe nicht rauslappen)
        const maxLeft = 100 - size; // Maximalposition berücksichtigt Knopfbreite
        knopf.style.left = Math.random() * maxLeft + '%';
        
        // Zufällige Startposition (weit oberhalb des sichtbaren Bereichs)
        knopf.style.top = -(Math.random() * 300 + 200) + 'px';
        
        // Zufällige Animationsdauer (zwischen 2.5 und 4.5 Sekunden)
        knopf.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        
        // Zufällige Verzögerung für gestaffelten Start (größerer Bereich für bessere Verteilung)
        knopf.style.animationDelay = Math.random() * 5 + 's';
        
        document.body.appendChild(knopf);
        
        // Knopf nach Animation entfernen
        knopf.addEventListener('animationend', () => {
            knopf.remove();
        });
    }
}

// PINKER KNOPF - fällt zum ersten O und ersetzt es
const specialKnopf = document.createElement('img');
specialKnopf.src = 'images/skizzen/knopf_rosa.png';
specialKnopf.classList.add('special_falling_knopf');

// Funktion zur Berechnung der Button-Größe basierend auf Schriftgröße
function updateKnopfSize() {
    const h1 = document.querySelector('h1');
    const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
    // Button-Größe = ca. 95% der Schriftgröße (anpassbar)
    specialKnopf.style.width = (fontSize * 0.95) + 'px';
    specialKnopf.style.height = (fontSize * 0.95) + 'px';
}

updateKnopfSize();

// Startposition: mittig horizontal, oberhalb des Bildschirms
specialKnopf.style.left = '50%';
specialKnopf.style.top = '-350px';
document.body.appendChild(specialKnopf);

const h1Element = document.querySelector('h1');
const buttons = document.querySelectorAll('.buttons .button'); // ← HIER ÄNDERN

// Funktion zur Positionierung des Buttons
function updateKnopfPosition() {
    const oTarget = document.getElementById('o-target');
    const rect = oTarget.getBoundingClientRect();
    // Endposition auf das O setzen (relativ zum Dokument, nicht zum Viewport)
    specialKnopf.style.left = rect.left + window.scrollX + rect.width / 2 + 'px';
    specialKnopf.style.top = rect.top + window.scrollY + rect.height / 2 + 'px';
}

// Berechne die Position des O
setTimeout(() => {
    updateKnopfPosition();
    // Animation später starten (3 Sekunden Verzögerung)
    specialKnopf.style.animationDelay = '3s';
    // Titel einblenden wenn Animation fertig ist (nach 3s delay + 3s animation = 6s)
    setTimeout(() => {
        h1Element.classList.add('visible');
        buttons.forEach(btn => btn.classList.add('visible'));
    }, 5830); // 3000ms delay + 3000ms animation
}, 100);

// Button-Position und -Größe bei Resize aktualisieren
window.addEventListener('resize', () => {
    updateKnopfSize();
    updateKnopfPosition();
});

// Regen beim Laden der Seite starten
window.addEventListener('load', createKnopfRain);