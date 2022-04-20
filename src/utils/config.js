require("dotenv").config()
module.exports = {
  dbConfig: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  },
  jwtSecret: "jwt-tokenz",
  defaultPageSize:100,
  appPort: process.env.APP_PORT,

};
