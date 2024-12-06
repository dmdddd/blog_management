import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from 'axios';
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
    // Adding a state "ArticleInfo" to the "ArticlePageComponent"
    // To set the state, we user setArticleInfo function
    // Currently initialized with { upvotes: 0, comments: [] }
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, canUpvote: false });
    const [articleComments, setArticleComments] = useState([]);
    const {canUpvote} = articleInfo;
    const [articleFound, setArticleFound] = useState(false);
    const navigate = useNavigate();

    // useState -> adds memory
    // useEffect -> updates it
    // Adding logic to our components, executed outside of the normal rendering

    const { user, isLoading } = useUser();
    
    useEffect(() => {
        // Define a function to retrieve the data
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            try {
                const response = await axios.get(`/api/articles/${articleId}`, { headers });
                const newArticleInfo = response.data;
                setArticleFound(true);
                setArticleInfo(newArticleInfo);
            } catch (e) {
                console.log("Article '" + articleId + "' not found")
            }

            try {
                const response = await axios.get(`/api/comments/${articleId}`, { headers });
                const newArticleComments = response.data;
                setArticleComments(newArticleComments);
            } catch (e) {
                console.log("Article '" + articleId + "' not found")
            }
        }
        if (!isLoading) {
            loadArticleInfo();
        }
    }, [isLoading, user]);

    const params = useParams();
    const articleId = params.articleId;

    const upDownVote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        if (articleInfo.upvoteIds && articleInfo.upvoteIds.includes(user.reloadUserInfo.localId)) {
            // Already upvoted, downvote
            try {
                const response = await axios.put(`/api/articles/${articleId}/downvote`, null, { headers });
                const updatedArticle = response.data;
                setArticleInfo(updatedArticle);
            } catch (e) {
                console.log("Error: " + e)
            }

        } else {
            // Never upvoted, upvote
            const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
            const updatedArticle = response.data;
            setArticleInfo(updatedArticle);
        }
    }

    if (articleFound)
    {
        // Atricle found
        return (
            <>
            <h1>{articleInfo.title}</h1>
            <div className="upvotes-section">
                { user
                    ? <button onClick={upDownVote}>{canUpvote ? 'Upvote' : 'Upvoted'}</button>
                    : <button onClick={ () => { navigate('/login'); } }>Log in to upvote</button>
                    }
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            {articleInfo.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
            { user
                ? <AddCommentForm
                    articleName={articleId}
                    onArticleupdated={updatedArticleComments => setArticleComments(updatedArticleComments)} />
                : <button onClick={ () => { navigate('/login'); } } >Log in to comment</button>
            }
            <CommentsList 
                comments={articleComments}
                onCommentRemoval={updatedArticleComments => setArticleComments(updatedArticleComments)}/>
            </>
        );
    } else {
        // Article not found
        return (
            <>
             <h1>Article not found</h1>
             <p>Requested article: {articleId}</p>
            </>
        )
    }
    
}

export default ArticlePage; 