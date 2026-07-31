import nodemailer from "nodemailer";
import { env } from "../config/env.config";
import { IEmailOptions } from "../types/common.types";
import { logger } from "../utils/logger.util";
import { getOTPEmailTemplate } from "../emails/templates";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = env.SMTP_PORT || 587;
    const isSecure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: isSecure,
      requireTLS: !isSecure,
      auth: env.SMTP_USER
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 4000,
      greetingTimeout: 4000,
      socketTimeout: 4000,
    });
  }

  public async sendEmail(options: IEmailOptions): Promise<boolean> {
    try {
      // 1. Try Resend HTTP API (Port 443 - Recommended for Render cloud hosting)
      if (env.RESEND_API_KEY) {
        return await this.sendViaResend(options);
      }

      // 2. Try Brevo HTTP API (Port 443 - Alternative for Render)
      if (env.BREVO_API_KEY) {
        return await this.sendViaBrevo(options);
      }

      // 3. In production or cloud host without HTTP API keys, skip raw TCP SMTP to prevent ETIMEDOUT errors
      if (env.NODE_ENV === "production") {
        logger.info(`[Email Service] Cloud server detected. Skipping raw SMTP to avoid port blocking timeout. Use Resend/Brevo API key or Dummy Master OTP 123456.`);
        return false;
      }

      // 4. Fallback to Nodemailer SMTP in local development
      if (env.SMTP_USER && env.SMTP_PASS) {
        const mailOptions = {
          from: env.SMTP_FROM || env.SMTP_USER,
          to: options.to,
          subject: options.subject,
          html: options.html,
        };

        const info = await this.transporter.sendMail(mailOptions);
        logger.info(`[Email Service] Email sent successfully via SMTP: ${info.messageId}`);
        return true;
      }

      logger.warn(`[Email Service] No active email provider configured. Email to ${options.to} skipped.`);
      return false;
    } catch (error) {
      logger.error(`[Email Service Error] Failed to send email to ${options.to}`, error);
      return false;
    }
  }

  private async sendViaResend(options: IEmailOptions): Promise<boolean> {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.SMTP_FROM || "Maysar Store <onboarding@resend.dev>",
          to: [options.to],
          subject: options.subject,
          html: options.html,
        }),
      });

      if (response.ok) {
        logger.info(`[Email Service] Email sent successfully via Resend HTTP API to ${options.to}`);
        return true;
      }
      const errData = await response.text();
      logger.error(`[Resend HTTP Error] ${response.status} - ${errData}`);
      return false;
    } catch (err) {
      logger.error(`[Resend HTTP Exception]`, err);
      return false;
    }
  }

  private async sendViaBrevo(options: IEmailOptions): Promise<boolean> {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Maysar Store", email: env.SMTP_FROM || env.SMTP_USER || "noreply@maysar.com" },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html,
        }),
      });

      if (response.ok) {
        logger.info(`[Email Service] Email sent successfully via Brevo HTTP API to ${options.to}`);
        return true;
      }
      const errData = await response.text();
      logger.error(`[Brevo HTTP Error] ${response.status} - ${errData}`);
      return false;
    } catch (err) {
      logger.error(`[Brevo HTTP Exception]`, err);
      return false;
    }
  }

  public async sendOTPEmail(email: string, otp: string, purpose: "signup" | "login", name?: string): Promise<boolean> {
    // ALWAYS log OTP clearly in server logs for zero-friction testing on Render!
    logger.info(`===================================================`);
    logger.info(`🔑 [LIVE OTP CODE]: ${otp} | Email: ${email} | Purpose: ${purpose.toUpperCase()}`);
    logger.info(`===================================================`);

    const template = getOTPEmailTemplate(name || "", otp, purpose);
    return await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }
}

export const emailService = new EmailService();
