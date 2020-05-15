const express = require('express');
const modalidadeController = require('./../controllers/modalidadeController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(modalidadeController.getAllModalidades);

router.use(authController.protect, authController.restrictTo(0, 1));
router.route('/:id').delete(modalidadeController.deleteModalidade);

module.exports = router;
