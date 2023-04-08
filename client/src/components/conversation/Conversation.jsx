import React, { useEffect, useState } from 'react'
import { makeRequest } from '../../axios'
import "./conversation.css"

function Conversation({ conversation, currentUser }) {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const friendId = conversation.members.find(m => m !== currentUser._id)
    const getUser = async () => {
      try {
        const res = await makeRequest(`/users/${friendId}`)
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getUser()
  }, [currentUser,conversation])


  return (
    <div className='conversation'>
      <img className='conversationImg' src={user?.profilePicture?user?.profilePicture:"https://img.freepik.com/free-vector/donald-trump-portrait-with-flat-design_23-2147940891.jpg?w=740&t=st=1679462810~exp=1679463410~hmac=77150068e6adc1badc2d3d53ae1d584ace700334f8903806141045e2a33b3ac7"}></img>
      <span className='conversationName'>{user?.username}</span>

    </div>
  )
}

export default Conversation