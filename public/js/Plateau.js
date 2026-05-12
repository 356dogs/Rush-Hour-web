//js n'a pas de fonction randint(min,max) prédefinie donc on doit la creer
function randomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

class Plateau {
    constructor(nom, lignes, colonnes, listeVehicules) {
        this.nom = nom;
        this.grille = [];
        this.lignes = lignes; 
        this.colonnes = colonnes;
        this.vehiculeSelectionne = null;
        this.listeVehicules = listeVehicules;
        this.divGrille = null;
    }

    creationVoisinage() {
        for (let x = 0; x < this.lignes; x++) {
            for (let y = 0; y < this.colonnes; y++) {
                if(x != 0) //on a une case au nord
                {
                    this.grille[x][y].voisinNord = this.grille[x-1][y];
                }
                if(x != this.lignes - 1) //on a une case au sud
                {
                    this.grille[x][y].voisinSud = this.grille[x+1][y];
                }
                if(y != 0) //on a une case à l'ouest
                {
                    this.grille[x][y].voisinOuest = this.grille[x][y-1];
                }
                if(y != this.colonnes - 1) //on a une case à l'est
                {
                    this.grille[x][y].voisinEst = this.grille[x][y+1];
                }
            }
        }
    }

    creationGrille(divGrille) {
        /*
        Cette fonction s'occupe de la creation de la grille de jeu, 
        */
        this.divGrille = divGrille;
        let compteur = 0;
        for (let x=0; x<this.lignes; x++) {
            this.grille[x] = [];

            const nouvLigne = document.createElement("div");
            nouvLigne.classList.add("ligne");
            nouvLigne.id = "ligne" + x;
            
            divGrille.appendChild(nouvLigne);
            for (let y=0; y<this.colonnes; y++) {
                const nouvCase = document.createElement("div");
                nouvCase.classList.add("case");
                nouvCase.id = "case" + x + "-" + y;

                //background de la case
                const background = document.createElement("img");
                background.setAttribute("src", "/public/assets/backgroundCase.png");
                background.setAttribute("height", "150");
                background.setAttribute("width", "150");

                //img de highlight de la case
                const highlight = document.createElement("img");
                highlight.setAttribute("src", "/public/assets/highlight.png");
                highlight.setAttribute("height", "100");
                highlight.setAttribute("width", "100");
                highlight.classList.add("highlight");
                highlight.style.display = "none";

                //il faut ajouter un event listener a chaque case qui va gérer la liaison cruciale entre les parties de nos classes.
                this.ajouterEventListenerCases(nouvCase,x,y);

                nouvCase.appendChild(background);
                nouvCase.appendChild(highlight);
                nouvLigne.appendChild(nouvCase);

                let cell = new Case(compteur, x, y, nouvCase);
                cell.highlightImg = highlight;
                this.grille[x][y] = cell;
                compteur++;
            }
        }
    }

    ajouterEventListenerCases(nouvCase,x,y) {
        nouvCase.addEventListener("click", function() {
            if (this.grille[x][y].caseHighlight === true) { // case hihlight
                if (this.vehiculeSelectionne) {
                    this.vehiculeSelectionne.deplacerVehicule(this.grille[x][y]);
                    this.viderHighlight();
                    this.viderVehiculeSelectionne();
                    console.log("Déplacement de this.vehiculeSelectionne vers : " + x + ", " + y);
                }
                else
                {
                    console.log("erreur : aucune voiture selectionnée (malgré le highlight de la case)");   
                }
            }
            else if (!this.grille[x][y].estVide()) //case vehicule
                {
                    this.viderVehiculeSelectionne();
                    this.viderHighlight();
                    console.log("ahah Véhicule cliqué : " + this.grille[x][y].vehicule.id);
                    this.vehiculeSelectionne = this.grille[x][y].vehicule;
                    this.vehiculeSelectionne.etudeDeplacementPossible();
                }
            else{ //case vide
                console.log("Case cliquée : " + x + ", " + y);
                this.viderHighlight();
                this.viderVehiculeSelectionne();
            }
        console.log("vehicule selectionne : " + this.vehiculeSelectionne);

        }.bind(this));
    }

    viderHighlight() {
        for (let x = 0; x < this.lignes; x++) {
            for (let y = 0; y < this.colonnes; y++) {
                this.grille[x][y].setHighlightVisible(false);
            }
        }
    }

    viderVehiculeSelectionne() {
        this.vehiculeSelectionne = null;
    }

    ajouterVehicule(id, x, y, orientation) {
        // placer un véhicule sur la grille à partir de sa tête (x,y) et de son orientation
        let vehicule = this.listeVehicules.find(v => v.id === id);

        let caseActuelle = this.grille[x][y];
        caseActuelle.vehicule = vehicule;
        vehicule.cases[0] = caseActuelle;
        vehicule.orientation = orientation;
        
        for (let i = 1; i < vehicule.taille; i++) {
            if (orientation === "Nord") {
                caseActuelle = this.grille[x + i][y];
            } else if (orientation === "Sud") {
                caseActuelle = this.grille[x - i][y];
            } else if (orientation === "Est") {
                caseActuelle = this.grille[x][y - i];
            } else if (orientation === "Ouest") {
                caseActuelle = this.grille[x][y + i];
            }
            caseActuelle.vehicule = vehicule;
            vehicule.cases[i] = caseActuelle;
        }

        if (this.divGrille) {
            vehicule.initImgVehicule(this.divGrille);
            vehicule.updateDOMPosition();
        }
    }

}

function grilleCustom1(listeVehicules) 
{    
    let grilleCustom1 = new Plateau("Grille Custom 1", 6, 6, listeVehicules);
    return grilleCustom1;
}









