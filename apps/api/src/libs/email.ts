import nodemailer from "nodemailer";
import env from "../core/env";

const config = env.getEmailConfig();
const mailer = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.username,
    pass: config.password,
  },
});
export const sendAccountActivationEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  return await sendMail({ from: config.username, to, text, html, subject });
};
export const sendMail = async ({
  to,
  from,
  subject,
  text,
  html,
}: {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  return await mailer.sendMail({
    to,
    from,
    subject,
    text,
    html,
  });
};

// if (require.main == module)
//   );
