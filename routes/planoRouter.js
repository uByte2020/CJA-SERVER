const express = require('express');
const planoController = require('./../controllers/planoController');

const router = express.Router();

router.route('/').get(planoController.getAllPlanos);
module.exports = router;
