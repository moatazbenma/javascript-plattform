var express = require('express');
var router = express.Router();
const prisma = require('../prisma/client');
const { isLoggedIn, isAdmin } = require('../middleware/auth');




router.get('/', isLoggedIn, async (req, res) => {
  const users = await prisma.user.findMany();
  res.render('index', { users });
});

// Example: only admin can access register page
router.get('/register', isAdmin, (req, res) => {
  res.render('form');
});
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



router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  });

  if (!user) return res.send("User not found");

  // save user to session
  req.session.user = user;
  res.redirect('/');
});


module.exports = router;
