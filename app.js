const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const app = express();

app.use(helmet());

const users = require('./routes/users');
const cars = require('./routes/car');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/apiproject', { useNewUrlParser: true, useUnifiedTopology: true });

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', users);
app.use('/cars', cars);

// Catch 404 Errors And Forward To Error Handler Function
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handler Function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    // Respond To Client
    res.status(status).json({
        error: {
            message: error.message
        }
    });

    // Respond To Ourself
    console.log(err);
});

// Start The Server
const port = app.get('port') || 3000;
app.listen(port, () => console.log('Server is listening on port '  + port));