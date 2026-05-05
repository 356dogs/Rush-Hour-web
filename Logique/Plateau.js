//js n'a pas de fonction randint(min,max) prédefinie donc on doit la creer
function randomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

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
    
    creation_grille(difficulte) {    
    }
}