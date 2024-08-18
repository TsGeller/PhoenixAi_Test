import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import path from 'path';
import API_KEY from './apiKey.js'; 

const app = express();

const port = 3000;

/**
 * Fonction qui filtre les fichiers téléchargés en fonction de leur type MIME et de leur extension.
 *
 * @param {Object} file - L'objet représentant le fichier téléchargé *                          
 * @param {Function} cb - La fonction de rappel qui doit être appelée pour indiquer si le fichier est accepté ou non.            
 * @returns {void} - La fonction ne retourne rien directement, mais invoque la fonction de rappel `cb`.
 */
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées!'), false);
    }
};
/**
 * middleware qui permet de télécharger l'image en mémoire et filtre l'entrée. Ici on télécharge l'image en mémoire.
 */
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
/**
 * vérifie si la clé API est valide
 * @param {*} req  objet de la requete http qui contient la clé API
 * @param {*} res le resultat de la fonction
 */
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // Utiliser un en-tête HTTP pour la clé API

    if (apiKey === API_KEY) {
        next(); // Clé API valide, continuer le traitement
    } else {
        console.log('api key ', apiKey + ' ? '+API_KEY);
        res.status(403).send('Clé API invalide ou manquante');
    }
};

// Routes
app.get('/', (req, res) => {
    res.status(200).send('L application est fonctionelle');
});
/**
 * route qui redimmensionne l'image.
 * Si l'image est redimensionnée avec succès, elle est renvoyée au client avec le bon type MIME.
 * Si la longueur ou la largeur n'est pas fournie, un code d'état 400 est renvoyé avec un message d'erreur.
 * Si l'image n'est pas fournie, un code d'état 400 est renvoyé avec un message d'erreur.
 * Si une erreur survient lors du traitement de l'image, un code d'état 500 est renvoyé avec un message d'erreur.
 * L'image est télécchargée en mémoire grace au middlewar multer.
 */
app.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Aucun fichier image trouvé.');
        }
        const { width, height } = req.body;
        
        if (!width || !height) {
            return res.status(400).send('Les dimensions sont requises');
        }
        if (width < 1 || height < 1) {
            return res.status(400).send('Les dimensions sont requises');
        }

        const outputBuffer = await sharp(req.file.buffer)
            .resize(parseInt(width), parseInt(height), { fit: 'contain' })
            .toBuffer();

        const format = req.file.mimetype.split('/')[1];
        res.set('Content-Type', `image/${format}`);
        res.status(200).send(outputBuffer);
    } catch (error) {
        res.status(500).send(error);
    }
});
/**
 * Route qui a la même fonction que image mais vérifie la clé api avant de redimensionner l'image.
 * 2 middlewars sont utilisé ici, le premier pour vérifier la clé api et le deuxième pour redimensionner l'image.
 */
app.post('/imageWithKey', apiKeyMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { width, height } = req.body;

        if (!width || !height) {
            return res.status(400).send('Les dimensions sont requises');
        }

        const outputBuffer = await sharp(req.file.buffer)
            .resize(parseInt(width), parseInt(height), { fit: 'contain' })
            .toBuffer();

        const format = req.file.mimetype.split('/')[1];
        res.set('Content-Type', `image/${format}`);
        res.status(200).send(outputBuffer);
    } catch (error) {
        res.status(500).send('Erreur lors du traitement de l\'image');
    }
});
app.get('/testApiKey', apiKeyMiddleware, (req, res) => {
    res.status(200).send('Clé API valide');
});
// Middleware pour gérer les routes non trouvées
app.use((req, res, next) => {
    res.status(404).send('Désolé, la page demandée est introuvable.');
});
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export { app };
