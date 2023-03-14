// Import the necessary functions from the tokenService module
const { getUser, generateAccessToken } = require('../services/tokenService');

// Import the Express framework and create a new router object
const express = require('express');
const router = express.Router();

// Define a route to handle token requests
router.post('/token', async (req, res, next) => {
  try {
    // Get the database connection from the app object
    const db = req.app.get('db');

    // Get the username and password from the request body
    const { username, password } = req.body;

    // Call the getUser function to check if the user exists in the database and their password is correct
    const user = await getUser(db, username, password);

    // If a user is found, generate an access token and send it back with the user ID
    if (user) {
      const token = await generateAccessToken(user);
      res.send({ ...token, user: { id: user.id } });
    } else {
      // If no user is found or their password is incorrect, send a 403 forbidden response
      res.sendStatus(403);
    }
  } catch (err) {
    // If an error occurs, pass it on to the error handling middleware
    next(err);
  }
});

module.exports = router;
