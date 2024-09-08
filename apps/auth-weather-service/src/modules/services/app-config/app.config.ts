import * as Joi from 'joi';

export const APP_CONFIG_VALIDATION_SCHEMA = {
  // APP
  APP_PORT: Joi.number().required(),
  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_URL: Joi.string().required(),
  // RabbitMQ
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_DEFAULT_USER: Joi.string().required(),
  RABBITMQ_DEFAULT_PASS: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  // JWT
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  // Cache
  WEATHER_CACHE_TTL_MS: Joi.number().required(),
  // Rate Limit
  WEATHER_RATE_LIMIT_MAX_COUNT: Joi.number().required(),
  WEATHER_RATE_LIMIT_WINDOW_MS: Joi.number().required(),
  REQUEST_LIMIT_MAX_COUNT: Joi.number().required(),
};

export const APP_CONFIG = () => ({
  app: {
    port: process.env.APP_PORT,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    url: process.env.DB_URL,
  },
  rabbitMQ: {
    host: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
    url: process.env.RABBITMQ_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  },
  cache: {
    weatherCacheTtlMs: process.env.WEATHER_CACHE_TTL_MS,
  },
  rateLimit: {
    weatherMaxCount: process.env.WEATHER_RATE_LIMIT_MAX_COUNT,
    weatherWindowMs: process.env.WEATHER_RATE_LIMIT_WINDOW_MS,
    requestMaxCount: process.env.REQUEST_LIMIT_MAX_COUNT,
  },
});
