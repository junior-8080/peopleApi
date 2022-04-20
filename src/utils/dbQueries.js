const { Pool } = require("pg");
const { dbConfigs } = require("./config");
const util = require("util");

let pool = new Pool({});

module.exports = {
  dbInit: () => {
    console.log("Initializing Postgres Database...");
    pool = new Pool(dbConfigs);

    pool.on("acquire", () => {
      console.log("[DB Connect] Pool client acquired");
    });
    pool.on("error", (err) => {
      console.error("[DB Error] Database pool error", err);
    });
    pool.on("remove", () => {
      console.log(
        "[DB Release] Connection released to pool",
        this.poolStatus()
      );
    });
  },
  poolStatus: () => {
    return {
      waiting: pool.waitingCount,
      idle: pool.idleCount,
    };
  },
  connect: () => {
    console.log("DB pool Status:",this.poolStatus());
    return new Promise((resolve, reject) => {
      let cnxStart = Date.now();
      console.debug("Connecting to the database server", {
        details: JSON.stringify(dbConfigs),
      });
      pool
        .connect()
        .then((client) => {
          let cnxDuration = Date.now() - cnxStart + " ms";
          console.log("Connection to database successful", {
            duration: cnxDuration,
          });
          console.log("[database: connect] Beginning Transaction...");
          client.query("BEGIN", (err) => {
            if (err) {
              console.error(
                "[database: connect] Error beginning transaction",
                JSON.stringify({ err })
              );
              this.abortTransaction(err, client, logKey);
            }
          });
          return resolve(client);
        })
        .catch((err) => {
          console.error("[database: connect] Error connecting to database");
          return reject(err);
        });
    });
  },
  abortTransaction: (err, client) => {
    if (err) {
      console.error("[DB Error] Error In Executing  Transaction");
      console.log("[DB] Rolling back transaction");
      client.query("ROLLBACK", (err) => {
        if (err) {
          console.log("[DB Error] Error rolling back transaction");
        }
        console.log("[BD] Client released to pool.");
      });
    }
  },
  commitAndRelease: function (client, logKey = null) {
    return new Promise((resolve, reject) => {
      let start = Date.now();
      client.query("COMMIT", (err) => {
        let duration = Date.now() - start + " ms";

        if (err) {
          console.error(
            "[database: commit] DB Error, Error committing transaction",
            { err, logKey }
          );
          return reject({ statusCode: 500, message: "Internal server Error" });
        }
        client.release();
        console.log("[database: commit] Transaction Commit Successfully", {
          logKey,
          duration,
        });
        return resolve();
      });
    });
  },
  rollbackAndRelease: (client, logKey = null) => {
    return new Promise((resolve, reject) => {
      client.query("ROLLBACK", (err) => {
        if (err) {
          console.error("Error rolling back transaction", JSON.stringify(err));
          return reject(err);
        } else {
          console.debug("Releasing client after rollback");
          client.release((err) => {
            console.debug("Client released to pool", JSON.stringify(err));
          });
          return resolve("done");
        }
      });
    });
  },
  retrieve: (client, sql, params) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      client
        .query(sql, params)
        .then((dbResponse) => {
          const duration = Date.now() - start;
          console.log(
            "[Query:retrieve] Executed Query :",
            JSON.stringify({ sql, params, duration })
          );
          return resolve({
            dbClient: client,
            rowCount: dbResponse.rowCount,
            data: dbResponse.rows,
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },
  retrieveOne: (client, sql, params) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      client
        .query(sql, params)
        .then((dbResponse) => {
          const duration = Date.now() - start;
          console.log(
            "[Query:retrieveOne] Executed Query :",
            JSON.stringify({ sql, params, duration })
          );
          return resolve({
            dbClient: client,
            rowCount: dbResponse.rowCount,
            data: dbResponse.rows[0],
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },
  create: (client, sql, params) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      client
        .query(sql, params)
        .then((dbResponse) => {
          const duration = Date.now() - start;
          console.log(
            "[Query:create] Executed Query :",
            JSON.stringify({ sql, params, duration })
          );
          return resolve({
            dbClient: client,
            rowCount: dbResponse.rowCount,
            data: dbResponse.rows[0],
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },
  update: (client, sql, params) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      client
        .query(sql, params)
        .then((dbResponse) => {
          const duration = Date.now() - start;
          console.log(
            "[Query:update] Executed Query :",
            JSON.stringify({ sql, params, duration })
          );
          return resolve({
            dbClient: client,
            rowCount: dbResponse.rowCount,
            data: dbResponse.rows[0],
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },
  sqlPaginate: (sql, pagination) => {
    const limit = pagination.pageSize < 1 ? maxPageSize : pagination.pageSize;
    const page = pagination.page < 1 ? 1 : pagination.page;
    const offset = (page - 1) * limit;
    return util.format("%s limit %d offset %d", sql, limit, offset);
  },
  sqlSort: (sort, sortFields, defaultField) => {
    let orderClause = null;
    let err = null;
    const sortField = sort.field || defaultField;
    const sortOrder = sort.order.toUpperCase() || "DESC";
    if (!sortFields[sortField]) {
      err = {
        statusCode: 401,
        message: "Invalid Parameters",
        data: {
          allowedValues: Object.keys(sortFields),
        },
      };
      return { err, orderClause };
    }
    if (sortOrder !== "ASC" || sortOrder !== "DESC") {
      err = {
        statusCode: 401,
        message: "Invalid Parameters",
        data: {
          allowedValues: ['ASC','DESC'],
        },
      };
      return { err, orderClause };
    }
    orderClause = util.format("order by %s %s",sortField,sortOrder);
    return {err,orderClause};

  },
};
