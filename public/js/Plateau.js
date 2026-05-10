//js n'a pas de fonction randint(min,max) prédefinie donc on doit la creer
function randomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

import { Case } from './Case.js';

class Plateau {
    constructor(nom, lignes, colonnes) {
        this.nom = nom;
        this.grille = [];
        this.lignes = lignes; 
        this.colonnes = colonnes;
        this.vehiculeSelectionne = null;
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

                const elem = document.createElement("img");
                elem.setAttribute("src", "/public/assets/casePlaceholder.png");
                elem.setAttribute("height", "150");
                elem.setAttribute("width", "150");

                //il faut ajouter un event listener a chaque case qui va gérer la liaison cruciale entre les parties de nos classes.
                nouvCase.addEventListener("click", function() {
                    console.log(this.vehiculeSelectionne);
                    if (this.grille[x][y].caseHighlight === true) {
                        // déplacer le véhicule vers cette case
                        if (this.vehiculeSelectionne) {
                            console.log("Déplacement vers : " + x + ", " + y);
                            this.vehiculeSelectionne.deplacerVehicule(this.vehiculeSelectionne, this.grille[x][y]);
                        }
                        console.log("Déplacement vers : " + x + ", " + y);
                        // TODO: implementer le deplacement
                    }
                    else if (!this.grille[x][y].estVide()) 
                        {
                            // selectionne le véhicule de cette case et affiche les déplacements possibles
                            this.viderHighlight();
                            console.log("Véhicule cliqué : " + this.grille[x][y].vehicule.id);
                            this.vehiculeSelectionne = this.grille[x][y].vehicule;
                            this.vehiculeSelectionne.etudeDeplacementPossible();
                        }

                    else{
                        console.log("Case cliquée : " + x + ", " + y);
                    }
                }.bind(this)); // pour pouvoir utiliser les propriétés de Plateau dans le listener
                nouvCase.appendChild(elem);
                nouvLigne.appendChild(nouvCase);

                let cell = new Case(compteur, x, y, nouvCase);
                this.grille[x][y] = cell;
                compteur++;
            }
        }
    }

    viderHighlight() {
        for (let x = 0; x < this.lignes; x++) {
            for (let y = 0; y < this.colonnes; y++) {
                this.grille[x][y].caseHighlight = false;
            }
        }
    }

    ajouterVehicule(vehicule, x, y, orientation) {
        // placer un véhicule sur la grille à partir de sa tête (x,y) et de son orientation
        //initialisation
        let caseActuelle = this.grille[x][y];
        caseActuelle.vehicule = vehicule[0];
        vehicule[0].case = caseActuelle;
        vehicule[0].orientation = orientation; 
  
        for (let i = 1; i < vehicule.length; i++) {
            vehicule[i].orientation = orientation; 
            
            if (orientation === "Nord") {
                caseActuelle = this.grille[x + i][y];
            } else if (orientation === "Sud") {
                caseActuelle = this.grille[x - i][y];
            } else if (orientation === "Est") {
                caseActuelle = this.grille[x][y - i];
            } else if (orientation === "Ouest") {
                caseActuelle = this.grille[x][y + i];
            }
            caseActuelle.vehicule = vehicule[i];
            vehicule[i].case = caseActuelle;
        }
        vehicule[0].orientation = orientation; // on stocke l'orientation dans la tête du véhicule
    }

}

function grilleCustom1() 
{    
    let grilleCustom1 = new Plateau("Grille Custom 1", 6, 6);
    return grilleCustom1;
}

export {Plateau, grilleCustom1};








