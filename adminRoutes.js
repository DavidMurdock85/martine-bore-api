var express = require('express'),
    router = express.Router();

router.post('/listings', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    const newListing = req.body;

    const [result] = await db.query("INSERT INTO products SET ?", newListing);

    res.send({
      ...newListing,
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
