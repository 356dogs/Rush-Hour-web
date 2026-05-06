//js n'a pas de fonction randint(min,max) prédefinie donc on doit la creer
function randomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

import { Case } from './Case.js';

class Plateau {
    constructor(nom, lignes, colonnes) {
        this.nom = nom;
        this.grille = [];
        this.lignes = lignes; 
        this.colonnes = colonnes;
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
        console.log("wowow")
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
                nouvLigne.appendChild(nouvCase);

                let cell = new Case(compteur, x, y, nouvCase);
                this.grille[x][y] = cell;
                compteur++;
            }
        }
    }

    placerVehicule(vehicule, x, y) 
    {
        if (this.grille[x][y].estVide()) {
            this.grille[x][y].vehicule = vehicule;
        }
    }
}

function grilleCustom1() 
{    
    let grilleCustom1 = new Plateau("Grille Custom 1", 3, 6);
    return grilleCustom1;
}

export {Plateau, grilleCustom1};