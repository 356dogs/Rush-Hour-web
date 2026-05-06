class Vehicule {
    constructor(id,orientation, partieVehicule) {
        this.id = id;
        this.orientation = orientation;
        this.partieVehicule = partieVehicule;
        this.image = "images/behiculeImageTest.png";
        this.case = null;
    }

    deplacmentVoiture(direction,nbCases)
    {

    }
}
// partieVehicule : chiffre commençant à 0 (commence a la tête du vehicule et augmente a chaque partie du vehicule) 
let voitureRouge1 = new Vehicule(1, "horizontal", 0);
let voitureRouge2 = new Vehicule(2, "horizontal", 1);

let voiture = [voitureRouge1, voitureRouge2];