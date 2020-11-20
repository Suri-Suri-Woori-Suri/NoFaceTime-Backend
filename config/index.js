require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

const NODE_MAILER_ID = process.env.NODE_MAILER_ID;
const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
const SERVICE_URL = 'https://localhost:3000';
const SERVER_URL = 'https://localhost:5000';

module.exports = {
  NODE_ENV,
  JWT_SECRET_KEY,
  MONGO_URI,
  NODE_MAILER_ID,
  NODE_MAILER_PASSWORD,
  SERVICE_URL,
  SERVER_URL
};
