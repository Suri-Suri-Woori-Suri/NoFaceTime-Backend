const express = require('express');
const router = express.Router();

const {
  getAllGroups,
  createNewGroup,
  deleteGroup
} = require('./controller/group.controller');
const verifyToken = require('./middleware/verifyToken');

router.get('/', verifyToken, getAllGroups);

router.post('/', verifyToken, createNewGroup);

router.delete('/', verifyToken, deleteGroups);

module.exports = router;
