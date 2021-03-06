const User = require('../models/User');

module.exports = class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async getUserData(filterOfUser) {
    try {
      return await this.userModel.findOne(filterOfUser).populate('rooms').populate('groups');
    } catch (err) {
      console.error(err);
    }
  }

  async addUserData(newUserData) {
    try {
      const { email, nickname } = newUserData;

      return await new User({ email, nickname, groups: [], rooms: [] }).save();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserData(userEmail) {
    try {
      return await this.userModel.deleteOne({ email: userEmail });
    } catch (err) {
      console.error(err);
    }
  }

  async addUserGroupData(userObjectId, groupObjectId) {
    try {
      return await this.userModel.updateOne(
        { _id: userObjectId },
        { $push: { groups: groupObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserGroupData(userObjectId, groupObjectIds) {
    try {
      return await this.userModel.updateMany(
        { _id: userObjectId },
        { $pull: { groups: { $in: groupObjectIds } } });
    } catch (err) {
      console.error(err);
    }
  }

  async addUserRoomData(userObjectId, roomObjectId) {
    try {
      return await this.userModel.updateOne(
        { _id: userObjectId },
        { $push: { rooms: roomObjectId } });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserRoomData(userObjectId, roomObjectId) {
    try {
      return await this.userModel.updateOne(
        { _id: userObjectId },
        { $pull: { rooms: roomObjectId } });
    } catch (err) {
      console.error(err);
    }
  }
};
