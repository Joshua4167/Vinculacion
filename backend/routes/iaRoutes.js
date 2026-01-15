const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController');

router.post('/analizar-fisio', iaController.analizarFisio);

module.exports = router;
