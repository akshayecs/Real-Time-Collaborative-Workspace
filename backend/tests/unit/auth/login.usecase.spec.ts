import * as passwordUtils from '../../../src/shared/utils/password';
import * as jwtUtils from '../../../src/shared/utils/jwt';
import { LoginUseCase } from '../../../src/application/auth/login.usecase';
import { prismaMock } from '../../singleton';

describe('LoginUseCase', () => {
    let useCase: LoginUseCase;

    beforeEach(() => {
        useCase = new LoginUseCase(prismaMock as any);
        jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
        jest.spyOn(jwtUtils, 'signAccessToken').mockReturnValue('mock-access');
        jest.spyOn(jwtUtils, 'signRefreshToken').mockReturnValue('mock-refresh');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns tokens on success', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'u1',
            email: 'test@test.com',
            passwordHash: 'hashed'
        } as any);

        const result = await useCase.execute('test@test.com', 'password123');
        expect(result.accessToken).toBe('mock-access');
    });
});