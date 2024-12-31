import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import BlogsList from "../components/BlogsList";
import axios from 'axios';
import useUser from "../hooks/useUser";
import Pagination from "../components/ui/Pagination";
import { toast } from '../components/ui/Toast';

const BlogsListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const { user, isLoading } = useUser();
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
      });

    useEffect(() => {
        // Define a function to retrieve the data
        const loadBlogs = async (page, size) => {
            try {
                const token = user && await user.getIdToken();
                const headers = token ? { authtoken: token } : {};
                const response = await axios.get(`/api/blogs?page=${page}&size=${size}`, { headers });
                const blogsData = response.data.data;
                setBlogs(blogsData);
                setPagination(response.data.pagination);
            } catch (e) {
                toast.error("Error loading blogs: " + e.message)
            } finally {
                setBlogsLoading(false);
            }
        }
        if (!isLoading)
            loadBlogs(pagination.currentPage, pagination.pageSize);
    }, [isLoading, pagination.currentPage, pagination.pageSize]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, currentPage: page }));
      };
    
      const handlePageSizeChange = (size) => {
        setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
      };
    
    if (blogsLoading) {
        return <p>Loading blogs...</p>;
    }

    return (
        <>
            <h1>Blogs</h1>
            <button onClick={() => {
                navigate(`/create-blog`);
            }}>Create Blog</button>
            <BlogsList blogs={blogs} />
            <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </>
    );
}

export default BlogsListPage;