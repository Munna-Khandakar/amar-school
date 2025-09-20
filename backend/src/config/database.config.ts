import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/school-management',
  options: {
    // Modern MongoDB driver doesn't need these deprecated options
  },
}));