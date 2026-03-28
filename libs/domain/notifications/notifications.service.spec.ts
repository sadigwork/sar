import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  it('should create notification', async () => {
    const prisma = {
      notification: {
        create: jest.fn().mockResolvedValue({ id: '1' }),
      },
    };

    const service = new NotificationsService(prisma as any);

    const result = await service.create({
      userId: 'user1',
      title: 'Test',
      message: 'Hello',
      type: 'WORKFLOW',
    });

    expect(result.id).toBe('1');
  });
});
