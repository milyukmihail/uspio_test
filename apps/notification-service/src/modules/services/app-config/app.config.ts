import * as Joi from 'joi';

export const APP_CONFIG_VALIDATION_SCHEMA = {
  // RabbitMQ
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_DEFAULT_USER: Joi.string().required(),
  RABBITMQ_DEFAULT_PASS: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  // Email
  GMAIL_USER: Joi.string().required(),
  GMAIL_CLIENT_ID: Joi.string().required(),
  GMAIL_CLIENT_SECRET: Joi.string().required(),
  GMAIL_REDIRECT_URI: Joi.string().required(),
  GMAIL_REFRESH_TOKEN: Joi.string().required(),
  GMAIL_ACCESS_TOKEN: Joi.string().required(),
  GMAIL_EXPIRY_DATE: Joi.number().required(),
};

export const APP_CONFIG = () => ({
  rabbitMQ: {
    host: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
    url: process.env.RABBITMQ_URL,
  },
  email: {
    gmail: {
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      redirectUri: process.env.GMAIL_REDIRECT_URI,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN,
      expiryDate: process.env.GMAIL_EXPIRY_DATE,
    },
  },
});
