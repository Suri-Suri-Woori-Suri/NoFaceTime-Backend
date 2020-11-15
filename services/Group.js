const Group = require('../models/Group');
const User = require('../models/User');

exports.findAllGroups = async (userObjectId) => {
  const UserData = await User.findById(userObdjectId).exec();
  const { groups } = UserData;

  return groups;
};

exports.addNewGroup = async (userObjdectId, newGroupData) => {
  /* user의 groups 배열에도 추가하고 group에서도 추가하고 */
  // newGroupData = {name : "groupName", members : [ member 정보들!]} 

  await Group.create(newGroupData);
  await User.updateOne('groups', newGroupData);

};

exports.removeGorup = async (req, res, next) => {
  /* req에 들어와야 할 정보 : 로그인 되어 있는 user가 누구인지, 어떤 group을 지우려고 하는지 */
  await Group;
};
