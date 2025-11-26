const Query = require("../model/queries_model");
const nodemailer = require("nodemailer");

// =========================
// CREATE NEW QUERY
// =========================
const createQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuery = new Query({ name, email, subject, message });
    await newQuery.save();

    return res.status(201).json({ message: "Query submitted successfully" });
  } catch (error) {
    console.error("Create Query Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// =========================
// GET ALL QUERIES (ADMIN)
// =========================
const getAllquerry = async (req, res) => {
  try {
    const queries = await Query.find();

    if (queries.length === 0) {
      return res.status(404).json({ message: "No queries available" });
    }

    return res.status(200).json({ queries });
  } catch (error) {
    console.error("Get All Queries Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// =========================
// REPLY TO QUERY (ADMIN)
// =========================
const ReplyMessage = async (req, res) => {
  try {
    const queryId = req.params.id;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    // Find the query by ID
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }

    const toEmail = query.email;

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use Gmail App Password if 2FA is enabled
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"LuxuryCars Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject || "Response from LuxuryCars Support",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #b58900;">LuxuryCars Support</h2>
          <p>Dear ${query.name},</p>
          <p>${message}</p>
          <br />
          <p style="font-size: 14px; color: #555;">
            Best regards,<br />
            <strong>LuxuryCars Team</strong>
          </p>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Reply Message Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createQuery, getAllquerry, ReplyMessage };
