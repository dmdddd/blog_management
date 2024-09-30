import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
    // Adding a state "ArticleInfo" to the "ArticlePageComponent"
    // To set the state, we user setArticleInfo function
    // Currently initialized with { upvotes: 0, comments: [] }
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, content: [], comments: [], canUpvote: false });
    const {canUpvote} = articleInfo;
    const [articleFound, setArticleFound] = useState(false);

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
        }
        if (!isLoading) {
            loadArticleInfo();
        }
    }, [isLoading, user]);

    const params = useParams();
    const articleId = params.articleId;

    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (articleFound)
    {
        // Atricle found
        return (
            <>
            <h1>{articleInfo.title}</h1>
            <div className="upvotes-section">
                { user
                    ? <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
                    : <button>Log in to upvote</button>
                    }
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            {articleInfo.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
            { user
                ? <AddCommentForm
                    articleName={articleId}
                    onArticleupdated={updatedArticle => setArticleInfo(updatedArticle)} />
                : <button>Log in to add a comment</button>
            }
            <CommentsList comments={articleInfo.comments}/>
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