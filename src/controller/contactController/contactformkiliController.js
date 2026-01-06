import Contact from "../../models/Contact/Contactformkili.js";
import transporter from "../../config/mailer.js";

export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, message, updates, privacy } = req.body;

    if (!privacy) {
      return res.status(400).json({
        success: false,
        message: "Privacy policy must be accepted",
      });
    }

    // Save to DB
    const contactkili = await Contact.create({
      firstName,
      lastName,
      email,
      message,
      updates,
      privacy,
    });

    /* ================= EMAIL TO ADMIN ================= */
    await transporter.sendMail({
      from: `"Website Contact" <info@imarakilelenisafaris.com>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    /* ================= THANK YOU EMAIL TO USER ================= */
    await transporter.sendMail({
      from: `"Imara Kileleni Safaris" <info@imarakilelenisafaris.com>`,
      to: email,
      subject: "Thank you for contacting us",
      html: `
        <p>Dear ${firstName},</p>

        <p>Thank you for reaching out to us. We have received your message and our team will get back to you shortly.</p>

        <p><strong>Your Message:</strong></p>
        <p>${message}</p>

        <br />
        <p>Warm regards,</p>
        <p><strong>Imara Kileleni Safaris Team</strong></p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contactkili,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
