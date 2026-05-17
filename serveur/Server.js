const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json());

// Servir tous les fichiers du frontend
app.use(express.static(path.join(process.cwd(), 'public')));

// Route par défaut (page d'accueil)
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

// ====================== API SCORES ======================
const scoresPath = path.join(process.cwd(), 'server/data/scores.json');

// Création automatique du fichier scores.json
function initScoresFile() {
    const dir = path.dirname(scoresPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(scoresPath)) fs.writeFileSync(scoresPath, '[]', 'utf-8');
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

// Sauvegarder un score
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

        // Tri : meilleur score puis meilleur temps
        scores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time.localeCompare(b.time);
        });

        scores = scores.slice(0, 100); // Top 100

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

// ====================== LANCER LE SERVEUR ======================
app.listen(PORT, () => {
    console.log(`Serveur Rush Hour Web lancé avec succès sur http://localhost:${PORT}`);
    console.log(`   → Menu   : http://localhost:${PORT}`);
    console.log(`   → Scores : http://localhost:${PORT}/api/scores`);
});