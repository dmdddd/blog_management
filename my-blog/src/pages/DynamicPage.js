import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styling
import useUser from "../hooks/useUser";

const DynamicPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { blogId, dynamicPageSlug } = useParams();
    const { currentBlog, blogPages, updatePageContent, loading, error } = useBlog();
    const [pageContent, setPageContent] = useState(null); // State to store the matched page
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [editedContent, setEditedContent] = useState(''); // Store edited content

    useEffect(() => {
        if (blogPages?.length) {
        // Find the page where the slug matches the dynamicPageSlug
        const matchedPage = blogPages.find(
            (page) => page.slug === dynamicPageSlug
        );
        setPageContent(matchedPage);
        setEditedContent(matchedPage.content);
        }
    }, [currentBlog, dynamicPageSlug]);

    const handleSave = async () => {
        try {
            if (!pageContent) return;

            // Call API to save the updated content
            await axios.put(`/api/blogs/${currentBlog.name}/pages/${pageContent.slug}`, {
                content: editedContent,
            });

            // Update the local state
            setPageContent((prev) => ({ ...prev, content: editedContent }));
            setIsEditing(false); // Exit edit mode

            updatePageContent(pageContent._id, pageContent)
        } catch (err) {
            console.error('Error saving page content:', err);
            alert('Failed to save changes. Please try again.');
        }
    };

  const handleDelete = async () => {
    try {
        if (!pageContent) return;
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.delete(`/api/blogs/${currentBlog.name}/pages/${pageContent.slug}`,{headers});
        if (response.status === 204) {
            navigate(`/blogs/${currentBlog.name}/articles`);
        }
    } catch (error) {
        console.error('Error deleting page:', error);
    }
  }

    //   if (loading) return <div>Loading...</div>;
//   if (!blogPages) return <div>Page not found</div>;
//   if (!currentBlog) return <div>Blog not found</div>;
//   if (error) return <div>Error: {error}</div>;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pageContent) return <p>Page not found.</p>;

  return (
    <div>
      <h1>{pageContent?.title}</h1>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="10"
            cols="50"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default DynamicPage;