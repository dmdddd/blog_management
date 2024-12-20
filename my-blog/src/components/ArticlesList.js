import { Link } from "react-router-dom";

const ArticlesList = ({articles, blog}) => {
    if (!blog){
        return <p>Loading</p>
    }

    const stripHtmlTags = (html) => {
        return html.replace(/<[^>]*>/g, '');
     }

    return (
        <>
        {articles.map(article => (
            <Link key={article.name} className="article-list-item" to={`/blogs/${article.blog}/articles/${article.name}`} state={{ blog }}>
                <h3>{article.title}</h3>
                <p>{stripHtmlTags(article.content.substring(0, 150))}...</p>
            </Link>
        ))}
        </>
    );
}

export default ArticlesList;