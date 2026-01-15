const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./config/database');

// 🔹 Rutas existentes
const fisioRoutes = require('./routes/fisioRoutes');

// 🔹 NUEVO: Rutas IA
const iaRoutes = require('./routes/iaRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 CORS
const corsOptions = {
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

// 🔹 Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 🔹 SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '..')));

// 🔹 RUTA PRINCIPAL → LOGIN
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'Login', 'index.html')
    );
});

// 🔹 APIs EXISTENTES
app.use('/api/fisio', fisioRoutes);

// 🔹 API IA (GEMINI)
app.use('/api/ia', iaRoutes);

// 🔹 STATUS
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        apis: {
            fisioterapia: 'ready',
            inteligenciaArtificial: 'ready'
        }
    });
});

// 🔹 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.url
    });
});

// 🔹 ERROR GLOBAL
app.use((err, req, res, next) => {
    console.error('🔥 Error global:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// 🔹 MYSQL + SERVER
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL');
        connection.release();

        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📊 API Fisio: http://localhost:${PORT}/api/fisio`);
            console.log(`🧠 API IA:   http://localhost:${PORT}/api/ia`);
            console.log(`📈 Status:   http://localhost:${PORT}/api/status\n`);
        });
    })
    .catch(err => {
        console.error('❌ Error conectando a MySQL:', err.message);
        process.exit(1);
    });
