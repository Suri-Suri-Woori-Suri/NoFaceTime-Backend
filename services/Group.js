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

  async createGroup(newGroupData) {
    try {
      return await this.groupModel.create(newGroupData);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteGroup(groupObjectId) {
    try {
      return await this.gorupModel.deleteOne({ 'id': groupObjectId });
    } catch (err) {
      console.error(err);
    }
  }
};
