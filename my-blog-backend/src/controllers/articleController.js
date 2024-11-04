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

export const upvoteArticle = async (req, res) => {
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


