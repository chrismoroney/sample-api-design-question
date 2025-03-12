const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

router.post('/update', async (req, res) => {
    const { product_id, quantity, location } = req.body;

    if (!product_id || !location || typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const updated = await Inventory.findOneAndUpdate(
            { product_id, location },
            { $set: { quantity } },
            { new: true, upsert: true }
        );

        res.json({ message: "Inventory updated", data: updated});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
