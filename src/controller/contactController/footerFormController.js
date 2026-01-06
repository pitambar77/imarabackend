import FooterForm from "../../models/Contact/FooterForm.js";
import transporter from "../../config/mailer.js";

export const submitFooterForm = async (req, res) => {
  try {
    const { firstName, lastName, email, privacy } = req.body;

    if (!privacy) {
      return res.status(400).json({
        success: false,
        message: "Privacy policy must be accepted",
      });
    }

    // Save to DB
    const footerData = await FooterForm.create({
      firstName,
      lastName,
      email,
      privacy,
    });

    /* ================= ADMIN EMAIL ================= */
    await transporter.sendMail({
      from: `"Website Footer Signup" <info@imarakilelenisafaris.com>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Footer Subscription",
      html: `
        <h2>New Footer Signup</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    /* ================= USER EMAIL ================= */
    await transporter.sendMail({
      from: `"Imara Kileleni Safaris" <info@imarakilelenisafaris.com>`,
      to: email,
      subject: "Thanks for subscribing!",
      html: `
        <p>Dear ${firstName},</p>

        <p>Thank you for subscribing! 🎉</p>
        <p>You’ll now receive exclusive offers, travel inspiration, and updates from us.</p>

        <br/>
        <p>Warm regards,</p>
        <p><strong>Imara Kileleni Safaris Team</strong></p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Subscription successful",
      data: footerData,
    });
  } catch (error) {
    console.error("Footer form error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
