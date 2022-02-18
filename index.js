

const express = require('express');
const mysql = require('mysql2');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const Strategy = require('passport-http-jwt-bearer').Strategy;

const { dbUser, dbPassword, dbName } = require("./envVars");


// set the value of calling the express function "app" to express
const app = express();

const main = async () => {
    // create a connection object
    const pool = mysql.createPool({
        host: "localhost",
        user: dbUser,
        password: dbPassword,
        database: dbName
    });

    app.set('db', await pool.promise());

    // passport
    passport.use(new Strategy(process.env.JWT_SECRET_FOR_ACCESS_TOKEN, (token, cb) => {
        return cb(null, { id: token.userId }, token);
    }));

    // require CORS
    const cors = require('cors');

    // use CORS
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload());
    app.use(passport.initialize());

    app.use('/auth', require('./routes/authRoutes'));
    app.use('/categories', require('./routes/categoryRoutes'));
    app.use('/products', require('./routes/productRoutes'));
    app.use('/images', require('./routes/imageRoutes'));
    app.use('/support', require('./routes/supportRoutes'));


    const PORT = process.env.PORT || 3001;

    // listen on port 3000
    app.listen(PORT, () => console.log('express server started'));
}

main();