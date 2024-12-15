import { useParams, useLocation } from 'react-router-dom';
import { BlogProvider } from './BlogContext';

export const BlogProviderWithParams = ({ children }) => {
    const { blogId } = useParams(); // Extract blogId from URL
    const location = useLocation(); // Access location state
    const blog = location.state?.blog; // Retrieve blog data from state

return (
    <BlogProvider blogId={blogId} blog={blog}>
        {children}
    </BlogProvider>
    );
};