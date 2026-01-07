
import { redisClient } from '../../../src/config/redis';
import { getRBACCache } from '../../../src/infrastructure/redis/rbac.cache';

describe('Authorization Cache', () => {
    let getSpy: jest.SpyInstance;

    beforeEach(() => {
        getSpy = jest.spyOn(redisClient, 'get');
    });

    afterEach(() => {
        getSpy.mockRestore();
    });

    it('should get from cache', async () => {
        const mockData = { role: 'ADMIN', permissions: [] };
        getSpy.mockResolvedValue(JSON.stringify(mockData));
        const res = await getRBACCache('w1', 'u1');
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith("rbac:w1:u1");
        expect(res).toEqual(mockData);
    });
});