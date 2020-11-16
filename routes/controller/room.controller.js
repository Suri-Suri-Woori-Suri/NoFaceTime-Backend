const { v4: uuidv4 } = require('uuid');

const { SERVICE_URL } = require('../../config');
const { RESPONSE_MESSAGE } = require('../../constants');

const User = require('../../models/User');
const Room = require('../../models/Room');
const Group = require('../../models/Group');

const UserService = require('../../services/User');
const RoomService = require('../../services/Room');
const GroupService = require('../../services/Group');

const userService = new UserService(User);
const roomService = new RoomService(User, Room);
const groupService = new GroupService(User, Group);

exports.getAllRooms = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userData = await userService.getUserData({ '_id': userId });
    console.log("GET ALL ROOMS", userData);

    return res.json({ rooms: userData.rooms });
  } catch (err) {
    console.error(err);
  }
};

exports.createNewRoom = async (req, res, next) => {
  try {
    console.log('createNewRoom', req.body);
    const { currentUser, roomName } = req.body;
    const roomUniqueId = uuidv4();

    const newRoomData = {
      name: roomName,
      host: currentUser._id,
      link: `${SERVICE_URL}/${roomUniqueId}`
    };

    const roomDataSavedToDB = await roomService.createRoom(newRoomData);
    console.log("NEW NEW NEW", roomDataSavedToDB);

    await userService.addUserRoomData(currentUser._id, roomDataSavedToDB._id);
    const newUserData = await userService.getUserData({ '_id': currentUser._id });
    console.log("NEW USER DATA", newUserData);

    return res.json({ rooms: newUserData[0].rooms });
  } catch (err) {
    console.error(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {

  } catch (err) {
    console.error(err);
  }
};