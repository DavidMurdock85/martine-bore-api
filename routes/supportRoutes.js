// Import necessary modules and services
const { send } = require("../services/directEmailService");
const { render } = require("../services/templateService");
const express = require('express'),
  router = express.Router();

// Handle POST request to /contact endpoint
router.post('/contact', async (req, res, next) => {

  // Extract data from the request body
  const requestSupportRepresentation = req.body;

  // Construct name of the sender
  const name = requestSupportRepresentation.firstName || requestSupportRepresentation.lastName ?
    requestSupportRepresentation.firstName + " " + requestSupportRepresentation.lastName :
    "Anonymous";
       
  try {
    // Send email using data from the request
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

    // Send response back to the client
    res.send(requestSupportRepresentation);

  } catch (err) {
    // Pass any errors to the next middleware
    next(err);
  }
});

// Export the router
module.exports = router;
