const Nodemailer = require("nodemailer");

/**
 * Service for sending out emails.
 */

const send  = async (emailData) => {
  const transporter = Nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST, // "smtp.example.com",
    port: process.env.SMTP_PORT, // 465,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER, // "username",
      pass: process.env.SMTP_PASSWORD //"password",
    },
  });

  await transporter.sendMail({
    bcc: emailData.bcc,
    cc: emailData.cc,
    from: emailData.from,
    html: emailData.body,
    subject: emailData.subject,
    to: emailData.to,
  });

  return null;
}

module.exports ={
  send
}

