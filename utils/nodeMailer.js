const nodemailer = require("nodemailer");

const { NODE_MAILER_ID, NODE_MAILER_PASSWORD } = require('../config');

const sendMail = async (sender, receivers, roomLink, groupId) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.naver.com",
    port: 587,
    secure: false,
    service: 'Naver',
    auth: {
      user: NODE_MAILER_ID,
      pass: NODE_MAILER_PASSWORD
    }
  });

  const link = `https://localhost:3000/rooms/${roomLink}?`;

  const mailOptions = {
    from: NODE_MAILER_ID,
    to: 'nofacetime2020@gmail.com',
    subject: 'TEST MAIL',
    text: 'SUCCESS?!',
    html: `<p>아래 초대 링크를 클릭하시면 No Face Time으로 이동합니다!</p>
          <a href=https://localhost:3000/rooms/8bfddbbf-056e-4813-ae71-819d9f94cfe5>이동하기</a>  `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  });
};

sendMail().catch(console.error);

module.exports = sendMail;
