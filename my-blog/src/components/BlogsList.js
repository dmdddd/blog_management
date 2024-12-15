import { Link } from "react-router-dom";

const BlogsList = ({blogs}) => {
    return (
        <>
        {blogs.map(blog => (
            <Link key={blog.name} className="article-list-item" to={`/blogs/${blog.name}/articles`} state={{ blog }}>
                <h3>{blog.title}</h3>
                <p>{blog.description.substring(0, 150)}...</p>
            </Link>
        ))}
        </>
    );
}

export default BlogsList;