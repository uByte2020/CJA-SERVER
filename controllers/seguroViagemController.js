const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const factory = require('./handlerFactory');
const SeguroViagem = require('../models/seguroViagemModel');
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

exports.uploadSeguroViagemDocs = upload.fields([
  { name: 'documentos', maxCount: 10 }
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

  if (req.files.documentos) {
    const files = await handlingFiles(
      req.files.documentos,
      'Viagem',
      'documentos'
    );
    req.body.documentos = files;
  }
  next();
});

exports.validateFilds = (req, res, next) => {
  if (!req.seguro)
    next(new AppError('Ocorreu um Erro durante o Registro do Seguro', 500));
  req.body.seguro = req.seguro._id;
  next();
};

exports.getPlanos = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      doc: SeguroViagem.getPlanos().planos
    }
  });
};

exports.simular = (req, res, next) => {
  if (!req.body.plano) return next();

  const plano = SeguroViagem.getPlanos()[req.body.plano];

  if (!plano) return next();

  const { pessoas, dataPartida, dataVolta } = req.body;
  const difference = Math.abs(
    new Date(dataPartida).getTime() - new Date(dataVolta).getTime()
  );
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
  let index;

  if (days >= 1 && days <= 8) {
    index = 0;
  } else if (days >= 9 && days <= 10) {
    index = 1;
  } else if (days >= 11 && days <= 15) {
    index = 2;
  } else if (days >= 16 && days <= 21) {
    index = 3;
  } else if (days >= 22 && days <= 30) {
    index = 4;
  } else if (days >= 31 && days <= 60) {
    index = 5;
  } else if (days >= 61 && days <= 90) {
    index = 6;
  } else {
    index = null;
  }

  if (!index) return next();

  const keys = Object.keys(plano);
  const precos = [];
  if (!keys)
    keys.forEach(key => {
      const preco = (plano[key][index] * pessoas).toFixed(2);
      precos.push({ key, preco });
    });
  else precos.push((plano[index] * pessoas).toFixed(2));

  res.status(200).json({
    status: 'success',
    data: {
      doc: precos
    }
  });
};

exports.getSeguroViagem = factory.getOne(SeguroViagem);
exports.getAllSeguroViagens = factory.getAll(SeguroViagem);
exports.createSeguroViagem = factory.createOne(SeguroViagem);
exports.updateSeguroViagem = factory.updateOne(SeguroViagem);
exports.deleteSeguroViagem = factory.deleteOne(SeguroViagem);
