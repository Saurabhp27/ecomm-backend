const pkg = require("pg");

const { Pool } = pkg;

const pool = new Pool (
    {
        user: 'admin',
        host: 'postgres',
        database: 'ecommerce',
        password: "admin",
        port: 5432,
    }
)

module.exports = pool;