import { db } from '../db.js';

export const getAllArticles = async (req, res) => {
    const articles = await db.collection('articles').find().toArray();
    if (articles) {
        res.json(articles);
    } else {
        res.sendStatus(404);
    }
};

export const getArticleByName = async (req, res) => {
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
};

export const voteOnArticle = async (req, res) => {
    try {
        const { name } = req.params;
        const { uid } = req.user;
        const voteType = req.query.type;

        // Fetch the article from the database
        const article = await db.collection('articles').findOne({ name });
        if (!article) {
            return res.status(404).send("That article doesn't exist");
        }
        
        const upvoteIds = article.upvoteIds || [];

        if (voteType === "up") {
            await handleUpvote(name, uid, upvoteIds);
        } else if (voteType === "down") {
            await handleDownvote(name, uid, upvoteIds);
        } else {
            return res.status(400).send("Invalid vote type");
        }

        // Return updated article
        const updatedArticle = await db.collection('articles').findOne({ name });
        updatedArticle.canUpvote = uid && !updatedArticle.upvoteIds.includes(uid);
        res.json(updatedArticle);
    } catch (error) {
        console.error("Error handling vote:", error);
        res.status(500).send("An error occurred while processing the vote");
    }
};

// Helper function for upvote
const handleUpvote = async (name, uid, upvoteIds) => {
    const canUpvote = uid && !upvoteIds.includes(uid);
    if (canUpvote) {
        await db.collection('articles').updateOne(
            { name },
            {
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid },
            }
        );
    }
};

// Helper function for downvote
const handleDownvote = async (name, uid, upvoteIds) => {
    const canDownvote = uid && upvoteIds.includes(uid);
    if (canDownvote) {
        await db.collection('articles').updateOne(
            { name },
            {
                $inc: { upvotes: -1 },
                $pull: { upvoteIds: uid },
            }
        );
    }
};

export const downvoteArticle = async (req, res) => {
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
};


