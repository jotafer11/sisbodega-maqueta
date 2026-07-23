const CLAVE_PROVEEDORES = "proveedores";
const proveedoresIniciales = [
    { id: 11, nombre: "Refax", telefono: "111111", Web: "refax.cl" },
    { id: 12, nombre: "Alsacia", telefono: "2222222", Web: "alsacia.cl" },
    { id: 13, nombre: "Caren", telefono: "444444", Web: "caren.cl" },
    { id: 14, nombre: "Rivecar", telefono: "555555", Web: "rivecar.cl" },
];

let proveedores = [];

function iniciarProveedores() {
    proveedores = obtenerProveedores();

    const botonAbrir = document.getElementById("btnAbrirProveedor");
    if (botonAbrir && !botonAbrir.dataset.listenerProveedor) {
        botonAbrir.addEventListener("click", abrirFormularioProveedor);
        botonAbrir.dataset.listenerProveedor = "1";
    }

    const formulario = document.getElementById("frmProveedor");
    if (formulario && !formulario.dataset.listenerProveedor) {
        formulario.addEventListener("submit", guardarProveedor);
        formulario.dataset.listenerProveedor = "1";
    }

    document.querySelectorAll("[data-close-modal='modalProveedor']").forEach((boton) => {
        if (!boton.dataset.listenerProveedor) {
            boton.addEventListener("click", () => cerrarModal("modalProveedor"));
            boton.dataset.listenerProveedor = "1";
        }
    });

    const modal = document.getElementById("modalProveedor");
    if (modal && !modal.dataset.listenerProveedor) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                cerrarModal("modalProveedor");
            }
        });
        modal.dataset.listenerProveedor = "1";
    }

    renderizarTablaProveedores();
}

function obtenerProveedores() {
    const guardados = localStorage.getItem(CLAVE_PROVEEDORES);
    if (!guardados) {
        localStorage.setItem(CLAVE_PROVEEDORES, JSON.stringify(proveedoresIniciales));
        return [...proveedoresIniciales];
    }

    try {
        const parseados = JSON.parse(guardados);
        if (!Array.isArray(parseados)) {
            throw new Error("Formato invalido");
        }
        return parseados;
    } catch (error) {
        localStorage.setItem(CLAVE_PROVEEDORES, JSON.stringify(proveedoresIniciales));
        return [...proveedoresIniciales];
    }
}

function guardarEnStorage() {
    localStorage.setItem(CLAVE_PROVEEDORES, JSON.stringify(proveedores));
}

function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove("d-none");
    }
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add("d-none");
    }
}

function limpiarFormularioProveedor() {
    const formulario = document.getElementById("frmProveedor");
    if (formulario) {
        formulario.reset();
    }

    const inputId = document.getElementById("proveedorId");
    const titulo = document.getElementById("proveedorTitulo");
    if (inputId) {
        inputId.value = "";
    }
    if (titulo) {
        titulo.textContent = "Nuevo proveedor";
    }
}

function abrirFormularioProveedor() {
    limpiarFormularioProveedor();
    abrirModal("modalProveedor");
    const inputNombre = document.getElementById("proveedorNombre");
    if (inputNombre) {
        inputNombre.focus();
    }
}

function normalizarWeb(web) {
    const valor = String(web || "").trim();
    if (!valor) {
        return "";
    }

    if (/^https?:\/\//i.test(valor)) {
        return valor;
    }

    return `https://${valor}`;
}

function renderizarTablaProveedores() {
    const tbody = document.querySelector("#tablaProveedores tbody");
    if (!tbody) {
        return;
    }

    if (!proveedores.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">Sin proveedores registrados.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = proveedores
        .map((proveedor) => {
            const webLimpia = String(proveedor.Web || proveedor.web || "").trim();
            const webHtml = webLimpia
                ? `<a href="${normalizarWeb(webLimpia)}" target="_blank" rel="noopener noreferrer">${webLimpia}</a>`
                : "";

            return `
                <tr>
                    <td>${proveedor.nombre || ""}</td>
                    <td>${proveedor.telefono || ""}</td>
                    <td>${webHtml}</td>
                    <td>
                        <button type="button" onclick="editarProveedor(${proveedor.id})">Editar</button>
                        <button type="button" onclick="eliminarProveedor(${proveedor.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        })
        .join("");
}

function guardarProveedor(event) {
    event.preventDefault();

    const inputId = document.getElementById("proveedorId");
    const inputNombre = document.getElementById("proveedorNombre");
    const inputTelefono = document.getElementById("proveedorTelefono");
    const inputWeb = document.getElementById("proveedorWeb");

    const nombre = inputNombre?.value.trim();
    const telefono = inputTelefono?.value.trim();
    const web = inputWeb?.value.trim();
    const id = Number(inputId?.value || 0);

    if (!nombre || !telefono || !web) {
        return;
    }

    if (id) {
        proveedores = proveedores.map((proveedor) => {
            if (proveedor.id !== id) {
                return proveedor;
            }

            return {
                ...proveedor,
                nombre,
                telefono,
                Web: web,
            };
        });
    } else {
        const nuevoId = proveedores.length
            ? Math.max(...proveedores.map((proveedor) => Number(proveedor.id) || 0)) + 1
            : 1;

        proveedores.push({
            id: nuevoId,
            nombre,
            telefono,
            Web: web,
        });
    }

    guardarEnStorage();
    renderizarTablaProveedores();
    cerrarModal("modalProveedor");
    limpiarFormularioProveedor();
}

function editarProveedor(idProveedor) {
    const proveedor = proveedores.find((item) => Number(item.id) === Number(idProveedor));
    if (!proveedor) {
        return;
    }

    const inputId = document.getElementById("proveedorId");
    const inputNombre = document.getElementById("proveedorNombre");
    const inputTelefono = document.getElementById("proveedorTelefono");
    const inputWeb = document.getElementById("proveedorWeb");
    const titulo = document.getElementById("proveedorTitulo");

    if (inputId) inputId.value = proveedor.id;
    if (inputNombre) inputNombre.value = proveedor.nombre || "";
    if (inputTelefono) inputTelefono.value = proveedor.telefono || "";
    if (inputWeb) inputWeb.value = proveedor.Web || proveedor.web || "";
    if (titulo) titulo.textContent = "Editar proveedor";

    abrirModal("modalProveedor");
    if (inputNombre) {
        inputNombre.focus();
    }
}

function eliminarProveedor(idProveedor) {
    const confirmacion = confirm("Deseas eliminar este proveedor?");
    if (!confirmacion) {
        return;
    }

    proveedores = proveedores.filter((proveedor) => Number(proveedor.id) !== Number(idProveedor));
    guardarEnStorage();
    renderizarTablaProveedores();
}

async function obtenerDatosGrupos() {
    try {
        const respuesta = await fetch('http://localhost:4000/grupos');
        const datos = await respuesta.json();
                
        const lista = document.getElementById('lista-datos');
        datos.forEach(item => {
            const li = document.createElement('li');
                li.textContent = `ID: ${item.id} - Nombre: ${item.nombre}`;
                lista.appendChild(li);
            });
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
}

obtenerDatosGrupos();
