const User = require('../models/User');

// exports.addUserRoomsData = async (userObjectId, roomObjectId) => {
//   return await User.updateOne({ '_id': userObjectId }, { $push: { 'rooms': roomObjectId } });
// };

// exports.deleteUserRoomsData = async (userObjectId, roomObjectId) => {
//   return await User.updateOne({ '_id': userObjectId }, { $pull: { 'rooms': roomObjectId } });
// };

// exports.addUserGroupsData = async (userObjectId, groupObjectId) => {
//   return await User.updateOne({ '_id': userObjectId }, { $push: { 'groups': groupObjectId } });
// };

// exports.deleteUserGroupsData = async (userObjectId, groupObjectId) => {
//   return await User.updateOne({ '_id': userObjectId }, { $pull: { 'groups': groupObjectId } });
// };


module.exports = class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async addUserRoom(userObjectId, roomObjectId) {
    try {
      return await this.userModel.updateOne({ '_id': userObjectId }, { $push: { 'rooms': roomObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserRoom(userObjectId, roomObjectId) {
    try {
      return await this.userModel.updateOne({ '_id': userObjectId }, { $pull: { 'rooms': roomObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async addUserGroup(userObjectId, groupObjectId) {
    try {
      return await this.groupModel.updateOne({ '_id': userObjectId }, { $push: { 'groups': groupObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserGroup(userObjectId, groupObjectId) {
    try {
      return await this.groupModel.updateOne({ '_id': userObjectId }, { $pull: { 'groups': groupObjectId } });
    } catch (err) {
      console.error(err);
    }
  }
};
