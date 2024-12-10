import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import slugify from 'slugify';
import axios from 'axios';

const AddArticlePage = () => {
    const [slug, setSlug] = useState('');
    const [isSlugEdited, setIsSlugEdited] = useState(false); // Track if the slug has been manually edited
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    // Handle title input and dynamically generate the slug if it hasn't been manually edited
    const handleTitleChange = (e) => {
        const inputTitle = e.target.value;
        setTitle(inputTitle);

        // Only update slug automatically if the user hasn't manually edited it
        if (!isSlugEdited) {
            const generatedSlug = slugify(inputTitle, {
                lower: true,
                strict: true,
            });
            setSlug(generatedSlug);
        }
    };

    // Handle manual slug edits
    const handleSlugChange = (e) => {
        setSlug(e.target.value); // Allow manual changes
        setIsSlugEdited(true); // Mark slug as edited
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate slug
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            setError('Invalid slug. Only lowercase letters, numbers, and hyphens are allowed.');
            return;
        }

        try {
            const response = await axios.get(`/api/articles/checkSlug/${slug}`);
            if (!response.data.isUnique) {
                setError('Article with this ID already exists. Please choose a different one.');
                setSuccess('');
                return;
            }

            // Submit the article
            await axios.post('/api/articles', { title, name:slug, text:content });
            setSuccess('Article created successfully!');
            setError('');
        } catch (err) {
            setError(`Failed to create the article. ${err}`);
            setSuccess('');
        }
    };

    return (
        <div>
            <h1>Add New Article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter article title"
                        required
                    />
                </div>
                <div>
                    <label>Name (ID):</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="text"
                            value={slug}
                            onChange={handleSlugChange} // Allow manual edits
                            placeholder="Edit or auto-generate id"
                            required
                        />
                        <button type="button" onClick={() => {
                            setSlug(slugify(title, { lower: true, strict: true }));
                            setIsSlugEdited(false); // Allow auto-updating again
                        }}
                        style={{
                            padding: '8px 12px',
                            margin: '0px 0px 16px 0px',
                        }}>
                            Reset
                        </button>
                    </div>

                </div>
                {/* Dynamic URL preview */}
                <div>
                    <p>Preview URL: <strong>/articles/{slug}</strong></p>
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter article content"
                        rows="10"
                        cols="50"
                        required
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