const express = require('express');
const router = express.Router();

const verifyToken = require('./middleware/verifyToken');

const {
  createNewRoom,
  deleteRoom
} = require('./controller/room.controller');

router.post('/', verifyToken, createNewRoom);

router.delete('/:roomId', verifyToken, deleteRoom);

module.exports = router;
