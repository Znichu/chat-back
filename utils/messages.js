const moment = require('moment');
const uuid = require('uuid');

const formatMessage = (message) => {
    return {
        id: uuid.v4(),
        text: message.text,
        img: message.img ? message.img : null,
        time: moment().format('h:mm a'),
    };
}

module.exports = {formatMessage};