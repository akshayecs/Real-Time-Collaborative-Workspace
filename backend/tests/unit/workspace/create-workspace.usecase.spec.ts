import { prismaMock } from '../../singleton';
import { CreateWorkspaceUseCase } from '../../../src/application/workspace/create-workspace.usecase';

describe('CreateWorkspaceUseCase', () => {
    let useCase: CreateWorkspaceUseCase;

    beforeEach(() => {
        useCase = new CreateWorkspaceUseCase(prismaMock as any);
    });

    it('creates a workspace successfully', async () => {
        prismaMock.workspace.create.mockResolvedValue({
            id: 'new-w-id',
            name: 'My Workspace',
            projectId: 'p1',
            createdAt: new Date(),
            updatedAt: new Date()
        } as any);

        const result = await useCase.execute('My Workspace', 'u1', 'p1');
        expect(result.id).toBe('new-w-id');
    });
});