const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

const rooms = new Map();

app.get('/rooms', (req, res, next) => {
    res.json(rooms)
});

app.post('/rooms', (req, res, next) => {
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
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users = rooms.get(roomId).get('users').values();
        socket.to(roomId).broadcast.emit('ROOM:JOINED', users)
    });

    console.log(`user connection ${socket.id}`)
});

const PORT = process.env.PORT || 7542;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));