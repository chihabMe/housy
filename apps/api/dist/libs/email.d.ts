export declare const sendAccountActivationEmail: ({ to, subject, text, html, }: {
    to: string;
    subject: string;
    text?: string | undefined;
    html?: string | undefined;
}) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const sendMail: ({ to, from, subject, text, html, }: {
    to: string;
    from: string;
    subject: string;
    text?: string | undefined;
    html?: string | undefined;
}) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
//# sourceMappingURL=email.d.ts.map