
// require mysql
var mysql = require('mysql');

// create a connection object
var connection = mysql.createConnection('mysql://root:password@localhost:3306/martine?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');

// establish a connection mysql database martine
connection.connect()

// require express
const express = require('express');

// set the value of calling the express function "app" to express
const app = express();

// require CORS
var cors = require('cors')

// use CORS
app.use(cors())

// get categories
app.get('/categories', (req, res) => {

    connection.query("SELECT * FROM categories", function (err, result) {
        if (err) throw err;

        // return categories
        res.send(result);
    });
});

// note categories start at 2 for testing purposes

//get categoryRoute
app.get('/categories/:categoryRoute', (req, res) => {

    // select everything from categories
    connection.query(`SELECT * FROM categories where route='${req.params.categoryRoute}'`, function (err, result) {
        if (err) throw err;

        // return categoryId
        res.send(result[0]);
    });
});

//get all products from a specific categoryId from a specific url
app.get('/categories/:categoryId/products', (req, res) => {

    // select everything from products where categoryId = categoryId
    connection.query(`SELECT * FROM products where categoryId=${req.params.categoryId}`, function (err, products) {
        if (err) throw err;

        //const productResponse = products

        console.log('1')

        products.map(product => {

            console.log('2')

            connection.query(`SELECT * FROM images where productId=${product.id}`, function (err, images) {
                if (err) throw err;

                console.log('3')

                product.images = images

            });
        }); 

        console.log('4')

        res.send(products);

    });
});

//request to get product object from database and then get images for that product using its id
app.get('/products/:productRoute', (req, res) => {

    // select everything from products where id = productId
    connection.query(`SELECT * FROM products where route='${req.params.productRoute}'`, function (err, result) {
        if (err) throw err;

        //console.log(result)

        const product = result[0]

        //console.log(product)

        //get images from the the product objects id 
        connection.query(`SELECT * FROM images where productId=${product.id}`, function (err, imageResult) {
            if (err) throw err;

            //console.log(imageResult)

            res.send({ ...product, images: imageResult });
        });
    });
});

app.get('/products/:productId/images', (req, res) => {

    // select everything from categories
    connection.query(`SELECT * FROM images where productId=${req.params.productId}`, function (err, result) {
        if (err) throw err;

        // return products
        res.send(result);
    });
});

const PORT = process.env.PORT || 3001;

// listen on port 3000
app.listen(PORT, () => console.log('express server started'));

