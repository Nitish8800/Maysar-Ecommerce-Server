import nodemailer from "nodemailer";
import { env } from "../config/env.config";
import { IEmailOptions } from "../types/common.types";
import { logger } from "../utils/logger.util";
import { getOTPEmailTemplate } from "../emails/templates";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: env.SMTP_SERVICE,
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure:  process.env.SMTP_PORT === '465',
      auth: env.SMTP_USER
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
    });
  }

  public async sendEmail(options: IEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      if (env.NODE_ENV === "development" && (!env.SMTP_USER || env.SMTP_HOST.includes("mailtrap"))) {
        logger.info(`[Email Service Simulation] Sent email to ${options.to} with subject "${options.subject}"`);
      }

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`[Email Service] Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(`[Email Service Error] Failed to send email to ${options.to}`, error);
      // In dev environment or unconfigured SMTP, do not throw fatal crash so developers can continue testing
      return false;
    }
  }

  public async sendOTPEmail(email: string, otp: string, purpose: "signup" | "login", name?: string): Promise<boolean> {
    const template = getOTPEmailTemplate(name || "", otp, purpose);
    return await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }
}

export const emailService = new EmailService();
