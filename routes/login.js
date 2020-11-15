const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/index');
const User = require('../models/User');

router.post('/', async function (req, res, next) {
  const payload = req.body;
  const { email, nickname } = req.body;
  console.log("routes", payload);

  try {
    const targetUser = await User.findOne({ email }).exec();

    if (targetUser) {
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: false, secure: false, maxAge: 60 * 60 * 1000 });
      res.json(targetUser);
    } else {
      try {
        await new User({
          email,
          nickname,
          groups: [],
          rooms: []
        }).save();
        const targetUser = await User.findOne({ email }).exec();
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: false, secure: false, maxAge: 60 * 60 * 1000 });
        res.json(targetUser);
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
