const express = require('express');
const seguroController = require('../controllers/seguroController');
const seguroViagemRoutes = require('./seguroViagemRoutes');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use('/viagens', seguroViagemRoutes);

router.route('/').get(seguroController.getAllSeguros);

router.route('/:id').get(seguroController.getSeguro);

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
    seguroController.validateFilds,
    seguroController.uploadSeguroDocs,
    seguroController.updateSeguro
  )
  .delete(seguroController.deleteSeguro);

// router.use('/:servicoId/solicitacaos', solicitacaoRouter);
// router.use(authController.protect);
// router.use(authController.restrictTo(0, 1));

module.exports = router;
