const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'ваш_пароль',
    database: 'beachside_racetrack',
});

client
    .connect()
    .then(() => {
        console.log('Connected to the database');
        client.end();
    })
    .catch((err) => {
        console.error('Connection error', err.stack);
        client.end();
    });
