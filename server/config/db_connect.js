import pgk from 'pg';
const {Pool} = pgk;

const pool = new Pool( {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'messenger_db',
    password: process.env.DB_PASSWORD || 'root',
    port: parseInt(process.env.DB_PORT) || 5432,
    max: parseInt(process.env.DB_POOL_MAX) || 20, // Максимальное количество соединений
    idleTimeoutMillis: 30000, // Закрыть соединение после 30 сек неактивности
    connectionTimeoutMillis: 5000, // Ошибка, если подключение дольше 5 сек
    allowExitOnIdle: true, // Разрешить завершение процесса, когда соединения простаивают
});

export default pool;