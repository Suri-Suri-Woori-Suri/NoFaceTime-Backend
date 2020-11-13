const { SECRET_KEY } = require('../../config/index');
const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const { cookie } = req.headers;
  const token = cookie.split('=')[1];
  if (token === null) return res.sendStatus(401);//아예 쿠키가 없음

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);//만료
    req.user = user;
    next();
  });
}
