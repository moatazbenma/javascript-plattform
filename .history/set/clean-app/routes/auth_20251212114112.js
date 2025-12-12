var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// Login page (GET)
router.get("/login", (req, res) => {
  res.render("login");
});

// Login action (POST)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return res.send("User not found or wrong password");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "SECRETKEY");
  res.cookie("token", token);

  res.send("Login successful");
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
