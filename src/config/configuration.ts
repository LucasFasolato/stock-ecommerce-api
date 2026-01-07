import { validateEnv } from './env.schema';

export default () => {
  const env = validateEnv(process.env);

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    db: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      name: env.DB_NAME,
    },
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
    },
  };
};
