import * as request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/modules/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST auth (success)', async () => {
    const authDto = {
      email: 'email1@gmail.com',
      password: 'password1',
    };

    const response = await request(app.getHttpServer())
      .post('/auth')
      .send(authDto)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.accessToken).toBeTruthy();
  });

  it('/POST auth (failure)', async () => {
    const authDto = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth')
      .send(authDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
