function iniciarIngresos(){
    listar_compras();

    const formulario = document.getElementById("frmIngreso");
    if (formulario) {
        formulario.addEventListener("submit", guardar_compra);
    }

    mostrarSiguienteNumeroCompra();
}




function obtenerCompras() {
    return JSON.parse(localStorage.getItem("compras")) || [];
}

function guardarCompras(compras) {
    localStorage.setItem("compras", JSON.stringify(compras));
}

function obtenerRepuestos() {
    return JSON.parse(localStorage.getItem("repuestos")) || [];
}

function guardarRepuestos(repuestos) {
    localStorage.setItem("repuestos", JSON.stringify(repuestos));
}

function obtenerSiguienteNumeroCompra() {
    const compras = obtenerCompras();

    if (compras.length === 0) {
        return 1;
    }

    const maximo = compras.reduce((acumulado, compra) => {
        const numero = Number(compra.numero_compra) || 0;
        return Math.max(acumulado, numero);
    }, 0);

    return maximo + 1;
}

function mostrarSiguienteNumeroCompra() {
    const codigo = document.getElementById("codigo");

    if (!codigo) {
        return;
    }

    codigo.value = obtenerSiguienteNumeroCompra();
}



function guardar_compra(event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo");
    const producto = document.getElementById("producto");    
    const descripcion = document.getElementById("descripcion");
    const stock = document.getElementById("stock");
    const proveedor = document.getElementById("proveedor");
    const precioVenta = document.getElementById("precio_venta");

    const numeroCompra = Number(codigo.value) || obtenerSiguienteNumeroCompra();

    const compra = {
        numero_compra: numeroCompra,
        producto: producto.value,        
        descripcion: descripcion.value.trim(),
        stock: stock.value,
        proveedor: proveedor.value,
        precio_venta: precioVenta.value
    };

    const compras = obtenerCompras();
    compras.push(compra);
    guardarCompras(compras);

    mostrarSnackbar("Compra guardada");
    listar_compras();

    document.getElementById("frmIngreso")?.reset();
    mostrarSiguienteNumeroCompra();
    stock.value = "1";
    descripcion.value = "";
}




function listar_compras() {
    const tbody = document.querySelector("#tablaCompras tbody");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    const compras = obtenerCompras();

    compras.forEach((compra) => {
        tbody.innerHTML += `
            <tr>
                <td>${compra.numero_compra}</td>
                <td>${compra.producto}</td>                
                <td>${compra.descripcion}</td>
                <td>${compra.stock}</td>
                <td>${compra.proveedor}</td>
                <td>${compra.precio_venta}</td>
                <td>
                    <button onclick="normalizarPedido(${compra.numero_compra})">
                        Normalizar pedido
                    </button>
                </td>
            </tr>
        `;
    });
}

function normalizarPedido(numeroCompra) {
    const compras = obtenerCompras();
    const compra = compras.find(item => {
        return String(item.numero_compra) === String(numeroCompra);
    });

    if (!compra) {
        return;
    }

    localStorage.setItem("pedido_normalizacion", JSON.stringify({
        ...compra,
        producto: compra.producto || "",
        precio_venta: compra.precio_venta ?? ""
    }));

    window.location.hash = "#normalizar";
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
