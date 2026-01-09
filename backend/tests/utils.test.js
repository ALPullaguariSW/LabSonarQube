import HTTP_STATUS from '../utils/httpStatus.js';

describe('HTTP Status Utils', () => {
    it('should have correct status codes', () => {
        expect(HTTP_STATUS.OK).toBe(200);
        expect(HTTP_STATUS.CREATED).toBe(201);
        expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
        expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
    });
});
