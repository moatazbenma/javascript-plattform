const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET all articles (public)
router.get("/", async (req, res) => {
  const articles = await prisma.article.findMany({
    include: { author: true },
  });
  res.json(articles);
});

// GET article by ID (public)
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true },
  });
  res.json(article);
});

// CREATE article (admin + member)
router.post("/", auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const { title, content } = req.body;

  const article = await prisma.article.create({
    data: {
      title,
      content,
      authorId: req.user.id,
    },
  });

  res.json(article);
});

// UPDATE article
router.put("/:id", auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const id = Number(req.params.id);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return res.status(404).json({ message: "Not found" });

  if (req.user.role === "MEMBER" && article.authorId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const updated = await prisma.article.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
});

// DELETE article
router.delete("/:id", auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const id = Number(req.params.id);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return res.status(404).json({ message: "Not found" });

  if (req.user.role === "MEMBER" && article.authorId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await prisma.article.delete({ where: { id } });

  res.json({ message: "Deleted" });
});

module.exports = router;
