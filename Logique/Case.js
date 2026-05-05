class Case {
    constructor(id, x, y, vehicule = null) {
        this.vehicule = vehicule;
        this.voisinNord = null;
        this.voisinSud = null;
        this.voisinEst = null;
        this.voisinOuest = null;
    }
    estVide() {
        return this.vehicule === null;
    }
}

