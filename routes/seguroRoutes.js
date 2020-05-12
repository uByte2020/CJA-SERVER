const express = require('express');
const seguroController = require('../controllers/seguroController');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(seguroController.getAllSeguros);

router.route('/:id').get(seguroController.getSeguro);

router.route('/').post(
  seguroController.uploadSeguroDocs,
  seguroController.resizeSeguroImg
  // seguroController.validateFilds,
  // seguroController.createSeguro
);

router
  .route('/:id')
  .patch(
    seguroController.uploadSeguroDocs
    // seguroController.resizeSeguroPhoto,
    // seguroController.updateSeguro
  )
  .delete(seguroController.deleteSeguro);

// router.use('/:servicoId/solicitacaos', solicitacaoRouter);
// router.use(authController.protect);
// router.use(authController.restrictTo(0, 1));

module.exports = router;
