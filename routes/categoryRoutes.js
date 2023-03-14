// Importing necessary packages and dependencies
const express = require('express'),
  router = express.Router();
const passport = require('passport');

// Route to get all categories
router.get('/', async (req, res, next) => {
  const db = req.app.get('db');

  try {
    const [categories] = await db.query("SELECT * FROM categories");

    res.send(categories);
  } catch (err) {
    next(err);
  }
});

// Route to get a specific category by route
router.get('/:categoryRoute', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    // Retrieve the category matching the provided route
    const [rows] = await db.query(`SELECT * FROM categories where route='${req.params.categoryRoute}'`);

    res.send(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Route to get all products in a specific category
router.get('/:categoryId/products', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    // Retrieve all products in the provided category
    const [results] = await db.query(`SELECT * FROM products where categoryId=${req.params.categoryId}`);

    // For each product, retrieve its associated images and add them to the product object
    const products = await Promise.all(results.map(async product => {
      try {
        const [images] = await db.query(`SELECT * FROM images where productId=${product.id} order by id`);
        product.images = images;
        return product;
      } catch (err) {
        console.log(err);
      }
    }));
    res.send(products);
  } catch (err) {
    next(err);
  }
});

// Route to create a new product listing in a specific category
router.post('/:categoryId/products',
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');

      // Generate a URL-friendly product route based on the product title
      const route = req.body.title.replace(/\s+/g, '-').toLowerCase();

      // Create a new listing object with the provided data and the generated route
      const newListing = {
        ...req.body,
        route,
        categoryId: req.params.categoryId
      };

      // Insert the new listing into the database and return the inserted row's ID
      const [result] = await db.query("INSERT INTO products SET ?", newListing);

      res.send({
        ...newListing,
        id: result.insertId,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Export the router for use in other files
module.exports = router;