const products = require("./products/products");
const mysql = require('mysql2/promise');
const { dbUser, dbPassword, dbName } = require("../envVars");

// Importing the mysql library to connect to a MySQL database
const main = async () => {
  const connection = await mysql.createConnection(`mysql://${dbUser}:${dbPassword}@0.0.0.0:3306/${dbName}`);

  // Get the list of products from the products object
  const productsList = products.products;

  // Log that we are about to insert products into the database
  console.log('Inserting products...');

  // Use Promise.all to concurrently insert all the products into the database
  await Promise.all(Object.keys(productsList).map(async (productRoute) => {
    // Get the product object for the current product route
    const product = productsList[productRoute];

    // Check if the product has a category
    if (product.category) {
      try {
        // Log that we are getting the category for this product
        console.log(`getting category for product ${productRoute}`);

        // Query the database for the category ID based on the category route
        const [rows] = await connection.query(`SELECT id FROM categories where route='${product.category}'`);

        // Get the first row of the result (there should only be one row)
        const category = rows[0];

        // Check that a category was found
        if (category !== undefined) {
          // Get the category ID
          const categoryId = category.id;

          // Insert the product into the database with its properties
          const [result] = await connection.query('INSERT INTO products SET ?', {
            categoryId: categoryId,
            route: productRoute,
            title: product.productTitle,
            period: product.period,
            date: product.date,
            origin: product.origin,
            maker: product.maker,
            medium: product.medium,
            description: product.description,
            dimensions: product.dimensions,
            productCondition: product.productCondition,
            price: product.price
          });

          // Get the ID of the newly inserted product
          const productId = result.insertId;

          // Log that we are about to insert images for this product
          console.log(`inserting images for product: ${productId}`);

          // Use Promise.all to concurrently insert all the images for this product
          return await Promise.all(product.images.map(async (image) => {
            return await connection.query('INSERT INTO images SET ?', {
              productId,
              original: image.original,
              thumbnail: image.thumbnail
            });
          }));
        }
      } catch (err) {
        // Log any errors that occurred during the insertion process
        console.log(err);
      }
    } else {
      // Log that this product had no category
      console.log(`product had no category: ${productRoute}`);
    }
  }));

  // Log that we are done inserting products and exiting the program
  console.log('Done. Exiting.');
  process.exit(1);
}

// Call the main function to start the program
main();