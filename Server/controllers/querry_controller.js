const Query = require("../model/queries_model");
const nodemailer=require("nodemailer");

const createQuery = async (req, res) => {
  try {
    const { name, email,subject, message } = req.body;
    const newQuery = new Query({ name, email,subject, message });
    await newQuery.save();
  return  res.status(201).json({ message: "Query submitted successfully" });
  } catch (error) {
  return  res.status(404).json({ error: error.message });
  }
};


const getAllquerry=async(req,res)=>{
try {
  const querry=await Query.find()
  if(!querry)
  {
    return res.status(404).json("No querries are available")
  }
  return res.status(200).json(querry)
} catch (error) {
   return  res.status(404).json({ error: error.message });
}
}


const ReplyMessage=async(req,res)=>{
try {
  const {to,subject,message}=req.body

  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"LuxuryCars Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || "Response from LuxuryCars Support",
      text: message, // plain text fallback
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #b58900;">LuxuryCars Support</h2>
          <p>Dear Customer,</p>
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
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Reply sent successfully" });
  
} catch (error) {
     return  res.status(404).json({ error: error.message });
}
}


module.exports={createQuery,getAllquerry,ReplyMessage};
