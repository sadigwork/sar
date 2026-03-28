import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Workflow (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should run full workflow', async () => {
    // 1. create application
    const appRes = await request(app.getHttpServer())
      .post('/applications')
      .send({});

    const appId = appRes.body.id;

    // 2. registrar approve
    await request(app.getHttpServer()).post(`/workflow/${appId}/review`).send({
      reviewerId: 'r1',
      role: 'REGISTRAR',
      decision: 'APPROVED',
    });

    // 3. reviewer approve
    await request(app.getHttpServer()).post(`/workflow/${appId}/review`).send({
      reviewerId: 'r2',
      role: 'REVIEWER',
      decision: 'APPROVED',
    });

    // assert later...
  });
  it('full workflow test', async () => {
    // 1. create application
    const appRes = await request(server)
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({ profileId });

    const appId = appRes.body.id;

    // 2. submit
    await request(server)
      .post(`/api/applications/${appId}/submit`)
      .set('Authorization', `Bearer ${token}`);

    // 3. reviewer action
    await request(server)
      .post(`/api/workflow/${appId}/review`)
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({
        action: 'APPROVE',
      });

    // 4. accountant verify
    await request(server)
      .patch(`/api/applications/payments/${appId}/verify`)
      .set('Authorization', `Bearer ${accountantToken}`);

    // 5. final status
    const final = await request(server)
      .get(`/api/applications/${appId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(final.body.status).toBe('APPROVED');
  });
});
