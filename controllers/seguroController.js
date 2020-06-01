const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Seguro = require('./../models/seguroModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const APIFeatures = require('./../utils/apiFeatures');
const ErrorMessage = require('./../utils/error');

const filds = [
  'tipo',
  'modalidade',
  'price',
  'simulacao',
  'apolice',
  'comprovativos',
  'docIdentificacaos',
  'estado',
  'seguradora',
  'sinistros'
];

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf')
    cb(null, true);
  else cb(new AppError(ErrorMessage[14].message, 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadSeguroDocs = upload.fields([
  { name: 'apolice', maxCount: 1 },
  { name: 'simulacao', maxCount: 1 },
  { name: 'comprovativos', maxCount: 3 },
  { name: 'docIdentificacaos', maxCount: 10 }
]);

const handlingFiles = async (files, type) => {
  const fileNames = [];

  await Promise.all(
    files.map(async (file, i) => {
      if (file.mimetype.startsWith('image')) {
        const filename = `seguro-${type}-${Date.now()}-${i}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/files/seguros/${type}/${filename}`);

        fileNames.push(filename);
      } else if (file.mimetype === 'application/pdf') {
        const filename = `seguro-${type}-${Date.now()}-${i}.pdf`;

        fs.writeFileSync(`public/files/seguros/${type}/${filename}`, file);

        fileNames.push(filename);
      }
    })
  );
  return fileNames;
};

exports.validateFiles = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.apolice) {
    const files = await handlingFiles(req.files.apolice, 'apolice');
    req.body.apolice = files[0];
  }

  if (req.files.simulacao) {
    const files = await handlingFiles(req.files.simulacao, 'simulacao');
    req.body.simulacao = files[0];
  }

  if (req.files.comprovativos) {
    const files = await handlingFiles(req.files.comprovativos, 'comprovativos');
    req.body.comprovativos = files;
  }

  if (req.files.docIdentificacaos) {
    const files = await handlingFiles(
      req.files.docIdentificacaos,
      'docIdentificacaos'
    );
    req.body.docIdentificacaos = files;
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.extractFilds = (req, res, next) => {
  req.body = filterObj(req.body, ...filds);
  next();
};

exports.extractUpdateFilds = (req, res, next) => {
  req.body = filterObj(
    req.body,
    'apolice',
    'comprovativos',
    'docIdentificacaos',
    'simulacao'
  );
  next();
};

exports.getSeguro = catchAsync(async (req, res, next) => {
  const doc = await Seguro.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.createSeguro = factory.createOne(Seguro);
// exports.getSeguro = factory.getOne(Seguro);
exports.getAllSeguros = factory.getAll(Seguro);
exports.updateSeguro = factory.updateOne(Seguro);
exports.deleteSeguro = factory.deleteOne(Seguro);

// const isRequiredFields = (obj, ...reqFields) => {
//   const fildObj = Object.keys(obj);

//   reqFields.forEach(el => {
//     if (!fildObj.includes(el)) return false;
//   });
//   return true;
// };
