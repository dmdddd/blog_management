import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import BlogsList from "../components/BlogsList";
import axios from 'axios';

const BlogsListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Define a function to retrieve the data
        const loadBlogs = async () => {
            try {
                const response = await axios.get('/api/blogs');
                const blogsData = response.data;
                setBlogs(blogsData);
            } catch (e) {
                console.log("Blogs not found")
            }
        }
        loadBlogs();
    }, []);
    
    if (blogs.length === 0) {
        return <p>Loading blogs...</p>;
    }

    return (
        <>
        <h1>Blogs</h1>
        {/* <button onClick={() => {
            navigate('/blogs/add');
        }}>Create Blog</button> */}
        <BlogsList blogs={blogs} />
        </>
    );
}

export default BlogsListPage;