const express = require('express');
const seguradoraController = require('./../controllers/seguradoraController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(seguradoraController.getAllSeguradoras)
  .post(
    authController.protect,
    authController.restrictTo(0),
    seguradoraController.createSeguradora
  );

router.route('/:id').get(seguradoraController.getSeguradora);

router.use(authController.protect, authController.restrictTo(0, 1));

router
  .route('/:id/modalidades')
  .patch(
    seguradoraController.validateModalidadeFild,
    seguradoraController.addModalidades
  )
  .delete(
    seguradoraController.validateModalidadeFild,
    seguradoraController.removeModalidade
  );

router
  .route('/:id/ibans')
  .patch(seguradoraController.validateIbanFild, seguradoraController.addIban)
  .delete(
    seguradoraController.validateIbanFild,
    seguradoraController.removeIban
  );

router.use(authController.restrictTo(0));

router
  .route('/:id')
  .patch(seguradoraController.updateSeguradora)
  .delete(seguradoraController.deleteSeguradora);

module.exports = router;
