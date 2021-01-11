const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const UserService = require('../../services/User');

const userService = new UserService(User);

exports.loginAndIssueToken = async (req, res, next) => {
  try {
    const payload = req.body;
    const { email, nickname } = req.body;
    let loginUserData = await userService.getUserData({ 'email': email });

    if (!loginUserData) {
      loginUserData = await userService.addUserData(payload);
    }

    const token = jwt.sign(
      payload,
      JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie(
      'token',
      token,
      {
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 1000
      }
    );

    return res.status(201).json({ loginUserData });
  } catch (err) {
    console.error(err);
  }
};
