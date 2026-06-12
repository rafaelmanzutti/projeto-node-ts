import nodemailer from 'nodemailer';

export class SendEmailUtils {
  public static async sendEmail(email: string, secret: number): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      //host: process.env.EMAIL_HOST,
      //port: Number(process.env.EMAIL_PORT),
      //secure: false,
      auth: {
        user: process.env.SEND_EMAIL_USER,
        pass: process.env.SEND_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SEND_EMAIL_USER,
      to: email,
      subject: 'Código de recuperação de senha',
      text: `Seu código de recuperação de senha é: ${secret}`,
    };

    await transporter.sendMail(mailOptions);
  }
  //smtp.gmail.com
}
