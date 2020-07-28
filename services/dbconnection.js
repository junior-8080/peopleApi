const {Client,Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'people',
    password: 'abdul',
    port: 5432
})
module.exports  = pool