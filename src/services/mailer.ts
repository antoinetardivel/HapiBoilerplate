import { mj } from './../config/config';
import * as mailjet from 'node-mailjet';
import { Email } from 'node-mailjet';

export const mailer: Email.Client = mailjet.connect(mj.apikey, mj.apisecret);

export const sendTemplatedEmail = (
  template: number,
  receiverEmail: string,
  receiverName: string,
  variables = {},
  subject?: string,
  senderEmail?: string,
  senderName?: string,
) => {
  console.log(
    'Sending email template n° ',
    template,
    ' to ',
    receiverEmail,
    receiverName,
    'with var ',
    JSON.stringify(variables),
  );
  const opts: any = {
    Messages: [
      {
        To: [
          {
            Email: receiverEmail,
            Name: receiverName,
          },
        ],
        TemplateID: template,
        TemplateLanguage: true,
        Variables: variables,
      },
    ],
  };

  if (subject) opts.Messages[0].Subject = subject;
  if (senderEmail && senderName)
    opts.Messages[0].From = {
      Email: senderEmail,
      Name: senderName,
    };

  const request = mailer.post('send', { version: 'v3.1' }).request(opts);
  request.catch((err) => {
    console.error(
      'Error sending email',
      template,
      receiverEmail,
      receiverName,
      variables,
      subject,
      senderEmail,
      senderName,
      '. Error: ',
      JSON.stringify(err),
    );
  });
};
