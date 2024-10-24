import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter; // Declare transporter as a class property
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(payload: { email: string; message: string; subject: string }) {
    this.logger.log(
      `Payload received for sending mail: ${JSON.stringify(payload)}`,
    );
    const mailOptions = {
      from: process.env.EMAIL, // Ensure this variable is correctly defined
      to: payload.email,
      subject: payload.subject,
      text: payload.message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email sent to ${payload.email} with subject: ${payload.subject}`,
      );
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}
