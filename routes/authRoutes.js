const { getUser, generateAccessToken, hash } = require('../services/tokenService');

const express = require('express'),
    router = express.Router();

const crypt = require('bcrypt');

router.post('/token', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    const { username, password } = req.body;

    const user = await getUser(db, username, password);

    if(user) {
      const token = generateAccessToken(user);

      console.log(token);

      res.send(token);
    }

    res.sendStatus(403);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
