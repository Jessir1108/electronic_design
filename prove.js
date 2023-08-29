const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Client } = require('pg');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'webserver',
    password: 'jessir',
    port: 5432,
});

let interval;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Iniciar la transmisión de datos
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => fetchAndEmitData(socket), 8000); // Cada 8 segundos

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        clearInterval(interval);
    });
});

function fetchAndEmitData(socket) {
    // Generar datos aleatorios
    const randomLatitud = Math.random() * (90 - (-90)) + (-90);
    const randomLongitud = Math.random() * (180 - (-180)) + (-180);
    const randomTiempo = Date.now() - Math.floor(Math.random() * 60000); // Hasta 1 minuto en el pasado

    const formattedTiempo = moment(randomTiempo).format('YYYY-MM-DD HH:mm:ss');

    const randomData = {
        latitud: randomLatitud.toFixed(6),
        longitud: randomLongitud.toFixed(6),
        tiempo: formattedTiempo,
    };

    socket.emit('update', randomData);
}

server.listen(3000, () => {
    console.log('Servidor en ejecución en http://localhost:3000');
});
