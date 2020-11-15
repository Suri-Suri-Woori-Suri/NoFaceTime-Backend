const { RESPONSE_MESSAGE } = require('../../constants');

const Group = require('../../models/Group');
const User = require('../../models/User');

// const {
//   findAllGroupsData,
//   createNewGroupData,
//   removeGroupData
// } = require('../../services/Group');

// const {
//   addUserGroupsData,
//   deleteUserGroupsData
// } = require('../../services/User');

const GroupService = require('../../services/Group');
const UserService = require('../../services/User');

const groupService = new GroupService(User, Group);
const userService = new UserService(User);

exports.getAllGroups = async (req, res, next) => {
  try {
    const userId = req.body.currentUser._id; // req.body 중 userObjectId 받아오는 부분
    const allGroupsData = await groupService.findAll(userId);

    return res.send(allGroupsData);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createNewGroup = async (req, res, next) => {
  try {
    console.log('group 생성', req.body); //user 정보와 group name 필요함.
    const { currentUser, groupName, members } = req.body;

    const newGroupData = {
      name: groupName,
      members: members
    };

    //const groupDataSavedToDB = await createNewGroupData(newGroupData);
    const groupDataSavedToDB = await groupService.create(newGroupData);
    //const newUserData = await addUserGroupsData(currentUser._id, groupDataSavedToDB._id);
    const newUserData = await userService.addUserGroup(currentUser._id, groupDataSavedToDB._id);
    console.log("NEW GROUP DATA", newUserData);
    return res.send(newUserData);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteGroup = (req, res, next) => {

};