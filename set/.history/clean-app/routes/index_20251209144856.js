var express = require('express');
var router = express.Router();
const prisma = require('../prisma/client');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const users = await prisma.user.findMany();
  res.render('index', { users });
});

/* SHOW REGISTER FORM */
router.get('/register', function(req, res) {
  res.render('form');
});

/* HANDLE SUBMIT */
router.post('/submit', async function(req, res) {
  await prisma.user.create({
    data: req.body
  });
  res.redirect('/');
});

module.exports = router;
