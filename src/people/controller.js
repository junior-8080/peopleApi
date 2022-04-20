const { success, error } = require("../utils/api");
const {
  prettifyInvalidParams,
  getPagination,
  getSortParams,
  retrieveReqParams,
} = require("../utils/helpers");
const service = require('./service');


const fetchPersons = (req, res) => {
  const context = req.context;
  const payload = {
    params: getPagination(req),
    sort: getSortParams(req),
  };
  service
    .fetchPersons(context, payload)
    .then((result) => {
      return success(context.dbClient, res, data);
    })
    .catch((err) => {
      error(context.dbClient, res, err);
    });
};

const fetchPerson = (req, res) => {
  const context = req.context;
  const payload = {
    params: getPagination(req),
    sort: getSortParams(req),
  };
  service
    .fetchPerson(context, payload)
    .then((result) => {
      return success(context.dbClient, res, data);
    })
    .catch((err) => {
      error(context.dbClient, res, err);
    });
};

const addPerson = (req, res) => {
  const body = req.body;
  const payload = body;
  const context = req.context;
  service
    .addPerson(context, payload)
    .then((result) => {
      return success(req.dbClient, res, result);
    })
    .catch((err) => {
      return error(context.dbClient, res, err);
    });
};

const editPersonDetails = (req, res) => {
  const body = req.body;
  const payload = body;
  const context = req.context;
  const validate = personSchema.validate(payload);
  if (validate.error) {
    const prettyFormat = prettifyInvalidParams(validate.error);
    const data = {
      statusCode: 401,
      message: "Invalid Parameters",
      data: prettyFormat,
    };
    return success(context.dbClient, res, data);
  }
  service
    .updatePerson(context, payload)
    .then((result) => {
      return success(req.dbClient, res, result);
    })
    .catch((err) => {
      return error(context.dbClient, res, err);
    });
};

const removePerson = (req, res) => {
  const context = req.context;
  const personId = retrieveReqParams(req,'personId');
  const payload = {
    personId
  }
  service.removePerson(context,payload).then(result => {
    success(context.dbClient,res,result);
  }).catch(err => {
    error(context.dbClient,res,err);
  })
};

module.exports = {
  fetchPerson,
  fetchPersons,
  addPerson,
  editPersonDetails,
  removePerson,
};
