const User = require('../models/User');

module.exports = class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async getUserData(filterOfUser) {
    try {
      console.log("USER SERVICE", filterOfUser);

      const result = await this.userModel.find(filterOfUser).populate('rooms').populate('groups');
      console.log("가져온 정보?", result);

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async addUserData(newUserData) {
    try {
      const { email, nickname } = newUserData;
      console.log("USER SERVICER, ADD USER DATA, input", newUserData);

      const result = await new User({ email, nickname, groups: [], rooms: [] }).save();
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async addUserGroupData(userObjectId, groupObjectId) {
    try {
      return await this.userModel.updateOne(
        { '_id': userObjectId },
        { $push: { 'groups': groupObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserGroupData(userObjectId, groupObjectId) {
    try {
      return await this.groupModel.updateOne(
        { '_id': userObjectId },
        { $pull: { 'groups': groupObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async addUserRoomData(userObjectId, roomObjectId) {
    try {
      return await this.userModel.updateOne(
        { '_id': userObjectId },
        { $push: { 'rooms': roomObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserRoomData(userObjectId, roomObjectId) {
    try {
      return await this.userModel.updateOne(
        { '_id': userObjectId },
        { $pull: { 'rooms': roomObjectId } });
    } catch (err) {
      console.error(err);
    }
  }
};
