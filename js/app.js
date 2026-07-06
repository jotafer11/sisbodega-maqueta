let grupos = [];
let marcas = [];
let matrices = [];

let indiceEditar = null;


document.addEventListener("DOMContentLoaded", () => {

    cargarGrupos();
    cargarMarcas();
    listar();    

});


async function cargarGrupos() {

    const response = await fetch("src/data/grupos.json");
    grupos = await response.json();

    const select = document.getElementById("grupo");

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

document.getElementById("marca").addEventListener("change", function () {

    cargarMatrices(this.value);

});


function actualizarDescripcion() {

    const grupo = document.getElementById("grupo");
    const marca = document.getElementById("marca");
    const matriz = document.getElementById("matriz");

    const descripcion = document.getElementById("descripcion");

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

document.getElementById("grupo")
    .addEventListener("change", actualizarDescripcion);

document.getElementById("marca")
    .addEventListener("change", actualizarDescripcion);

document.getElementById("matriz")
    .addEventListener("change", actualizarDescripcion);

function guardar(event) {

    event.preventDefault();

    const grupo = document.getElementById("grupo");
    const marca = document.getElementById("marca");
    const matriz = document.getElementById("matriz");
    const descripcion = document.getElementById("descripcion");
    const stock = document.getElementById("stock");    

    const registro = {

        grupo: grupo.options[grupo.selectedIndex].text,
        marca: marca.options[marca.selectedIndex].text,
        matriz: matriz.options[matriz.selectedIndex].text,
        descripcion: descripcion.value,
        stock: stock.value        

    };

    let registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];


    if(indiceEditar === null){

        registros.push(registro);

        mostrarSnackbar("Repuesto creado");

    }else{

        registros[indiceEditar] = registro;

        indiceEditar = null;        

        mostrarSnackbar("Repuesto actualizado");

    }        


    localStorage.setItem(
        "repuestos",
        JSON.stringify(registros)
    );

    listar();

    document.getElementById("frmRepuesto").reset();

    document.getElementById("matriz").innerHTML =
        '<option value="">Seleccione una marca...</option>';

    descripcion.value = "";

    mostrarSnackbar("Repuesto creado");    

}

document
    .getElementById("frmRepuesto")
    .addEventListener("submit", guardar);


function listar() {

    const tbody =
        document.querySelector("#tablaRepuestos tbody");

    tbody.innerHTML = "";

    const registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];

    registros.forEach((registro,index) => {

        tbody.innerHTML += `

            <tr>

                <td>${registro.grupo}</td>
                <td>${registro.marca}</td>
                <td>${registro.matriz}</td>
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

    snackbar.textContent = mensaje;

    snackbar.classList.add("show");

    setTimeout(() => {

        snackbar.classList.remove("show");

    },2500);

}

function editar(index){

    const registros =
        JSON.parse(localStorage.getItem("repuestos")) || [];

    const repuesto = registros[index];

    indiceEditar = index;

    document.getElementById("descripcion").value = repuesto.descripcion;

    document.getElementById("stock").value = repuesto.stock;

    // después podremos seleccionar automáticamente
    // grupo, marca y matriz.

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

    listar();

    mostrarSnackbar("Repuesto eliminado");

}
