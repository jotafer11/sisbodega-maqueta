let grupos = [];
let marcas = [];
let matrices = [];

let indiceEditar = null;
let pedidoPendiente = null;
let repuestoEnEdicion = null;

async function iniciarNormalizar(){
    bindNormalizarEvents();
    await Promise.all([
        cargarGrupos(),
        cargarMarcas()
    ]);
    listar_repuestos_n();
    cargarPedidoPendiente();
    await cargarRepuestoEdicion();
}

function bindNormalizarEvents() {
    const marca = document.getElementById("marca");
    if (marca && !marca.dataset.listenerNormalizar) {
        marca.addEventListener("change", async function () {
            await cargarMatrices(this.value);
            actualizarDescripcion();
        });
        marca.dataset.listenerNormalizar = "1";
    }

    const grupo = document.getElementById("grupo");
    if (grupo && !grupo.dataset.listenerNormalizar) {
        grupo.addEventListener("change", actualizarDescripcion);
        grupo.dataset.listenerNormalizar = "1";
    }

    const matriz = document.getElementById("matriz");
    if (matriz && !matriz.dataset.listenerNormalizar) {
        matriz.addEventListener("change", actualizarDescripcion);
        matriz.dataset.listenerNormalizar = "1";
    }

    const formulario = document.getElementById("frmRepuesto");
    if (formulario && !formulario.dataset.listenerNormalizar) {
        formulario.addEventListener("submit", guardar);
        formulario.dataset.listenerNormalizar = "1";
    }
}

function cargarPedidoPendiente() {

    pedidoPendiente = JSON.parse(localStorage.getItem("pedido_normalizacion"));

    if (!pedidoPendiente) {

        return;

    }

    const descripcion = document.getElementById("descripcion");
    const stock = document.getElementById("stock");
    const producto = document.getElementById("producto");
    const precioVenta = document.getElementById("precio_venta");
    const numeroCompra = document.getElementById("numero_compra");

    if (descripcion && pedidoPendiente.descripcion) {

        descripcion.value = pedidoPendiente.descripcion;

    }

    if (stock && pedidoPendiente.stock !== undefined && pedidoPendiente.stock !== null) {

        stock.value = pedidoPendiente.stock;

    }

    if (producto && pedidoPendiente.producto) {

        producto.value = pedidoPendiente.producto;

    }

    if (precioVenta && pedidoPendiente.precio_venta !== undefined) {

        precioVenta.value = pedidoPendiente.precio_venta;

    }

    if (numeroCompra && pedidoPendiente.numero_compra !== undefined) {

        numeroCompra.value = pedidoPendiente.numero_compra;

    }

}

async function cargarRepuestoEdicion() {

    const repuestoEdicion = JSON.parse(localStorage.getItem("repuesto_editar"));

    if (!repuestoEdicion || !repuestoEdicion.repuesto) {
        return;
    }

    const repuesto = repuestoEdicion.repuesto;
    repuestoEnEdicion = repuesto;

    indiceEditar = Number.isInteger(repuestoEdicion.indice)
        ? repuestoEdicion.indice
        : null;

    const grupo = document.getElementById("grupo");
    const marca = document.getElementById("marca");
    const matriz = document.getElementById("matriz");
    const descripcion = document.getElementById("descripcion");
    const stock = document.getElementById("stock");
    const producto = document.getElementById("producto");
    const precioVenta = document.getElementById("precio_venta");
    const numeroCompra = document.getElementById("numero_compra");

    if (grupo && repuesto.grupo_id) {
        grupo.value = repuesto.grupo_id;
    }

    if (marca && repuesto.marca_id) {
        marca.value = repuesto.marca_id;
    }

    if (matriz && repuesto.marca_id) {
        await cargarMatrices(repuesto.marca_id);
        matriz.value = repuesto.matriz_id || "";
    }

    if (descripcion && repuesto.descripcion) {
        descripcion.value = repuesto.descripcion;
    }

    if (stock && repuesto.stock !== undefined && repuesto.stock !== null) {
        stock.value = repuesto.stock;
    }

    if (producto && repuesto.producto) {
        producto.value = repuesto.producto;
    }

    if (precioVenta && repuesto.precio_venta !== undefined) {
        precioVenta.value = repuesto.precio_venta;
    }

    if (numeroCompra && repuesto.numero_compra !== undefined) {
        numeroCompra.value = repuesto.numero_compra;
    }

}


async function cargarGrupos() {

    const response = await fetch("src/data/grupos.json");
    grupos = await response.json();

    const select = document.getElementById("grupo");
    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Seleccione...</option>';

    grupos.forEach(grupo => {

        select.innerHTML += `
            <option value="${grupo.id}">
                ${grupo.nombre}
            </option>
        `;

    });

}

async function cargarMarcas() {

    const response = await fetch("src/data/marcas.json");
    marcas = await response.json();

    const select = document.getElementById("marca");
    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Seleccione...</option>';

    marcas.forEach(marca => {

        select.innerHTML += `
            <option value="${marca.id}">
                ${marca.nombre}
            </option>
        `;

    });

}

async function cargarMatrices(marcaId) {

    // Solo carga el JSON la primera vez
    if (matrices.length === 0) {

        const response = await fetch("src/data/matrices.json");
        matrices = await response.json();

    }

    const select = document.getElementById("matriz");
    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Seleccione...</option>';

    const filtradas = matrices.filter(matriz => matriz.marca_id == marcaId);

    filtradas.forEach(matriz => {

        select.innerHTML += `
            <option value="${matriz.id}">
                ${matriz.modelo} ${matriz.motor} ${matriz.año}
            </option>
        `;

    });

}


function actualizarDescripcion() {

    const grupo = document.getElementById("grupo");
    const marca = document.getElementById("marca");
    const matriz = document.getElementById("matriz");
    const descripcion = document.getElementById("descripcion");

    if (!grupo || !marca || !matriz || !descripcion) {
        return;
    }

    const grupoTexto = grupo.options[grupo.selectedIndex].text;
    const marcaTexto = marca.options[marca.selectedIndex].text;
    const matrizTexto = matriz.options[matriz.selectedIndex].text;

    if (
        grupo.value === "" ||
        marca.value === "" ||
        matriz.value === ""
    ) {
        descripcion.value = "";
        return;
    }

    descripcion.value =
        `${grupoTexto} ${marcaTexto} ${matrizTexto}`.toUpperCase();

}

function guardar(event) {

    event.preventDefault();

    const grupo = document.getElementById("grupo");
    const marca = document.getElementById("marca");
    const matriz = document.getElementById("matriz");
    const producto = document.getElementById("producto");    
    const descripcion = document.getElementById("descripcion");
    const stock = document.getElementById("stock");    
    const precioVenta = document.getElementById("precio_venta");
    const numeroCompraInput = document.getElementById("numero_compra");

    if (!grupo || !marca || !matriz || !producto || !descripcion || !stock || !precioVenta || !numeroCompraInput) {
        return;
    }

    const numeroCompra = pedidoPendiente
        ? Number(pedidoPendiente.numero_compra) || null
        : Number(numeroCompraInput.value || repuestoEnEdicion?.numero_compra) || null;

    const grupoTexto = grupo.options[grupo.selectedIndex]?.text || "";
    const marcaTexto = marca.options[marca.selectedIndex]?.text || "";
    const matrizTexto = matriz.options[matriz.selectedIndex]?.text || "";

    const registro = {

        numero_compra: numeroCompra,

        grupo_id: grupo.value,        
        grupo: grupoTexto,

        marca_id: marca.value,        
        marca: marcaTexto,

        matriz_id: matriz.value,        
        matriz: matrizTexto,

        producto: producto.value,
        precio_venta: precioVenta.value || "",

        descripcion: descripcion.value,

        stock: stock.value        

    };

    let registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];

    let indiceObjetivo = indiceEditar;

    if (indiceObjetivo === null && numeroCompra !== null) {

        indiceObjetivo = registros.findIndex(registroActual => {
            return String(registroActual.numero_compra) === String(numeroCompra);
        });

    }

    if(indiceObjetivo === null || indiceObjetivo === -1){

        registros.push(registro);

        mostrarSnackbar("Repuesto creado");

    }else{

        registros[indiceObjetivo] = registro;

        indiceEditar = null;        

        mostrarSnackbar("Repuesto actualizado");

    }        


    localStorage.setItem(
        "repuestos",
        JSON.stringify(registros)
    );

    if (pedidoPendiente) {
        localStorage.removeItem("pedido_normalizacion");
        pedidoPendiente = null;
    }

    repuestoEnEdicion = null;
    localStorage.removeItem("repuesto_editar");

    listar_repuestos_n();

    document.getElementById("frmRepuesto")?.reset();

    const matrizSelect = document.getElementById("matriz");
    if (matrizSelect) {
        matrizSelect.innerHTML =
            '<option value="">Seleccione una marca...</option>';
    }

    descripcion.value = "";

}

function listar_repuestos_n() {

    const tbody =
        document.querySelector("#tablaRepuestosN tbody");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    const registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];

    registros.forEach((registro,index) => {

        tbody.innerHTML += `

            <tr>
                <td>${registro.numero_compra || ""}</td>            
                <td>${registro.marca}</td>
                <td>${registro.matriz}</td>
                <td>${registro.producto}</td>                
                <td>${registro.descripcion}</td>
                <td>${registro.stock}</td>
            <td>

                <button onclick="editar(${index})">
                    Editar
                </button>

                <button onclick="eliminar(${index})">
                    Eliminar
                </button>

            </td>
                                
            </tr>

        `;

    });

}

function mostrarSnackbar(mensaje){

    const snackbar = document.getElementById("snackbar");
    if (!snackbar) {
        return;
    }

    snackbar.textContent = mensaje;

    snackbar.classList.add("show");

    setTimeout(() => {

        snackbar.classList.remove("show");

    },2500);

}

async function editar(index){

    const registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];

    const repuesto = registros[index];

    if (!repuesto) {
        return;
    }

    indiceEditar = index;
    repuestoEnEdicion = repuesto;

    // Grupo
    const grupo = document.getElementById("grupo");
    const marca = document.getElementById("marca");
    const matriz = document.getElementById("matriz");
    const stock = document.getElementById("stock");
    const producto = document.getElementById("producto");
    const descripcion = document.getElementById("descripcion");
    const precioVenta = document.getElementById("precio_venta");
    const numeroCompra = document.getElementById("numero_compra");

    if (!grupo || !marca || !matriz || !stock || !producto || !descripcion || !precioVenta || !numeroCompra) {
        return;
    }

    grupo.value = repuesto.grupo_id;

    // Marca
    marca.value = repuesto.marca_id;

    // Cargar matrices de esa marca
    await cargarMatrices(repuesto.marca_id);

    // Seleccionar la matriz
    matriz.value = repuesto.matriz_id;
    producto.value = repuesto.producto || "";
    descripcion.value = repuesto.descripcion || "";
    precioVenta.value = repuesto.precio_venta ?? "";
    numeroCompra.value = repuesto.numero_compra ?? "";

    // Actualizar descripción
    actualizarDescripcion();

    // Stock
    stock.value = repuesto.stock;

}

function eliminar(index){

    if(!confirm("¿Eliminar este repuesto?")){

        return;

    }

    let registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];

    registros.splice(index,1);

    localStorage.setItem(

        "repuestos",

        JSON.stringify(registros)

    );

    listar_repuestos_n();

    mostrarSnackbar("Repuesto eliminado");

}
