const Room = require('../models/Room');
const User = require('../models/User');

exports.findAllRoomsData = async (userObjectId) => {
  const UserData = await User.findById(userObdjectId).exec();
  const { rooms } = UserData;

  return rooms;
};

exports.createNewRoomData = async (newRoomData) => {
  return await Room.create(newRoomData);
};

exports.removeRoomData = async (roomObjectId) => {
  await Room.deleteOne({ 'id': roomObjectId });
};
