const express = require('express');
const {createRoom, getChatData} =  require ('../utils/rooms');


const rooms = express.Router();

rooms.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params;
    const data = getChatData(roomId);
    console.log(data)
    res.json(data);
});

rooms.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body;
    createRoom(roomId);
    res.send();
})


module.exports = rooms;
