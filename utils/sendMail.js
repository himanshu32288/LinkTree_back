import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.AUTH_API);

export const sendEmail = ({ to, from, subject, text, html }) => {
  const msg = { to, from, subject, text, html };
  return sendgrid.send(msg); //return promise that we can use later on
};
