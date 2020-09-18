const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Estado = require('./../models/estadoModel');
const Perfil = require('./../models/perfilModel');
const User = require('./../models/userModel');
const Seguradora = require('./../models/seguradoraModel');
const Modalidade = require('./../models/modalidadeModel');

dotenv.config({ path: './config.env' });

let DB = '';

if(process.env.NODE_ENV === 'development')
   DB = process.env.DATABASE_LOCAL;
else
  DB = process.env.DATABASE_REMOTE
             .replace('<PASSWORD>',  process.env.DATABASE_PWD)
             .replace('<DBUSR>',     process.env.DATABASE_USR)
             .replace('<HOST>',      process.env.DATABASE_HOST)
             .replace('<DBNAME>',    process.env.DATABASE_NAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const estados = JSON.parse(
  fs.readFileSync(`${__dirname}/estados.json`, 'utf-8')
);

const perfis = JSON.parse(
  fs.readFileSync(`${__dirname}/perfils.json`, 'utf-8')
);

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const seguradoras = JSON.parse(
  fs.readFileSync(`${__dirname}/seguradoras.json`, 'utf-8')
);
const modalidades = JSON.parse(
  fs.readFileSync(`${__dirname}/modalidades.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Estado.create(estados);
    const modalidadesResult = await Modalidade.create(modalidades);

    seguradoras.forEach(el => {
      el.modalidades = modalidadesResult.map(el=>el._id);
    });

    await Seguradora.create(seguradoras);
    await Perfil.create(perfis);
    await User.create(users, { validateBeforeSave: false });

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Estado.deleteMany();
    await Perfil.deleteMany();
    await User.deleteMany();
    await Seguradora.deleteMany();
    await Modalidade.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
