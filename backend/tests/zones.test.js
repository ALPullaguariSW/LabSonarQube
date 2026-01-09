import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import bodyParser from 'body-parser';

// 1. Mock DB
jest.unstable_mockModule('../config/db.js', () => ({
    default: {
        query: jest.fn(),
    },
}));

// 2. Import Mocked DB
const db = await import('../config/db.js').then(m => m.default);

// 3. Dynamic Import of Router (AFTER mocking)
const { default: zonesRouter } = await import('../routes/zones.js');

const app = express();
app.use(bodyParser.json());
app.use('/zones', zonesRouter);

describe('Zones API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /zones', () => {
        it('should return all zones', async () => {
            const mockZones = [{ id: 1, name: 'Zone A' }];
            db.query.mockResolvedValue({ rows: mockZones });

            const res = await request(app).get('/zones');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockZones);
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).get('/zones');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /zones/:id', () => {
        it('should return a zone by id', async () => {
            const mockZone = { id: 1, name: 'Zone A' };
            db.query.mockResolvedValue({ rows: [mockZone] });

            const res = await request(app).get('/zones/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockZone);
        });

        it('should return 400 for invalid id', async () => {
            const res = await request(app).get('/zones/abc');
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /zones', () => {
        it('should create a zone', async () => {
            db.query.mockResolvedValue({ rowCount: 1 });
            const res = await request(app).post('/zones').send({ name: 'Z', description: 'Desc' });
            expect(res.statusCode).toBe(201);
        });

        it('should handle errors during creation', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).post('/zones').send({ name: 'Z', description: 'Desc' });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('PUT /zones/:id', () => {
        it('should update a zone', async () => {
            db.query.mockResolvedValue({ rowCount: 1 });
            const res = await request(app).put('/zones/1').send({ name: 'Z', description: 'Updated' });
            expect(res.statusCode).toBe(200);
        });

        it('should handle errors during update', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).put('/zones/1').send({ name: 'Z', description: 'Updated' });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('DELETE /zones/:id', () => {
        it('should delete a zone', async () => {
            db.query.mockResolvedValue({ rowCount: 1 });
            const res = await request(app).delete('/zones/1');
            expect(res.statusCode).toBe(200);
        });

        it('should handle errors during deletion', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).delete('/zones/1');
            expect(res.statusCode).toBe(500);
        });
    });
});
