import express from 'express';
import { connectToDb } from './db.js';
import { admin } from './firebaseAdmin.js';
import 'dotenv/config';
import path from 'path';
import { getAllArticles, getArticleByName, upvoteArticle, downvoteArticle } from './controllers/articleController.js';
import { getCommentsForArticle, addCommentToArticle, deleteCommentById, updateIconForComments, editCommentById } from './controllers/commentController.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.use(async (req, res, next) => {
    const { authtoken } = req.headers;

    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
            return res.sendStatus(400);
        }
    }

    req.user = req.user || {};

    next();
});

app.get('/api/articles', getAllArticles);
app.get('/api/articles/:name', getArticleByName);
app.get('/api/comments/:name', getCommentsForArticle);

app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});

app.put('/api/articles/:name/upvote', upvoteArticle);
app.put('/api/articles/:name/downvote', downvoteArticle);

app.delete('/api/comments/delete/:id', deleteCommentById);
app.post('/api/comments/add/:name', addCommentToArticle);
app.put('/api/comments/edit/:id', editCommentById);
app.post('/api/comments/updateIcon', updateIconForComments);

const PORT = process.env.PORT || 8080;

connectToDb(() => {
    console.log('Successfully connected to database!');
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT);
    });
})
