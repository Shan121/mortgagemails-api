const dotenv = require("dotenv");
dotenv.config();

const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.emailForm = (req, res) => {
  // console.log(req.body);
  const { name, email, subject, message } = req.body;
  //
  if (!name || !name.length) {
    res.status(400);
    throw new Error("Name is required");
  }

  if (name && name.length > 32) {
    res.status(400);
    throw new Error("Name cannot be more than 32 characters");
  }

  if (!email) {
    res.status(422);
    throw new Error("Email is required");
  }

  if (!subject || !subject.length) {
    res.status(400);
    throw new Error("Subject is required");
  }

  if (!message || !message.length) {
    res.status(400);
    throw new Error("Message is required");
  }
  if (message && message.length > 128) {
    res.status(400);
    throw new Error("Message cannot be more than 128 characters");
  }

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "shan2k18s@gmail.com",
          Name: "Akmal Zeeshan",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: subject,
        TextPart: message,
        HTMLPart: message,
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
      return res.status(200).json({
        success: true,
        message: "Email sent!",
      });
    })
    .catch((err) => {
      // console.log(err.statusCode);
      return res.status(401).json({
        success: false,
        message: "Email could not be sent!",
      });
    });
};
