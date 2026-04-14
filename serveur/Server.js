const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir tous les fichiers du dossier public
app.use(express.static(path.join(process.cwd(), 'public')));

// Route par défaut : si on va sur / → on sert index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

// ====================== API ======================

// Générer une map aléatoire
app.get('/api/map', (req, res) => {
    const difficulty = req.query.diff || 'medium';
    const gridSize = difficulty === 'hard' ? 8 : difficulty === 'medium' ? 7 : 6;

    // Pour l’instant : map très simple (tu l’amélioreras plus tard)
    const map = {
        gridSize: gridSize,
        cars: [
            { id: 1, row: 0, col: 0, length: 2, direction: 'horizontal', color: 'red' },
            { id: 2, row: 2, col: 1, length: 3, direction: 'vertical', color: 'blue' },
            { id: 3, row: 4, col: 3, length: 2, direction: 'horizontal', color: 'green' }
        ],
        exit: { row: 2, col: gridSize - 1 }
    };

    res.json(map);
});

// Gestion des scores
const scoresPath = path.join(process.cwd(), 'server/data/scores.json');

// Créer le dossier data s’il n’existe pas
if (!fs.existsSync(path.join(process.cwd(), 'server/data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'server/data'), { recursive: true });
}

app.get('/api/scores', (req, res) => {
    if (!fs.existsSync(scoresPath)) {
        fs.writeFileSync(scoresPath, '[]');
    }
    const scores = JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));
    res.json(scores);
});

app.post('/api/scores', (req, res) => {
    const { playerName, score, time, difficulty } = req.body;

    if (!playerName || score === undefined) {
        return res.status(400).json({ error: "Données manquantes" });
    }

    let scores = [];
    if (fs.existsSync(scoresPath)) {
        scores = JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));
    }

    scores.push({
        playerName,
        score: Number(score),
        time,
        difficulty,
        date: new Date().toISOString()
    });

    // Trier et garder les 50 meilleurs
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 50);

    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
    res.json({ message: 'Score sauvegardé avec succès !' });
});

app.listen(PORT, () => {
    console.log(`🚗 Serveur Rush Hour Web lancé sur http://localhost:${PORT}`);
    console.log(`   → Menu : http://localhost:${PORT}`);
    console.log(`   → API Map : http://localhost:${PORT}/api/map?diff=medium`);
});