const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth'); // middleware

// Public — anyone can read articles
router.get('/', async (req, res) => {
  const articles = await prisma.article.findMany({
    include: { author: true },
  });
  res.json(articles);
});

// Public — view article detail
router.get('/:id', async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: Number(req.params.id) },
    include: { author: true },
  });
  res.json(article);
});

// ==========================
// PROTECTED ROUTES BELOW
// ==========================

// Create article → Admin + Member
router.post('/', auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const { title, content } = req.body;

  const article = await prisma.article.create({
    data: {
      title,
      content,
      authorId: req.user.id, // logged-in user
    },
  });

  res.json(article);
});

// Update article
router.put('/:id', auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) return res.status(404).json({ message: "Not found" });

  // MEMBER can edit only their own articles
  if (req.user.role === "MEMBER" && article.authorId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const updated = await prisma.article.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
});

// Delete article
router.delete('/:id', auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) return res.status(404).json({ message: "Not found" });

  // MEMBER can delete only their own articles
  if (req.user.role === "MEMBER" && article.authorId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const deleted = await prisma.article.delete({
    where: { id },
  });

  res.json({ message: "Deleted", deleted });
});

module.exports = router;
