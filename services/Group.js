const Group = require('../models/Group');
const User = require('../models/User');

// exports.findAllGroupsData = async (userObjectId) => {
//   const UserData = await User.findById(userObdjectId).exec();
//   const { groups } = UserData;

//   return groups;
// };

// exports.createNewGroupData = async (newGroupData) => {
//   // newGroupData = {name : "groupName", members : [ member 정보들!]} 
//   return await Group.create(newGroupData);
// };

// exports.removeGorupData = async (req, res, next) => {
//   /* req에 들어와야 할 정보 : 로그인 되어 있는 user가 누구인지, 어떤 group을 지우려고 하는지 */
//   await Group;
// };

module.exports = class GroupService {
  constructor(userModel, groupModel) {
    this.userModel = userModel;
    this.groupModel = groupModel;
  }

  async findAll(userObjectId) {
    try {
      const UserData = await this.userModel.findById(userObjectId).exec();
      const { groups } = UserData;

      return groups;
    } catch (err) {
      console.error(err);
    }
  }

  async create(newGroupData) {
    try {
      return await this.groupModel.create(newGroupData);
    } catch (err) {
      console.error(err);
    }
  }
};
