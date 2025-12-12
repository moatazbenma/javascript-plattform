var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/login", (req, res) => {
  res.render("login", { title: "Login Page" });
});

router.post("/login", async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).send("User not found");
  }

  req.session.user = user;
  return res.redirect("/articles");
});

module.exports = router;
