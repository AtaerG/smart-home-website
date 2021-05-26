//funcion que valida los datos introducidos 
function validateForm() {
    if (validateNameSurName() == false || validateMovil() == false) {
        return false;
    } else {
        alert("Muchas gracias! Nosotros contactamos contigo mas breve possible!");
        crearPedido(event);
        document.getElementById("name").value = "";;
        document.getElementById("quantity_hab").value = "";;
        document.getElementById("quantity_ench").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("tipo-instalacion").value = "";
        return true;
    }
}
//funcion que valida el nombre
function validateNameSurName() {
    var name = document.formPedido.name.value;
    var elemento = document.getElementById("name");
    if (!isNaN(name)) {
        alert("Hay un error en campo para numero de nombre y apellido.");
        elemento.classList.add("denegado");
        return false;
    } else {
        elemento.classList.add("accpetado");
        return true;
    }
}
//funcion que valida numero movil
function validateMovil() {
    var movil = document.formPedido.phone.value;
    var elemento = document.getElementById("phone");
    var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[- ]?([0-9]{3})$/;
    if (movil.match(phoneno)) {
        elemento.classList.add("accpetado");
        return true;
    } else {
        elemento.classList.add("denegado");
        alert("Hay un error en campo para numero de telefono.");
        return false;
    }
}
/**********************************
 * 
 * Scripts para que JSON bin funciona .
 * 
 *********************************/
//Clase de pedido
class Pedido {
    nombre = "";
    cantidad_hab = "";
    cantidad_enchuf = "";
    num_tel = "";
    sistema = "";

    constructor(nombre, cantidad_hab, cantidad_enchuf, num_tel, sistema) {
        this.nombre = nombre;
        this.cantidad_hab = cantidad_hab;
        this.cantidad_enchuf = cantidad_enchuf;
        this.num_tel = num_tel;
        this.sistema = sistema;
    }
}
//funcion que crear un pedido
function crearPedido(event) {
    event.preventDefault();

    var nombre = document.getElementById("name").value;
    var cantidad_hab = document.getElementById("quantity_hab").value;
    var cantidad_enchuf = document.getElementById("quantity_ench").value;
    var num_tel = document.getElementById("phone").value;

    var tipoSeleccionado = document.getElementById("tipo-instalacion").options[document.getElementById("tipo-instalacion").selectedIndex].text;

    var pedido = new Pedido(nombre, cantidad_hab, cantidad_enchuf, num_tel, tipoSeleccionado);

    var json = JSON.stringify(pedido);
    crearBin(json);
}
//funcion que crear un objeto de tipo json
function crearBin(json) {
    let req = new XMLHttpRequest();

    req.open("POST", "https://api.jsonbin.io/v3/b", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", SECRET_KEY);
    req.setRequestHeader("X-Collection-Id", COLLECTION_ID);
    req.send(json);
}
//funcion que lee la coleccion
function leerColeccion() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            respuesta = JSON.parse(req.responseText);

            for (var i = 0; i < respuesta.length; i++) {
                leerBin(respuesta[i].record, false);
            }
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/c/" + COLLECTION_ID + "/bins/", true);
    req.setRequestHeader("X-Master-Key", SECRET_KEY);
    req.send();
}
//funcion que leee los datso de bin
function leerBin(binID, edicion) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            if (!edicion) {
                formatearPedidos(binID, JSON.parse(req.responseText).record);
            } else {
                cargarPedidoEdicion(JSON.parse(req.responseText).record);
            }
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/" + binID + "/latest", true);
    req.setRequestHeader("X-Master-Key", SECRET_KEY);
    req.send();
}
//funcion que formatea los pedidos.
function formatearPedidos(binID, pedido) {
    //Obtención nodo principal
    var pedidos = document.getElementById("pedidos");

    //Creación de nodos
    var div_pedido = document.createElement("div");
    div_pedido.className += "producto";
    var h2_nombre = document.createElement("h1");
    var p_cantidad_hab = document.createElement("p");
    var p_cantidad_ench = document.createElement("p");
    var p_phoene = document.createElement("p");
    var p_tipo_instal = document.createElement("p");
    var btn_editar = document.createElement("button");
    var btn_borrar = document.createElement("button");

    //Relleno de nodos
    h2_nombre.innerText = "Nombre: " + pedido.nombre;
    p_cantidad_hab.innerText = "Cantidad de Habitaciones: " + pedido.cantidad_hab;
    p_cantidad_ench.innerText = "Cantidad de enchufes: " + pedido.cantidad_enchuf;
    p_phoene.innerText = "Numero tel: " + pedido.num_tel;
    p_tipo_instal.innerText = "Tipo: " + pedido.sistema;
    btn_editar.innerHTML = "<a href='editar-pedido.html' style='text-decoration: none; '>Editar pedido</a>"
    btn_borrar.innerText = "Borrar Pedido de: " + pedido.nombre;
    //Eventos de editar y borrar
    btn_editar.addEventListener("click", function() { localStorage.setItem("binID", binID); }, false);
    btn_borrar.addEventListener("click", function() { borrarBin(binID); }, false);

    //Adjuntamos nodos al div y al DOM
    div_pedido.appendChild(h2_nombre);
    div_pedido.appendChild(p_cantidad_hab);
    div_pedido.appendChild(p_cantidad_ench);
    div_pedido.appendChild(p_phoene);
    div_pedido.appendChild(p_tipo_instal);
    div_pedido.appendChild(btn_editar);
    div_pedido.appendChild(btn_borrar);

    pedidos.appendChild(div_pedido);
}
//funcion que carga propiedades de un pedido.
function cargarPedidoEdicion(pedido) {
    console.log(pedido)
    document.getElementById("name").value = pedido.nombre;
    document.getElementById("quantity_hab").value = pedido.cantidad_hab;
    document.getElementById("quantity_ench").value = pedido.cantidad_enchuf;
    document.getElementById("phone").value = pedido.num_tel;
    document.getElementById("tipo-instalacion").value = pedido.sistema;
}
//funcion que edita un pedido.
function editarPedido(event, binID) {
    event.preventDefault();
    var nombre = document.getElementById("name").value;
    var cantidad_hab = document.getElementById("quantity_hab").value;
    var cantidad_enchuf = document.getElementById("quantity_ench").value;
    var num_tel = document.getElementById("phone").value;

    var tipoSeleccionado = document.getElementById("tipo-instalacion").options[document.getElementById("tipo-instalacion").selectedIndex].text;
    if (validateNameSurName() == false || validateMovil() == false) {
        return false;
    }
    var pedido = new Pedido(nombre, cantidad_hab, cantidad_enchuf, num_tel, tipoSeleccionado);

    var json = JSON.stringify(pedido);
    editarBin(binID, json);
}

//funcion que edita la informacin en bin
function editarBin(binID, pedido) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            alert("Registro actualizado!");
            document.location.replace("all-pedidos.html");
        }
    };

    req.open("PUT", "https://api.jsonbin.io/v3/b/" + binID, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", SECRET_KEY);
    req.send(pedido);
}
//funcion que borra informacion en bin
function borrarBin(binID) {
    var confirmacion = confirm("¿Desea borrar el registro?");

    if (confirmacion) {
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                limpiarPedidos();
                leerColeccion();
                document.location.replace("all-pedidos.html");
            }
        };


        req.open("DELETE", "https://api.jsonbin.io/v3/b/" + binID, true);
        req.setRequestHeader("X-Master-Key", SECRET_KEY);
        req.send();
    }
}
//funcion que limpia pedido.
function limpiarPedidos() {
    var pedidos = document.getElementById("personas");
    pedidos.innerHTML = "";
}