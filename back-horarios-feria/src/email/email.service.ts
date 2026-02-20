import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    // Solo crear transporter si hay credenciales configuradas
    if (smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      this.logger.warn('SMTP no configurado. Los emails no se enviarán.');
    }
  }

  /**
   * Envía email de confirmación de reserva
   */
  async sendReservationConfirmation(data: {
    email: string;
    schoolName: string;
    coordinatorName: string;
    day: string;
    slot: string;
    students: number;
    reservationId: string;
  }): Promise<void> {
    // Si no hay transporter configurado, solo loguear
    if (!this.transporter) {
      this.logger.warn(
        `Email no enviado (SMTP no configurado) para reserva ${data.reservationId} a ${data.email}`,
      );
      return;
    }

    try {
      const templatePath = path.join(
        __dirname,
        'templates',
        'reservation-confirmation.hbs',
      );

      let htmlTemplate: string;
      try {
        htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      } catch (error) {
        // Si no existe el template, usar uno básico
        htmlTemplate = this.getDefaultTemplate();
      }

      const template = handlebars.compile(htmlTemplate);
      const html = template({
        schoolName: data.schoolName,
        coordinatorName: data.coordinatorName,
        day: data.day,
        slot: data.slot,
        students: data.students,
        reservationId: data.reservationId,
      });

      const mailOptions = {
        from: `"${this.configService.get<string>('SMTP_FROM_NAME') || 'Global Money Week'}" <${this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER')}>`,
        to: data.email,
        subject: 'Confirmación de Reserva - Global Money Week',
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de confirmación enviado a ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email de confirmación a ${data.email}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Template HTML por defecto si no existe el archivo
   */
  private getDefaultTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1f4b9e; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f8f9fa; }
    .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #1f4b9e; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Global Money Week</h1>
    </div>
    <div class="content">
      <h2>¡Reserva Confirmada!</h2>
      <p>Hola <strong>{{coordinatorName}}</strong>,</p>
      <p>Tu reserva ha sido registrada exitosamente:</p>
      
      <div class="info-box">
        <p><strong>🏫 Institución:</strong> {{schoolName}}</p>
        <p><strong>📅 Día:</strong> {{day}}</p>
        <p><strong>⏰ Horario:</strong> {{slot}}</p>
        <p><strong>👥 Estudiantes:</strong> {{students}}</p>
        <p><strong>🆔 Código de reserva:</strong> {{reservationId}}</p>
      </div>
      
      <p>Gracias por tu participación en Global Money Week 2026.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    </div>
    <div class="footer">
      <p>Este es un email automático, por favor no responder.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}
