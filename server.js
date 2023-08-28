const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Client } = require('pg');
const dgram = require('dgram');

const app = express();
const server = http.createServer(app);

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

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

const io = socketIo(server);

const udpServer = dgram.createSocket('udp4');

const UDP_PORT = 8099;

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`Servidor UDP en funcionamiento en ${address.address}:${address.port}`);
});

udpServer.on('message', (message, remote) => {
  console.log(`Mensaje recibido de ${remote.address}:${remote.port}: ${message}`);

  const entrada = message.toString();
  let latitude = null;
  let longitude = null;
  let time = null;

  entrada.split(', ').forEach(item => {
    if (item.startsWith('Latitude:')) {
      latitude = parseFloat(item.split(': ')[1]);
    } else if (item.startsWith('Longitude:')) {
      longitude = parseFloat(item.split(': ')[1]);
    } else if (item.startsWith('Time:')) {
      time =  parseFloat(item.split(': ')[1]);
    }
  });

  if (latitude !== null && longitude !== null && time !== null) {
    const insertQuery = 'INSERT INTO ubicaciones (latitud, longitud, tiempo) VALUES ($1, $2, $3) RETURNING *';
    const values = [latitude, longitude, time];

    dbClient.query(insertQuery, values)
      .then(result => {
        const insertedData = result.rows[0];
        console.log('Datos guardados en la base de datos:', insertedData);

        io.emit('nuevos-datos', message.toString());
      })
      .catch(err => {
        console.error('Error al guardar datos en la base de datos:', err);
      });
  } else {
    console.log('No se pudieron procesar todos los datos.');
  }
});

udpServer.bind(UDP_PORT);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
