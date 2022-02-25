const express = require('express'),
    router = express.Router();
const passport = require('passport');

// GET @ /categories
router.get('/', async (req, res, next) => {
  const db = req.app.get('db');

  try {
      const [categories] = await db.query("SELECT * FROM categories");

      // return categories
      res.send(categories);
  } catch(err) {
      next(err);
  }
});

// note categories start at 2 for testing purposes

// GET @ /categories/:categoryRoute
router.get('/:categoryRoute', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    // select a single category by route
    const [rows] = await db.query(`SELECT * FROM categories where route='${req.params.categoryRoute}'`);

    // return categoryId
    res.send(rows[0]);
  } catch (err) {
    next(err);
  }
});

//get all products from a specific categoryId from a specific url
router.get('/:categoryId/products', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    // select everything from products where categoryId = categoryId
    const [results] = await db.query(`SELECT * FROM products where categoryId=${req.params.categoryId}`);

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

// TODO requires auth
router.post('/:categoryId/products',
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');

      // create route from title
      const route = req.body.title.replace(/\s+/g, '-').toLowerCase();

      // assemble newListing for entry to db
      const newListing = {
        ...req.body,
        route,
        categoryId: req.params.categoryId
      };

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


module.exports = router;