import { db } from '../db.js';

export const getAllArticles = async (req, res) => {
    const articles = await db.collection('articles').find().toArray();
    if (articles) {
        res.json(articles);
    } else {
        res.sendStatus(404);
    }
};


export const getCommentsForArticle = async (req, res) => {
    const { name } = req.params;

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
};

export const addCommentToArticle = async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const user = req.user.name || req.user.email;
    const userRecord = await admin.auth().getUser(req.user.uid); // retrieve user record from firebase

    await db.collection('comments').insertOne({
        postedBy: user, text, articleName: name, userEmail: req.user.email, "createdOn": new Date(), userIcon: userRecord.photoURL,
    });
    const comments = await db.collection('comments').find({ articleName: name }).toArray();

    if (comments) {
        // Adding the canDelete tag, otherwise, the comment deletion button will not appear
        comments.forEach(function (comment) {
            comment.canDelete = req.user.email === comment.userEmail;
        });
        res.json(comments);
    }
};

export const deleteCommentById = async (req, res) => {
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
};


export const updateIconForComments = async (req, res) => {
    const { photoURL } = req.body;

    try {
        const result = await db.collection('comments').updateMany(
            { userEmail: req.user.email },  // Filter: all comments by this user
            { $set: { userIcon: photoURL } }  // Update: set the new userIcon
        );
        if (result) {
            res.status(200).send({ message: "URLs updated successfully" });
        } else {
            res.status(404).send({ message: "URLs not found" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating URLs", error });
    }
};