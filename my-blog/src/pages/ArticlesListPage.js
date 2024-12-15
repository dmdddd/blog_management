import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArticlesList from "../components/ArticlesList";
import axios from 'axios';
import { useBlog } from '../context/BlogContext';  // Access blog context

const ArticlesListPage = () => {
    const { blogId } = useParams(); // URL parameter
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const { currentBlog, loading, error } = useBlog();


    // Fetch articles
    useEffect(() => {
        const loadArticles = async () => {
            try {
                const response = await axios.get(`/api/blogs/${blogId}/articles`);
                const articlesData = response.data;
                setArticles(articlesData);
            } catch (e) {
                console.log(`Articles not found for ${blogId}`);
            }
        };
        loadArticles();
    }, [blogId]); // Re-run if blogId changes

    if (!currentBlog) {
        return <p>Loading blog details...</p>;  // Show loading if blog is not yet loaded
    }

    if (articles.length === 0) {
        return <p>Loading articles...</p>; // Show loading if articles are still being fetched
    }

    if (loading) {
        return <div>Loading blog...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
        <>
        <h1>{currentBlog.name.title}</h1>
        <p>{currentBlog.name.description}</p>
        <h2>Articles</h2>
        <button onClick={() => {
            navigate(`/blogs/${currentBlog.name}/articles/add`);
        }}>Create Article</button>
        <ArticlesList articles={articles} blog={currentBlog.name} />
        </>
    );
}

export default ArticlesListPage;