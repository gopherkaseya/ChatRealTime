const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
    }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {

    console.log('Client connected with this is ID :', socket.id);

    socket.on('message', (data) => {
        console.log(`Message received: ${JSON.stringify(data)}`);
        io.emit('response', data); // Utilisez io.emit pour diffuser le message à tous les clients
        console.log('Message broadcasted');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server listening on port ' + server.address().port);
});
