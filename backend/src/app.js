const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();


// log requests
app.use(morgan('tiny'));

app.use(cors({
    origin: ['http://localhost:3000', 'https://primetrade-ai-assignment-pi.vercel.app/'], // allow requests from this origin
    credentials: true, // allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// parse request to body parser 
app.use(bodyparser.urlencoded({ extended: true }))

app.use(cookieParser());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// load routers
app.use('/api/v1/users', require("./routes/user.routes"));
app.use('/api/v1/tasks', require("./routes/task.routes"));
app.use('/api/v1/admin', require("./routes/admin.routes"));

module.exports = app;