const moment = require('moment');

const messages = []

const roomMessages = (roomId, msg, userName) => {
    const roomMessages = {roomId, messages: msg, user: userName};
    messages.push(roomMessages)
}
const getMessages = (roomId) => {
    return messages.filter(messages => messages.roomId === roomId)
}


const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = {formatMessage, roomMessages, getMessages};