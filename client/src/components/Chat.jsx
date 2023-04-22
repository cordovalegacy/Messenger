import React, { useState, useEffect } from 'react';
import axios from 'axios'
import io from 'socket.io-client';

const Chat = () => {
    const [socket, setSocket] = useState(null); //socket object
    const [allConversations, setAllConversations] = useState([])
    const [openConversation, setOpenConversation] = useState({})
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("")
    const [user, setUser] = useState({})
    const [allUsers, setAllUsers] = useState([])
    const [conversationId, setConversationId] = useState("")

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/messagesInOneConversation/${conversationId}`)
                console.log("This conversation: ", response.data)
                setOpenConversation(response.data) //should get back conversation by _id
                setMessages(response.data.messages) //should get back all messages in said conversation
            }
            catch (err) {
                console.log("Something went wrong fetching conversation: ", err)
            }
        }
        fetchConversation()
    }, [conversationId]) //listening for conversationId value change (triggers new axios call)

    useEffect(() => {
        const newSocket = io('http://localhost:8000') //io holds server url in server.js (connection point*)
        setSocket(newSocket)

        return () => newSocket.disconnect(true) //clean up function
    }, [])

    useEffect(() => {
        if (!socket) {//if no socket connection, stop searching for one
            return
        }
        //otherwise*
        socket.on('message_other_clients', (message) => { //connect => message is from io.emit object in server.js
            setMessages((messages) => [...messages, message]); //gives us messages to display
        });
        return () => {
            socket.disconnect(true) //clean up function
        }
    }, [socket]) //listening for socket value change

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/getLoggedInUser', { withCredentials: true })
            .then((res) => {
                console.log("Logged In User: (chat) ", res.data)
                setUser(res.data)
            })
            .catch((err) => {
                console.log("Something went wrong: (Logged in user) ", err)
            })
    }, [])

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/getAllUsers')
            .then((res) => {
                console.log("Here are all the users: ", res.data)
                const allButLoggedInUser = res.data.filter((users) => users._id !== user._id)
                setAllUsers(allButLoggedInUser)
            })
            .catch((err) => {
                console.log("Something went wrong getting all users: ", err)
            })
    }, [user])


    useEffect(() => {
        axios
            .get('http://localhost:8000/api/allConversations')
            .then((res) => {
                console.log("All Conversations: ", res.data)
                setAllConversations(res.data)
            })
            .catch((err) => {
                console.log("Something went wrong: (all conversations)", err)
            })
    }, [])

    const handleCreateConversation = async (userIds) => {
        try {
            console.log(userIds)
            const response = await axios.post('http://localhost:8000/api/newConversation', { users: userIds }, { withCredentials: true })
            const newConversation = response.data
            console.log("New Conversation Created: ", newConversation)
            setOpenConversation(newConversation)
            setConversationId(response.data._id)
        }
        catch (err) {
            console.log("Something went wrong in creating a conversation: ", err)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = { conversationId: openConversation._id, sender: user._id, content: message }
        axios
            .post('http://localhost:8000/api/newMessage', newMessage, { withCredentials: true })
            .then((res) => {
                console.log("New Message Created: ", res.data)
                socket.emit('message', { sender: res.data.sender, content: res.data.content, timestamp: res.data.createdAt });
                setMessage('');
            })
            .catch((err) => {
                console.log("Something went wrong with message creation: ", err)
            })
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <div className="w-3/5 mx-10 p-4 rounded-lg">
                <div className="bg-gray-800 rounded-lg px-10 py-4 my-6">
                    <h1 className="font-bold text-blue-500 rounded px-40 w-full">Chat</h1>
                    <ul className="overflow-auto max-h-80 w-full">
                        {messages.map((message, index) => (
                            <li key={index} className={`mb-4 w-1/2 ${message.sender !== user._id ? 'self-end' : 'self-start'}`}>
                                <div className={`bg-slate-700 p-5 rounded-3xl ${message.sender === user._id ? 'ml-5' : 'mr-5'}`}>
                                    {message.sender === user._id ? (
                                        <>
                                            <span className="text-gray-100 font-bold">You</span>
                                            <span className="text-gray-400 text-xs ml-2 align-self-end">
                                                {message.timestamp}
                                            </span>
                                            <hr />
                                            <div className="mt-2 text-blue-500">{message.content}</div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-gray-100 font-bold">{message.sender.firstName}</span>
                                            <span className="text-gray-400 text-xs ml-2 align-self-end">
                                                {message.timestamp}
                                            </span>
                                            <hr />
                                            <div className="mt-2 text-blue-500">{message.content}</div>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex bg-gray-800 rounded-lg p-2 mb-6">
                        <input
                            type="text"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-gray-700 text-amber-200 rounded-full py-2 px-4 w-full focus:outline-blue-700 placeholder-amber-400 font-bold"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-amber-400 font-bold rounded-full py-2 px-4 ml-2">
                            Send
                        </button>
                    </div>
                </form>
            </div>
            <div className='flex flex-col gap-2 bg-gray-800 rounded-lg px-10 py-4 my-6'>
                <h2 className='text-amber-400 font-bold'>Friends</h2>
                {
                    allUsers.map((eachUser) => (
                        <div key={eachUser._id} className='flex justify-between items-center text-white gap-10 hover:bg-gray-900 py-1 px-5 rounded-lg'>
                            <h3>{eachUser.firstName} {eachUser.lastName}</h3>
                            <p className='text-lg font-extrabold text-blue-500 cursor-pointer'>
                                <button onClick={() => handleCreateConversation([user._id, eachUser._id])}>+</button>
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Chat;
