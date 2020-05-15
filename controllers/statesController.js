const State = require('../models/estadoModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.generateStatusCode = catchAsync(async (req, res, next) => {
  const estadoCode = await State.aggregate([
    {
      $group: { _id: null, max: { $max: '$estadoCode' } }
    }
  ]);
  req.body.estadoCode = 1 + estadoCode[0].max * 1;
  next();
});

exports.getState = factory.getOne(State);
exports.getAllStates = factory.getAll(State);
exports.createState = factory.createOne(State);
exports.updateState = factory.updateOne(State);
exports.deleteState = factory.deleteOne(State);
