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

    initImgVehicule(container) {
        if (this.image) {
            return;
        }
        const img = document.createElement('img');
        img.classList.add('vehicule');
        img.src = './assets/vehicule' + this.id + '.png';
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.transition = 'transform 0.75s ease-in-out ';
        img.style.transformOrigin = 'top left';
        container.appendChild(img);
        this.image = img;
        this.container = container;
    }

    updateDOMPosition() {
        if (!this.image || !this.cases[0]) {
            return;
        }
        const allXs = this.cases.map(c => c.x);
        const allYs = this.cases.map(c => c.y);
        const minX = Math.min(...allXs);
        const minY = Math.min(...allYs);
        const anchorCase = this.cases.find(c => c.x === minX && c.y === minY);
        if (!anchorCase) {
            return;
        }

        const caseRect = anchorCase.divCase.getBoundingClientRect();
        const parentRect = this.container.getBoundingClientRect();
        const offsetX = caseRect.left - parentRect.left;
        const offsetY = caseRect.top - parentRect.top;

        const width = (this.orientation === 'Est' || this.orientation === 'Ouest') ? this.taille * anchorCase.divCase.offsetWidth : anchorCase.divCase.offsetWidth;
        const height = (this.orientation === 'Nord' || this.orientation === 'Sud') ? this.taille * anchorCase.divCase.offsetHeight : anchorCase.divCase.offsetHeight;

        this.image.style.width = width + 'px';
        this.image.style.height = height + 'px';
        this.image.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
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
        this.updateDOMPosition();
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

var vehicules = [voitureRouge,voitureBleue];






