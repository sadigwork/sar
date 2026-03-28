import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Applications (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // تسجيل دخول
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456',
      });

    token = res.body.accessToken;
  });

  it('create application', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profileId: 'profile-id',
      });

    expect(res.status).toBe(201);
  });

  it('get my applications', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/applications/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
