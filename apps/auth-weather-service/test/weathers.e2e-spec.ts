import * as request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { cities, stableDate } from '../prisma/seeds/data/data';
import { AppModule } from '../src/modules/app.module';

describe('WeathersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /weathers (success)', async () => {
    const userToken = await authenticateUser();

    const response = await request(app.getHttpServer())
      .get('/weathers')
      .query({
        city: cities[0].name,
        date: stableDate,
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('weatherCondition');
    expect(response.body).toHaveProperty('weatherDate');
    expect(typeof response.body.weatherCondition).toBe('string');
    expect(new Date(response.body.weatherDate)).toBeInstanceOf(Date);
  });

  it('/GET /weathers (unauthorized)', async () => {
    const response = await request(app.getHttpServer())
      .get('/weathers')
      .query({
        city: 'London',
        date: stableDate,
      })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/GET /weathers (rate limit exceeded)', async () => {
    const userToken = await authenticateUser();

    const totalRequests = 7;

    const requests = Array.from({ length: totalRequests }, () =>
      request(app.getHttpServer())
        .get('/weathers')
        .query({
          city: cities[0].name,
          date: stableDate,
        })
        .set('Authorization', `Bearer ${userToken}`),
    );

    const results = await Promise.allSettled(requests);

    results.forEach((result) => {
      if (result.status === 'rejected') {
        expect(result.reason.response?.status).toBe(
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    });
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
