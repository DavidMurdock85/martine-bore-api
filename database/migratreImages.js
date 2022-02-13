var mysql = require("mysql");
var products = require("../api/products");
var connection = mysql.createConnection('mysql://root:password@localhost:3306/martine?debug=true&timezone=-0700');

console.log(images);

connection.connect(function (err) {
  if (err) throw err;
  //console.log(categories.categories);
  
  // for image in images
   Object.values(image.images).map((images) => {
    //console.log(`${index} : ${categoryId}`);
    
    connection.query(`SELECT id FROM categories where route=${product.image}`, function (err, result, fields) {
      if (err) throw err;
      
      const categoryId = result;
      
      // query to access products
      connection.query('INSERT INTO products SET ?', { original: product.images[original], thumbnail: product.images[thumbnail], categoryId }, function (error, results, fields) {
        if (error) throw error;
        //console.log(results.insertId);
      });
      console.log(result);
      process.exit(1);
    });
  });
});
