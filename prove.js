const { Client } = require('pg');

// Datos de entrada
const entrada = "Latitud: 10.913799, Longitud: -74.8216787, Tiempo: 2023-08-20 13:39:23";
let latitud = null;
let longitud = null;
let tiempo = null;

// Procesar la entrada para obtener los valores
entrada.split(', ').forEach(item => {
    if (item.startsWith('Latitud:')) {
        latitud = parseFloat(item.split(': ')[1]);
    } else if (item.startsWith('Longitud:')) {
        longitud = parseFloat(item.split(': ')[1]);
    } else if (item.startsWith('Tiempo:')) {
        tiempo = new Date(item.split(': ')[1]);
    }
});

// Configuración de la conexión a la base de datos
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'webserver',
    password: 'jessir',
    port: 5432,
});

// Conectar a la base de datos
client.connect()
    .then(() => {
        // Insertar los valores en la base de datos
        if (latitud !== null && longitud !== null && tiempo !== null) {
            const query = 'INSERT INTO ubicaciones (latitud, longitud, tiempo) VALUES ($1, $2, $3)';
            const values = [latitud, longitud, tiempo];
            
            return client.query(query, values);
        } else {
            console.log('No se pudieron procesar todos los datos.');
            return Promise.reject('Datos faltantes.');
        }
    })
    .then(() => {
        console.log('Datos insertados correctamente.');
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Cerrar la conexión
        client.end();
    });