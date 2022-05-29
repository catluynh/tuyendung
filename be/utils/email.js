const nodemailer = require('nodemailer');
const guiEmail = async (options) => {
  // 1. Create a transporter
  let transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
   secure: true
  });
  // 2. Define the email option
  const mailOptions = {
    from: 'QTV Support <qtv.support@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };
  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = guiEmail;
