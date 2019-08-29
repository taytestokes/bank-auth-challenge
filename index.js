require('dotenv').config();
const express = require('express');
const cors = require('cors');
const massive = require('massive');
const session = require('express-session');

// Controllers
const authCtrl = require('./controllers/auth_controller');
const accountCtrl = require('./controllers/account_controller');

// Middleware Functions
const authMiddleware = require('./middleware/auth_middleware');

// ENV Variables
const {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env;

// App Instance
const app = express();

// TLM 
app.use(express.json());
app.use(cors());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 60000
    }
}));

// Database Connection
massive(CONNECTION_STRING)
    .then(dbInstance => {
        app.set('db', dbInstance);
        console.log('Database Connected 🚀');
    })
    .catch(error => {
        console.log(error);
    });

// End Points
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

/*
*
* Use the middleware as request level to make sure user exisrs before moving on
*
*/

app.get('/account/checkBalance', accountCtrl.checkBalance);

app.post('/account/depositChecking', accountCtrl.depositChecking);
app.post('/account/depositSavings', accountCtrl.depositSavings);

app.post('/account/withdrawChecking', accountCtrl.withdrawChecking);
app.post('/account/withdrawSavings', accountCtrl.withdrawSavings);

// Black Diamond
app.put('/account/transferFunds', accountCtrl.transfer);


// App Listening
app.listen(SERVER_PORT, () => console.log('Server Running! 🦄'));