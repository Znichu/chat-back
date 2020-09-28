const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

const rooms = new Map();

app.get('/rooms', (req, res) => {
    res.json(rooms)
});

app.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
    res.send();
})

// Run when client connects
io.on('connection', socket => {
    console.log(`user connection ${socket.id}`)
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));