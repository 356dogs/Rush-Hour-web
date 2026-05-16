class Vehicule {
    constructor(id, taille) {
        this.id = id;
        this.taille = taille; // nombre de cases occupées par le véhicule
        this.orientation = null; //axe vers lequel la tête du véhicule est orienté (Nord, Sud, Est, Ouest)
        this.image = null;
        this.cases = []; // la première et la dernière case sur laquelle le véhicule est placé

        for (let i = 0; i < taille; i++) {
            this.cases.push(null);
        }
    }

    orientationADegrees() {
        let orientationDegrees = {
            "Nord": { deg: 0},
            "Sud": { deg : 180},
            "Est": { deg : 90},
            "Ouest": { deg : 270}
        };
        return orientationDegrees[this.orientation].deg;
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
            caseActuelle.setHighlightVisible(true);
        }
    }

    initImgVehicule(divGrille) {
        const imgvehicule = document.createElement('img');
        
  
        imgvehicule.classList.add('vehicules');
        imgvehicule.src = './assets/vehicule' + this.id + '.png';
        imgvehicule.style.transformOrigin = '50% 25%'; // rotation autour du centre de l'image
        
        let orientationOffset = {
            "Nord": { offset: 5},
            "Sud": { offset : -5},
            "Est": { offset : -5},
            "Ouest": { offset : 5}
        };
        let xImg = this.cases[0].y * 100; // position x en px
        let yImg = this.cases[0].x * 100; // position y en px
        if (this.orientation === "Nord" || this.orientation === "Sud") {
            yImg += orientationOffset[this.orientation].offset;
        } else {
            xImg += orientationOffset[this.orientation].offset;
        }       
        
        imgvehicule.style.transform = "translate(" + xImg + "px, " + yImg + "px) rotate(" + this.orientationADegrees() + "deg)";
        divGrille.appendChild(imgvehicule);
        this.image = imgvehicule;
    }

    mettreAJourImgVehicule(distance, direction) 
    {
        let orientationOffset = {
            "Nord": { offset: 5},
            "Sud": { offset : -5},
            "Est": { offset : -5},
            "Ouest": { offset : 5}
        };
        let xImg = this.cases[0].y * 100; // position x en px
        let yImg = this.cases[0].x * 100; // position y en px
        if (this.orientation === "Nord" || this.orientation === "Sud") {
            yImg += orientationOffset[this.orientation].offset;
        } else {
            xImg += orientationOffset[this.orientation].offset;
        }      
        this.image.style.transform = "translate(" + xImg + "px, " + yImg + "px) rotate(" + this.orientationADegrees() + "deg)";
    }

    aGagner() {
        for (let i = 0; i < this.cases.length; i++) {
            if (this.cases[i].caseVictoire) {
                return true;
            }
        }
        return false;
    }

    deplacerVehicule(caseDestination) {
        // déplacer le véhicule à la case de destination.
        const [direction, nbDeplacements] = this.calculDeplacementNecessaire(caseDestination);

        for (let i = 0; i < this.cases.length; i++) {
            this.cases[i].vehicule = null;
        }
        for (let i = 0; i < this.cases.length; i++) {
            let caseActuelle = this.cases[i];
            for (let pas = 0; pas < nbDeplacements; pas++) {
                caseActuelle = caseActuelle[direction];
            }
            this.cases[i] = caseActuelle;
        }
        for (let i = 0; i < this.cases.length; i++) {
            this.cases[i].vehicule = this;
        }
        this.mettreAJourImgVehicule(nbDeplacements, direction);
    }

    calculDeplacementNecessaire(caseDestination)
    {
        //on calcul la distance entre la case et ses extremitées pour savoir dans quel sens la case
        //calcul la valeur absolue du nombre de déplacements et l'orientation du déplacement pour atteindre la case de destination
        let nbCasesDeplacementTete;
        let nbCasesDeplacementQueue;        
        if(this.orientation === "Nord") //seul le x nous intéresse
        {
            nbCasesDeplacementTete = Math.abs(this.cases[0].x - caseDestination.x);
            nbCasesDeplacementQueue = Math.abs(this.cases[this.cases.length - 1].x - caseDestination.x);

            if(nbCasesDeplacementTete < nbCasesDeplacementQueue)
            {
                return ["voisinNord", nbCasesDeplacementTete];
            }
            else
            {
                return ["voisinSud", nbCasesDeplacementQueue];
            }
        }
        else if(this.orientation === "Sud") //seul le x nous intéresse
        {
            nbCasesDeplacementTete = Math.abs(this.cases[0].x - caseDestination.x);
            nbCasesDeplacementQueue = Math.abs(this.cases[this.cases.length - 1].x - caseDestination.x);
            if(nbCasesDeplacementTete < nbCasesDeplacementQueue)
            {
                return ["voisinSud", nbCasesDeplacementTete];
            }
            else
            {
                return ["voisinNord", nbCasesDeplacementQueue];
            }
        }
        else if(this.orientation === "Est") //seul le y nous intéresse
        {
            nbCasesDeplacementTete = Math.abs(this.cases[0].y - caseDestination.y);
            nbCasesDeplacementQueue = Math.abs(this.cases[this.cases.length - 1].y - caseDestination.y);
            if(nbCasesDeplacementQueue > nbCasesDeplacementTete)
            {
                return ["voisinEst", nbCasesDeplacementTete];
            }
            else{
                return ["voisinOuest", nbCasesDeplacementQueue];
            }
        }
        else //Ouest seul le y nous intéresse
        {
            nbCasesDeplacementTete = Math.abs(this.cases[0].y - caseDestination.y);
            nbCasesDeplacementQueue = Math.abs(this.cases[this.cases.length - 1].y - caseDestination.y);
            if(nbCasesDeplacementQueue > nbCasesDeplacementTete)
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

// partieVehicule : chiffre commençant à 0 (commence a la tête du véhicule et augmente a chaque partie du véhicule)
var voitureRouge = new Vehicule(0, 2);
var voitureBleue = new Vehicule(1, 2);
var voitureVerte = new Vehicule(2, 2);
var voitureOrange = new Vehicule(3, 2);
var voitureViolette = new Vehicule(4, 2);
var camionJaune = new Vehicule(5, 3);
var camionVert = new Vehicule(6, 3);

var vehicules = [voitureRouge,voitureBleue,voitureVerte,voitureOrange,voitureViolette,camionJaune,camionVert];






