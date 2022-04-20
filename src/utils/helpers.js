const jwt = require("jsonwebtoken");
const { jwtSecret,defaultPageSize } = require("./config");

module.exports = {
  verifyToken: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          return reject({
            statusCode: 401,
            message: "Token Expired",
          });
        }
        return resolve(decoded);
      });
    });
  },
  getPagination: (req) => {
    return {
      page: parseInt(this.retrieveReqParams(req, "page")) || 1,
      pageSize:parseInt(this.retrieveReqParams(req, "pageSize")) || defaultPageSize,
    };
  },
  getSortParams: (req) => {
    return {
      order: this.retrieveReqParams(req, "order") || "DESC",
      field: this.retrieveReqParams(req, "sort"),
    };
  },
  retrieveReqParams: (req, field) => {
    return req.query[field] || req.params[field];
  },
  prettifyInvalidParams: (errors) =>  {
        const formattedErrors = errors.map((error) => {
        return {fieldError: error.context.label, message: error.message, value: error.context.value}
     })
     return formattedErrors;
  }
};
