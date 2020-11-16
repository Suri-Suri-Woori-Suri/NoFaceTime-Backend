require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

const SERVICE_URL = 'http://localhost:3000';

module.exports = {
  NODE_ENV,
  JWT_SECRET_KEY,
  MONGO_URI,
  SERVICE_URL
};
