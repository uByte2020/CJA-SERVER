const multer = require('multer');
const sharp = require('sharp');
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

const resizeOne = async (image, type) => {
  if (image.mimetype.startsWith('image')) {
    const imageName = `seguro-${type}-${Date.now()}.jpeg`;

    await sharp(image.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/seguros/${type}/${imageName}`);
    return imageName;
  }
};

const resizeMany = async (images, type) => {
  const imageNames = [];

  await Promise.all(
    images.map(async (file, i) => {
      if (file.mimetype.startsWith('image')) {
        const filename = `seguro-${type}-${Date.now()}-${i}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/seguros/${type}/${filename}`);

        imageNames.push(filename);
      }
    })
  );
  return images;
};

exports.resizeSeguroImg = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.apolice) {
    resizeOne(req.files.apolice, 'apolice');
  }

  if (req.files.comprovativos) {
    resizeMany(req.files.comprovativos, 'comprovativos');
  }

  if (req.files.docIdentificacaos) {
    resizeOne(req.files.docIdentificacaos, 'docIdentificacaos');
  }

  next();
});

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};

//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });

//   return newObj;
// };

const isRequiredFields = (obj, ...reqFields) => {
  const fildObj = Object.keys(obj);

  reqFields.forEach(el => {
    if (!fildObj.includes(el)) return false;
  });
  return true;
};
//TODO: Redefinir os Campos
exports.validateFilds = (req, res, next) => {
  if (!isRequiredFields(req.body, 'tipo', 'modalidade', 'seguradora')) {
    return next(new AppError(ErrorMessage[15].message, 400));
  }
  next();
};

exports.getSeguro = factory.getOne(Seguro);
exports.getAllSeguros = factory.getAll(Seguro);
exports.createSeguro = factory.createOne(Seguro);
exports.updateSeguro = factory.updateOne(Seguro);
exports.deleteSeguro = factory.deleteOne(Seguro);
