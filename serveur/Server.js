const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json());

// Servir tous les fichiers du dossier public 
app.use(express.static(path.join(process.cwd(), 'public')));

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});


// ====================== SCORES ======================
const scoresPath = path.join(process.cwd(), 'server/data/scores.json');

// Initialisation du fichier scores
function initScoresFile() {
    const dir = path.dirname(scoresPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(scoresPath)) {
        fs.writeFileSync(scoresPath, '[]', 'utf-8');
    }
}
initScoresFile();

// Récupérer les scores
app.get('/api/scores', (req, res) => {
    try {
        const scores = JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));
        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la lecture des scores" });
    }
});

// Ajouter un score
app.post('/api/scores', (req, res) => {
    try {
        const { playerName, score, time, difficulty, moves } = req.body;

        if (!playerName || score === undefined || !time || !difficulty) {
            return res.status(400).json({ error: "Données incomplètes" });
        }

        let scores = JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));

        const newScore = {
            id: Date.now(),
            playerName: playerName.trim(),
            score: Number(score),
            time: time,
            moves: moves || 0,
            difficulty: difficulty,
            date: new Date().toISOString()
        };

        scores.push(newScore);

        // Tri : meilleur score d'abord, puis meilleur temps
        scores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time.localeCompare(b.time);
        });

        scores = scores.slice(0, 100);

        fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));

        res.status(201).json({ 
            message: 'Score sauvegardé avec succès !',
            position: scores.findIndex(s => s.id === newScore.id) + 1
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Supprimer tous les scores 
app.delete('/api/scores', (req, res) => {
    try {
        fs.writeFileSync(scoresPath, '[]');
        res.json({ message: 'Tous les scores ont été supprimés' });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
});

// ====================== LANCER LE SERVEUR ======================
app.listen(PORT, () => {
    console.log(`Serveur Rush Hour Web lancé avec succès !`);
    console.log(`   → http://localhost:${PORT}`);
    console.log(`   → Menu          : http://localhost:${PORT}`);
    console.log(`   → Map           : http://localhost:${PORT}/api/map?diff=medium`);
    console.log(`   → Scores        : http://localhost:${PORT}/api/scores`);
});
