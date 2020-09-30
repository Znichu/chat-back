const users = [];

// Join user to chat
const userJoin = (id, userName, roomId) => {
    const user = { id, userName, roomId };
    users.push(user);
    return user;
}

// Get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

// User leaves chat
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
const getRoomUsers = (roomId) => {
    return users.filter(user => user.roomId === roomId);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};