const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.setApiKey(
//   "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"
// );

export { sgMail };
