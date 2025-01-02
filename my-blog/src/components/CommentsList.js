import axios from 'axios';
import useUser from "../hooks/useUser";
import Comment from './Comment';
import { toast } from '../components/ui/Toast';

const CommentsList = ({ comments, onCommentRemoval }) => {

    const { user } = useUser();

    const handleDeleteComment = async ( blogSlug, articleSlug, commentId ) => {
        try {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            
            const response = await axios.delete(`/api/blogs/${blogSlug}/articles/${articleSlug}/comments/${commentId}`,{headers});
            if (response.status === 204) {
                // Filter out the deleted comment from the comments state
                onCommentRemoval((comments) =>
                    comments.filter((comment) => comment._id !== commentId)
                );
            }
        } catch (error) {
            toast.error(`Error deleting comment: ${error.response?.data?.message}`);
        }
    
    }

    const handleSaveComment = async ( blogSlug, articleSlug, commentId, updatedText ) => {
        try {
            // Retrieve the authentication token if the user is logged in
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};

            // Prepare the data to be sent to the backend (e.g., the updated text of the comment)
            const commentData = { text: updatedText, };

            // Send the PUT request to update the comment
            await axios.put(`/api/blogs/${blogSlug}/articles/${articleSlug}/comments/${commentId}`, commentData, { headers });
            
        } catch (error) {
            toast.error(`Error editing comment: ${error.response?.data?.message}`);
        }
    }

    return (
        <>
        <h3>Comments:</h3>
        {comments.map(comment => (
            <Comment
                key={comment._id}
                comment={comment}
                onSave={handleSaveComment}
                onDelete={handleDeleteComment}
            />
        ))}
        </>
    )
}

export default CommentsList;