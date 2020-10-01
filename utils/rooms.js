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

//Get messages in the room
const getMessages = (roomId) => {
    return [...rooms.get(roomId).get('messages').values()]
}

//Save new message
const saveNewMessage = (roomId, newMessage) => {
    rooms.get(roomId).get('messages').push(newMessage)
}

//Save new user in the room
const saveUser = (roomId, socketId, userName) => {
    rooms.get(roomId).get('users').set(socketId, userName);
}

//Get users in the room
const getUsers = (roomId) => {
    return [...rooms.get(roomId).get('users').values()]
}

//User leaves chat
const userLeave = (socketId) => {
    rooms.forEach((value, roomId) => {
        if (value.get('users').delete(socketId)) {
            return [...rooms.get(roomId).get('users').values()];
        }
    })
}

module.exports = {
    getUsers,
    saveUser,
    getMessages,
    userLeave,
    createRoom,
    saveNewMessage
}