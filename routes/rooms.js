const express = require('express');
const router = express.Router();

const {
  getAllRooms,
  postNewRoom,
  deleteRoom
} = require('./controller/room.controller');

router.get('/', getAllRooms);

router.post('/', postNewRoom);

router.delete('/', deleteRoom);

module.exports = router;
