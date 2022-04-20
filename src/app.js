const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authorization, getDbClient } = require('./utils/context');
const { appPort } = require('./utils/config');
const people = require('./people/router');
const { dbInit } = require('./utils/dbQueries');
const app = express();
const port = appPort;

// initialize DB.
dbInit()
// middleware.
app.use(cors());
app.use(getDbClient);
app.use(bodyParser.json());
app.use(morgan('combined'));

// routes.
app.use('/v1/api', people);

app.listen(port, () => console.log(`app is running on port ${port}`));