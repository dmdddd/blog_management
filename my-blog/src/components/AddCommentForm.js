import { useState } from "react"
import axios from 'axios';
import useUser from "../hooks/useUser";

const AddCommentForm = ({ articleName, onArticleupdated }) => {
    const [commentText, setCommentText] = useState('');
    const { user } = useUser();

    const addComment = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post(`/api/comments/add/${articleName}`, {
            text:commentText,
        }, {
            headers,
        });
        const updatedArticle = response.data;
        onArticleupdated(updatedArticle);
        setCommentText('');
    }

    return (
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            { user && <p>You are posting as {user.displayName || user.email}</p>}
            <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows="4" cols="50" />
            <button onClick={addComment}>Add Comment</button>
        </div>
    )
}

export default AddCommentForm