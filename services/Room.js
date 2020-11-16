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
      return await this.roomModel.deleteOne({ 'id': roomObjectId });
    } catch (err) {
      console.error(err);
    }
  }
};
