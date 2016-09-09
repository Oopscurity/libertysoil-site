import app, { logger } from './server';

global.Promise = require('bluebird');
global.Promise.config({
  warnings: false,
  longStackTraces: true,
  cancellation: true
});

const PORT = 8000;

app.listen(PORT, function (err) {
  if (err) {
    logger.error(err);  // eslint-disable-line no-console
    process.exit(1);
  }

  logger.info(`Listening at http://0.0.0.0:${PORT}\n`);
});

export default app;
