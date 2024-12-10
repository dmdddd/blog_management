import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom';
import ArticlesList from "../components/ArticlesList";
import axios from 'axios';

const ArticlesListPage = () => {
    const [articles, setArticles] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        // Define a function to retrieve the data
        const loadArticles = async () => {
            try {
                const response = await axios.get('/api/articles');
                const articlesData = response.data;
                setArticles(articlesData);
            } catch (e) {
                console.log("Articles not found")
            }
        }
        loadArticles();
    }, []);
    
    return (
        <>
        <h1>Articles</h1>
        <button onClick={() => {
            navigate('/articles/add');
        }}>Create Article</button>
        <ArticlesList articles={articles} />
        </>
    );
}

export default ArticlesListPage;