require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
  SECRET_KEY,
  MONGO_URI
};
