// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import validator from "email-validator";
import * as postmark from "postmark";

const isProduction = process.env.NODE_ENV === "production";

let client;
if (isProduction)
  client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

export default async (req, res) => {
  res.status(200).json({ message: "SUCCESS" });
  const data = JSON.parse(req.body);
  console.log("REQ DATA", data);
  const { name, email, message } = data;
  console.log("REQ", {
    name,
    email,
    message,
    tok: process.env.POSTMARK_API_TOKEN
  });
  if (!isProduction) return res.status(200).json({ message: "Sent" });

  if (!validator.validate(email)) {
    res.status(400).json({ message: "Invalid Email" });
  } else {
    try {
      const result = await client.sendEmail({
        From: "howdy@ponder.to",
        To: "sky100010@gmail.com",
        Subject: "Gustavo.is CONTACT FORM",
        TextBody: `${name} (${email}): ${message}`,
        MessageStream: "outbound"
      });

      console.log("Successfully sent email", result);
      res.status(200).json({ message: "Sent" });
    } catch (error) {
      console.log("Could not send mail", error);
      res.status(400).json({ message: error });
    }
  }
};