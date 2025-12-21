const axios = require("axios");
const { OPENWEATHER_API_KEY, BASE_URL } = require("../config/config");

/**
 * GET /weather?city=London
 */
const getWeather = async (req, res) => {
    const { city } = req.query;

    // Data validation
    if (!city || typeof city !== "string") {
        return res.status(400).json({ error: "City parameter is required and must be a string." });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: OPENWEATHER_API_KEY,
                units: "metric"
            }
        });

        // Success
        return res.json({
            city: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description
        });

    } catch (error) {
        console.error(error.message);

        // Error handling
        if (error.response) {
            // API responded with error
            return res.status(error.response.status).json({
                error: error.response.data.message
            });
        } else if (error.request) {
            // Request was made but no response
            return res.status(500).json({ error: "No response from weather API." });
        } else {
            // Other errors
            return res.status(500).json({ error: "Internal server error." });
        }
    }
};

module.exports = { getWeather };
