import mysql from 'mysql/promise';
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '13434000Ac_',
    database: 'clinicaVSC_db',
    waitForConnection: 'true',
    connectionLimit: '10',
});

export default pool;

