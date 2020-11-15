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
  try {
    const { currentUser, groupName, members } = req.body;
    const newGroupData = {
      name: groupName,
      members: members
    };

    await groupService.createGroup(newGroupData);
    const userData = await userService.getUserData({ '_id': currentUser._id });

    return res.status(201).send(userData.groups);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteGroup = (req, res, next) => {
  try {

  } catch (err) {
    console.error(err);
  }

};
