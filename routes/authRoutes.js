const { getUser, generateAccessToken, hash } = require('../services/tokenService');

const express = require('express'),
    router = express.Router();

router.post('/token', async (req, res, next) => {
  try {
    const db = req.app.get('db');

    const { username, password } = req.body;

    const user = await getUser(db, username, password);

    if(user) {
      const token = await generateAccessToken(user);

      res.send({ accessToken: token, user: { id: user.id }});
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;
