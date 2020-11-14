const { v4: uuidv4 } = require('uuid');

const { RESPONSE_MESSAGE } = require('../../constants');
const { SERVICE_URL } = require('../../config');

const {
  addUserRoomsData,
  addUserGroupsData,
  deleteUserRoomsData
} = require('../../services/User');

const {
  findAllRoomsData,
  createNewRoomData,
  removeRoomData
} = require('../../services/Room');

exports.getAllRooms = async (req, res, next) => {
  try {
    const userId = req.body; // req.body 중 userObjectId 받아오는 부분
    const allRoomsData = await findAllRoomsData(userId);

    return res.send(allRoomsData);
  } catch (err) {
    console.error(err);
  }
};

exports.postNewRoom = async (req, res, next) => {
  try {
    console.log('postNewRoom', req.body);
    const { currentUser, roomName } = req.body;
    const roomUniqueId = uuidv4();

    const newRoomData = {
      name: roomName,
      host: currentUser._id,
      link: `${SERVICE_URL}/${roomUniqueId}`
    };

    const roomDataSavedToDB = await createNewRoomData(newRoomData);
    const newUserData = await addUserRoomsData(currentUser._id, roomDataSavedToDB._id);
    console.log("NEW USER DATA", newUserData);

    return res.send(newUserData);
  } catch (err) {
    console.error(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { currentUser, roomId } = req.body;
    console.log("delete?", currentUser, roomId);

    await removeRoomData(roomId);
    await deleteUserRoomsData(currentUser, roomId);
    console.log("delete!!!!");
  } catch (err) {
    console.error(err);
  }
};