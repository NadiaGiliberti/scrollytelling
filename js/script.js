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

// PINKER KNOPF - fällt in die Mitte und bleibt dort
    const specialButton = document.createElement('img');
    specialButton.src = 'images/knopf_rosa.png'; // Hier dein neues Bild einfügen
    specialButton.classList.add('special_falling_button');
    
    // Größe des pinken Knopfs
    specialButton.style.width = '15%'; // Passe die Größe nach Bedarf an
    
    // Startposition: mittig horizontal, oberhalb des Bildschirms
    specialButton.style.left = '50%';
    specialButton.style.transform = 'translateX(-50%)';
    specialButton.style.top = '-300px';
    
    // Animation: etwas später starten und länger dauern
    specialButton.style.animationDuration = '3s';
    specialButton.style.animationDelay = '3s'; // Startet nach 3 Sekunden
    
    document.body.appendChild(specialButton);


// Regen beim Laden der Seite starten
window.addEventListener('load', createButtonRain);