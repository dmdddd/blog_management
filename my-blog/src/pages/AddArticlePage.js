import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import ErrorMessage from '../components/ui/ErrorMessage';
import slugify from 'slugify';
import axios from 'axios';
import { useBlog } from '../context/BlogContext';
import ReactQuill from 'react-quill';
import useUser from '../hooks/useUser';

const AddArticlePage = () => {
    const { currentBlog, loading, blogLoadingError } = useBlog();
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formErrors, setFormErrors] = useState('');
    const { user } = useUser();

    const navigate = useNavigate();

    // Handle title input and dynamically generate the slug if it hasn't been manually edited
    const handleTitleChange = (e) => {
        const inputTitle = e.target.value;
        setTitle(inputTitle);

        const generatedSlug = slugify(inputTitle, {
            lower: true,
            strict: true,
        });
        setSlug(generatedSlug);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate slug
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            setError('Invalid slug. Only lowercase letters, numbers, and hyphens are allowed.');
            return;
        }

        try {
            const response = await axios.get(`/api/blogs/${currentBlog.name}/articles/checkSlug/${slug}`);
            if (!response.data.isUnique) {
                setError('Article with this name already exists in the blog. Please choose a different one.');
                setSuccess('');
                return;
            }

            // Submit the article
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            await axios.post(`/api/blogs/${currentBlog.name}/articles`, { blog:currentBlog.name, title, name:slug, content:content }, { headers });
            setSuccess('Article created successfully!');
            setError('');
            setFormErrors('');
            // Go to the new article
            navigate(`/blogs/${currentBlog.name}/articles/${slug}`);
        } catch (err) {
            // Form validation errors
            if (err.response?.status === 400) {
                setError('');
                setFormErrors(err.response.data.errors);
            } else if (err.response?.status === 403) {
                setError(err.response.data.message);
            } else {
                setError(`Failed to create the article: ${err}`);
            }
            setSuccess('');
        }
    };
      
    return (
        <div>
            <h1>Add New Article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <ErrorMessage message={formErrors.title} />
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter article title"
                        required
                    />
                </div>
                {/* Dynamic URL preview */}
                <div>
                    <p>Preview URL: <strong>/articles/{slug}</strong></p>
                </div>
                <div>
                    <label>Content:</label>
                    <ErrorMessage message={formErrors.content} />
                    <ReactQuill 
                        value={content} 
                        onChange={setContent} 
                    />
                </div>
                <button type="submit">Add Article</button>
            </form>

            {/* Display success or error messages */}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AddArticlePage;