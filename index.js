const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage, roomMessages, getMessages} = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const botName = 'Chat Bot';

// Run when client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ userName, roomId }) => {
        const user = userJoin(socket.id, userName, roomId);
        console.log(user)
        socket.join(user.roomId);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.roomId)
            .emit('message', formatMessage(botName, `${user.userName} has joined the chat`));

        // Send users and room info
        io.to(user.roomId).emit('roomUsers', {
            room: user.roomId,
            users: getRoomUsers(user.roomId),
            messages: getMessages(user.roomId),
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.userName, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.roomId).emit('roomUsers', {
                room: user.roomId,
                users: getRoomUsers(user.roomId),
                messages: getMessages(user.roomId),
            });
        }
    });
});

const PORT = process.env.PORT || 7542;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`, server.address().port ));