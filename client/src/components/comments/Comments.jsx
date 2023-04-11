import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";

import moment from "moment";

function Comments(post) {
  const [desc, setDesc] = useState("");
  const { currentUser, token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  console.log(post.post);
  const sortedComments =
    post.post.comments.length >= 2
      ? post.post.comments.sort((a, b) => {
         return new Date(b.createdAt) - new Date(a.createdAt);
        })
      : post.post.comments;

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.put(`/posts/${post.post._id}/comment`, newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        // handleNotification("commented on your post")
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick(event);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const newComment = {
      comment: desc,
      profilePic: currentUser.profilePicture,
      name: currentUser.username,
    };
    mutation.mutate(newComment);
    setDesc("");
  };
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {sortedComments.map((comment) => (
        <div className="comment" key={comment._id}>
          <img src={comment.profilePic} alt="" />

          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.comment}</p>
          </div>

          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
}

export default Comments;
