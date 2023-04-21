import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null)


    useEffect(() => {
        const newSocket = io('http://localhost:8000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Connected!');
        })

        socket.on('event_to_all_other_clients', (data) => {
            setMessages((messages) => [...messages, data]);
        });

        return () => {
            socket.disconnect(true)
        };
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('event_from_client', { content: message, sender: userId });
        setMessage('');
    };

    return (
        <div className="flex-column h-screen bg-gray-900">
            <div className="w-100 mx-10 my-auto p-4 rounded-lg">
                <div className="bg-gray-800 rounded-lg px-10 py-4 mb-6">
                    <h1 className="font-bold text-blue-500 rounded px-40 w-full">Chat</h1>
                    <ul className="overflow-auto max-h-80 w-full">
                        {messages.map((message, index) => (
                            <li key={index} className={`mb-4 ${message.sender === userId ? 'self-end' : 'self-start'}`}>
                                <div className={`flex items-start ${message.sender === userId ? 'flex-row-reverse' : ''}`}>
                                    <div className={`bg-slate-700 p-5 rounded-3xl ${message.sender === userId ? 'mr-5' : 'ml-5'}`}>
                                        <span className="text-gray-100 font-bold">{message.sender}</span>
                                        <span className="text-gray-400 text-xs ml-2 align-self-end">
                                            {new Date(message.timestamp).toLocaleString()}
                                        </span>
                                        <hr />
                                        <div className="mt-2 text-blue-500">{message.content}</div>
                                    </div>
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
        </div>
    );
};

export default Chat;
