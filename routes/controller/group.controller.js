const { RESPONSE_MESSAGE } = require('../../constants');

const User = require('../../models/User');
const Group = require('../../models/Group');

const UserService = require('../../services/User');
const GroupService = require('../../services/Group');

const userService = new UserService(User);
const groupService = new GroupService(User, Group);

exports.getAllGroups = async (req, res, next) => {
  try {
    const { currentUser } = req.body;
    const userData = await userService.getUserData({ '_id': currentUser._id });

    return res.send(userData.groups);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createNewGroup = async (req, res, next) => {
  console.log('*******');
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

exports.deleteGroups = (req, res, next) => {
  try {
    const { userId, selectedGroup } = req.body;
    await groupService.deleteGroups(selectedGroup);
    const updatedUser = await userService.getUserData({ '_id': userId });

    return res.status(204).json({ groups: updatedUser[0].groups });
  } catch (err) {
    console.error(err);
  }

};
