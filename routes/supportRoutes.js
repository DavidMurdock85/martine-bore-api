const { send } = require("../services/directEmailService");
const { render } = require("../services/templateService");
const express = require('express'),
  router = express.Router();

//

router.post('/contact', async (req, res, next) => {

  //
  const requestSupportRepresentation = req.body;

  //
  const name = requestSupportRepresentation.firstName || requestSupportRepresentation.lastName ?
    requestSupportRepresentation.firstName + " " + requestSupportRepresentation.lastName :
    "Anonymous";

  //           
  try {
    send({
      body: render("contact", {
        name: name,
        body: requestSupportRepresentation.body,
        email: requestSupportRepresentation.email,
        date: new Date().toISOString(),
      }),
      from: process.env.SMTP_USER,
      subject: `Contact request from: ${name}`,
      to: process.env.EMAIL_MARTINE,
    });

    //
    res.send(requestSupportRepresentation);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
