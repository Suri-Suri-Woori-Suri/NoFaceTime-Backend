module.exports = class RoomService {
  constructor(userModel, roomModel) {
    this.userModel = userModel;
    this.roomModel = roomModel;
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

  async createRoom(newRoomData) {
    try {
      console.log("NEW ROOM DATA", newRoomData);
      return await this.roomModel.create(newRoomData);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteRoom(roomObjectId) {
    try {
      const result = await this.roomModel.deleteOne({ '_id': roomObjectId });
      console.log("DELETE RESULT");

      return result;
    } catch (err) {
      console.error(err);
    }
  }
};
