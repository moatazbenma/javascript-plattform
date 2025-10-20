const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'data.json');

// Utility: load / save data
function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'studyhub-secret-123',
  resave: false,
  saveUninitialized: true
}));

// middleware to attach user
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

/* ---------- Routes ---------- */

// Home
app.get('/', (req, res) => {
  res.render('index');
});

// Signup
app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});
app.post('/signup', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.render('signup', { error: 'Name and Email required' });

  const data = loadData();
  const exists = data.users.find(u => u.email === email);
  if (exists) return res.render('signup', { error: 'Email already registered. Please login.' });

  const user = {
    id: uuidv4(),
    name,
    email,
    points: 0,
    completed: []
  };
  data.users.push(user);
  saveData(data);

  req.session.user = { id: user.id, name: user.name, email: user.email };
  res.redirect('/dashboard');
});

// Login (super simple: by email)
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});
app.post('/login', (req, res) => {
  const { email } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.render('login', { error: 'No user found with that email.' });

  req.session.user = { id: user.id, name: user.name, email: user.email };
  res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const data = loadData();
  const user = data.users.find(u => u.id === req.session.user.id);
  res.render('dashboard', { user, materials: data.materials });
});

// Materials list with simple search
app.get('/materials', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const data = loadData();
  const materials = data.materials.filter(m => {
    if (!q) return true;
    return m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.type.toLowerCase().includes(q);
  });
  res.render('materials', { materials, q });
});

// View a material
app.get('/materials/:id', (req, res) => {
  const id = req.params.id;
  const data = loadData();
  const material = data.materials.find(m => m.id === id);
  if (!material) return res.status(404).send('Material not found.');
  let user = null;
  if (req.session.user) {
    user = data.users.find(u => u.id === req.session.user.id);
  }
  res.render('material', { material, user });
});

// Mark material completed -> award points
app.post('/materials/:id/complete', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const id = req.params.id;
  const data = loadData();
  const user = data.users.find(u => u.id === req.session.user.id);
  if (!user) return res.redirect('/dashboard');

  if (!user.completed.includes(id)) {
    user.completed.push(id);
    user.points += 10; // award 10 points per lesson
    saveData(data);
  }
  res.redirect(`/materials/${id}`);
});

/* ---------- AI placeholders ---------- */

// AI Chat page
app.get('/ai/chat', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('ai_chat', { response: null, input: '' });
});

// POST chat -> placeholder simple echo + "AI" reply
app.post('/ai/chat', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const message = req.body.message || '';
  // Placeholder AI: echo back with small modifications
  const response = `AI Tutor: I hear you say "${message}". Great attempt! Try to expand: "${message} ... and then I..."`;
  res.render('ai_chat', { response, input: message });
});

// Grammar correction endpoint (placeholder)
// In production replace with real AI API call (OpenAI etc.)
app.post('/ai/grammar', (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: 'login required' });
  const text = req.body.text || '';
  // Simple naive "correction": fix double spaces and capitalise first letter of sentence
  const corrected = text.replace(/\s+/g, ' ').trim().replace(/(^\w)/, c => c.toUpperCase());
  const suggestions = [
    { original: text, corrected }
  ];
  res.json({ corrected, suggestions });
});

/* ---------- Start ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`StudyHub app listening on http://localhost:${PORT}`);
});
