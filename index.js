const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const {
    getUsers,
    saveUser,
    getCurrentUser,
    userLeave,
    saveNewMessage,
    saveTyper,
    getAllTypers,
    deleteTyper
} = require('./utils/rooms');
const {formatMessage} = require('./utils/messages');
const rooms = require('./routes/rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

const botName = 'Chat Bot';

//App Routes
app.use('/chat', rooms);

// Run when client connects
io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);

        saveUser(roomId, socket.id, userName);

        // Send users
        const users = getUsers(roomId);
        io.to(roomId).emit(
            'ROOM:SET_USERS',
            users
        );

        // Runs when client disconnects
        socket.on('disconnect', () => {
            userLeave(socket.id, roomId);
            deleteTyper(roomId, socket.id);
            io.to(roomId).emit(
                'ROOM:SET_USERS',
                getUsers(roomId)
            );
        })

    });

    // Listen for chatMessage
    socket.on('ROOM:NEW_MESSAGE', ({roomId, message}) => {
        const newMessage = {
            message: formatMessage(message),
            user: getCurrentUser(roomId, socket.id)
        };
        saveNewMessage(roomId, newMessage);
        io.to(roomId).emit(
            'ROOM:NEW_MESSAGE',
            newMessage
        );
    });

    //Listening to chat who is typing now
    socket.on('ROOM:USER_TYPED', ({roomId}) => {
        const user = getCurrentUser(roomId, socket.id);
        saveTyper(roomId, socket.id, user.userName);
        socket.broadcast.to(roomId).emit(
            'ROOM:USER_TYPED',
            getAllTypers(roomId)
        );
    });

    socket.on('ROOM:USER_STOPPED_TYPING', ({roomId}) => {
        deleteTyper(roomId, socket.id);
        socket.broadcast.emit('ROOM:USER_STOPPED_TYPING', getAllTypers(roomId));
    });

    console.log(`user connection ${socket.id}`)

});

const PORT = process.env.PORT || 7542;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));