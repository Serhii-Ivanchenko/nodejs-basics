import { startServer } from './server.js';
import { initMongoDB } from './db/initiMongoDb.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
