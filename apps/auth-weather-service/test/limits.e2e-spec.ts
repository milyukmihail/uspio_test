import * as request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/modules/app.module';

describe('LimitsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /limits (success)', async () => {
    const userToken = await authenticateUser();

    const response = await request(app.getHttpServer())
      .get('/limits')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('maxRequests');
    expect(response.body).toHaveProperty('actualValue');
    expect(typeof response.body.maxRequests).toBe('number');
    expect(typeof response.body.actualValue).toBe('number');
  });

  it('/GET /limits (unauthorized)', async () => {
    await request(app.getHttpServer())
      .get('/limits')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  afterAll(async () => {
    await app.close();
  });

  async function authenticateUser(): Promise<string> {
    const authResponse = await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: 'email1@gmail.com',
        password: 'password1',
      })
      .expect(HttpStatus.OK);

    return authResponse.body.accessToken;
  }
});
