//js n'a pas de fonction randint(min,max) prédefinie donc on doit la creer
function randomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

class Plateau {
    constructor(nom, lignes, colonnes, listeVehicules, difficulté,scoreDebut) {
        this.nom = nom;
        this.grille = [];
        this.lignes = lignes; 
        this.colonnes = colonnes;
        this.vehiculeSelectionne = null;
        this.listeVehicules = listeVehicules;
        this.difficulté = difficulté;
        this.divGrille = null;
        this.nbdeplacements = 0;
        this.scoreDebut = scoreDebut;
        this.score = scoreDebut;

        this.timerSecondes = 0;
        this.timerInterval = null;
        
        this.updateScoreDisplay();
        this.demarreTimer();

    }

    demarreTimer() {
        setTimeout(() => {
        this.timerInterval = setInterval(() => {
            this.timerSecondes++;
            this.updateTexteTimer();
            this.updateScoreDisplay();
        }, 1000)}, 1000); // délai de 1 secondes avant de démarrer le timer
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    updateTexteTimer() {
        const minutes = Math.floor(this.timerSecondes / 60);
        const seconds = this.timerSecondes % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = 
                String(minutes).padStart(2, '0') + ':' + 
                String(seconds).padStart(2, '0');
        }
    }

    updateMovesDisplay() {
        const movesElement = document.getElementById('moves');
        if (movesElement) {
            movesElement.textContent = this.nbdeplacements;
        }
    }

    calculerScore() {
        // formule: base de 1000 - 5 * nbSecondes - 10 * nbdeplacements, avec un minimum de 10 points
        this.score = this.scoreDebut - (this.timerSecondes * 5) - (this.nbdeplacements * 10); // évite un score négatif
        if (this.score < 100) {
            this.score = 100; // score minimum de 100
        }
        this.score = Math.round(this.score);
    }

    updateScoreDisplay() {
        this.calculerScore();
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = this.score;
        console.log("Score mis à jour: " + this.score);
    }

    formaterTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
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
                background.setAttribute("src", "./assets/backgroundCase.png");
                background.setAttribute("draggable", "false");
                background.setAttribute("height", "150px");
                background.setAttribute("width", "150px");

                //img de highlight de la case
                const highlight = document.createElement("img");
                highlight.setAttribute("src", "./assets/highlight.png");
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
                    this.nbdeplacements++;
                    this.updateMovesDisplay();
                    this.updateScoreDisplay();
                    this.viderHighlight();
                    this.viderVehiculeSelectionne();
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
                    this.vehiculeSelectionne = this.grille[x][y].vehicule;
                    this.vehiculeSelectionne.etudeDeplacementPossible();
                }
            else{ //case vide
                this.viderHighlight();
                this.viderVehiculeSelectionne();
            }
        console.log("x : " + x + " y : " + y);
        if(this.listeVehicules[0].aGagner() === true) {
            this.victoire();
            return;
        }
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
        vehicule.initImgVehicule(this.divGrille);
    }

    desactiverCases()
    {
        for (let x = 0; x < this.lignes; x++) {
            for (let y = 0; y < this.colonnes; y++) {
                this.grille[x][y].divCase.style.pointerEvents = "none";
            }
        }
    }

       victoire() {
        this.stopTimer();
        this.updateScoreDisplay();
        this.desactiverCases();
        this.afficherFormulaireFin();
    }

       afficherFormulaireFin() {
        const fin = document.getElementById('finJeu');
        const form = document.getElementById('scoreForm');
        if (!fin || !form) return;

        const finalScore = document.getElementById('finalScore');
        const finalTime = document.getElementById('finalTime');
        const finalMoves = document.getElementById('finalMoves');
        const diffField = document.getElementById('difficultyField');
        const status = document.getElementById('saveStatus');

        this.calculerScore();

        if (finalScore) finalScore.value = this.score;
        if (finalTime) finalTime.value = this.formaterTime(this.timerSecondes);
        if (finalMoves) finalMoves.value = this.nbdeplacements;
        if (diffField) diffField.value = this.difficulté || 'Facile';
        if (status) status.textContent = '';

        fin.style.display = 'block';

        if (!this._formHandlersAttached) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('playerName');
                const saveStatus = document.getElementById('saveStatus');

                if (!nameInput || !nameInput.value.trim()) {
                    if (saveStatus) saveStatus.textContent = 'Veuillez entrer un nom.';
                    return;
                }

                if (saveStatus) saveStatus.textContent = 'Envoi en cours...';

                const res = await this.envoyerScoreAuServeur(nameInput.value.trim());

                if (res.ok) {
                    if (saveStatus) saveStatus.textContent = 'Score enregistré avec succès !';
                    setTimeout(() => {
                        fin.style.display = 'none';
                    }, 1500);
                } else {
                    if (saveStatus) saveStatus.textContent = 'Erreur : ' + (res.error || 'Impossible de sauvegarder');
                }
            });

            const cancelBtn = document.getElementById('cancelSave');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    fin.style.display = 'none';
                });
            }

            this._formHandlersAttached = true;
        }
    }

        async envoyerScoreAuServeur(playerName) {
        if (!playerName || playerName.trim() === '') {
            return { ok: false, error: 'Nom requis' };
        }

        this.calculerScore();

        const payload = {
            playerName: playerName.trim(),
            score: this.score,
            time: this.formaterTime(this.timerSecondes),
            difficulty: this.difficulté || 'Facile',
            moves: this.nbdeplacements
        };

        try {
            const response = await fetch('http://localhost:3000/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Erreur serveur');
            }

            const data = await response.json();
            console.log('Score sauvegardé avec succès', data);
            return { ok: true, data };

        } catch (error) {
            console.error('Erreur lors de l\'envoi du score:', error);
            return { ok: false, error: error.message };
        }
    }
}

function grilleCustom1(listeVehicules) 
{    
    let grille = new Plateau("Grille Custom 1", 6, 6, listeVehicules, "Facile", 2000);
    grille.creationGrille(document.getElementById('plateauDeJeu'));
    grille.creationVoisinage();
    grille.grille[2][5].caseVictoire = true;

    grille.ajouterVehicule(0, 2, 2, 'Est');
    grille.ajouterVehicule(1,5,3,'Est');
    grille.ajouterVehicule(2, 3, 4, 'Ouest');
    grille.ajouterVehicule(3, 1,1,'Sud');
    grille.ajouterVehicule(5, 0, 3, 'Nord');
    grille.ajouterVehicule(6, 0, 5, 'Nord');
    
    return grille;
}









