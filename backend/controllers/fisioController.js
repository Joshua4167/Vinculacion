const FichaFisio = require('../models/FichaFisio');

exports.crearFicha = async (req, res) => {
    try {
        const datos = req.body;
        
        // Generar ID único
        datos.id_unico = `FIS-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        
        // Procesar campos JSON
        procesarCamposJSON(datos);
        
        const fichaId = await FichaFisio.crear(datos);
        
        res.status(201).json({
            success: true,
            message: 'Ficha guardada exitosamente',
            data: { id: fichaId, id_unico: datos.id_unico }
        });
    } catch (error) {
        console.error('Error al crear ficha:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la ficha',
            error: error.message
        });
    }
};

exports.obtenerFicha = async (req, res) => {
    try {
        const { id } = req.params;
        const ficha = await FichaFisio.obtenerPorId(id);
        
        if (!ficha) {
            return res.status(404).json({
                success: false,
                message: 'Ficha no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: ficha
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la ficha',
            error: error.message
        });
    }
};

exports.listarFichas = async (req, res) => {
    try {
        const { busqueda } = req.query;
        
        let fichas;
        if (busqueda) {
            fichas = await FichaFisio.buscar(busqueda);
        } else {
            fichas = await FichaFisio.obtenerTodas();
        }
        
        res.json({
            success: true,
            data: fichas,
            count: fichas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al listar fichas',
            error: error.message
        });
    }
};

exports.actualizarFicha = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        
        procesarCamposJSON(datos);
        
        const actualizado = await FichaFisio.actualizar(id, datos);
        
        if (actualizado === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ficha no encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Ficha actualizada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la ficha',
            error: error.message
        });
    }
};

exports.archivarFicha = async (req, res) => {
    try {
        const { id } = req.params;
        
        const archivado = await FichaFisio.eliminar(id);
        
        if (archivado === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ficha no encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Ficha archivada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al archivar la ficha',
            error: error.message
        });
    }
};

exports.estadisticas = async (req, res) => {
    try {
        const stats = await FichaFisio.obtenerEstadisticas();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// Función auxiliar para procesar campos JSON
function procesarCamposJSON(datos) {
    const camposJSON = [
        'evaluacion_postural',
        'tests_ortopedicos',
        'cif_puntajes',
        'seguimiento'
    ];
    
    camposJSON.forEach(campo => {
        if (datos[campo] && typeof datos[campo] !== 'string') {
            datos[campo] = JSON.stringify(datos[campo]);
        }
    });
}