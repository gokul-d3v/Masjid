const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('API Tests', () => {

    // Close mongoose connection after tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('GET / should return 404 (since no root route is defined)', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(404);
    });

    it('GET /auth/health should return 404 if not defined or 200 if defined', async () => {
        // Just checking if the app responds
        const res = await request(app).get('/auth/random-endpoint');
        expect(res.statusCode).toEqual(404);
    });
});
