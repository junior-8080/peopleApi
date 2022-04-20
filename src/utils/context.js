const { error } = require("./api");
const { connect } = require("./dbQueries");
const { verifyToken } = require("./helpers");

module.exports = {
  authorization: (req, res, next) => {
    // check for x-access-token.
    // validate it.
    // get a dbClient from pool.
    let token = "x-access";
    if (req) {
      req.context = {};
    } else {
      req = {};
      req.context = {};
    }
    verifyToken(token)
      .then((data) => {
        req.user = {
          accountId: data.accountId,
          email: data.email,
          userId: data.userId,
        };
        next();
      })
      .catch((err) => {
        return error(req.context.dbClient, res, err);
      });
  },
  getDbClient: (req, res, next) => {
    if(!req.context){
        req.context = {}
    }
    connect().then((client) => {
        req.context.dbClient = client;
        client.query('BEGIN').then(result => {
            if(result.command === 'BEGIN'){
                console.log('Transaction Begin..')
            }
        })
        next()
    });
  },
};
