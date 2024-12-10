import { db } from '../db.js';
import { admin } from '../firebaseAdmin.js';
import { ObjectId } from 'mongodb';


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

    // Add new comment
    const result = await db.collection('comments').insertOne({
        postedBy: user, text, articleName: name, userEmail: req.user.email, "createdOn": new Date(), userIcon: userRecord.photoURL,
    });

    const comment = await db.collection('comments').findOne({ _id: result.insertedId });
    console.log(comment);
    if (comment) {
        comment.canDelete = req.user.email === comment.userEmail;
        res.status(201).json(comment);
    }
};

export const deleteCommentById = async (req, res) => {

    try {
        const { id } = req.params;

        // Find the comment by ID
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) });
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        // Check if the user is allowed to delete this comment
        const canRemoveComment = req.user.email === comment.userEmail;
        if (!canRemoveComment) {
            return res.status(403).send({ message: "You are not authorized to delete this comment" });
        }

        const result = await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
        if (result) {
            return res.status(200).send({ message: "Comment deleted successfully" });
        }
        
    } catch (error) {
        console.log(`Error deleting comment: ${error}`);
        return res.status(500).send({ message: "Error deleting comment", error });
    }
};


export const updateIconForComments = async (req, res) => {
    const { photoURL } = req.body;

    try {
        // Update all comments with the new user icon for the logged-in user
        const result = await db.collection('comments').updateMany(
            { userEmail: req.user.email },  // Filter: all comments by this user
            { $set: { userIcon: photoURL } }  // Update: set the new userIcon
        );

        // Check if any documents were updated
        if (result.modifiedCount > 0) {
            return res.status(200).send({ message: "User icons updated successfully" });
        }

        // No documents were updated (e.g., no matching comments found)
        return res.status(404).send({ message: "No comments found to update" });

    } catch (error) {
        console.error('Error while updating user icons for comments:', error);
        return res.status(500).send({ message: "An error occurred while updating user icons", error });
    }
};


export const editCommentById = async (req, res) => {

    try {
        const { id } = req.params;
        const { text } = req.body;

        // Find the comment by ID
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) });
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        // Check if the user is allowed to update this comment
        const canEditComment = req.user.email === comment.userEmail;
        if (!canEditComment) {
            return res.status(403).send({ message: "You are not authorized to update this comment" });
        }

        // Update the comment
        const result = await db.collection('comments').updateOne(
            { _id: new ObjectId(id) }, // Filter: Find by commentId
            { $set: { text: text, updatedAt: new Date() } } // Update operation
        );


        // Check if the update was successful
        if (result.modifiedCount > 0) {
            return res.status(200).send({ message: "Comment updated successfully" });
        }

        // If no document was modified, it might indicate the text was the same
        return res.status(400).send({ message: "No changes were made to the comment" });

    } catch (error) {
        console.error('Database error while editing comment:', error);
        return res.status(500).send({ message: "Error editing comment", error });
    }
};