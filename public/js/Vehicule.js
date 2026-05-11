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
        // déplacer le véhicule a la case de destination 
        // quatre  cas de figure (la case est devant ou derrière le véhicule) et (le véhicule est orienté vers le nord/sud ou est/ouest)
        if(this.orientation === "Nord" || this.orientation === "Sud")
        {
            if(caseDestination.x > vehiculeSelectionne.cases[0].x) // tête vas sur la case de destination
            


        
        
        vehiculeSelectionne.cases[0].vehicule = null; // on libère la case de départ
        vehiculeSelectionne.cases[0] = null;
        vehiculeSelectionne.cases[0] = caseDestination;
        caseDestination.vehicule = vehiculeSelectionne;

        vehiculeSelectionne.cases[1].vehicule = null; // casse la liaison avec le vehicule de la case
        vehiculeSelectionne.cases[1] = null;
        vehiculeSelectionne.cases[1] = caseDestination.voisinSud;
        caseDestination = caseDestination.voisinSud;
        caseDestination.vehicule = vehiculeSelectionne; // crée la liaison avec la nouvelle case
    
        }
    }
    
    


}

// partieVehicule : chiffre commençant à 0 (commence a la tête du vehicule et augmente a chaque partie du vehicule) 
let voitureRouge = new Vehicule(0, 2);

let vehicules = [voitureRouge];

// Associer chaque partie du véhicule à l'ensemble du véhicule

export { Vehicule, vehicules};






