const moment = require('moment');
const uuid = require('uuid');

const formatMessage = (userName, text) => {
    return {
        id: uuid.v4(),
        userName,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = {formatMessage};