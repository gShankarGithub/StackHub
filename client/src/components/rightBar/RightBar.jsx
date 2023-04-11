import { useContext, useEffect, useState } from 'react'
import './rightbar.scss'
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom'
import { AuthContext } from "../../context/authContext";


function RightBar() {

  const queryClient = useQueryClient();

  const [allUsers, setAllUsers] = useState([])

  const { currentUser,setCurrentUser } = useContext(AuthContext);


  useEffect(()=>{
    const getAllUsers = (async()=>{
      makeRequest.get(`users/`).then((users)=>{
     
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
  },[])

  const { isLoading, error, data } = useQuery(["suggestions"], () =>
  makeRequest.get(`users/`).then((res) => {
  const users = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  setAllUsers(users) 
 
  
  return res.data;
})
);


const follow =async(userId)=>{
  await makeRequest.put(`users/${userId}/follow`,{ userId :currentUser._id})
  queryClient.invalidateQueries(["user"]);
  queryClient.invalidateQueries(["suggestions"]);
  queryClient.invalidateQueries(["posts"]);


}

  return (
    <div className='rightBar'>
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          


          {allUsers.map((user,index)=>(
          currentUser.username!=user.username && user.username!="admin" &&  !user.followers.includes(currentUser._id) && index<5 && <div className="user" key={user._id}>
            <div className="userInfo" key = {user._id} >
              <Link
              to={`/profile/${user._id}`}>
              <img src={user.profilePicture} />
              </Link>
              <Link to={`/profile/${user._id}`} style={{textDecoration:"none"}}>
              <span>{user.username}</span>
              </Link>
            </div>
            <div className="buttons">
           { !user.followers.includes(currentUser._id)?
              <button className='bg-blue-500 hover:bg-blue-700 text-white  py-1 px-1 rounded' onClick={()=>follow(user._id)} >Follow</button>:
              <button className='bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded' >Dismiss</button>}
            </div>
          </div>
          ))}


          
        </div>
        
      </div>
    </div>
  )
}

export default RightBar