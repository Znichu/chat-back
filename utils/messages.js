const moment = require('moment');
const uuid = require('uuid');

const formatMessage = (text) => {
    return {
        id: uuid.v4(),
        text,
        time: moment().format('h:mm a'),
    };
}

module.exports = {formatMessage};