const User = require('../../models/User');
const UserService = require('../../services/User');

const userService = new UserService(User);

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userData = await userService.getUserData({ '_id': userId });

    return res.status(200).send(userData);
  } catch (err) {
    console.error(err);
  }
};
