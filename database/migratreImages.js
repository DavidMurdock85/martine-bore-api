var mysql = require("mysql");
var products = require("../api/products");
var connection = mysql.createConnection('mysql://root:password@localhost:3306/martine?debug=true&timezone=-0700');

connection.connect(function (err) {
  if (err) throw err;

  Object.values(image.images).map((images) => {

    connection.query(`SELECT id FROM categories where route=${product.image}`, function (err, result, fields) {
      if (err) throw err;

      const categoryId = result;

      connection.query('INSERT INTO products SET ?', { original: product.images[original], thumbnail: product.images[thumbnail], categoryId }, function (error, results, fields) {
        if (error) throw error;

      });

      process.exit(1);
    });
  });
});
