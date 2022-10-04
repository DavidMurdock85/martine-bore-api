const express = require('express'),
    router = express.Router();
const passport = require('passport');

// request to get delete a specific image
router.delete('/:imageId',
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');

      await db.query(`DELETE FROM images where id=${req.params.imageId}`);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;