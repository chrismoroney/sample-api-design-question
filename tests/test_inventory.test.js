const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Inventory = require('../models/Inventory'); // ✅ Fix import path

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri);
});

beforeEach(async () => {
    await Inventory.deleteMany({}); // Ensure a clean database before each test
});

afterAll(async () => {
    await mongoose.connection.close(); // ✅ Close Mongoose connection
    await mongoServer.stop();
    await new Promise(resolve => setTimeout(resolve, 0)); // ✅ Fix Jest exit issue
});

describe('POST /api/inventory/update', () => {
    it('should update inventory with valid data', async () => {
        const res = await request(app)
            .post('/api/inventory/update')
            .send({ product_id: "ABC123", quantity: 50, location: "Seattle-Warehouse" });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Inventory updated");
    });

    it('should return 400 if input is invalid', async () => {
        const res = await request(app)
            .post('/api/inventory/update')
            .send({ product_id: "", quantity: -10, location: "" });

        expect(res.statusCode).toBe(400);
    });
});
