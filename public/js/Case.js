export class Case {
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
    }
    estVide() {
        return this.vehicule === null;
    }

    
}

