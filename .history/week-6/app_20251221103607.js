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
        res.sendFile(path.join(__dirname, "weather.html"));

});
const path = require("path");



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
