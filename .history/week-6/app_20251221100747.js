const express = require("express");
const bodyParser = require("body-parser");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use("/api", weatherRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Weather API Server is running.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
