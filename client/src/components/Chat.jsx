import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import io from 'socket.io-client';
import { MyContext } from '../App';
import GIF from '../assets/gif-bg.gif'
import TRASH from '../assets/icons8-trash.svg'

const Chat = () => {

    //listened for* = useEffect dependency array
    const { user, setUser, redirect } = useContext(MyContext) //logged in user getter and setter
    const [allUsers, setAllUsers] = useState([]) //used for conditional rendering
    const [allConversations, setAllConversations] = useState([]) //not used yet, just for console data
    const [openConversation, setOpenConversation] = useState({}) //fetchConvo gets conversation, set to that convo
    const [conversationId, setConversationId] = useState("") //params to send through fetchConvo (listened for*)
    const [message, setMessage] = useState("") //tracking input change
    const [messages, setMessages] = useState([]); //map these to chat window
    const [socket, setSocket] = useState(null); //socket object (listened for*)
    const [loaded, setLoaded] = useState(false) //conditional gif



    // ****************************************Get Logged In User*******************************************
    // ! Gets our logged in user for conditionally rendering friends list
    useEffect(() => {
        axios
            .get('http://localhost:8000/api/getLoggedInUser', { withCredentials: true })
            .then((res) => {
                // console.log("Logged In User: (chat) ", res.data)
                setUser(res.data)
            })
            .catch((err) => {
                console.log("Something went wrong: (Logged in user) ", err)
                redirect('/login')
            })
    }, [])

    // ****************************************Two Below Get All*******************************************
    // ! Get all data from DB
    useEffect(() => {
        axios
            .get('http://localhost:8000/api/getAllUsers')
            .then((res) => {
                // console.log("Here are all the users: ", res.data)
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

    // ****************************************Two Above Get All*******************************************

    // ****************************************Two Below Work Together*************************************
    // ! creating and fetching conversations from DB    
    const handleCreateConversation = async (userIds) => {
        try {
            console.log(userIds)
            const response = await axios.post('http://localhost:8000/api/newConversation', { users: userIds }, { withCredentials: true })
            const newConversation = response.data
            console.log("New Conversation Created: ", newConversation)
            setConversationId(newConversation._id)
            setLoaded(true)
        }
        catch (err) {
            console.log("Something went wrong in creating a conversation: ", err)
        }
    }

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/messagesInOneConversation/${conversationId}`)
                console.log("This conversation: ", response.data)
                setOpenConversation(response.data) //should get back conversation by _id
            }
            catch (err) {
                console.log("Something went wrong fetching conversation: ", err)
            }
        }
        fetchConversation()
    }, [conversationId]) //listening for conversationId value change (triggers new axios call)

    useEffect(() => {
        if (!openConversation.messages) {
            return;
        }
        setMessages(openConversation.messages); //should get back all messages in said conversation (current/past)
    }, [openConversation]);

    // ****************************************Two Above Work Together****************************************

    // ****************************************Three Below Work Together**************************************
    // ! socket client to server cycle
    useEffect(() => {
        const newSocket = io('http://localhost:8000') //io holds server url in server.js (connection point*)
        setSocket(newSocket)

        return () => newSocket.disconnect(true) //clean up function
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = { conversationId: openConversation._id, sender: user._id, content: message }
        axios
            .post('http://localhost:8000/api/newMessage', newMessage, { withCredentials: true })
            .then((res) => {
                console.log("New Message Created: ", res.data)
                socket.emit('message', { sender: res.data.sender, content: res.data.content, updatedAt: res.data.updatedAt });
                setMessage('');
            })
            .catch((err) => {
                console.log("Something went wrong with message creation: ", err)
            })
    };

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
    // ****************************************Three Above Work Together**************************************
    //**********************************************Delete Message********************************************

    const deleteHandler = (messageFromChat) => {
        if (messageFromChat.sender._id == user._id) {
            const id = messageFromChat._id
            axios
                .delete(`http://localhost:8000/api/deleteMessage/${id}`, { withCredentials: true })
                .then((res) => {
                    console.log("Deleted Message: ", res)
                    const deleteMessage = messages.filter((allOtherMessages) => allOtherMessages._id !== messageFromChat._id)
                    setMessages(deleteMessage)
                })
                .catch((err) => {
                    console.log("Something went wrong: ", err)
                })
        }
        else {
            console.log("Try again", messageFromChat)
        }
    }

    return (
        <div className="flex h-full bg-gray-900">
            <div className="w-3/5 mx-10 rounded-lg">
                <div className="bg-gray-800 rounded-lg px-10 py-10 my-6">
                    <h1 className="text-blue-500 px-40 w-full mb-2 p-1 font-extrabold text-lg border-b">Chat</h1>
                    <ul className="overflow-auto max-h-60 min-h-60 w-full">
                        {
                            loaded === false ?
                                <div className="relative">
                                    <img src={GIF} alt='gif' className='w-1/3 m-auto' />
                                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">Start a new chat!</p>
                                </div> :

                                messages.map((singleMessage, idx) => (
                                    <li key={idx} className={`flex my-2 relative ${singleMessage.sender._id === user._id ? 'flex-row-reverse' : ''}`}>
                                        <img
                                            src={TRASH}
                                            alt="delete icon"
                                            className={`absolute cursor-pointer top-1 right-2 w-6 ${singleMessage.sender._id != user._id ? 'hidden' : 'hover:opacity-100'} opacity-0 transition-opacity`}
                                            onClick={() => deleteHandler(singleMessage)}
                                        />
                                        <div className={`bg-slate-700 px-20 border py-3 rounded-3xl ${singleMessage.sender._id === user._id ? 'ml-5' : 'mr-5'}`}>
                                            <div className="flex flex-col">
                                                <div className="text-gray-100 font-bold">{singleMessage.sender.firstName}</div>
                                                <div className="text-gray-400 text-xs align-self-end">
                                                    {new Date(singleMessage.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                                    {' '}
                                                    {new Date(singleMessage.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="mt-2 text-blue-500">{singleMessage.content}</div>
                                        </div>
                                    </li>
                                ))

                        }
                    </ul>
                </div>
                <form onSubmit={handleSubmit} className='max-h-20 min-h-20 flex bg-gray-800 rounded-lg p-2 mb-6'>       
                        <input
                            type="text"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-gray-700 text-amber-200 rounded-full py-2 px-4 w-full focus:outline-blue-700 placeholder-amber-400 font-bold"
                        />
                        <button
                            type="submit"
                            className={`bg-blue-600 hover:bg-blue-500 text-amber-400 font-bold rounded-full py-2 px-4 ml-2 ${loaded ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!loaded}
                        >
                            Send
                        </button>
                </form>
            </div>
            <div className='flex flex-col gap-2 bg-gray-800 rounded-lg px-10 py-4 my-6 h-100 max-h-100 min-h-100 overflow-auto'>
                <h2 className='text-amber-400 font-bold'>Friends</h2>
                {
                    allUsers.map((eachUser) => (
                        <div
                            key={eachUser._id}
                            onClick={() => handleCreateConversation([user._id, eachUser._id])}
                            className='flex justify-between items-center text-white gap-10 hover:bg-gray-900 py-1 px-5 rounded-lg cursor-pointer'>
                            <h3>{eachUser.firstName} {eachUser.lastName}</h3>
                            <button className='text-lg font-extrabold text-blue-500 cur'>+</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Chat;
