// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import validator from "email-validator";
import * as postmark from "postmark";

const isProduction = process.env.NODE_ENV === "production";

let client;
if (isProduction)
  client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

export default async (req, res) => {
  if (isProduction) {
    const data = JSON.parse(req.body);
    const { name, email, message } = data;

    if (!isProduction) return res.status(200).json({ message: "Sent" });

    if (!validator.validate(email)) {
      res.status(400).json({ message: "Invalid Email" });
    } else {
      try {
        const result = await client.sendEmail({
          From: process.env.POSTMARK_SENDER,
          To: process.env.POSTMARK_RECIPIENT,
          Subject: "Gustavo.is CONTACT FORM",
          TextBody: `${name} (${email}): ${message}`,
          MessageStream: "outbound"
        });

        // console.log("Successfully sent email", result);
        res.status(200).json({ message: "SUCCESS" });
      } catch (error) {
        // console.log("Could not send mail", error);
        res.status(400).json({ message: error });
      }
    }
  } else res.status(200).json({ message: "SUCCESS" });
};
