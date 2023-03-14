// Import required modules and packages
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Define a delete route for deleting an image
router.delete('/:imageId', 
  // Authenticate the user using JWT token
  passport.authenticate('jwt-bearer', { session: false }),
  async (req, res, next) => {
    try {
      const db = req.app.get('db');

      // Delete the image with the provided id from the database
      await db.query(`DELETE FROM images where id=${req.params.imageId}`);

      // Send success status code to the client
      res.sendStatus(204);
    } catch (err) {
      // Pass any errors to the next error handling middleware
      next(err);
    }
  }
);

// Export the router for use in other modules
module.exports = router;