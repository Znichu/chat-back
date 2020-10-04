const uuid = require('uuid');


const rooms = new Map();

//New room
const createRoom = (roomId) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
}

// Create chat data
const getChatData = (roomId) => {
    return  rooms.has(roomId)
        ? {
            users: getUsers(roomId),
            messages: getMessages(roomId),
        }
        : { users: [], messages: [] };

}

//Get messages in the room
const getMessages = (roomId) => {
    return [...rooms.get(roomId).get('messages').values()]
}

//Save new message
const saveNewMessage = (roomId, newMessage) => {
    rooms.get(roomId).get('messages').push(newMessage)
}

//Save new user in the room
const saveUser = (roomId, socketId, userName, urlAvatar) => {
    rooms.get(roomId).get('users').set(socketId, {id: uuid.v4(), userName, urlAvatar} );
}

//Get users in the room
const getUsers = (roomId) => {
    return [...rooms.get(roomId).get('users').values()]
}

//Get user in the room
const getCurrentUser = (roomId, socketId) => {
    return rooms.get(roomId).get('users').get(socketId)
}

//User leaves chat
const userLeave = (socketId, roomId) => {
    rooms.get(roomId).get('users').delete(socketId)
}

module.exports = {
    getUsers,
    saveUser,
    getMessages,
    userLeave,
    createRoom,
    saveNewMessage,
    getChatData,
    getCurrentUser
}