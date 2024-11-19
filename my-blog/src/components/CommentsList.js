import axios from 'axios';
import useUser from "../hooks/useUser";
import Comment from './Comment';

const CommentsList = ({ comments, onCommentRemoval }) => {

    const { user } = useUser();

    const handleDeleteComment = async ( commentId ) => {
        try {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            const response = await axios.delete(`/api/comments/delete/${commentId}`,{headers});
            if (response.status === 200) {
                // Filter out the deleted comment from the comments state
                onCommentRemoval((comments) =>
                    comments.filter((comment) => comment._id !== commentId)
                );
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

    const handleSaveComment = async ( commentId, updatedText ) => {
        try {
            // Retrieve the authentication token if the user is logged in
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};

            // Prepare the data to be sent to the backend (e.g., the updated text of the comment)
            const commentData = { text: updatedText, };

            // Send the PUT request to update the comment
            const response = await axios.put(`/api/comments/edit/${commentId}`, commentData, { headers });
            
        } catch (error) {
            console.error('Error updating comment:', error);
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