class Case {
    constructor(id, x, y, divCase) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vehicule = null;
        this.voisinNord = null;
        this.voisinSud = null;
        this.voisinEst = null;
        this.voisinOuest = null;
        this.divCase = divCase;
        this.caseVictoire = false;
        this.caseHighlight = false;
        this.highlightImg = null;
    }
    
    estVide() {
        return this.vehicule === null;
    }

    voisinExiste(attributDirection) {
        return this[attributDirection] !== null;
    }

    setHighlightVisible(visible) {
        this.caseHighlight = visible;
        if (this.highlightImg) {
            this.highlightImg.style.display = visible ? 'block' : 'none';
        }
    }
}

