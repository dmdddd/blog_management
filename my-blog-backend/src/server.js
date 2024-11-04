
import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';
import { ObjectId } from 'mongodb';
import 'dotenv/config';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

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

app.get('/api/articles', async (req, res) => {
    const articles = await db.collection('articles').find().toArray();
    if (articles) {
        res.json(articles);
    } else {
        res.sendStatus(404);
    }
});

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

app.get('/api/comments/:name', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const comments = await db.collection('comments').find({ articleName: name }).toArray();

    if (comments) {
        comments.forEach(function (comment) {
            comment.canDelete = req.user.email === comment.userEmail;
        });
        res.json(comments);
    } else {
        // No comments found for the article
        res.json([]);
    }
});


app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});

app.delete('/api/comments/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) });
        if (comment) {
            const canRemoveComment = req.user.email === comment.userEmail;
            if (canRemoveComment) {
                const result = await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
                if (result) {
                    res.status(200).send({ message: "Item deleted successfully" });
                }
            }
        } else {
            res.status(404).send({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error deleting item", error });
    }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);
   
        if (canUpvote) {
            await db.collection('articles').updateOne({ name }, {
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid },
            });
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        updatedArticle.canUpvote = false;
        res.json(updatedArticle);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.put('/api/articles/:name/downvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        const canDownvote = uid && upvoteIds.includes(uid);

        if (canDownvote) {
            await db.collection('articles').updateOne({ name }, {
                $inc: { upvotes: -1 },
                $pull: { upvoteIds: uid },
            });
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        updatedArticle.canUpvote = true;
        res.json(updatedArticle);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.post('/api/comments/add/:name', async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const user = req.user.name || req.user.email;

    await db.collection('comments').insertOne({
        postedBy: user, text, articleName: name, userEmail: req.user.email,
    });
    const comments = await db.collection('comments').find({ articleName: name }).toArray();

    if (comments) {
        // Adding the canDelete tag, otherwise, the comment deletion button will not appear
        comments.forEach(function (comment) {
            comment.canDelete = req.user.email === comment.userEmail;
        });
        res.json(comments);
    }
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
    console.log('Successfully connected to database!');
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT);
    });
})
