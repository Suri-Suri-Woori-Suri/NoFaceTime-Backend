const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: "Hello!, This is 'Two Face Time' Server!" });
});

module.exports = router;
