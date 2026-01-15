const express = require('express');
const router = express.Router();
const fisioController = require('../controllers/fisioController');

// Rutas CRUD para fichas de fisioterapia
router.post('/fichas', fisioController.crearFicha);
router.get('/fichas', fisioController.listarFichas);
router.get('/fichas/:id', fisioController.obtenerFicha);
router.put('/fichas/:id', fisioController.actualizarFicha);
router.delete('/fichas/:id', fisioController.archivarFicha);

// Ruta para estadísticas
router.get('/estadisticas', fisioController.estadisticas);

// Ruta para buscar fichas
router.get('/buscar', fisioController.listarFichas);

module.exports = router;