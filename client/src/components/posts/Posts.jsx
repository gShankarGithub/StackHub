
import "./posts.scss";
import { useQuery } from 'react-query'
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Post from '../../components/post/Post'


const Posts = ({profile,userId}) => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery('posts', () =>
    makeRequest.get(`/posts/timeline/all/${currentUser._id}`).then((res) => {
      const sortedPosts = res.data.length > 2 ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : res.data;
      return sortedPosts
    })
  )
  return (
    <div className="posts">
      {profile?
      (error
        ? "Something went wrong"
        : isLoading
        ? "Loading"
        : data && data.map(post => (userId===post.userId)&&<Post post={post} key={post._id} />)
      ) : (
        error
        ? "Something went wrong"
        : isLoading
        ? "Loading"
        : data && data.map(post => <Post post={post} key={post._id} />)
      
      )
    }
    </div>
  )
};

export default Posts;