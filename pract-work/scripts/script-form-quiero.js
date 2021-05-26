//funcion que valida los datos introducidos 
function validateForm() {
    if (validateName() == false || validateEmail() == false || validateMovil() == false) {
        return false;
    } else {
        alert("Muchas gracias! Nosotros contactamos contigo mas breve possible!");
        return true;
    }
}
//funcion que valida el nombre
function validateName() {
    var name = document.formQueiro.name.value;
    var elemento = document.getElementById("name");
    if (name.length >= 20 || !isNaN(name)) {
        alert("Hay un error en campo para numero de nombre.");
        elemento.classList.add("denegado");
        return false;
    } else {
        elemento.classList.add("accpetado");
        return true;
    }
}
//funcion que valida correo electronico
function validateEmail() {
    var email = document.formQueiro.email.value;
    var elemento = document.getElementById("email");
    if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        elemento.classList.add("accpetado");
        return true;
    }
    elemento.classList.add("denegado");
    alert("Hay un error en campo para numero de email.");
    return false;
}
//funcion que valida numero movil
function validateMovil() {
    var movil = document.formQueiro.phone.value;
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