// Knopf-Regen Effekt
function createButtonRain() {
    const numberOfButtons = 100; // Anzahl der fallenden Knöpfe
    
    for (let i = 0; i < numberOfButtons; i++) {
        const button = document.createElement('img');
        button.src = 'images/knopf_weiss_transparent.png';
        button.classList.add('falling_button');
        
        // Zufällige Größe für Variation
        const size = Math.random() * 5 + 10; // zwischen 10% und 15%
        button.style.width = size + '%';
        
        // Zufällige horizontale Position (angepasst, damit Knöpfe nicht rauslappen)
        const maxLeft = 100 - size; // Maximalposition berücksichtigt Knopfbreite
        button.style.left = Math.random() * maxLeft + '%';
        
        // Zufällige Startposition (weit oberhalb des sichtbaren Bereichs)
        button.style.top = -(Math.random() * 300 + 200) + 'px';
        
        // Zufällige Animationsdauer (zwischen 2.5 und 4.5 Sekunden)
        button.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        
        // Zufällige Verzögerung für gestaffelten Start (größerer Bereich für bessere Verteilung)
        button.style.animationDelay = Math.random() * 5 + 's';
        
        document.body.appendChild(button);
        
        // Knopf nach Animation entfernen
        button.addEventListener('animationend', () => {
            button.remove();
        });
    }
}

// PINKER KNOPF - fällt zum ersten O und ersetzt es
const specialButton = document.createElement('img');
specialButton.src = 'images/knopf_rosa.png';
specialButton.classList.add('special_falling_button');

// Funktion zur Berechnung der Button-Größe basierend auf Schriftgröße
function updateButtonSize() {
    const h1 = document.querySelector('h1');
    const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
    // Button-Größe = ca. 95% der Schriftgröße (anpassbar)
    specialButton.style.width = (fontSize * 0.95) + 'px';
    specialButton.style.height = (fontSize * 0.95) + 'px';
}

updateButtonSize();

// Startposition: mittig horizontal, oberhalb des Bildschirms
specialButton.style.left = '50%';
specialButton.style.top = '-350px';

document.body.appendChild(specialButton);

const h1Element = document.querySelector('h1');

// Funktion zur Positionierung des Buttons
function updateButtonPosition() {
    const oTarget = document.getElementById('o-target');
    const rect = oTarget.getBoundingClientRect();
    
    // Endposition auf das O setzen (relativ zum Dokument, nicht zum Viewport)
    specialButton.style.left = rect.left + window.scrollX + rect.width / 2 + 'px';
    specialButton.style.top = rect.top + window.scrollY + rect.height / 2 + 'px';
}

// Berechne die Position des O
setTimeout(() => {
    updateButtonPosition();
    
    // Animation später starten (3 Sekunden Verzögerung)
    specialButton.style.animationDelay = '3s';
    
    // Titel einblenden wenn Animation fertig ist (nach 3s delay + 3s animation = 6s)
    setTimeout(() => {
        h1Element.classList.add('visible');
    }, 5830); // 3000ms delay + 3000ms animation
}, 100);

// Button-Position und -Größe bei Resize aktualisieren
window.addEventListener('resize', () => {
    updateButtonSize();
    updateButtonPosition();
});

// Regen beim Laden der Seite starten
window.addEventListener('load', createButtonRain);