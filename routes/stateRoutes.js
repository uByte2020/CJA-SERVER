const express = require('express');
const stateController = require('./../controllers/statesController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo(0, 1), stateController.getAllStates);

router.use(authController.protect, authController.restrictTo(0));

router
  .route('/')
  .post(stateController.generateStatusCode, stateController.createState);

router
  .route('/:id')
  .patch(stateController.updateState)
  .delete(stateController.deleteState);

module.exports = router;
