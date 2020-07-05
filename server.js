const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE_REMOTE;

mongoose
  .connect(
    DB.replace('<DBUSR>', process.env.DATABASE_USR)
      .replace('<PASSWORD>', process.env.DATABASE_PWD)
      .replace('<HOST>', process.env.DATABASE_HOST)
      .replace('<DBNAME>', process.env.DATABASE_NAME),
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('DB connect succefully'))
  .catch(err => console.log('Error: ', err));

// Definiçã da porta
const port = process.env.PORT || 3000;

// Criação de um Listner para ouvir as rquisições do utilizador.
const server = app.listen(port, () => {});

process.on('unhandledRejection', err => {
  server.close(() => {
    process.exit(1);
  });
});
