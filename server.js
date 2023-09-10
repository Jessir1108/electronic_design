const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2'); // Utilizar el módulo mysql2 en lugar de pg
const dgram = require('dgram');

const app = express();
const server = http.createServer(app);

const dbConfig = {
  user: 'root',
  host: 'mydbs.cuuo9scbn0zr.us-east-2.rds.amazonaws.com',
  database: 'webserver',
  password: 'jessir123',
  port: 3306, // Puerto por defecto de MySQL
};

const dbClient = mysql.createConnection(dbConfig); // Utilizar mysql.createConnection en lugar de new Client

dbClient.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
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
  let date = null;
  let time = null;

  entrada.split(', ').forEach(item => {
    if (item.startsWith('Latitude:')) {
      latitude = parseFloat(item.split(': ')[1]);
    } else if (item.startsWith('Longitude:')) {
      longitude = parseFloat(item.split(': ')[1]);
    } else if (item.startsWith('Time:')) {
      // Dividir la fecha y la hora
      const dateTimeStr = item.split(': ')[1];
      const [dateStr, timeStr] = dateTimeStr.split(' ');

      date = dateStr; // Mantener la fecha como una cadena en formato 'YYYY-MM-DD'
      time = timeStr; // Mantener la hora como una cadena en formato 'HH:MM:SS'
    }
  });

  if (latitude !== null && longitude !== null && date !== null && time !== null) {
    const insertQuery = 'INSERT INTO coordenadas (Latitud, Longitud, Fecha, Hora) VALUES (?, ?, ?, ?)'; // Consulta SQL de MySQL
    const values = [latitude, longitude, date, time];

    dbClient.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error al guardar datos en la base de datos:', err);
      } else {
        console.log('Datos guardados en la base de datos:', result);

        io.emit('nuevos-datos', message.toString());
      }
    });
  } else {
    console.log('No se pudieron procesar todos los datos.');
  }
});

udpServer.bind(UDP_PORT);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
