const sendgrid = require("@sendgrid/mail");
require("dotenv").config();
sendgrid.setApiKey(process.env.MAIL_API);
const sendMail = ({ to, from, subject, text, html }) => {
  const msg = { to, from, subject, text, html };
  return sendgrid.send(msg); //return promise that we can use later on
};

exports.sendMail = sendMail;
