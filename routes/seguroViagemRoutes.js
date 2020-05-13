const express = require('express');
const seguroViagemController = require('../controllers/seguroViagemController');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(seguroViagemController.getAllSeguroViagens);

router.route('/:id').get(seguroViagemController.getSeguroViagem);

router
  .route('/')
  .post(
    seguroViagemController.validateFilds,
    seguroViagemController.uploadSeguroViagemDocs,
    seguroViagemController.validateFiles,
    seguroViagemController.createSeguroViagem
  );

router
  .route('/:id')
  .patch(
    seguroViagemController.validateFilds,
    seguroViagemController.uploadSeguroViagemDocs,
    seguroViagemController.updateSeguroViagem
  )
  .delete(seguroViagemController.deleteSeguroViagem);

// router.use('/:servicoId/solicitacaos', solicitacaoRouter);
// router.use(authController.protect);
// router.use(authController.restrictTo(0, 1));

module.exports = router;
