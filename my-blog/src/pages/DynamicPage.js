import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css'; // Import Quill styling
import useUser from "../hooks/useUser";
import TitleAndContentEditor from '../components/TitleAndContentEditor';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import slugify from 'slugify';
import DOMPurify from 'dompurify';
import { toast } from '../components/ui/Toast';
import DeletionConfirmationModal from '../components/ui/DeletionConfirmationModal';



const DynamicPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { blogId, dynamicPageSlug } = useParams();
    const { currentBlog, blogPages, updatePageContent, deletePage, loading, error } = useBlog();
    const [loadedPage, setLoadedPage] = useState(false);
    const [pageContent, setPageContent] = useState(null); // State to store the matched page
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [formErrors, setFormErrors] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (blogPages?.length) {
        // Find the page where the slug matches the dynamicPageSlug
        const matchedPage = blogPages.find(
            (page) => page.slug === dynamicPageSlug
        );
        setPageContent(matchedPage);
        setLoadedPage(true)
        }
    }, [blogPages, currentBlog, dynamicPageSlug]);

    const handleSave = async (editedTitle, editedContent) => {
        try {
            if (!pageContent) return;

            // Call API to save the updated content
            const titleChanged = pageContent.title !== editedTitle;
            const generatedSlug = slugify(editedTitle, {
              lower: true,
              strict: true,
            });

            if (editedContent === "<p><br></p>") editedContent = ""; // Quilt's default for empty text
            const updates = {slug: generatedSlug, title: editedTitle, content: editedContent};
            const response = await axios.put(`/api/blogs/${currentBlog.name}/pages/${pageContent.slug}`, updates);
            const updatedPage = response.data;
            setPageContent(updatedPage) // Update local state
            setIsEditing(false); // Exit edit mode

            updatePageContent(updatedPage._id, updatedPage)
            toast.success('Page updated successfully!');
            setFormErrors('');
            if (titleChanged) {
              navigate(`/blogs/${currentBlog.name}/pages/${generatedSlug}`);
            }
        } catch (error) {
            // Form validation errors
            if (error?.response.status === 400) {
                setFormErrors(error.response.data.errors);
            } else if (error?.response.status === 403) {
                toast.error(error.response?.data?.message);
            } else {
                toast.error('Error editing page content: ' + error?.message);
            }
        }
    };

  const handleDelete = async () => {
    setIsModalOpen(false)

    try {
        if (!pageContent) return;
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.delete(`/api/blogs/${currentBlog.name}/pages/${pageContent.slug}`,{headers});
        if (response.status === 204) {
            toast.success(`Page ${pageContent.title} deleted successfully!`);
            deletePage(pageContent._id)
            navigate(`/blogs/${currentBlog.name}/articles`);
        }
    } catch (error) {
        if (error?.response.status === 403) {
            toast.error(error.response?.data?.message);
        } else {
            toast.error('Error deleting page: ' + error.response?.data?.message);
        }
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!loadedPage) {
      // Show skeleton placeholders while loading
      return (
          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
              {/* Simulate a blog title */}
              <Skeleton height={40} width="60%" style={{ marginBottom: '20px' }} />

              {/* Simulate the blog content */}
              <Skeleton count={10} height={20} style={{ marginBottom: '10px' }} />
              <Skeleton height={20} width="80%" style={{ marginBottom: '10px' }} />
          </div>
      );
  }

  if (loadedPage && !pageContent) return <p>Page not found.</p>;

  return (
    <div>
      {isEditing ? (
        <div>
          <br/>
          <TitleAndContentEditor 
          initialTitle={pageContent.title} 
          initialContent={pageContent.content} 
          formErrors={formErrors} 
          onSave={handleSave} 
          onCancel={() => {setIsEditing(false); setFormErrors('');}} />
        </div>
      ) : (
        <div>
          <h1>{pageContent?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageContent.content) }} />
          { ( currentBlog?.admin || currentBlog?.editor ) && <button onClick={() => setIsEditing(true)}>Edit</button> }
          { currentBlog?.admin && <button onClick={() => setIsModalOpen(true)}>Delete</button> }
        </div>
      )}

      <DeletionConfirmationModal
          isOpen={isModalOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsModalOpen(false)}
          title="Are you sure you want to delete this page?"
          message="This action cannot be undone."
      />
    </div>
  );
};

export default DynamicPage;