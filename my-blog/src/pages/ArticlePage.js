import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TitleAndContentEditor from "../components/TitleAndContentEditor";
import 'react-loading-skeleton/dist/skeleton.css';
import slugify from 'slugify';
import axios from 'axios';
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import { useBlog } from "../context/BlogContext";
import DOMPurify from 'dompurify';
import { toast } from '../components/ui/Toast';
import DeletionConfirmationModal from '../components/ui/DeletionConfirmationModal';
import ArticlePageSkeleton from '../components/skeletons/ArticlePageSkeleton';



const ArticlePage = () => {
    const { currentBlog } = useBlog();  // Access the currentBlog from context
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, canUpvote: false , content: ''});
    const [articleComments, setArticleComments] = useState([]);
    const {canUpvote} = articleInfo;
    const [articleFound, setArticleFound] = useState(false);
    const [articleLoaded, setArticleLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const params = useParams();
    const { blogId, articleId } = params;
    const { user, isLoading } = useUser();
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Define a function to retrieve the data
        const loadArticleInfo = async () => {
            console.log("Loading article: " + blogId + "/" + articleId)
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            try {
                const response = await axios.get(`/api/blogs/${blogId}/articles/${articleId}`, { headers });
                const newArticleInfo = response.data;
                setArticleInfo(newArticleInfo);
                setArticleFound(true);
            } catch (e) {
                toast.error(`Failed to fetch article: '${articleId}' for blog '${blogId}': ${e.message}`);
            } finally {
                setArticleLoaded(true);
            }

            try {
                const response = await axios.get(`/api/blogs/${blogId}/articles/${articleId}/comments`, { headers });
                const newArticleComments = response.data;
                setArticleComments(newArticleComments);
            } catch (e) {
                console.error(`Failed to fetch comments for '${articleId}': not found: ${e}`)
            }
        }

        if (currentBlog && !isLoading) { // User data loaded
            loadArticleInfo();
        }
    }, [articleId, currentBlog, isLoading, user]);

    const voteOnArticle = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        if (articleInfo.upvoteIds && articleInfo.upvoteIds.includes(user.reloadUserInfo.localId)) {
            // Already upvoted, downvote
            try {
                const response = await axios.put(`/api/blogs/${currentBlog.name}/articles/${articleId}/vote?type=down`, null, { headers });
                const updatedArticle = response.data;
                setArticleInfo(updatedArticle);
            } catch (e) {
                console.log("Error: " + e)
            }

        } else {
            // Never upvoted, upvote
            const response = await axios.put(`/api/blogs/${currentBlog.name}/articles/${articleId}/vote?type=up`, null, { headers });
            const updatedArticle = response.data;
            setArticleInfo(updatedArticle);
        }
    }

    const handleSave = async (title, content) => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        try {
            const generatedSlug = slugify(title, {
                lower: true,
                strict: true,
            });
            if (content === "<p><br></p>") content = ""; // Quilt's default for empty text
            const articleData = { name: generatedSlug, title: title, blog: currentBlog.name, content: content };
            const response = await axios.put(`/api/blogs/${currentBlog.name}/articles/${articleId}`, articleData, { headers });
            const updatedArticle = response.data;
            setArticleInfo(updatedArticle);
            setIsEditing(false);
            setFormErrors('');
            if (generatedSlug !== articleInfo.name) { // slug changed
                navigate(`/blogs/${currentBlog.name}/articles/${generatedSlug}`);
            }
        } catch (err) {
            // Form validation errors
            if (err.response?.status === 400) {
                setFormErrors(err.response.data.errors);
            } else if (err.response?.status === 403) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Error updating article: " + err);
            }
        }
    }

    const handleDelete = async () => {
        setIsModalOpen(false)
        try {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            const response = await axios.delete(`/api/blogs/${currentBlog.name}/articles/${articleInfo.name}`,{headers});
            if (response.status === 204) {
                navigate(`/blogs/${currentBlog.name}/articles`);
            }
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Error deleting article: " + error);
            }
        }
    }

    if (!articleLoaded) {
        return (
           <ArticlePageSkeleton/>
        );
    }

    if (articleLoaded && !articleFound){
        return (
            <>
                <h1>Article not found</h1>
                <p>Blog: {currentBlog?.title}</p>
                <p>Requested article: {articleId}</p>
            </>
        );
    }

    return (
        <>
            { isEditing ? (
                <div>
                    <br/>
                    <TitleAndContentEditor 
                        initialTitle={articleInfo.title}
                        initialContent={articleInfo.content}
                        formErrors={formErrors}
                        // setFormErrors={setFormErrors}
                        onSave={handleSave}
                        onCancel={() => {setIsEditing(false); setFormErrors('');}} />
                </div>
            ) : (
                <div>
                    <h1>{articleInfo?.title}</h1>
                    <div className="upvotes-section">
                        {user ? (
                            <button onClick={voteOnArticle}>{canUpvote ? 'Upvote' : 'Upvoted'}</button>
                        ) : (
                            <button onClick={() => { navigate('/login'); }}>Log in to upvote</button>
                        )}
                        <p>This article has {articleInfo.upvotes} upvote(s)</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleInfo.content) }} />
                    <br />
                    {(articleInfo.admin || articleInfo.editor) && <button onClick={() => isEditing(true)} className="edit-button">Edit</button>}
                    {articleInfo.admin && <button onClick={() => setIsModalOpen(true)} className="delete-button">Delete</button>}
                </div>
            )}
            { user ? (
                <AddCommentForm
                    blog={currentBlog?.name}
                    articleName={articleId}
                    onCommentAdded={newComment => setArticleComments([...articleComments, newComment])}
                />
            ) : (
                <button onClick={() => { navigate('/login'); }}>Log in to comment</button>
            )}
            { articleComments.length === 0?
                <p>No comments yet</p>
                :
                <CommentsList
                    comments={articleComments}
                    onCommentRemoval={updatedArticleComments => setArticleComments(updatedArticleComments)}
                />
            }
            <DeletionConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                title="Are you sure you want to delete this article?"
                message="This action cannot be undone."
            />
        </>
    );
}

export default ArticlePage; 