const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const factory = require('./handlerFactory');
const SeguroViagem = require('../models/seguroViagemModel');
const AppError = require('../utils/appError');
const SimulacaoViagem = require('../utils/seguroViagem/simulacaoViagem');
const SimulacaoViagemPlanos = require('../utils/seguroViagem/planos');
const catchAsync = require('../utils/catchAsync');
const ErrorMessage = require('./../utils/error');

const filds = [
  'plano',
  'pessoas',
  'dataPartida',
  'dataVolta',
  'documentos',
  'seguro'
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

exports.uploadSeguroViagemDocs = upload.fields([
  { name: 'documentos', maxCount: 10 }
]);

const handlingFiles = async (files, type) => {
  const fileNames = [];

  await Promise.all(
    files.map(async (file, i) => {
      if (file.mimetype.startsWith('image')) {
        const filename = `seguro-viagem-${type}-${Date.now()}-${i}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/files/seguros/viagem/${type}/${filename}`);

        fileNames.push(filename);
      } else if (file.mimetype === 'application/pdf') {
        const filename = `seguro-viagem-${type}-${Date.now()}-${i}.pdf`;

        fs.writeFileSync(
          `public/files/seguros/viagem/${type}/${filename}`,
          file
        );

        fileNames.push(filename);
      }
    })
  );
  return fileNames;
};

exports.validateFiles = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.documentos) {
    const files = await handlingFiles(req.files.documentos, 'documentos');
    req.body.documentos = files;
  }
  next();
});

exports.validateFilds = (req, res, next) => {
  if (!req.body.seguro)
    next(new AppError('Ocorreu um Erro durante o Registro do Seguro', 500));
  next();
};

exports.getPlanos = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      docs: SimulacaoViagemPlanos.getPlanos()
    }
  });
};

const isRequiredFields = (obj, ...reqFields) => {
  const fildObj = Object.keys(obj);

  reqFields.forEach(el => {
    if (!fildObj.includes(el)) return false;
  });
  return true;
};

exports.simular = (req, res, next) => {
  if (
    !isRequiredFields(
      req.body,
      'seguradora',
      'plano',
      'pessoas',
      'dataPartida',
      'dataVolta'
    )
  )
    return next(new AppError('Preencher os campos obrigatórios', 401));

  const simulacao = new SimulacaoViagem(
    req.body,
    req.body.seguradora
  ).simular();

  if (!simulacao.status)
    next(new AppError('Campos Preenchidos Incorrectamente', 500));

  res.status(200).json({
    status: 'success',
    data: {
      precos: simulacao.data
    }
  });
};

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

exports.updateSeguroViagem = factory.updateOne(SeguroViagem);
exports.getSeguroViagem = factory.getOne(SeguroViagem);
exports.getAllSeguroViagens = factory.getAll(SeguroViagem);
exports.createSeguroViagem = factory.createOne(SeguroViagem);
exports.deleteSeguroViagem = factory.deleteOne(SeguroViagem);
