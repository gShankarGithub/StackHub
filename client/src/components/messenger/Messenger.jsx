import React, { useContext, useEffect, useRef, useState } from 'react'
import './messenger.scss'
import NavBar from "../navBar/NavBar"
import { DarkModeContext } from '../../context/darkModeContext';
import Conversation from '../conversation/Conversation';
import Message from '../message/Message';
import ChatOnline from '../chatOnline/ChatOnline';
import { AuthContext } from '../../context/authContext';
import { makeRequest } from '../../axios';
import { io } from "socket.io-client"

function Messenger() {
    const { darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext)
    const scrollRef = useRef()

    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const socket = useRef()


    //Socket useEffect

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)&&setMessages(prev=>[...prev,arrivalMessage])
    },[arrivalMessage,currentChat])

    useEffect(() => {
        socket.current.emit("addUser", currentUser._id)
        socket.current.on("getUsers", users => {
           setOnlineUsers(currentUser.following.filter(f=>users.some((u)=>u.userId===f)))
        })
    }, [currentUser])


    //Socket

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await makeRequest.get("/conversations/" + currentUser._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [currentUser._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await makeRequest.get("/messages/" + currentChat?._id)
                setMessages(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        getMessages()
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: currentUser?._id,
            text: newMessage,
            conversationId: currentChat?._id
        }

        const receiverId = currentChat.members.find(member => member !== currentUser._id)

        socket.current.emit("sendMessage", {
            senderId: currentUser._id,
            receiverId,
            text: newMessage
        })

        try {
            const res = await makeRequest.post("/messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (err) {
            console.log(err);
        }
    }

    // For Scroll

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div>
            <div className={`theme-${darkMode ? "dark" : "light"}`}>
                <NavBar />
            </div>
            <div className='messenger'>
                <div className='chatMenu'>
                    <div className='chatMenuWrapper'>
                        <input placeholder='Search for friends' className='chatMenuInput'></input>
                        {conversations.map(c => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={currentUser} />
                            </div>
                        ))}

                    </div>
                </div>
                <div className='chatBox'>
                    <div className='chatBoxWrapper'>
                        {
                            currentChat ?
                                <>
                                    <div className='chatBoxTop'>
                                        {messages.map(m => (
                                            <div ref={scrollRef}>

                                                <Message message={m} own={m?.sender === currentUser?._id} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className='chatBoxBottom '>
                                        <textarea className='chatMessageInput' onChange={(e) => setNewMessage(e.target.value)} value={newMessage} placeholder='Write Something' />
                                        <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                                    </div>
                                </> : <span className='noConversationText pl-24 '>Open a conversation to start a chat</span>
                        }
                    </div>
                </div>
                <div className='chatOnline'>
                    <div className='chatOnlineWrapper'>
                        <ChatOnline onlineUsers={onlineUsers} currentId={currentUser._id} setCurrentChat={setCurrentChat}/>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Messenger