// Inicialización de la App
function initApp() {
    console.log("Aplicación iniciada");
    showModule("nutricion");

    // Simular ID de usuario
    document.getElementById("user-id-display").textContent =
        "ID Usuario: " + Math.floor(Math.random() * 9000 + 1000);
}


// Mostrar módulos
function showModule(moduleName) {
    // Ocultar todos los módulos
    document.querySelectorAll(".module").forEach(mod => mod.classList.add("hidden"));

    // Mostrar módulo seleccionado
    document.getElementById(`${moduleName}-module`).classList.remove("hidden");

    // Quitar active del menú
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    // Agregar active al menú correspondiente
    document.getElementById(`nav-${moduleName}`).classList.add("active");
}


// Calcular IMC
function calculateBMI() {
    let peso = parseFloat(document.getElementById("peso").value);
    let talla = parseFloat(document.getElementById("talla").value);

    if (!peso || !talla) {
        alert("Ingrese peso y talla válidos");
        return;
    }

    talla = talla / 100; // convertir de cm a metros

    let imc = peso / (talla * talla);
    document.getElementById("imc-result").textContent = imc.toFixed(2);

    // Percentil simulado
    let percentil = Math.floor(Math.random() * 100);
    document.getElementById("percentil-result").textContent = percentil + " %";

    // Clasificación
    let clasificacion = "";
    if (imc < 18.5) clasificacion = "Bajo Peso";
    else if (imc < 25) clasificacion = "Normal";
    else if (imc < 30) clasificacion = "Sobrepeso";
    else clasificacion = "Obesidad";

    document.getElementById("clasificacion-result").textContent = clasificacion;
}
