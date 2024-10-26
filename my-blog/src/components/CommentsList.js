import axios from 'axios';
import useUser from "../hooks/useUser";

const CommentsList = ({ comments, onCommentRemoval }) => {

    const { user } = useUser();

    const deleteComment = async ( commentId ) => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.delete(`/api/comments/delete/${commentId}`,{headers});
        if (response.status === 200) {
            // Filter out the deleted comment from the comments state
            onCommentRemoval((comments) =>
                comments.filter((comment) => comment._id !== commentId)
            );
        }
    }

    return (
        <>
        <h3>Comments:</h3>
        {comments.map(comment => (
            <div className="comment" key={comment._id}>
            <h4>{comment.postedBy}</h4>
            <p>{comment.text}</p>
            <br/>
            { comment.canDelete &&
                <button onClick={() => deleteComment(comment._id)}>Delete</button>
            }
            </div>
        ))}
        </>
    )
}

export default CommentsList;