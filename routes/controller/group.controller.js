const { RESPONSE_MESSAGE } = require('../../constants');
const { getAllGroups } = require('../../services/Group');

exports.getAllGroups = async (req, res, next) => {
  const userId = req.body; // req.body 중 userObjectId 받아오는 부분
  getAllGroups(userId);
  res.send('this is group');
};

exports.addNewGroup = (req, res, next) => {

};

exports.deleteGroup = (req, res, next) => {

};