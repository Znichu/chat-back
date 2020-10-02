const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const {getUsers, saveUser, getMessages, userLeave, createRoom, saveNewMessage} = require('./utils/rooms');
const {formatMessage} = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());



const botName = 'Chat Bot';

app.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body;
    createRoom(roomId);
    res.send();
})

// Run when client connects
io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);

        saveUser(roomId, socket.id, userName);

        let data = { users: getUsers(roomId), messages: getMessages(roomId) };
        io.to(roomId).emit('ROOM:DATA_ROOM', data);

        socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', formatMessage(botName, `${userName} has joined the chat`));
    });
    socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, message }) => {
        let newMessage = formatMessage(userName, message);
        saveNewMessage(roomId, newMessage);
        io.to(roomId).emit('ROOM:NEW_MESSAGE', newMessage);
    });
    socket.on('disconnect', () => {
/*        const users = userLeave(socket.id);
        console.log(users)*/
        /*io.to().emit('ROOM:SET_USERS', users);*/

/*        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()];
                socket.to(roomId).broadcast.emit('ROOM:LEAVE', users)
            }
        })*/
    })
    console.log(`user connection ${socket.id}`)
});

const PORT = process.env.PORT || 7542;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));