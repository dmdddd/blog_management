import React, { useState } from 'react';

const Comment = ({ comment, onSave, onDelete }) => {
  const defaultAvatar = "https://img.freepik.com/free-psd/3d-rendering-bear-emoji-icon_23-2150339725.jpg";
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState(comment.text);
  const [tempText, setTempText] = useState(comment.text);
  const isEdited = comment.createdAt !== comment.updatedAt;


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
    onSave(comment.blog, comment.articleName, comment._id, tempText); // Pass id and updated text to parent
  };

  const handleDelete = () => {
    onDelete(comment.blog, comment.articleName, comment._id);
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
            <h4>{comment.postedBy || comment.userEmail}</h4>
            {comment.createdAt && 
                <div><span><i>
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })} {new Date(comment.createdAt).toLocaleTimeString("en-US", {
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
                    {isEdited && 
                        <div><span>Last edited: <i> 
                            {new Date(comment.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })} {new Date(comment.updatedAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        })}
                            </i></span></div>
                    }
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