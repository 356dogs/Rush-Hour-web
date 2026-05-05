class Vehicule {
    constructor(id,orientation, partieVehicule) {
        this.id = id;
        this.orientation = orientation;
        this.partieVehicule = partieVehicule;
        this.image = "images/behiculeImageTest.png";
    }
}
// partieVehicule : chiffre commençant à 0 (commence a la tête du vehicule et augmente a chaque partie du vehicule) 
let voiture1 = new Vehicule(1, "horizontal", 0);

let voiture = [voiture1];