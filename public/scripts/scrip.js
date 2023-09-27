// Función para mostrar el contenido de Live
function mostrarLive() {
    if (modo !== "Live") {

        modo = "Live";
        clearMap();
        removeRectangle();
        removeclick();

        
    }
    document.querySelector('.latitude').style.display = 'inline-block';
    document.querySelector('.longitude').style.display = 'inline-block';
    document.querySelector('.fecha').style.display = 'inline-block';
    document.querySelector('#limpiar').style.display = 'inline-block';

    // Ocultar contenido de Historial
    document.querySelector('.Historial').style.display = 'none';

    // Mostrar mapa Live y ocultar mapa Historial
    document.getElementById('map-live').style.display = 'block';
    document.getElementById('map-historial').style.display = 'none';
}
  
// Función para ocultar el contenido de Live
function ocultarLive() {
    document.querySelector('.latitude').style.display = 'none';
    document.querySelector('.longitude').style.display = 'none';
    document.querySelector('.fecha').style.display = 'none';
    document.querySelector('#limpiar').style.display = 'none';
}

// Función para mostrar el contenido de Historial
function mostrarHistorial() {
    if (modo !== "Historial") {
        modo = "Historial";
        clearMap();  
    }
    document.querySelector('.Historial').style.display = 'block';

        // Ocultar contenido de Live
        ocultarLive();

        // Mostrar mapa Historial y ocultar mapa Live
        document.getElementById('map-live').style.display = 'none';
        document.getElementById('map-historial').style.display = 'block';
}

// Función para ocultar el contenido de Historial
function ocultarHistorial() {
    document.querySelector('.Historial').style.display = 'none';
}

// Agregar eventos click a los elementos "Live" y "Historial"
document.querySelector('p[data-target="#Live"]').addEventListener('click', mostrarLive);
document.querySelector('p[data-target="#Historial"]').addEventListener('click', mostrarHistorial);

// Inicialmente, ocultar el contenido de Live y Historial
ocultarLive();
ocultarHistorial();

  
  
  