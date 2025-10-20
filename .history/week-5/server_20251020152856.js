const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Define a simple route
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page", message: "Welcome to StudyHub Express App!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
