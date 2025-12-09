var express = require('express');
var router = express.Router();
const prisma = require('../prisma/client'); // or ../lib/prisma if you used that

/* GET home page. */
router.get('/', async function(req, res, next) {
  const users = await prisma.user.findMany();
  res.render('index', { users });
});

module.exports = router;
