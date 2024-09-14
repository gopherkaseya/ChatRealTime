import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]); // Changez response en chatMessages
    const myID = socket.id

    useEffect(() => {
        // Écoutez les messages du serveur
        socket.on('response', (data) => {
            console.log('Message received from server:', data); // Ajoutez un log pour déboguer
            setChatMessages((prevMessages) => [...prevMessages, data]); // Ajoutez le nouveau message à l'état
        });

        return () => {
            socket.off('response'); // Nettoyez l'écouteur lors du démontage
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('message', { text: message, id :myID});
            setMessage(''); // Réinitialiser le champ de message après l'envoi
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4 bg-gray-100">
            {/* Affichage des messages */}
            <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-inner flex flex-col-reverse">
                <ul className="space-y-2">
                    {chatMessages.map((msg, index) => (
                        
                        <li key={index} className={`flex ${msg.id == myID ? 'justify-end' : 'justify-start'}`}>
                            
                            <div

                                className={`max-w-xs px-4 py-2 rounded-lg shadow-md text-white ${msg.id == myID ? 'bg-blue-500' : 'bg-gray-300'} mt-1 mb-1`}
                            >
                                <strong className={`${msg.isUser ? 'text-white' : 'text-gray-800'}`}></strong> {msg.text}
                            </div>
                        </li>
                    ))}
                </ul>
                
            </div>
    
            {/* Formulaire de chat */}
            <form onSubmit={handleSubmit} className="mt-4 flex-shrink-0 flex">
                <input
                    type="text"
                    placeholder="Entrez le message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="ml-3 p-2 border-blue-600 border-2 rounded flex items-center justify-center"
                >
                    <img src="./src/assets/send-message.png" className="w-6 h-6 text-white" alt="Send"/>
                </button>
            </form>
        </div>
    );
    
}

export default App;
