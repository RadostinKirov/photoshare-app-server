const hbs = require('express-handlebars');
const express = require('express');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');

const authMiddleware = require('../middlewares/auth');
const storageMiddleware = require('../middlewares/storage');
const bodyParser = require('body-parser');

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: 'hbs',
    }));
    
    app.set('view engine', 'hbs');
    app.use('/static', express.static('static'));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(storageMiddleware());
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Credentials', true)
            .append('Access-Control-Allow-Headers', '*')
            .append('Access-Control-Allow-Headers', 'content-type')

        next();
    });

    app.use((req, res, next) => {
        console.log('>>>', req.method);

        if (req.user) {
            console.log('Known user', req.user.username);
        }
        next();
    });

    //TODO add storage and middlewares
}