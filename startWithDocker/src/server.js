import app from "./app.js";
const PORT = process.env.PORT || 5001;

// Start the server

import prisma from './prismaClient.js';

const connectWithRetry = async () => {
  for (let i = 0; i < 5; i++) {
    try {
      await prisma.$connect();
      console.log('Database connected successfully!');
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1}: Could not connect to database. Retrying in 5 seconds...`, error.message);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error('Failed to connect to database after multiple retries. Exiting.');
  process.exit(1);
};

connectWithRetry().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
