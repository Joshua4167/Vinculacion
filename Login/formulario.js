const users = [
    { username: "nutri", password: "2222" },
    { username: "fisio", password: "3333" }
];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");
    const statusMessage = document.getElementById("status-message");
    const forgotLink = document.querySelector(".forgot-password");

    // Cargar usuario recordado
    const remembered = localStorage.getItem("rememberedUsername");
    if (remembered) {
        usernameInput.value = remembered;
        rememberMe.checked = true;
    }

    forgotLink.addEventListener("click", e => {
        e.preventDefault();
        alert("Función de recuperación pendiente (requiere backend).");
    });

    form.addEventListener("submit", e => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const user = users.find(
            u => u.username === username && u.password === password
        );

        if (user) {
            statusMessage.style.color = "lime";
            statusMessage.textContent = "✅ Acceso concedido...";

            rememberMe.checked
                ? localStorage.setItem("rememberedUsername", username)
                : localStorage.removeItem("rememberedUsername");

            sessionStorage.setItem("userName", username);

            setTimeout(() => {
                window.location.href =
                    username === "fisio"
                        ? "/Fisioterapia/FisioTerapia.html"
                        : "/Nutricion/Nutricion.html";
            }, 800);

        } else {
            statusMessage.style.color = "red";
            statusMessage.textContent = "❌ Usuario o contraseña incorrectos";
        }
    });
});
