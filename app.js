const express = require('express');
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')
const cors = require('cors')


const app = express();
const port = 3001;

const user = require('./routes/userRoute');
const people = require('./routes/peopleRoute')
const message = require('./routes/messageRoute')


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors())
app.use(cookieParser())

app.use('/api', user);
app.use('/api', people);
app.use('/api',message);


app.listen(port, () => console.log(`app is running on port ${port}`));