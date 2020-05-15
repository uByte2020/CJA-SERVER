const Profile = require('../models/perfilModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const ErrorMessage = require('./../utils/error');

exports.validateModalidadeFild = (req, res, next) => {
  if (!req.params.id || !req.body.modalidades)
    return next(new AppError(ErrorMessage[12].message, 400));
  req.filter = { modalidades: req.body.modalidades };
  next();
};

exports.addModalidades = factory.addTo(Profile);

exports.removeModalidade = factory.removeFrom(Profile);

exports.generatePerfilCode = catchAsync(async (req, res, next) => {
  const perfilCode = await Profile.aggregate([
    {
      $group: { _id: null, max: { $max: '$perfilCode' } }
    }
  ]);
  req.body.perfilCode = 1 + perfilCode[0].max * 1;
  next();
});

exports.getProfile = factory.getOne(Profile);
exports.getAllProfiles = factory.getAll(Profile);
exports.createProfile = factory.createOne(Profile);
exports.updateProfile = factory.updateOne(Profile);
exports.deleteProfile = factory.deleteOne(Profile);
