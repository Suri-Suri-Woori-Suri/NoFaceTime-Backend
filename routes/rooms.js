const express = require('express');
const router = express.Router();

const {
  createNewRoom,
  deleteRoom,
  getRoom
} = require('./controller/room.controller');
const verifyToken = require('./middleware/verifyToken');

router.get('/:roomId', getRoom);

router.post('/', verifyToken, createNewRoom);

router.delete('/:roomId', verifyToken, deleteRoom);

module.exports = router;
