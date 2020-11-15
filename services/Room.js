const Room = require('../models/Room');
const User = require('../models/User');

// exports.findAllRoomsData = async (userObjectId) => {
//   const UserData = await User.findById(userObdjectId).exec();
//   const { rooms } = UserData;

//   return rooms;
// };

// exports.createNewRoomData = async (newRoomData) => {
//   return await Room.create(newRoomData);
// };

// exports.removeRoomData = async (roomObjectId) => {
//   await Room.deleteOne({ 'id': roomObjectId });
// };

module.exports = class RoomService {
  constructor(userModel, roomModel) {
    this.userModel = userModel;
    this.roomMode = roomModel;
  }

  async findAll(userObjectId) {
    try {
      const UserData = await this.userModel.findById(userObjectId).exec();
      const { rooms } = UserData;

      return rooms;
    } catch (err) {
      console.error(err);
    }
  }

  async create(newRoomData) {
    try {
      return await this.roomModel.create(newRoomData);
    } catch (err) {
      console.error(err);
    }
  }

  async delete(roomObjectId) {
    try {
      return await this.roomModel.deleteOne({ 'id': roomObjectId });
    } catch (err) {
      console.error(err);
    }
  }
};
