const express = require('express'),
    router = express.Router();

const passport = require('passport');

//request to get product object from database and then get images for that product using its id
router.get('/:productRoute', async (req, res, next) => {
  try {
    const db = req.app.get('db');
    // select everything from products where id = productId
    const [rows] = await db.query(`SELECT * FROM products where route='${req.params.productRoute}'`);

    const product = rows[0];

    //get images from the the product objects id
    const [images] =  await db.query(`SELECT * FROM images where productId=${product.id}`);

    res.send({ ...product, images });
  } catch (err) {
    next(err);
  }
});

//request to get product object from database and then get images for that product using its id
router.post('/:productId/images',
  passport.authenticate('bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');

      // create image on server (limit size?)

      const original = "";

      const image = {
        productId: req.params.productId,
        original
      };

      // create image reference in db
      const [result] =  await db.query("INSERT INTO images SET ?", image);

      res.send({
        ...image,
        id: result.insertId
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;