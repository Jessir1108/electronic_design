const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Client } = require('pg');
const dgram = require('dgram');

// Crear la instancia de la aplicación Express y del servidor HTTP
const app = express();
const server = http.createServer(app);

// Configurar la conexión a la base de datos PostgreSQL
const dbConfig = {
  user: 'Jessir',
  host: 'localhost',
  database: 'webserver',
  password: 'uninorte',
  port: 5432,
};

const dbClient = new Client(dbConfig);

dbClient.connect()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Configurar el puerto en el que escuchará el servidor
const PORT = 3000;

// Iniciar el servidor en el puerto especificado
server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

// Configurar Socket.IO para trabajar con el servidor
const io = socketIo(server);

// Configurar el servidor UDP
const udpServer = dgram.createSocket('udp4');

const UDP_PORT = 8099;

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`Servidor UDP en funcionamiento en ${address.address}:${address.port}`);
});

udpServer.on('message', (message, remote) => {
  console.log(`Mensaje recibido de ${remote.address}:${remote.port}: ${message}`);

  const insertQuery = 'INSERT INTO ubicaciones (content) VALUES ($1) RETURNING *';
  const values = [message.toString()];
  

  dbClient.query(insertQuery, values)
    .then(result => {
      const insertedData = result.rows[0];
      console.log('Datos guardados en la base de datos:', insertedData);

      // Emitir los datos a través de Socket.IO para actualizar la página web
      io.emit('nuevos-datos', message.toString());
    })
    .catch(err => {
      console.error('Error al guardar datos en la base de datos:', err);
    });
});

udpServer.bind(UDP_PORT);

// Configurar la ruta para servir la página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
