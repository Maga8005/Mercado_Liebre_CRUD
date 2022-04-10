// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const mainController = require('../controllers/mainController');

router.get('/', mainController.index); //trae y muestra la página index
router.get('/search', mainController.search); 

module.exports = router;
