import { gmail_v1, google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import * as MailComposer from 'nodemailer/lib/mail-composer';

export class Gmail {
  public gmail: gmail_v1.Gmail;

  constructor(auth: OAuth2Client) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  public async sendMessage(
    emailTo: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const mailComposer = new MailComposer({
      to: emailTo,
      subject,
      text,
      html: '',
      textEncoding: 'base64',
    });

    const message = await mailComposer.compile().build();

    const rawMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
      },
    });
  }
}
