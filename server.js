const express = require('express');
const mongoose = require('mongoose');
const app = express();
const inventoryRoutes = require('./routes/inventory');

// Middleware
app.use(express.json());

// can update with actual mongodb string
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/inventorydb";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));


// Routes
app.use('/api/inventory', inventoryRoutes);

module.exports = app;

// Start server
if (require.main === module) {
    app.listen(3000, () => console.log("Server running on port 3000"));
}
