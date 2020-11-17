const { RESPONSE_MESSAGE } = require('../../constants');
const queryString = require('query-string');

const User = require('../../models/User');
const Group = require('../../models/Group');

const UserService = require('../../services/User');
const GroupService = require('../../services/Group');

const userService = new UserService(User);
const groupService = new GroupService(User, Group);

exports.getAllMembers = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const members = await groupService.findMembers(groupId);
    return res.status(200).json({ members });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createNewGroup = async (req, res, next) => {
  try {
    const { userId, groupName, members } = req.body;
    const newGroupData = {
      name: groupName,
      members: members
    };

    const groupDataSavedToDB = await groupService.createGroup(newGroupData);
    await userService.addUserGroupData(userId, groupDataSavedToDB._id);
    const updatedUser = await userService.getUserData({ '_id': userId });

    return res.status(201).json({ groups: updatedUser[0].groups });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteGroups = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const parsed = queryString.parse(req.params.id);
    console.log('$$$$$$$$', req.params.id);
    console.log('$$$$$$$$', parsed);
    const groupIdArray = Array.isArray(parsed.groups) ? parsed.group : [parsed.group] ;

    await groupService.deleteGroups( groupIdArray);
    const updatedUser = await userService.getUserData({ '_id': userId });
    //204...?
    return res.status(200).json({ groups: updatedUser[0].groups });
  } catch (err) {
    console.error(err);
  }
};

exports.addMembersToGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const { members } = req.body;
    await groupService.addMembers(groupId, members);
    const updatedMembers = await groupService.findMembers(groupId);
    return res.status(201).json({ updatedMembers });
  } catch (err) {
    console.errer(err);
  }
};

exports.deleMembersFromGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const parsed = queryString.parse(req.params.memberId);
    await groupService.deleteMembers(groupId, parsed.member);
    const updatedMembers = await groupService.findMembers(groupId);
    return res.status(201).json({ updatedMembers });
  } catch (err) {
    console.log(err);
  }
};
