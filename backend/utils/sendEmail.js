import nodemailer from 'nodemailer'

async function sendEmail(msg,userEmail, route){
      const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, 
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDERMAIL,
      to: userEmail,
      subject: "Verify your email",
      text: `${msg}: ${process.env.BASE_URL}/${route}`,
    };

    // send success status to user
    await transporter.sendMail(mailOption);
}
export default sendEmail