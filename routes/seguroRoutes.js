const express = require('express');
const seguroViagemRoutes = require('./seguroViagemRoutes');
const seguroController = require('../controllers/seguroController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use('/viagens', seguroViagemRoutes);

router.use(authController.protect);

router
  .route('/')
  .post(
    seguroController.validateFilds,
    seguroController.uploadSeguroDocs,
    seguroController.validateFiles,
    seguroController.createSeguro
  );

router
  .route('/:id')
  .patch(
    seguroController.extractFilds,
    seguroController.validateFilds,
    seguroController.uploadSeguroDocs,
    seguroController.validateFiles,
    seguroController.updateSeguro
  )
  .delete(seguroController.deleteSeguro);

router.use(authController.restrictTo(0, 1));

router.route('/').get(seguroController.getAllSeguros);

router.route('/:id').get(seguroController.getSeguro);

module.exports = router;
