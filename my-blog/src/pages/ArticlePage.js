import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";

const ArticlePage = () => {
    // Adding a state "ArticleInfo" to the "ArticlePageComponent"
    // To set the state, we user setArticleInfo function
    // Currently initialized with { upvotes: 0, comments: [] }
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });


    // useState -> adds memory
    // useEffect -> updates it
    // Adding logic to our components, executed outside of the normal rendering

    useEffect(() => {
        // Define a function to retrieve the data
        const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }
        // Use the defined function
        loadArticleInfo();
    }, []);

    const params = useParams();
    const articleId = params.articleId;
    const article = articles.find(article => article.name === articleId)

    const addUpvote = async () => {
        const response = await axios.put(`/api/articles/${articleId}/upvote`);
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (!article){
        return <NotFoundPage />
    }
    
    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            <button onClick={addUpvote}>Upvote</button>
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
        ))}
        <AddCommentForm
            articleName={articleId}
            onArticleupdated={updatedArticle => setArticleInfo(updatedArticle)} />
        <CommentsList comments={articleInfo.comments}/>
        </>
    );
}

export default ArticlePage; 