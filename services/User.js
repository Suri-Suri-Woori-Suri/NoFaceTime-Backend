const User = require('../models/User');

exports.addUserRoomsData = async (userObjectId, roomObjectId) => {
  return await User.updateOne({ '_id': userObjectId }, { $push: { 'rooms': roomObjectId } });
};

exports.deleteUserRoomsData = async (userObjectId, roomObjectId) => {
  return await User.updateOne({ '_id': userObjectId }, { $pull: { 'rooms': roomObjectId } });
};

exports.addUserGroupsData = async (userObjectId, groupObjectId) => {
  return await User.updateOne({ '_id': userObjectId }, { $push: { 'groups': groupObjectId } });
};

exports.deleteUserGroupsData = async (userObjectId, groupObjectId) => {
  return await User.updateOne({ '_id': userObjectId }, { $pull: { 'groups': groupObjectId } });
};
