const express = require('express');
const router = express.Router();

const { loginAndIssueToken } = require('./controller/login.controller');

router.post('/', loginAndIssueToken);

module.exports = router;
