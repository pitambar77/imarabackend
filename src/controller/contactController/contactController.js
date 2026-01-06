

import Contact from "../../models/Contact/Contact.js";
import transporter from "../../config/mailer.js";
import { bookingEmailTemplate } from "../../utils/emailTemplate.js";

export const submitContactForm = async (req, res) => {
  try {
    const data = req.body;

    /* ================= SAVE TO DB ================= */
    const contact = await Contact.create(data);

    /* ================= EMAIL TO ADMIN ================= */
    await transporter.sendMail({
      from: `"Imara kileleni Safari" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Tour Enquiry Received",
      html: bookingEmailTemplate({
        type: "admin",
        ...data,
      }),
    });

    /* ================= THANK YOU EMAIL TO USER ================= */
    await transporter.sendMail({
      from: `"Imara kileleni Safari" <${process.env.MAIL_USER}>`,
      to: data.email,
      subject: "Thank you for contacting Imara kileleni Safari",
      html: bookingEmailTemplate({
        type: "user",
        ...data,
      }),
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
