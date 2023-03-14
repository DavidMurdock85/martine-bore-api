// Import the Nodemailer library
const Nodemailer = require("nodemailer");

// Define the send function that accepts email data and sends an email
const send = async (emailData) => {

  // Create a new transporter object to send emails
  const transporter = Nodemailer.createTransport({
    pool: true, // Enable the use of a single SMTP connection
    host: process.env.SMTP_HOST, // SMTP server hostname
    port: process.env.SMTP_PORT, // SMTP server port number
    secure: true, // Use a secure connection
    auth: {
      user: process.env.SMTP_USER, // SMTP account username
      pass: process.env.SMTP_PASSWORD // SMTP account password
    },
  });

  // Send the email using the transporter object
  await transporter.sendMail({
    bcc: emailData.bcc, // Blind carbon copy recipients
    cc: emailData.cc, // Carbon copy recipients
    from: emailData.from, // Email sender address
    html: emailData.body, // HTML content of the email
    subject: emailData.subject, // Email subject line
    to: emailData.to, // Email recipient(s) address(es)
  });

  return null; // Return null when the email is successfully sent
}

// Export the send function so it can be used in other modules
module.exports = {
  send
}