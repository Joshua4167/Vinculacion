// Base de usuarios simulada
const users = [
    { username: "admin", password: "1234", role: "admin" },
    { username: "nutri", password: "2222", role: "nutricionista" },
    { username: "fisio", password: "3333", role: "fisioterapeuta" }
];

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let role = document.getElementById("role").value;

    const statusMessage = document.getElementById("status-message");

    // Buscar usuario válido
    const userFound = users.find(
        user => user.username === username &&
                user.password === password &&
                user.role === role
    );

    if (userFound) {
        statusMessage.style.color = "green";
        statusMessage.textContent = `✔ Bienvenido ${username} (${role})`;

        // Aquí puedes redirigir según el rol:
        // if (role === "admin") window.location.href = "admin.html";
    } else {
        statusMessage.style.color = "red";
        statusMessage.textContent = "❌ Usuario, contraseña o rol incorrecto";
    }
});
