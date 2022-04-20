const { commitAndRelease, rollbackAndRelease } = require("./dbQueries");

module.exports = {
  success: (dbClient, res, data = {}) => {
    commitAndRelease(dbClient)
      .then((result) => {
        switch (data.statusCode) {
          case 200:
            return res.status(200).json(data);
          case 201:
            return res.status(201).json(data);
          case 400:
            return res.status(400).json(data);
          case 401:
            return res.status(401).json(data);
          case 403:
            return res.status(403).json(data);
          case 404:
            return res.status(404).json(data);
        }
      })
      .catch((err) => {
        return res.status(500).json({
          statusCode: 500,
          message: "Internal Server Error",
        });
      });
  },
  error: (dbClient, res, data = {}) => {
    if (dbClient) {
      rollbackAndRelease(dbClient).then((result) => {
        switch (result.statusCode) {
          case 401:
            return res.status(401).json(data);
          default:
            return res.status(500).json({
              statusCode: 500,
              message: "Internal Server Error",
              err,
            });
        }
      });
    }
    switch (result.statusCode) {
      case 401:
        return res.status(401).json(data);
      default:
        return res.status(500).json({
          statusCode: 500,
          message: "Internal Server Error",
          err,
        });
    }
  },
};
