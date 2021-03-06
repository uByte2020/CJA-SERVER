const express = require('express');
const solicitacaoController = require('./../controllers/solicitacaoController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(
    solicitacaoController.validateData,
    solicitacaoController.createSolicitacao
  );

router
  .route('/mySolicitacoes')
  .get(
    solicitacaoController.getMySolicitations,
    solicitacaoController.getAllSolicitacao
  );

router
  .route('/mySolicitacoes/:id')
  .delete(
    solicitacaoController.getMySolicitations,
    solicitacaoController.desactiveMySolicitations,
    solicitacaoController.updateSolicitacao
  );

router.route('/:id').get(solicitacaoController.getSolicitacao);

router
  .route('/cancelar/:id')
  // .get(solicitacaoController.getSolicitacao)
  .patch(
    solicitacaoController.extractFilds,
    solicitacaoController.getEstadoById,
    solicitacaoController.updateSolicitacao
  );

router.use(authController.restrictTo(0, 1));

router
  .route('/')
  .get(
    solicitacaoController.getUserSolicitations,
    solicitacaoController.getAllSolicitacao
  );

router
  .route('/:id')
  // .get(solicitacaoController.getSolicitacao)
  .patch(
    solicitacaoController.extractFilds,
    solicitacaoController.getEstadoById,
    solicitacaoController.updateSolicitacao
  )
  .delete(solicitacaoController.deleteSolicitacao);

module.exports = router;
