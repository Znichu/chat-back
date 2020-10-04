const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const {getUsers, saveUser, getUser, userLeave, saveNewMessage} = require('./utils/rooms');
const {formatMessage} = require('./utils/messages');
const rooms = require ('./routes/rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

const botName = 'Chat Bot';

app.use('/chat', rooms);

// Run when client connects
io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);

        saveUser(roomId, socket.id, userName);

        const users = getUsers(roomId);
        io.to(roomId).emit('ROOM:SET_USERS', users);

        socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', formatMessage(botName, `${userName} has joined the chat`));

        socket.on('disconnect', () => {
            userLeave(socket.id, roomId);
            io.to(roomId).emit('ROOM:SET_USERS',getUsers(roomId));
        })

    });
    socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, message}) => {
        let newMessage = formatMessage(userName, message);
        saveNewMessage(roomId, newMessage);
        io.to(roomId).emit('ROOM:NEW_MESSAGE', newMessage);
    });

    console.log(`user connection ${socket.id}`)

});

const PORT = process.env.PORT || 7542;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));