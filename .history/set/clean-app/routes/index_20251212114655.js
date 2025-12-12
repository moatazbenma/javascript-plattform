const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // middleware

// Temporary in-memory article list (so app works without DB)
let articles = [
  {
    id: 1,
    title: "First Article",
    content: "Hello world",
    authorId: 1,
    author: { id: 1, email: "admin@example.com" }
  }
];

// ================================
// PUBLIC ROUTES
// ================================

// Get all articles (public)
router.get('/', async (req, res) => {
  res.json(articles);
});

// View details (public)
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find(a => a.id === id);

  if (!article) return res.status(404).json({ message: "Not found" });

  res.json(article);
});

// ================================
// PROTECTED ROUTES (ADMIN + MEMBER)
// ================================

// Create article
router.post('/', auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const { title, content } = req.body;

  const newArticle = {
    id: articles.length + 1,
    title,
    content,
    authorId: req.user.id,
    author: { id: req.user.id, email: req.user.email }
  };

  articles.push(newArticle);

  res.json(newArticle);
});

// Update article
router.put('/:id', auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const id = Number(req.params.id);
  let article = articles.find(a => a.id === id);

  if (!article) return res.status(404).json({ message: "Not found" });

  // Member can update only their own article
  if (req.user.role === "MEMBER" && article.authorId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  article.title = req.body.title ?? article.title;
  article.content = req.body.content ?? article.content;

  res.json(article);
});

// Delete article
router.delete('/:id', auth(["ADMIN", "MEMBER"]), async (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find(a => a.id === id);

  if (!article) return res.status(404).json({ message: "Not found" });

  // Member can delete only their own article
  if (req.user.role === "MEMBER" && article.authorId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  articles = articles.filter(a => a.id !== id);

  res.json({ message: "Deleted" });
});

module.exports = router;
