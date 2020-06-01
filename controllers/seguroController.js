const multer = require('multer');
const Seguro = require('./../models/seguroModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ErrorMessage = require('./../utils/error');
// const APIFeatures = require('./../utils/apiFeatures');
// const sharp = require('sharp');

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

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `public/files/seguros/${file.fieldname}/`);
  },
  filename: function(req, file, cb) {
    let type = 'pdf';
    if (file.mimetype.startsWith('image')) type = 'jpeg';
    cb(null, `seguro-${file.fieldname}-${Date.now()}.${type}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf')
    cb(null, true);
  else cb(new AppError(ErrorMessage[14].message, 400), false);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});

exports.uploadSeguroDocs = upload.fields([
  { name: 'apolice', maxCount: 1 },
  { name: 'simulacao', maxCount: 1 },
  { name: 'comprovativos', maxCount: 3 },
  { name: 'docIdentificacaos', maxCount: 10 }
]);

exports.validateFiles = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.apolice) {
    req.body.apolice = req.files.apolice[0].filename;
  }

  if (req.files.simulacao) {
    req.body.simulacao = req.files.simulacao[0].filename;
  }

  if (req.files.comprovativos) {
    req.body.comprovativos = req.files.comprovativos.map(el => el.filename);
  }

  if (req.files.docIdentificacaos) {
    req.body.docIdentificacaos = req.files.docIdentificacaos.map(
      el => el.filename
    );
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
exports.getAllSeguros = factory.getAll(Seguro);
exports.updateSeguro = factory.updateOne(Seguro);
exports.deleteSeguro = factory.deleteOne(Seguro);
