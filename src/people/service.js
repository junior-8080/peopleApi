const {
  sqlSort,
  sqlPaginate,
  retrieve,
  create,
  update,
} = require("../utils/dbQueries");
const { prettifyInvalidParams } = require("../utils/helpers");
const { personSchema } = require("./schema");
const util = require("util");

const fetchPersons = (context, payload) => {
  return new Promise((resolve, reject) => {
    const pagination = payload.pagination;
    const sort = payload.sort;
    const sortFields = {
      name: "name",
      phonenumber: "msisdn",
      country: "country",
      gender: "gender",
      creationDate: "posted_ts",
    };
    let sql = `select persons.id,persons.name,persons.email,persons.msisdn,persons.gender,persons.title,persons.city,persons.country,persons.occupation,persons.posted_ts as creationDate,
        account_persons.account_id, account_persons.person_id on persons.id = account_persons.persons_id where persons.status = 'A' and account_persons.account_id = $1`;
    let sqlCountPersons = `select count(*) as total from persons`;
    const orderStatement = sqlSort(sort, sortFields, "name");
    if (orderStatement.err) {
      return reject(err);
    }
    const params = [payload.data.accountId];
    sql = sql + orderStatement.orderClause;
    sql = sqlPaginate(sql, pagination);

    const listPersons = retrieve(context.dbClient, sql, params);
    const countAllPersons = retrieve(context.dbClient, sqlCountPersons);
    Promise.all([listPersons, countAllPersons]).then((result) => {
      const persons = result[0].data;
      const personsCount = result[1].data.total;
      return resolve({
        statusCode: 200,
        message: "SUCCESS",
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          numberOfPage: Math.ceil(personsCount / pagination.pageSize),
        },
        data: {
          count: persons.count,
          total: personsCount,
          data: persons,
        },
      });
    });
  });
};

const fetchPerson = (context, payload) => {
  return new Promise((resolve, reject) => {
    let sql = `select persons.id,persons.name,persons.email,persons.msisdn,persons.gender,persons.title,persons.city,persons.country,persons.occupation,persons.posted_ts as creationDate,
        account_persons.account_id, account_persons.person_id on persons.id = account_persons.persons_id where persons.status = 'A' and account_persons.persons = $1 and account_persons.account_id = $2`;
    let params = [payload.personId, payload.accountId];
    retrieve(context.dbClient, sql, params).then((result) => {
      const persons = result.data[0];
      return resolve({
        statusCode: 200,
        message: "SUCCESS",
        data: persons,
      });
    });
  });
};

const addPersonDetails = (context, payload) => {
  return new Promise((resolve, reject) => {
    const validate = personSchema.validate(context, payload);
    if (validate.error) {
      const prettyFormat = prettifyInvalidParams(validate.error);
      return reject({
        statusCode: 401,
        message: "INVALID PARAMETERS",
        data: prettyFormat,
      });
    }
    const sql = `insert into persons(id,name,email,msisdn,gender,title,city,country,occupation) values(uuid_generate_v4(),$1,$2,$3,$4,$5,$6,$7,$8) returning id as personId,name,email,msisdn as phonenumber`;
    const params = [
      payload.name,
      payload.email,
      payload.phonenumber,
      payload.gender || "",
      payload.title || "",
      payload.city || "",
      payload.country || "",
      payload.occupation || "",
    ];
    create(context.dbClient, sql, params).then((result) => {
      const person = result.data[0];
      return resolve(person);
    });
  });
};

const addPerson = (context, payload) => {
  return new Promise((resolve, reject) => {
    addPersonDetails(context, payload)
      .then((personDetails) => {
        const personId = personDetails.personId;
        const sql = `insert into account_persons(person_id,account_id) values($1,$2)`;
        const params = [personId, payload.accountId];
        return create(context.dbClient, sql, params);
      })
      .then((result) => {
        return resolve({
          statusCode: 201,
          message: "RESOURCE CREATED",
          data: personDetails,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editPerson = (context, payload) => {
  const fields = {
    name: "name",
    email: "email",
    phonenumber: "msisdn",
    gender: "gender",
    city: "city",
    country: "country",
    occupation: "occupation",
  };
  const validate = personSchema.validate(context, payload);
  if (validate.error) {
    const prettyFormat = prettifyInvalidParams(validate.error);
    return reject({
      statusCode: 401,
      message: "INVALID PARAMETERS",
      data: prettyFormat,
    });
  }
  const sql = `update persons set `;
  const updateFields = Object.keys(payload);
  const index = 1;
  const params = [];
  updateFields.map((field) => {
    if (fields[field]) {
      sql = sql + `${fields[field]} =${index},`;
      params.push(payload[field]);
    }
  });
  sql = sql.slice(0, -1);
  params.push(payload.personId);
  sql = sql + `where id = $${params.length} returning *`;
  update(context.dbClient, sql, params)
    .then((personDetails) => {
      return resolve({
        statusCode: 201,
        message: "RESOURCE CREATED",
        data: personDetails,
      });
    })
    .catch((err) => {
      return reject(err);
    });
};

const removePerson = (context, payload) => {
  return new Promise((resolve, reject) => {
    const sql = `update persons set status = 'D' where id = $1 returning *`;
    const params = [payload.personId];
    update(context.dbClient, sql, params)
      .then((result) => {
        return resolve({
          statusCode: 201,
          message: "RESOURCE DELETED",
          data: result.data[0],
        });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
module.exports = {
  fetchPersons,
  fetchPerson,
  addPerson,
  editPerson,
  removePerson,
};
