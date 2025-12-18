
import dotenv from 'dotenv';
dotenv.config();

export default  {
 development: {
    // Force Sequelize to use the full connection string
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    // Important for local PostgreSQL on Windows
    dialectOptions: {
      ssl: false
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};