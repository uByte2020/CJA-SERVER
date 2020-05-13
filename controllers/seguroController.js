const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Seguro = require('./../models/seguroModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ErrorMessage = require('./../utils/error');

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
  { name: 'comprovativos', maxCount: 3 },
  { name: 'docIdentificacaos', maxCount: 10 }
]);

const handlingFiles = async (files, modalidade, type) => {
  const fileNames = [];
  let filename;

  await Promise.all(
    files.map(async (file, i) => {
      if (file.mimetype.startsWith('image')) {
        filename = `seguro-${modalidade}-${type}-${Date.now()}-${i}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/seguros/${modalidade}/${type}/${filename}`);

        fileNames.push(filename);
      } else if (file.mimetype === 'application/pdf') {
        filename = `seguro-${modalidade}-${type}-${Date.now()}-${i}.pdf`;

        fs.writeFileSync(
          `public/seguros/${modalidade}/${type}/${filename}`,
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

  if (req.files.apolice) {
    const files = await handlingFiles(
      req.files.apolice,
      req.body.modalidade,
      'apolice'
    );
    req.body.apolice = files;
  }

  if (req.files.comprovativos) {
    const files = await handlingFiles(
      req.files.comprovativos,
      req.body.modalidade,
      'comprovativos'
    );
    req.body.comprovativos = files;
  }

  if (req.files.docIdentificacaos) {
    const files = await handlingFiles(
      req.files.docIdentificacaos,
      req.body.modalidade,
      'docIdentificacaos'
    );
    req.body.docIdentificacaos = files;
  }

  next();
});

const isRequiredFields = (obj, ...reqFields) => {
  const fildObj = Object.keys(obj);

  reqFields.forEach(el => {
    if (!fildObj.includes(el)) return false;
  });
  return true;
};

exports.validateFilds = (req, res, next) => {
  if (!isRequiredFields(req.body, 'modalidade')) {
    return next(new AppError(ErrorMessage[15].message, 400));
  }
  next();
};

exports.createSeguro = catchAsync(async (req, res, next) => {
  const doc = await Seguro.create(req.body);
  this.createLogs(req.user.id, Seguro, null, doc, req.method);
  req.seguro = doc;
  next();
});

exports.getSeguro = factory.getOne(Seguro);
exports.getAllSeguros = factory.getAll(Seguro);
exports.updateSeguro = factory.updateOne(Seguro);
exports.deleteSeguro = factory.deleteOne(Seguro);
