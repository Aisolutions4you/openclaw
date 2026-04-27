const request = require('supertest');
const app = require('../api/app');

describe('API Tests', () => {
    it('should return welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Welcome to OpenClaw API!');
    });
});