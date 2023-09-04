
// require express and set router to express router?
const express = require('express'),
  router = express.Router();

// require passport
const passport = require('passport');
const fs = require('fs').promises;

// Route for getting incomplete products
router.get('/incomplete',

  // Use passport to authenticate user with jwt-bearer strategy
  passport.authenticate('jwt-bearer', { session: false }),

  async (req, res, next) => {

    try {
      // Get database connection from app
      const db = req.app.get('db');

      // Query the database for products that have null values for certain fields
      const [products] = await db.query('SELECT * FROM products where ' +
        'title is null OR ' +
        'description is null OR ' +
        'details is null OR ' +
        'period is null OR ' +
        'date is null OR ' +
        'origin is null OR ' +
        'maker is null OR ' +
        'medium is null OR ' +
        'dimensions is null OR ' +
        'productCondition is null OR ' +
        'price is null'
      );

      // Send the products that have incomplete data
      res.send(products);

    } catch (err) {
      next(err);
    }
  }
);

// Route for getting a single product by its route
router.get('/:productRoute', async (req, res, next) => {
  try {
    // Get database connection from app
    const db = req.app.get('db');

    // Query the database for the product with the given route
    const [rows] = await db.query(`SELECT * FROM products where route='${req.params.productRoute}'`);

    // Get the first product from the result set
    const product = rows[0];

    //get images from the the product objects id
    const [images] = await db.query(`SELECT * FROM images where productId=${product.id} order by original`);

    // Send the product and its images as a response
    res.send({ ...product, images });
  } catch (err) {
    next(err);
  }
});

// Route for updating a product by its ID
router.put('/:productId',
  // Use passport to authenticate user with jwt-bearer strategy
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      // Get database connection from app
      const db = req.app.get('db');

      // Get the updated product data from the request body
      const updateListing = req.body;

      // Update the product's route if the title has changed
      if (updateListing.title) {
        updateListing.route = updateListing.title.replace(/\s+/g, '-').toLowerCase();
      }

      // Query the database to update the product
      const query = `UPDATE products SET ? where id=${req.params.productId}`;
      await db.query(query, updateListing);

      // Send the updated product as a response
      res.send(updateListing);
    } catch (err) {
      next(err);
    }
  }
);

// This route handles the deletion of a product and all its associated images
router.delete('/:productId',

  // This middleware authenticates the user using the jwt-bearer strategy and disables session support
  passport.authenticate('jwt-bearer', { session: false }),

  // This is the route handler function
  async (req, res, next) => {
    try {
      const db = req.app.get('db'); // Get the database connection from the app's configuration

      const productId = req.params.productId; // Get the product ID from the request's parameters

      // Delete all images associated with the product
      await db.query(`DELETE FROM images where productId=${productId}`);

      // Delete the product
      await db.query(`DELETE FROM products where id=${productId}`);

      // Send a "No Content" response to indicate success
      res.sendStatus(204);
    } catch (err) {
      // Pass any errors to the next middleware
      next(err);
    }
  }
);

// Handles HTTP POST requests to upload product images
router.post('/:productId/images',

  // Authenticates the user using a JWT token
  passport.authenticate('jwt-bearer', { session: false }),

  // Middleware function that handles the request
  async (req, res, next) => {

    try {

      // Get a reference to the database object
      const db = req.app.get('db');

      // Get the product ID from the request parameters
      const productId = req.params.productId;

      // Get the product and category routes from the database
      const [rows] = await db.query(
        `SELECT pr.route as productRoute, ca.route as categoryRoute FROM products pr join categories ca on ca.id = pr.categoryId where pr.id='${productId}'`
      );

      // Extract the product and category routes from the query result
      const routes = rows[0];

      // Get the uploaded image files from the request
      const files = req.files;

      // Process each uploaded file in parallel using Promise.all()
      const imageResults = await Promise.all(Object.values(files).map(async (file, index) => {

        // Generate the image file name and path
        const imageName = `${routes.productRoute}-${index}.${file.name.split('.').pop()}`;
        const original = `${routes.categoryRoute}/${imageName}`;

        // Write the image file to disk
        await fs.writeFile(`${process.env.IMAGES_DIR}/${original}`, file.data);

        // Create a new image object to store in the database
        const image = {
          productId,
          original,
          thumbnail: original
        };

        // Insert the new image into the database
        const [result] = await db.query("INSERT INTO images SET ?", image);

        // Return the image object with the ID assigned by the database
        return {
          ...image,
          id: result.insertId
        }
      }));

      // Send the uploaded image information back to the client
      res.send(imageResults);
    } catch (err) {
      // Pass any errors to the error handling middleware
      next(err);
    }
  }
);

// Export the router object for use by the application
module.exports = router;