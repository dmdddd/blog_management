import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To extract blogId from the URL
import axios from 'axios';
import useUser from '../hooks/useUser';

// Create BlogContext
const BlogContext = createContext();

// Define the BlogProvider
export const BlogProvider = ({ blogId, blog: initialBlog, children }) => {
    const [currentBlog, setCurrentBlog] = useState(initialBlog || null); // Use provided blog or null
    const [blogPages, setBlogPages] = useState([]); // Use provided blog or null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isLoading } = useUser();

    
    useEffect(() => {

      // Define a function to retrieve the data
        const loadBlogInfo = async () => {
          // If no initial blog data is provided, fetch the blog by ID
          if (!currentBlog && blogId) {
              setLoading(true);
              setError(null);
              const token = user && await user.getIdToken();
              const headers = token ? { authtoken: token } : {};
              axios
              .get(`/api/blogs/${blogId}`, { headers }) // Replace with your actual API endpoint
              .then((response) => {
                  setCurrentBlog(response.data); // Set the fetched blog data
              })
              .catch((err) => {
                  setError(err.message || 'Failed to fetch blog');
              })
              .finally(() => {
                  setLoading(false);
            });
          }
        }
        if (!isLoading) { // User data loaded
          loadBlogInfo();
      }
    }, [currentBlog, blogId, isLoading]); // Re-fetch only if no blog data and blogId changes


  useEffect(() => {
    const fetchPages = async () => {
      try {
        // const token = user && await user.getIdToken();
        // const headers = token ? { authtoken: token } : {};
        const response = await fetch(`/api/blogs/${blogId}/pages`);
        if (!response.ok) throw new Error(`Failed to fetch blog pages for ${blogId}`);
        const pages = await response.json();
        setBlogPages(pages.sort((a, b) => a.order - b.order)); // Sort by order
      } catch (err) {
        console.error(err);
      }
    };
  
    if (blogId) fetchPages();
  }, [blogId]);

  const updatePageContent = async (pageId, newPage) => {
      const updatedPages = blogPages.map((page) =>
          page._id === pageId ? newPage : page
      );
      setBlogPages(updatedPages);
      return updatedPages;
  };

  const deletePage = async (pageId) => {
    const updatedPages = blogPages.filter((page) => page._id !== pageId);
    setBlogPages(updatedPages);
    return updatedPages;
};

  // Provide the blog data to the context
  return (
    <BlogContext.Provider value={{ currentBlog, blogPages, updatePageContent, deletePage, loading, error }}>
      {children}
    </BlogContext.Provider>
  );
};


// Custom hook to use BlogContext
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};