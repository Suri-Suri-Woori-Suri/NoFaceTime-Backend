require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const SECRET_KEY = process.env.SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

const SERVICE_URL = 'http://localhost:3000';

module.exports = {
  NODE_ENV,
  SECRET_KEY,
  MONGO_URI,
  SERVICE_URL
};
