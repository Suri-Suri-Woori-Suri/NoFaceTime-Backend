const express = require('express');
const router = express.Router();

const verifyToken = require('./middleware/verifyToken');

const {
  getAllRooms,
  createNewRoom,
  deleteRoom
} = require('./controller/room.controller');

router.get('/', verifyToken, getAllRooms);

router.post('/', verifyToken, createNewRoom);

router.delete('/', verifyToken, deleteRoom);

module.exports = router;
