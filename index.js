

const express = require('express');
const mysql = require('mysql2');
const fileUpload = require('express-fileupload');
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

    // require CORS
    const cors = require('cors')

    // use CORS
    app.use(cors());
    app.use(express.json());
    app.use(fileUpload());

    app.use('/categories', require('./categoryRoutes'));
    app.use('/products', require('./productRoutes'));
    // app.use('/admin', require('./adminRoutes'));


    const PORT = process.env.PORT || 3001;

    // listen on port 3000
    app.listen(PORT, () => console.log('express server started'));
}

main();