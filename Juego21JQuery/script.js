"use strict";

//En esta variable se guarda la instancia del juego
let partida;
class Juego {
    constructor() {
        this.dados = [];
        this.comenzar = false;
        this.puntosActuales = 0;
        this.puntosGlobales = 0;
        this.dadoDeshabilitado = false;
        this.deshabilitar = false;
        this.botonDes = false;
    }
}

//Esto es lo primero que se ejecuta al cargar la página
$(() => {
    $(".comenzar").on("click", comenzar);
    $(".reiniciar").on("click", reiniciar);
});

//Esta función se ejecuta al presionar el botón 'Reiniciar' con la cual se podrá empezar de nuevo el juego y te dará los puntos totales que has conseguido a lo largo del juego.
const reiniciar = () => {
    Swal.fire({
        text: "Gracias por jugar. Has conseguido un total de " + partida.puntosGlobales + " puntos.",
        icon: "success"
    });
    $("#panel-numDados").empty();
    $(".comenzar").on("click", comenzar);
}

//Aquí se crea una instancia del juego, y este comenzará.
const comenzar = () => {
    $(".comenzar").off("click", comenzar);
    partida = new Juego();
    partida.comenzar = true;
    crearInputyLabel();
    crearTablero();
    crearBotonLanzar();
    meterDadosArray();
}

//Esta función crea el input donde se irán viendo los puntos conseguidos con los dados.
const crearInputyLabel = () => {
    let capa = $("#panel-numDados");
    let label = $("<label>");
    let input = $("<input>");
    label.attr("class", "claspunt");
    label.text("Puntos");
    label.attr("for", "claspunt");
    input.attr("class", "claspunt");
    input.attr("type", "text");
    input.attr("value", 0);
    input.attr("readonly", true);
    input.attr("id", "textPuntos");
    capa.append(label);
    capa.append(input);
}

//Esta función crea el tablero donde estarán los dados.
const crearTablero = () => {
    let capa = $("#panel-numDados");
    let tabla = $("<table>");
    tabla.attr("id", "tablero");
    capa.append(tabla);
    for (let i = 0; i < 1; i++) {
        let tr = $("<tr>");
        tabla.append(tr);
        for (let j = 0; j < 2; j++) {
            let td = $("<td>");
            tr.append(td);
        }
    }
}

//En esta función se crea el botón 'lanzar', con el cual se podrán lanzar los dados.
const crearBotonLanzar = () => {
    let capa = $("#panel-numDados");
    let capaBoton = $("<div>");
    capa.append(capaBoton);
    capaBoton.addClass("capaBoton");
    let boton = $("<input>");
    boton.addClass(" btn btn-warning btn-lg");
    boton.attr("id", "botonLanzar");
    boton.attr("type", "button");
    boton.attr("value", "Lanzar");
    capaBoton.append(boton);
    boton.on("click", lanzar);
}

//Aquí se meten las imagenes de los dados en el array.
const meterDadosArray = () => {
    for (let i = 1; i <= 6; i++) {
        partida.dados.push("assets/imagenes/dado" + i + ".png");
    };
};

//Esta función se ejecuta al darle al botón 'Lanzar' y es la encargada de sacar de forma aleatoria dos dados, y sumará 
//el reslutado de estos, mostrandolos en el input de arriba.
const lanzar = () => {
    let img, ind;
    $("#tablero tr").children().each(function () {
        ind = Math.round(Math.random() * 5);
        if ($(this).children(":first").length > 0) {
            img = $(this).children(":first");
        } else {
            img = $("<img>")
            $(this).append(img);
        }
        img.attr("src", partida.dados[ind]);
        img.on("click", deshabilitarDado);
        partida.puntosActuales += (ind + 1);
        console.log(ind);
    });
    $("#textPuntos").attr("value", partida.puntosActuales);
    //Después de sacar los dados se comprueba si el juego ha terminado, porque se haya sacado 21 o porque se haya pasado.
    const time = setTimeout(() => {
        comprobarPuntuacion();
    }, 400);

}

// Esta función se ejecuta al presionar el botón plantarse, que hace que la ronda empieze de nuevo.
const nuevaJugada = () => {
    partida.botonDes = false;
    partida.deshabilitar = false;
    partida.puntosActuales = 0;
    $("#panel-numDados").empty();
    crearInputyLabel();
    crearTablero();
    crearBotonLanzar();
}

//Esta función se ejecutará al comprobar que se ha pasado la puntuación de 15, comprobado en la función comprobarPuntuacion(), es la encargada
//de crear el botón plantarse, con el que el usuario podrá hacer una nueva jugada.
const crearBotonPlantarse = () => {
    let capaBoton = $(".capaBoton");
    let boton = $("<input>");
    boton.addClass(" btn btn-lg");
    boton.attr("id", "botonPlantarse");
    boton.attr("type", "button");
    boton.attr("value", "Plantarse");
    capaBoton.append(boton);
    boton.on("click", plantarse);
}

//Esta función es la que se ejecuta al presionar el botón 'Plantarse' y con la cual comenzará una nueva jugada, sumando los puntos a la cuenta global.
const plantarse = () => {
    Swal.fire({
        text: "Te has plantado. Nueva jugada",
        icon: "success"
    });
    partida.puntosGlobales += partida.puntosActuales;
    nuevaJugada();
}

//Esta función hace que puedas deshabilitar un dado cuando se sobrepasen los 15 puntos, y seguir jugando con un solo dado.
function deshabilitarDado() {
    if (partida.deshabilitar) {
        if ($("#tablero tr td").length === 2) {
            $(this).parent().remove();
            $("#botonLanzar").on("click", lanzar);
            partida.botonDes = true;
        } else {
            console.log("Solo se puede eliminar un dado");
        }
    }
}

//Esta función comprueba si se ha perdido o ganado, dependiendo de la puntuación.
const comprobarPuntuacion = () => {
    //Si tienes entre 15 y 20 puntos te avisará de lo que puedes hacer, y se creará el botón 'Plantarse'.
    if (partida.puntosActuales >= 15 && partida.puntosActuales < 21) {
        Swal.fire({
            text: "Ha conseguido " + partida.puntosActuales + " puntos. Puede plantarse y sumar esa puntuación en su cuenta o seguir jugando deshabilitando un dado",
            icon: "warning",
            confirmButtonText: "Ok"
        })
        if (!partida.botonDes) {
            $("#botonLanzar").off("click", lanzar);
        }
        if ($(".capaBoton #botonPlantarse").length === 0) {
            crearBotonPlantarse();
        }
        partida.deshabilitar = true;

    } else if (partida.puntosActuales === 21) {//Si tienes 21 puntos ganarás la ronda, se sumarán 100 puntos a la cuenta global y se empezará una nueva jugada.
        Swal.fire({
            text: "¡¡Enhorabuena!! Ha conseguido " + partida.puntosActuales + " ptos y ha ganado la partida. Suma 100 ptos en su cuenta",
            icon: "success",
            confirmButtonText: "Ok"
        }).then((result) => {
            partida.puntosGlobales += 100;
            nuevaJugada();
        })
    } else if (partida.puntosActuales > 21) {//Si sobrepasas los 21 puntos perderás la ronda, no se sumará nada a la cuenta global y se empezará jugada nueva.
        Swal.fire({
            text: "Ha conseguido " + partida.puntosActuales + " puntos. Ha perdido la partida. Se sumará 0 puntos en su cuenta",
            icon: "error",
            confirmButtonText: "Ok"
        }).then((result) => {
            nuevaJugada();
        })
    }
}