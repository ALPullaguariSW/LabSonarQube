import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import bodyParser from 'body-parser';

jest.unstable_mockModule('../config/db.js', () => ({
    default: {
        query: jest.fn(),
    },
}));

const db = await import('../config/db.js').then(m => m.default);

// Dynamic import
const { default: spacesRouter } = await import('../routes/spaces.js');

const app = express();
app.use(bodyParser.json());
app.use('/spaces', spacesRouter);

describe('Spaces API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /spaces', () => {
        it('should return all spaces', async () => {
            const mockSpaces = [{ id: 1, number: 'A1' }];
            db.query.mockResolvedValue({ rows: mockSpaces });

            const res = await request(app).get('/spaces');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockSpaces);
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).get('/spaces');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /spaces/:id', () => {
        it('should return space by id', async () => {
            const mockSpace = { id: 1, number: 'A1' };
            db.query.mockResolvedValue({ rows: [mockSpace] });
            const res = await request(app).get('/spaces/1');
            expect(res.statusCode).toBe(200);
        });

        it('should validate id', async () => {
            const res = await request(app).get('/spaces/invalid');
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /spaces', () => {
        it('should create space', async () => {
            db.query.mockResolvedValue({});
            const res = await request(app).post('/spaces').send({ zone_id: 1, number: '10', status: 'free' });
            expect(res.statusCode).toBe(201);
        });

        it('should handle errors during creation', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).post('/spaces').send({ zone_id: 1, number: '10', status: 'free' });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('PUT /spaces/:id', () => {
        it('should update space', async () => {
            db.query.mockResolvedValue({});
            const res = await request(app).put('/spaces/1').send({ zone_id: 1, number: '11', status: 'busy' });
            expect(res.statusCode).toBe(200);
        });

        it('should handle errors during update', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).put('/spaces/1').send({ zone_id: 1, number: '11', status: 'busy' });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('DELETE /spaces/:id', () => {
        it('should delete space', async () => {
            db.query.mockResolvedValue({});
            const res = await request(app).delete('/spaces/1');
            expect(res.statusCode).toBe(200);
        });

        it('should handle errors during deletion', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).delete('/spaces/1');
            expect(res.statusCode).toBe(500);
        });
    });
});
