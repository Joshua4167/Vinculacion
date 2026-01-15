const pool = require('../config/database');

class FichaFisio {
    // Crear nueva ficha
    static async crear(fichaData) {
        const query = `INSERT INTO fichas_fisio SET ?`;
        const [result] = await pool.query(query, fichaData);
        return result.insertId;
    }

    // Obtener ficha por ID
    static async obtenerPorId(id) {
        const query = `SELECT * FROM fichas_fisio WHERE id = ?`;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    }

    // Obtener todas las fichas
    static async obtenerTodas() {
        const query = `SELECT * FROM fichas_fisio ORDER BY fecha_creacion DESC`;
        const [rows] = await pool.query(query);
        return rows;
    }

    // Buscar por cédula o nombre
    static async buscar(busqueda) {
        const query = `
            SELECT * FROM fichas_fisio 
            WHERE cedula LIKE ? OR nombres LIKE ? OR apellidos LIKE ?
            ORDER BY fecha_creacion DESC
        `;
        const [rows] = await pool.query(query, 
            [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`]
        );
        return rows;
    }

    // Actualizar ficha
    static async actualizar(id, fichaData) {
        const query = `UPDATE fichas_fisio SET ? WHERE id = ?`;
        const [result] = await pool.query(query, [fichaData, id]);
        return result.affectedRows;
    }

    // Eliminar (archivar) ficha
    static async eliminar(id) {
        const query = `UPDATE fichas_fisio SET estado = 'archivado' WHERE id = ?`;
        const [result] = await pool.query(query, [id]);
        return result.affectedRows;
    }

    // Obtener estadísticas
    static async obtenerEstadisticas() {
        const query = `
            SELECT 
                COUNT(*) as total_fichas,
                SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completadas,
                SUM(CASE WHEN estado = 'borrador' THEN 1 ELSE 0 END) as borradores,
                COUNT(DISTINCT estudiante_id) as estudiantes_activos
            FROM fichas_fisio
        `;
        const [rows] = await pool.query(query);
        return rows[0];
    }
}

module.exports = FichaFisio;