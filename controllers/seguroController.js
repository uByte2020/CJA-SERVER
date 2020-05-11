const multer = require('multer');
const sharp = require('sharp');
const Seguro = require('./../models/seguroModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ErrorMessage = require('./../utils/error');

const multerStorage = multer.memoryStorage();
//TODO: Metodos Para Upload de Files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError(ErrorMessage[14].message, 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadSeguroPhoto = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

exports.resizeSeguroPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.coverImage) {
    req.body.coverImage = `seguro-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/seguros/${req.body.coverImage}`);
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `seguro-${req.params.id}-${Date.now()}-${i}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/seguros/${filename}`);

        req.body.images.push(filename);
      })
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

const isRequiredFields = (obj, ...reqFields) => {
  const fildObj = Object.keys(obj);

  reqFields.forEach(el => {
    if (!fildObj.includes(el)) return false;
  });
  return true;
};
//TODO: Redefinir os Campos
exports.validateFilds = (req, res, next) => {
  if (
    !isRequiredFields(
      req.body,
      'nome',
      'endereco',
      'pacote',
      'fornecedor',
      'coverImage',
      'categoria'
    )
  ) {
    return next(new AppError(ErrorMessage[15].message, 400));
  }

  const fieldsBody = Object.keys(req.body);

  if (fieldsBody.includes('features')) {
    const { features } = req.body;
    const newFeatures = [];

    features.forEach(fe => {
      if (isRequiredFields(fe, 'feature', 'price'))
        newFeatures.push(filterObj(fe, 'feature', 'price'));
    });

    req.body.price =
      req.body.price || newFeatures.reduce((total, current) => total + current);
    req.body.features = newFeatures;

    return next();
  }

  if (!fieldsBody.includes('price'))
    return next(new AppError(ErrorMessage[15].message, 400));

  next();
};

exports.getSeguro = factory.getOne(Seguro);
exports.getAllSeguros = factory.getAll(Seguro);
exports.createSeguro = factory.createOne(Seguro);
exports.updateSeguro = factory.updateOne(Seguro);
exports.deleteSeguro = factory.deleteOne(Seguro);
