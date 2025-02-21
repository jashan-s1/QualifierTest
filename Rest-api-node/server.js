const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000; // Local Testing Port



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// POST Endpoint - Process Data
app.post("/bfhl", (req, res) => {
    try {
        const { full_name, dob, data } = req.body;

        // Validate required fields
        if (!full_name || !dob || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Missing required fields. Ensure full_name, dob, and data array are provided."
            });
        }

        // Generate user_id
        const user_id = `${full_name.replace(/\s+/g, '_').toLowerCase()}_${dob}`;

        // Separate numbers and alphabets
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item) && typeof item === "string");

        // Find highest alphabet (case insensitive)
        let highestAlphabet = [];
        if (alphabets.length > 0) {
            highestAlphabet = [alphabets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).pop()];
        }

        // Response
        res.json({
            is_success: true,
            user_id,
            numbers,
            alphabets,
            highest_alphabet: highestAlphabet
        });
    } catch (error) {
        res.status(500).json({
            is_success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET Endpoint - Operation Code
app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start server for local testing
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export app for Vercel deployment
module.exports = app;
