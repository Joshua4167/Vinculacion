const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function consultarGemini(prompt) {
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest"
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = consultarGemini;
