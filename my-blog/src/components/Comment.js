import React, { useState } from 'react';

const Comment = ({ comment, onSave, onDelete }) => {
  const defaultAvatar = "https://img.freepik.com/free-psd/3d-rendering-bear-emoji-icon_23-2150339725.jpg";
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState(comment.text);
  const [tempText, setTempText] = useState(comment.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempText(commentText); // Revert to original text
  };

  const handleSave = () => {
    setIsEditing(false);
    setCommentText(tempText); // Save changes locally
    onSave(comment._id, tempText); // Pass id and updated text to parent
  };

  const handleDelete = () => {
    onDelete(comment._id); // Pass id to parent
  };

  const handleChange = (e) => {
    setTempText(e.target.value);
  };

  return (
    <>
    <div className="comment-container" key={comment._id}>
        <img alt='user icon' src={comment.userIcon || defaultAvatar} 
        className="comment-icon"/>
        
        <div className="comment-content">
            <h4>{comment.postedBy}</h4>
            {comment.createdOn && 
                <div><span><i>
                    {new Date(comment.createdOn).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })} {new Date(comment.createdOn).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })}
                    </i></span></div>
            }
                <div className="comment">
                {isEditing ? (
                    <>
                    <textarea
                        value={tempText}
                        onChange={handleChange}
                        className="comment-textarea"
                    />
                    <br/>
                    <div>
                        <button onClick={handleSave} className="save-button">Save</button>
                        <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                    </>
                ) : (
                    <>
                    <p className="comment-text">{commentText}</p>
                    <br/>
                    { comment.canDelete && <button onClick={handleEdit} className="edit-button">Edit</button>}
                    { comment.canDelete && <button onClick={handleDelete} className="delete-button">Delete</button>}
                    </>
                )}
            </div>
        </div>
    </div>
    </>
  );
};

export default Comment;