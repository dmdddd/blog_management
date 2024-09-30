import { useState, useEffect } from "react"
import ArticlesList from "../components/ArticlesList";
import axios from 'axios';

const ArticlesListPage = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        // Define a function to retrieve the data
        const loadArticles = async () => {
            try {
                const response = await axios.get('/api/articles');
                const articlesData = response.data;
                setArticles(articlesData);
                // console.log(articles);
            } catch (e) {
                console.log("Articles not found")
            }
        }
        loadArticles();
    }, []);
    
    return (
        <>
        <h1>Articles</h1>
        <ArticlesList articles={articles} />
        </>
    );
}

export default ArticlesListPage;