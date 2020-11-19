const express = require('express');
const router = express.Router();

const {
  createNewGroup,
  deleteGroups,
  getAllMembers,
  addMembersToGroup,
  deleMembersFromGroup
} = require('./controller/group.controller');

const verifyToken = require('./middleware/verifyToken');

router.post('/', verifyToken, createNewGroup);//add group

router.delete('/:id', verifyToken, deleteGroups);

router.get('/:id', verifyToken,  getAllMembers);

router.post('/:groupId/members/', verifyToken, addMembersToGroup);

router.delete('/:groupId/members/:memberId', verifyToken, deleMembersFromGroup);

module.exports = router;
