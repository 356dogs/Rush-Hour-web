class Vehicule {
    constructor(id, taille) {
        this.id = id;
        this.taille = taille; // nombre de cases occupées par le véhicule
        this.orientation = null; //axe vers lequel la tête du véhicule est orienté (Nord, Sud, Est, Ouest)
        this.image = null;
        this.cases = []; // la première et la dernière case sur laquelle le véhicule est placé
    }

    etudeDeplacementPossible()
    {
        // regarde les déplacements possibles et active les cases correspondante
        let axe1 = this.cases[0]; // tête du véhicule
        let axe2 = this.cases[this.cases.length - 1]; // queue du véhicule

        let directions = {
            "Nord": { avant: "Nord", arriere: "Sud" },
            "Sud": { avant: "Sud", arriere: "Nord" },
            "Est": { avant: "Est", arriere: "Ouest" },
            "Ouest": { avant: "Ouest", arriere: "Est" }
        };
        
        let direction = directions[this.orientation];
        this.etudierDirection(direction.avant, axe1);
        this.etudierDirection(direction.arriere, axe2);
    }
    
    etudierDirection(direction, caseDepart) {
        // cette fonction active les cases dans la direction donnée à partir de la case de départ
        let caseActuelle = caseDepart;
        let attributVoisin = "voisin" + direction;
        while (caseActuelle.voisinExiste(attributVoisin) && caseActuelle[attributVoisin].estVide()) {
            caseActuelle = caseActuelle[attributVoisin];
            caseActuelle.caseHighlight = true;
        }
    }

    deplacerVehicule(vehiculeSelectionne, caseDestination) {    
        // déplacer le véhicule a la case de destination.
        let nbDeplacements;
        let direction;
        [direction, nbDeplacements] = this.calculDeplacementNecessaire(caseDestination);
        
        for(let i = 0; i < this.cases.length; i++) {
        for (let i = 0; i < nbDeplacements; i++) {
            this.cases[i]
    }

    calculDeplacementNecessaire(caseDestination)
    {
        //on calcul la distance entre la case et ses extremitées pour savoir dans quel sens la case
        //calcul la valeur absolue du nombre de déplacements et l'orientation du déplacement pour atteindre la case de destination
        let nbCasesDeplacementTete;
        let nbCasesDeplacementQueue;        
        if(this.orientation === "Nord" || this.orientation === "Sud") //seul le x nous intéresse
        {
            nbCasesDeplacementTete = Math.abs(this.cases[0].x - caseDestination.x);
            nbCasesDeplacementQueue = Math.abs(this.cases[this.cases.length - 1].x - caseDestination.x);

            if(nbCasesDeplacementQueue < nbCasesDeplacementTete)
            {
                return ["voisinNord", nbCasesDeplacementTete];
            }
            else
            {
                return ["voisinSud", nbCasesDeplacementQueue];
            }
        }
        else //seul le y nous intéresse
        {
            nbCasesDeplacementTete = Math.abs(this.cases[0].y - caseDestination.y);
            nbCasesDeplacementQueue = Math.abs(this.cases[this.cases.length - 1].y - caseDestination.y);
            if(nbCasesDeplacementQueue < nbCasesDeplacementTete)
            {
                return ["voisinOuest", nbCasesDeplacementTete];
            }
            else
            {
                return ["voisinEst", nbCasesDeplacementQueue];
            }
        }
    }

}

// partieVehicule : chiffre commençant à 0 (commence a la tête du vehicule et augmente a chaque partie du vehicule) 
let voitureRouge = new Vehicule(0, 2);

let vehicules = [voitureRouge];

// Associer chaque partie du véhicule à l'ensemble du véhicule

export { Vehicule, vehicules};






