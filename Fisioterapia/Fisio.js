/************************************************************
 * FISIO.JS - CONEXIÓN CON BACKEND NODE.JS + MYSQL
 ************************************************************/

const API_URL = 'http://localhost:3000/api/fisio';

let fichaActualId = null;

/* ===================== FUNCIONES DE API ===================== */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error en API request:', error);
        throw error;
    }
}

/* ===================== FORMULARIO ===================== */
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("ficha");
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            await guardarFicha();
        });
    }
    
    const printBtn = document.getElementById("printButton");
    if (printBtn) {
        printBtn.addEventListener("click", imprimirFicha);
    }
    
    verificarConexionBackend();
});

/* ===================== RECOLECTAR DATOS CON MAPEO ===================== */
function recolectarDatosFormulario() {
    console.log("=== INICIANDO RECOLECCIÓN DE DATOS ===");
    const form = document.getElementById("ficha");
    const datosCrudos = {};
    
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach(el => {
        if (!el.name) return;
        
        if (el.type === "checkbox") {
            if (!datosCrudos[el.name]) datosCrudos[el.name] = [];
            if (el.checked) {
                datosCrudos[el.name].push(el.value || "true");
            }
        } 
        else if (el.type === "radio") {
            if (el.checked) datosCrudos[el.name] = el.value;
        } 
        else {
            datosCrudos[el.name] = el.value || '';
        }
    });
    
    console.log("Datos crudos del formulario:", datosCrudos);
    
    const puntosDolorosos = document.getElementById("puntosDolorosos");
    const tejidosBlandos = document.getElementById("tejidosBlandos");
    const estructurasOseas = document.getElementById("estructurasOseas");
    const diagnosticoTexto = document.getElementById("diagnostico-texto");
    
    if (puntosDolorosos) datosCrudos.puntos_dolorosos = puntosDolorosos.value || '';
    if (tejidosBlandos) datosCrudos.tejidos_blandos = tejidosBlandos.value || '';
    if (estructurasOseas) datosCrudos.estructuras_oseas = estructurasOseas.value || '';
    if (diagnosticoTexto) datosCrudos.diagnostico = diagnosticoTexto.value || '';
    
    const datosMapeados = {
        apellidos: datosCrudos.apellidos || '',
        nombres: datosCrudos.nombres || '',
        cedula: datosCrudos.cedula || '',
        fecha_nacimiento: datosCrudos.fnac || '',
        edad_anios: datosCrudos.edad_anios || 0,
        edad_meses: datosCrudos.edad_meses || 0,
        sexo: datosCrudos.sexo || '',
        institucion_educativa: datosCrudos.institucion || '',
        grado: datosCrudos.grado || '',
        telefono: datosCrudos.telefono || '',
        direccion: datosCrudos.direccion || '',
        tutor_nombre: datosCrudos.tutor_nombre || '',
        tutor_parentesco: datosCrudos.tutor_parentesco || '',
        tutor_cedula: datosCrudos.tutor_cedula || '',
        tutor_telefono: datosCrudos.tutor_telefono || '',
        
        antecedentes_personales: datosCrudos.ant_otro || '',
        medicacion_actual: datosCrudos.medicacion || '',
        alergias: datosCrudos.alergias || '',
        tipo_vivienda: datosCrudos.tipo_vivienda || '',
        
        servicios_basicos: [
            datosCrudos.srv_agua && datosCrudos.srv_agua.length > 0 ? 'Agua' : null,
            datosCrudos.srv_luz && datosCrudos.srv_luz.length > 0 ? 'Luz' : null,
            datosCrudos.srv_alc && datosCrudos.srv_alc.length > 0 ? 'Alcantarillado' : null,
            datosCrudos.srv_int && datosCrudos.srv_int.length > 0 ? 'Internet' : null
        ].filter(Boolean).join(', '),
        
        actividad_fisica: datosCrudos.act_fisica || '',
        deporte: datosCrudos.deporte || '',
        horas_pantalla: datosCrudos.pantalla || '',
        horas_sueño: datosCrudos.sueño || '',
        alimentacion: datosCrudos.alimentacion || '',
        postura_estudio: datosCrudos.postura_estudio || '',
        seguro_salud: datosCrudos.seguro || '',
        acceso_centro_salud: datosCrudos.acceso || '',
        
        motivo_consulta: datosCrudos.motivo || '',
        dolor_presente: datosCrudos.dolor_presente || '',
        dolor_localizacion: datosCrudos.dolor_local || '',
        dolor_agravantes: datosCrudos.dolor_agre || '',
        eva_valor: datosCrudos.eva_valor || 0,
        peso: datosCrudos.peso || 0,
        talla: datosCrudos.talla || 0,
        imc: datosCrudos.imc || 0,
        perimetro_abdominal: datosCrudos.pcint || 0,
        frecuencia_cardiaca: datosCrudos.fc || 0,
        frecuencia_respiratoria: datosCrudos.fr || 0,
        pie_derecho: datosCrudos.pie_der || '',
        pie_izquierdo: datosCrudos.pie_izq || '',
        
        puntos_dolorosos: datosCrudos.puntos_dolorosos || '',
        tejidos_blandos: datosCrudos.tejidos_blandos || '',
        estructuras_oseas: datosCrudos.estructuras_oseas || '',
        
        rangos_movimiento: JSON.stringify({
            hombro: datosCrudos.rom_hombro || '',
            codo: datosCrudos.rom_codo || '',
            muneca: datosCrudos.rom_muneca || '',
            cadera: datosCrudos.rom_cadera || '',
            rodilla: datosCrudos.rom_rodilla || '',
            tobillo: datosCrudos.rom_tobillo || ''
        }),
        
        fuerza_muscular: JSON.stringify({
            ms_der: datosCrudos.f_ms_der || 0,
            ms_izq: datosCrudos.f_ms_izq || 0,
            fm_der: datosCrudos.f_fm_der || 0,
            fm_izq: datosCrudos.f_fm_izq || 0,
            mi_der: datosCrudos.f_mi_der || 0,
            mi_izq: datosCrudos.f_mi_izq || 0,
            to_der: datosCrudos.f_to_der || 0,
            to_izq: datosCrudos.f_to_izq || 0
        }),
        
        equilibrio_coordinacion: JSON.stringify({
            estatico: datosCrudos.eq_estatico || '',
            dinamico: datosCrudos.eq_dinamico || '',
            ojo_mano: datosCrudos.coord_om || '',
            motora_gruesa: datosCrudos.coord_mg || ''
        }),
        
        cif_puntajes: JSON.stringify({
            b280: datosCrudos.cif_b280 || 0,
            b710: datosCrudos.cif_b710 || 0,
            b730: datosCrudos.cif_b730 || 0,
            d410: datosCrudos.cif_d410 || 0,
            d450: datosCrudos.cif_d450 || 0,
            d540: datosCrudos.cif_d540 || 0,
            e310: datosCrudos.cif_e310 || 0
        }),
        
        impresion_diagnostica: datosCrudos.impresion || '',
        objetivo_corto_plazo: datosCrudos.obj_corto || '',
        objetivo_medio_plazo: datosCrudos.obj_medio || '',
        frecuencia_sesiones: datosCrudos.freq || '',
        duracion_tratamiento: datosCrudos.duracion || '',
        recomendaciones: datosCrudos.recomendaciones || '',
        
        evaluador_nombre: datosCrudos.eval_nombre || '',
        evaluador_carrera: datosCrudos.eval_carrera || '',
        evaluador_nivel: datosCrudos.eval_nivel || '',
        evaluador_docente: datosCrudos.eval_docente || '',
        
        diagnostico_soap: datosCrudos.diagnostico || '',
        
        tests_ortopedicos: JSON.stringify(obtenerTestsOrtopedicos())
    };
    
    datosMapeados.id_unico = 'FIS-' + Date.now();
    datosMapeados.estado = 'borrador';
    datosMapeados.fecha_creacion = new Date().toISOString().split('T')[0];
    datosMapeados.fecha_actualizacion = new Date().toISOString().split('T')[0];
    
    console.log("=== DATOS MAPEADOS PARA MySQL ===");
    console.log(datosMapeados);
    console.log("=== FIN DATOS MAPEADOS ===");
    
    return datosMapeados;
}

function obtenerTestsOrtopedicos() {
    const tests = [];
    const tabla = document.getElementById("tabla-body");
    
    if (!tabla) return tests;
    
    const filas = tabla.querySelectorAll("tr");
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length >= 5) {
            tests.push({
                test: celdas[0].textContent || '',
                articulacion: celdas[1].textContent || '',
                rango: celdas[2].textContent || '',
                resultado: celdas[3].textContent || '',
                observaciones: celdas[4].textContent || ''
            });
        }
    });
    
    return tests;
}

/* ===================== FUNCIONES PRINCIPALES ===================== */

async function guardarFicha() {
    try {
        const ficha = recolectarDatosFormulario();
        
        if (!ficha.apellidos || !ficha.nombres) {
            alert("Por favor complete al menos Apellidos y Nombres");
            return;
        }
        
        ficha.estado = 'completado';
        
        console.log("Enviando datos al backend:", ficha);
        
        const response = await apiRequest('/fichas', 'POST', ficha);
        
        fichaActualId = response.data.id;
        
        alert("✅ Ficha guardada en la base de datos");
        console.log("Ficha guardada en MySQL:", response.data);
        
        return response.data;
        
    } catch (error) {
        console.error("Error al guardar ficha:", error);
        alert("❌ Error al guardar la ficha: " + error.message);
        
        const fichaData = recolectarDatosFormulario();
        guardarEnLocalStorage(fichaData);
    }
}

async function cargarFicha(id) {
    try {
        const response = await apiRequest(`/fichas/${id}`);
        poblarFormulario(response.data);
        fichaActualId = id;
        alert(`✅ Ficha cargada: ${response.data.nombres} ${response.data.apellidos}`);
        return response.data;
    } catch (error) {
        console.error('Error al cargar ficha:', error);
        alert('Error al cargar la ficha: ' + error.message);
        return null;
    }
}

async function buscarFichas(termino) {
    try {
        const response = await apiRequest(`/fichas?busqueda=${encodeURIComponent(termino)}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar fichas:', error);
        return [];
    }
}

async function actualizarFicha() {
    if (!fichaActualId) {
        alert('No hay ficha cargada para actualizar');
        return;
    }
    
    try {
        const ficha = recolectarDatosFormulario();
        const response = await apiRequest(`/fichas/${fichaActualId}`, 'PUT', ficha);
        
        alert('✅ Ficha actualizada en la base de datos');
        return response.data;
    } catch (error) {
        console.error('Error al actualizar ficha:', error);
        alert('Error al actualizar: ' + error.message);
    }
}

async function archivarFicha() {
    if (!fichaActualId) {
        alert('No hay ficha cargada');
        return;
    }
    
    if (confirm('¿Está seguro de archivar esta ficha?')) {
        try {
            await apiRequest(`/fichas/${fichaActualId}`, 'DELETE');
            alert('✅ Ficha archivada');
            fichaActualId = null;
            limpiarFormulario();
        } catch (error) {
            console.error('Error al archivar:', error);
            alert('Error al archivar: ' + error.message);
        }
    }
}

function poblarFormulario(datos) {
    const form = document.getElementById("ficha");
    
    Object.keys(datos).forEach(key => {
        const elemento = form.querySelector(`[name="${key}"]`);
        if (elemento) {
            if (elemento.type === 'checkbox') {
                try {
                    const valores = JSON.parse(datos[key]);
                    if (Array.isArray(valores)) {
                        valores.forEach(valor => {
                            const checkbox = form.querySelector(`[name="${key}"][value="${valor}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }
                } catch (e) {
                    if (typeof datos[key] === 'string') {
                        const valores = datos[key].split(',').map(v => v.trim());
                        valores.forEach(valor => {
                            const checkbox = form.querySelector(`[name="${key}"][value="${valor}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }
                }
            } else if (elemento.type === 'radio') {
                const radio = form.querySelector(`[name="${key}"][value="${datos[key]}"]`);
                if (radio) radio.checked = true;
            } else {
                elemento.value = datos[key] || '';
            }
        }
    });
    
    const puntosDolorosos = document.getElementById("puntosDolorosos");
    const tejidosBlandos = document.getElementById("tejidosBlandos");
    const estructurasOseas = document.getElementById("estructurasOseas");
    const diagnosticoTexto = document.getElementById("diagnostico-texto");
    
    if (puntosDolorosos && datos.puntos_dolorosos) puntosDolorosos.value = datos.puntos_dolorosos;
    if (tejidosBlandos && datos.tejidos_blandos) tejidosBlandos.value = datos.tejidos_blandos;
    if (estructurasOseas && datos.estructuras_oseas) estructurasOseas.value = datos.estructuras_oseas;
    if (diagnosticoTexto && datos.diagnostico_soap) diagnosticoTexto.value = datos.diagnostico_soap;
}

function limpiarFormulario() {
    if (confirm('¿Limpiar formulario? Se perderán los datos no guardados.')) {
        document.getElementById("ficha").reset();
        const tabla = document.getElementById("tabla-body");
        if (tabla) tabla.innerHTML = '';
        
        const puntosDolorosos = document.getElementById("puntosDolorosos");
        const tejidosBlandos = document.getElementById("tejidosBlandos");
        const estructurasOseas = document.getElementById("estructurasOseas");
        const diagnosticoTexto = document.getElementById("diagnostico-texto");
        
        if (puntosDolorosos) puntosDolorosos.value = '';
        if (tejidosBlandos) tejidosBlandos.value = '';
        if (estructurasOseas) estructurasOseas.value = '';
        if (diagnosticoTexto) diagnosticoTexto.value = '';
        
        fichaActualId = null;
    }
}

/* ===================== FUNCIONES AUXILIARES ===================== */

async function verificarConexionBackend() {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            console.log('✅ Backend conectado correctamente');
            const alerta = document.getElementById("alerta-widget");
            if (alerta) {
                alerta.className = "alert-box alert-NORMAL";
                alerta.innerHTML = "🟢 Conectado a la base de datos - Listo para guardar";
            }
        }
    } catch (error) {
        console.warn('⚠️ Backend no disponible');
        const alerta = document.getElementById("alerta-widget");
        if (alerta) {
            alerta.className = "alert-box alert-WARNING";
            alerta.innerHTML = "⚠️ Modo offline - Los datos se guardarán localmente";
        }
    }
}

function imprimirFicha() {
    window.print();
}

function cerrarSesion() {
    if (confirm("¿Desea cerrar sesión?")) {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "../Login/index.html";
    }
}

function agregarRegistro() {
    const tabla = document.getElementById("tabla-body");

    const test = document.getElementById("test").value;
    const articulacion = document.getElementById("articulacion").value;
    const rango = document.getElementById("rango").value;
    const resultado = document.getElementById("resultado").value;
    const obs = document.getElementById("observaciones").value;

    if (!test || !articulacion) {
        alert("Complete los campos obligatorios");
        return;
    }

    const fila = `
    <tr>
      <td>${test}</td>
      <td>${articulacion}</td>
      <td>${rango}</td>
      <td>${resultado}</td>
      <td>${obs}</td>
    </tr>
  `;

    tabla.innerHTML += fila;

    document.getElementById("test").value = "";
    document.getElementById("articulacion").value = "";
    document.getElementById("rango").value = "";
    document.getElementById("resultado").value = "";
    document.getElementById("observaciones").value = "";
}

function guardarEnLocalStorage(ficha) {
    try {
        const STORAGE_KEY = "fichas_fisioterapia_backup";
        ficha.id = "FISIO-" + Date.now();
        ficha.backup = true;

        const fichas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        fichas.push(ficha);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));

        console.log("Ficha guardada en localStorage como backup:", ficha);
        alert("⚠️ Ficha guardada localmente (modo offline)");
        
    } catch (error) {
        console.error("Error en backup localStorage:", error);
        alert("❌ Error al guardar la ficha");
    }
}

/* ===================== BOTONES DE GESTIÓN ===================== */
function agregarBotonesGestion() {
    const seccionAcciones = document.querySelector('.seccion-acciones');
    if (seccionAcciones) {
        if (!document.querySelector('.btn-nuevo')) {
            seccionAcciones.innerHTML += `
                <button type="button" onclick="nuevaFicha()" class="btn-accion btn-nuevo">
                    📄 Nueva Ficha
                </button>
                <button type="button" onclick="buscarFicha()" class="btn-accion btn-buscar">
                    🔍 Buscar Ficha
                </button>
            `;
        }
    }
}

function nuevaFicha() {
    limpiarFormulario();
}

async function buscarFicha() {
    const termino = prompt('Ingrese cédula, nombre o apellido para buscar:');
    if (termino) {
        try {
            const fichas = await buscarFichas(termino);
            if (fichas.length > 0) {
                let lista = 'Fichas encontradas:\n\n';
                fichas.forEach((ficha, index) => {
                    lista += `${index + 1}. ${ficha.nombres || ''} ${ficha.apellidos || ''} (${ficha.cedula || 'Sin cédula'})\n`;
                });
                
                const seleccion = prompt(lista + '\nIngrese el número de la ficha a cargar:');
                const indice = parseInt(seleccion) - 1;
                
                if (!isNaN(indice) && indice >= 0 && indice < fichas.length) {
                    await cargarFicha(fichas[indice].id);
                } else {
                    alert('Selección inválida');
                }
            } else {
                alert('No se encontraron fichas');
            }
        } catch (error) {
            console.error('Error al buscar:', error);
            alert('Error al buscar fichas: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    agregarBotonesGestion();
    
    const btnGuardarPalpacion = document.querySelector('.ficha button[onclick="guardar()"]');
    const btnCargarPalpacion = document.querySelector('.ficha button[onclick="cargar()"]');
    const btnLimpiarPalpacion = document.querySelector('.ficha button[onclick="limpiar()"]');
    
    if (btnGuardarPalpacion) {
        btnGuardarPalpacion.onclick = guardarFicha;
    }
    if (btnCargarPalpacion) {
        btnCargarPalpacion.onclick = buscarFicha;
    }
    if (btnLimpiarPalpacion) {
        btnLimpiarPalpacion.onclick = limpiarFormulario;
    }
});

/* ===================== ALIAS PARA COMPATIBILIDAD ===================== */
function guardar() {
    guardarFicha();
}

function cargar() {
    buscarFicha();
}

function limpiar() {
    limpiarFormulario();
}

/* ================================
   ANALIZAR FICHA CON IA (GEMINI)
================================ */

async function analizarConIA() {
    const form = document.getElementById('ficha');

    if (!form) {
        alert('❌ No se encontró el formulario de fisioterapia');
        return;
    }

    // 🔹 Obtener datos del formulario
    const formData = new FormData(form);
    const ficha = {};

    // 🔹 Procesar campos normales y arrays (checkbox[])
    for (let [key, value] of formData.entries()) {
        if (key.endsWith('[]')) {
            const cleanKey = key.replace('[]', '');
            if (!ficha[cleanKey]) ficha[cleanKey] = [];
            ficha[cleanKey].push(value);
        } else {
            ficha[key] = value;
        }
    }

    // 🔹 Validación mínima
    if (!ficha.nombres && !ficha.apellidos) {
        alert('⚠️ Ingresa al menos el nombre del paciente');
        return;
    }

    mostrarRespuestaIA('🧠 Analizando ficha clínica con IA...\nPor favor espera.');

    try {
        const response = await fetch('http://localhost:3000/api/ia/analizar-fisio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ficha })
        });

        const data = await response.json();

        if (!data || !data.respuesta) {
            mostrarRespuestaIA('⚠️ La IA no devolvió respuesta.');
            return;
        }

        mostrarRespuestaIA(data.respuesta);

    } catch (error) {
        console.error('Error IA:', error);
        mostrarRespuestaIA('❌ Error conectando con el servidor de IA.');
    }
}

/* ================================
   MOSTRAR RESPUESTA IA
================================ */

function mostrarRespuestaIA(texto) {
    const contenedor = document.getElementById('respuestaIA');
    const contenido = document.getElementById('respuestaIAContenido');

    if (!contenedor || !contenido) {
        alert('No existe el contenedor para la respuesta IA');
        return;
    }

    contenido.innerText = texto;
    contenedor.style.display = 'block';

    // 🔹 Scroll automático hacia la respuesta
    contenedor.scrollIntoView({ behavior: 'smooth' });
}

/* ================================
   (OPCIONAL) LIMPIAR RESPUESTA IA
================================ */

function limpiarRespuestaIA() {
    const contenedor = document.getElementById('respuestaIA');
    if (contenedor) {
        contenedor.innerText = '';
        contenedor.style.display = 'none';
    }
}

