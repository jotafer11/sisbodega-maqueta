function iniciarInicio(){
    listar_repuestos();

    const buscador = document.getElementById("busquedaRepuesto");

    if (buscador) {
        buscador.addEventListener("input", listar_repuestos);
    }

    const modalEditar = document.getElementById("frmEditarRepuesto");
    if (modalEditar) {
        modalEditar.addEventListener("submit", guardar_detalle_repuesto);
    }

    document.querySelectorAll("[data-close-modal]").forEach(boton => {
        boton.addEventListener("click", () => {
            cerrarModal(boton.getAttribute("data-close-modal"));
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                cerrarModal(modal.id);
            }
        });
    });
    
    if (!window.__inicioEscapeListenerBound) {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                cerrarModal("modalDetalleRepuesto");
                cerrarModal("modalEditarRepuesto");
            }
        });

        window.__inicioEscapeListenerBound = true;
    }

}

function obtenerRepuestos() {
    return JSON.parse(localStorage.getItem("repuestos")) || [];
}

function guardarRepuestos(repuestos) {
    localStorage.setItem("repuestos", JSON.stringify(repuestos));
}

function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function coincideBusqueda(repuesto, busqueda) {
    if (!busqueda) {
        return true;
    }

    const campos = Object.values(repuesto).join(" ");
    return normalizarTexto(campos).includes(busqueda);
}

function listar_repuestos() {
    const tbody = document.querySelector("#tablaRepuestos tbody");

    if (!tbody) {
        return;
    }

    const busqueda = normalizarTexto(
        document.getElementById("busquedaRepuesto")?.value
    );

    const registros = obtenerRepuestos()
        .map((repuesto, indice) => ({ repuesto, indice }))
        .filter(({ repuesto }) => coincideBusqueda(repuesto, busqueda));

    tbody.innerHTML = "";

    if (registros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">No se encontraron repuestos.</td>
            </tr>
        `;
        return;
    }

    registros.forEach(({ repuesto, indice }) => {
        tbody.innerHTML += `
            <tr>
                <td>${repuesto.numero_compra || ""}</td>
                <td>${repuesto.marca || ""}</td>
                <td>${repuesto.producto || ""}</td>
                <td>${repuesto.descripcion || ""}</td>                
                <td>${repuesto.precio_venta ?? ""}</td>
                <td>${repuesto.stock || ""}</td>
                <td>
                    <button type="button" onclick="ver_repuesto(${indice})">Ver</button>
                    <button type="button" onclick="editar_repuesto(${indice})">Editar</button>
                </td>
            </tr>
        `;
    });
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

function ver_repuesto(indice) {
    const repuestos = obtenerRepuestos();
    const repuesto = repuestos[indice];

    if (!repuesto) {
        return;
    }

    const contenido = document.getElementById("detalleRepuestoContenido");

    if (!contenido) {
        return;
    }

    contenido.innerHTML = `
        <div class="detalle-item">
            <strong>Origen</strong>
            <span class="detalle-texto">${repuesto.origen || ""}</span>
        </div>
        <div class="detalle-item">
            <strong>Anotaciones de pieza</strong>
            <span class="detalle-texto">${repuesto.anotaciones_repuesto || ""}</span>
        </div>
        <div class="detalle-item">
            <strong>Anotaciones de marca automovil</strong>
            <span class="detalle-texto">${repuesto.anotaciones_marca || ""}</span>
        </div>
    `;

    abrirModal("modalDetalleRepuesto");
}

function editar_repuesto(indice) {
    const repuestos = obtenerRepuestos();
    const repuesto = repuestos[indice];

    if (!repuesto) {
        return;
    }

    const inputIndice = document.getElementById("editarIndiceRepuesto");
    const origen = document.getElementById("editarOrigenRepuesto");
    const anotacionesRepuesto = document.getElementById("editarAnotacionesRepuesto");
    const anotacionesMarca = document.getElementById("editarAnotacionesMarca");

    if (inputIndice) {
        inputIndice.value = indice;
    }

    if (origen) {
        origen.value = repuesto.origen || "";
    }

    if (anotacionesRepuesto) {
        anotacionesRepuesto.value = repuesto.anotaciones_repuesto || "";
    }

    if (anotacionesMarca) {
        anotacionesMarca.value = repuesto.anotaciones_marca || "";
    }

    abrirModal("modalEditarRepuesto");
}

function guardar_detalle_repuesto(event) {
    event.preventDefault();

    const indice = Number(document.getElementById("editarIndiceRepuesto")?.value);
    const origen = document.getElementById("editarOrigenRepuesto")?.value || "";
    const anotacionesRepuesto = document.getElementById("editarAnotacionesRepuesto")?.value || "";
    const anotacionesMarca = document.getElementById("editarAnotacionesMarca")?.value || "";

    if (!Number.isInteger(indice) || indice < 0) {
        return;
    }

    const repuestos = obtenerRepuestos();
    const repuestoActual = repuestos[indice];

    if (!repuestoActual) {
        return;
    }

    repuestos[indice] = {
        ...repuestoActual,
        origen,
        anotaciones_repuesto: anotacionesRepuesto,
        anotaciones_marca: anotacionesMarca
    };

    guardarRepuestos(repuestos);
    cerrarModal("modalEditarRepuesto");
    listar_repuestos();
    mostrarSnackbar("Repuesto actualizado");
}

function mostrarSnackbar(mensaje) {
    const snackbar = document.getElementById("snackbar");

    if (!snackbar) {
        return;
    }

    snackbar.textContent = mensaje;
    snackbar.classList.add("show");

    setTimeout(() => {
        snackbar.classList.remove("show");
    }, 2500);
}
