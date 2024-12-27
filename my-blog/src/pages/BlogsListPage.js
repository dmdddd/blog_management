import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import BlogsList from "../components/BlogsList";
import axios from 'axios';
import useUser from "../hooks/useUser";

const BlogsListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const { user, isLoading } = useUser();

    useEffect(() => {
        // Define a function to retrieve the data
        const loadBlogs = async () => {
            try {
                const token = user && await user.getIdToken();
                const headers = token ? { authtoken: token } : {};
                const response = await axios.get('/api/blogs', { headers });
                const blogsData = response.data;
                setBlogs(blogsData);
            } catch (e) {
                console.log("Blogs not found")
            }
        }
        if (!isLoading)
            loadBlogs();
    }, [isLoading]);
    
    if (blogs.length === 0) {
        return <p>Loading blogs...</p>;
    }

    return (
        <>
        <h1>Blogs</h1>
        <button onClick={() => {
            navigate(`/create-blog`);
        }}>Create Blog</button>
        <BlogsList blogs={blogs} />
        </>
    );
}

export default BlogsListPage;