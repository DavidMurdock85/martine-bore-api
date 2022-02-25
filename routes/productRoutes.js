const express = require('express'),
    router = express.Router();

const passport = require('passport');

const fs = require('fs').promises;

//request to get product object from database and then get images for that product using its id
router.get('/:productRoute', async (req, res, next) => {
  try {
    const db = req.app.get('db');
    // select everything from products where id = productId
    const [rows] = await db.query(`SELECT * FROM products where route='${req.params.productRoute}'`);

    const product = rows[0];

    //get images from the the product objects id
    const [images] =  await db.query(`SELECT * FROM images where productId=${product.id} order by id`);

    res.send({ ...product, images });
  } catch (err) {
    next(err);
  }
});

//request to get product object from database and then get images for that product using its id
router.delete('/:productId',
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');
      // select everything from products where id = productId
      const productId = req.params.productId;
      await db.query(`DELETE FROM images where productId=${productId}`);
      await db.query(`DELETE FROM products where id=${productId}`);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

//request to get product object from database and then get images for that product using its id
router.post('/:productId/images',
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');
      const productId = req.params.productId;
      const [rows] = await db.query(
        `SELECT pr.route as productRoute, ca.route as categoryRoute FROM products pr join categories ca on ca.id = pr.categoryId where pr.id='${productId}'`
      );
      const routes = rows[0];

      // create image on server (limit size?)
      const files = req.files;
      const imageResults = await Promise.all(Object.values(files).map(async (file, index) => {
        const imageName = `${routes.productRoute}-${index}.${file.name.split('.').pop()}`;
        const original = `/${routes.categoryRoute}/${imageName}`;

        await fs.writeFile(`${process.env.IMAGES_DIR}/${original}`, file.data);

        const image = {
          productId,
          original,
          thumbnail: original
        };

        const [result] =  await db.query("INSERT INTO images SET ?", image);

        return {
          ...image,
          id: result.insertId
        }
      }));

      // create image reference in db

      res.send(imageResults);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;