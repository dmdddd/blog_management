import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import useUser from '../hooks/useUser';
import ErrorMessage from '../components/ui/ErrorMessage';
import slugify from 'slugify';
import axios from 'axios';
// import { useBlog } from '../context/BlogContext';
import ReactQuill from 'react-quill';

const CreateBlogPage = () => {
    // const { currentBlog, loading, blogLoadingError } = useBlog();
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
            const response = await axios.get(`/api/blogs/checkSlug/${slug}`);
            if (!response.data.isUnique) {
                setError('Blog with this name already exists. Please choose a different one.');
                setSuccess('');
                return;
            }

            // Submit the blog
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};

            await axios.post(`/api/blogs`, { title:title, name:slug, description:description }, { headers });
            setSuccess('Blog created successfully!');
            setError('');
            setFormErrors('');
            // Go to the new article
            navigate(`/blogs/${slug}/articles`);
        } catch (err) {
            // Form validation errors
            if (err.response && err.response.status === 400) {
                setError('');
                setFormErrors(err.response.data.errors);
            } else {
                setError(`Failed to create the article: ${err}`);
            }
            setSuccess('');
        }
    };
      
    return (
        <div>
            <h1>Create New Blog</h1>
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
                    <p>Preview URL: <strong>/blogs/{slug}</strong></p>
                </div>
                <div>
                    <label>Content:</label>
                    <ErrorMessage message={formErrors.description} />
                    {/* <ReactQuill 
                        value={description} 
                        onChange={setDescription} 
                    /> */}
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="4" cols="50" />
                </div>
                <button type="submit">Create Blog</button>
            </form>

            {/* Display success or error messages */}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default CreateBlogPage;