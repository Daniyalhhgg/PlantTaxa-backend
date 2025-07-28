const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.error("Missing fields:", { name, email, message });
    return res.status(400).json({ error: "All fields are required: name, email, message." });
  }

  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    console.error("Email configuration missing:", {
      MAIL_USER: process.env.MAIL_USER,
      MAIL_PASSWORD: process.env.MAIL_PASSWORD ? "[REDACTED]" : undefined,
    });
    return res.status(500).json({ error: "Email service not configured properly." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"PlantTaxa Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "🌱 New Contact Form Submission",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("❌ Email sending error:", error.message, error);
    return res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};

module.exports = {
  sendContactMessage,
};