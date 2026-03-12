import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

async function start() {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`FoodRush backend listening on port ${ENV.PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

