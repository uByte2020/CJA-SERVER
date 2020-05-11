const Profile = require('../models/perfilModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const ErrorMessage = require('./../utils/error');

exports.addModalidades = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.body.modalidades)
    return next(new AppError(ErrorMessage[12].message, 400));

  const doc = await Profile.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { modalidades: req.body.modalidades } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.removeModalidades = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.body.modalidade)
    return next(new AppError(ErrorMessage[12].message, 400));

  const doc = await Profile.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { modalidades: req.body.modalidade } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getProfile = factory.getOne(Profile);
exports.getAllProfiles = factory.getAll(Profile);
exports.createProfile = factory.createOne(Profile);
exports.updateProfile = factory.updateOne(Profile);
exports.deleteProfile = factory.deleteOne(Profile);
