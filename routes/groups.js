const express = require('express');
const router = express.Router();

const { RESPONSE_MESSAGE } = require('../constants');
const { getAllGroups } = require('./controller/group.controller');

router.get('/', getAllGroups);

router.post('/', (req, res, next) => { // 그룹 생성할 때 post 요청 들어올 때
  try {



  } catch (err) {

  }
});

router.delete('/', (req, res, next) => { // 그룹 삭제할 때 delete 요청 들어올 때
  try {





    res.stats(204).send({
      message: RESPONSE_MESSAGE.NO_CONTENT
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
