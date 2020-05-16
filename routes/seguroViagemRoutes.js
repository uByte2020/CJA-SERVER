const express = require('express');
const seguroViagemController = require('../controllers/seguroViagemController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/simular').post(seguroViagemController.simular);

router.use(authController.protect);

router
  .route('/')
  .post(
    seguroViagemController.uploadSeguroViagemDocs,
    seguroViagemController.validateFilds,
    seguroViagemController.extractFilds,
    seguroViagemController.validateFiles,
    seguroViagemController.createSeguroViagem
  );

router
  .route('/:id')
  .patch(
    authController.restrictTo(0),
    seguroViagemController.extractFilds,
    seguroViagemController.uploadSeguroViagemDocs,
    seguroViagemController.validateFiles,
    seguroViagemController.updateSeguroViagem
  );

router.use(authController.restrictTo(0, 1));

router.route('/').get(seguroViagemController.getAllSeguroViagens);

router
  .route('/:id')
  .get(seguroViagemController.getSeguroViagem)
  .delete(seguroViagemController.deleteSeguroViagem);

module.exports = router;
