class Vehicule {
    constructor(id, partieVehicule) {
        this.id = id;
        this.orientation = null; //axe vers lequel la tête du véhicule est orienté (Nord, Sud, Est, Ouest)
        this.partieVehicule = partieVehicule;
        this.image = "images/vehiculeImageTest.png";
        this.case = null;
        this.vehiculecomplet;
    }

    etudeDeplacementPossible()
    {
        // regarde les déplacements possibles et active les cases correspondante
        let axe1 = this.vehiculecomplet[0].case // tête du véhicule
        let axe2 = this.vehiculecomplet[this.vehiculecomplet.length - 1].case // queue du véhicule
        
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

    deplacerVehicule(vehiculeATete, caseDestination) {    
        // déplacer le véhicule a la case de destination 
        // quatre  cas de figure (la case est devant ou derrière le véhicule) et (le véhicule est orienté vers le nord/sud ou est/ouest)
        vehiculeATete.case.vehicule = null;
        
        // a finir

        
        // Placer le véhicule à la nouvelle case
        vehiculeATete.case = caseDestination;
        caseDestination.vehicule = vehiculeATete;
        
        return true;
    }  
}



// partieVehicule : chiffre commençant à 0 (commence a la tête du vehicule et augmente a chaque partie du vehicule) 
let voitureRougePartie1 = new Vehicule(0, 0);
let voitureRougePartie2 = new Vehicule(1, 1);

let voitureRouge = [voitureRougePartie1, voitureRougePartie2];

let vehicules = [voitureRouge];

// Associer chaque partie du véhicule à l'ensemble du véhicule
for (let i = 0; i < vehicules.length; i++) {
    for (let j = 0; j < vehicules[i].length; j++) {
        vehicules[i][j].vehiculecomplet = vehicules[i];
    }
}

export { Vehicule, vehicules };






