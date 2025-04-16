import pgk from 'pg';
const {Pool} = pgk;

const pool = new Pool( {
    user: 'postgres',
    host: 'localhost',
    database: 'messenger_db',
    password: 'root',
    port: 5432,
    max: 20,
});

export default pool;