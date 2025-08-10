const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables

// Get DB URI from environment variables
const DB = process.env.MONGO_URI;

if (!DB) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log("✅ MongoDB connection successful"))
.catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
});

module.exports = mongoose;
