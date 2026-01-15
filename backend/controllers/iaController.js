const consultarGemini = require('../services/geminiService');

exports.analizarFisio = async (req, res) => {
    const { ficha } = req.body;

    if (!ficha) {
        return res.json({
            respuesta: 'No se recibieron datos de la ficha.'
        });
    }

    const prompt = `
Eres un fisioterapeuta profesional.
Analiza la siguiente ficha clínica.

FICHA:
${JSON.stringify(ficha, null, 2)}

Devuelve:
1. Evaluación fisioterapéutica
2. Posible diagnóstico funcional (no definitivo)
3. Recomendaciones
`;

    try {
        const respuesta = await consultarGemini(prompt);
        res.json({ respuesta });
    } catch (error) {
        console.error(error);
        res.json({
            respuesta: 'Error al consultar la IA.'
        });
    }
};
