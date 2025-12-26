// import Contact from "../../models/Contact/Contact.js";
// import transporter from "../../config/mailer.js";

// export const submitContactForm = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       country,
//       travelType,
//       arrivalDate,
//       departureDate,
//       totalDays,
//       adults,
//       children,
//       message,
//     } = req.body;

//     /* ================= SAVE TO DB ================= */
//     const contact = await Contact.create({
//       fullName,
//       email,
//       phone,
//       country,
//       travelType,
//       arrivalDate,
//       departureDate,
//       totalDays,
//       adults,
//       children,
//       message,
//     });

//     /* ================= EMAIL TO ADMIN ================= */
//     await transporter.sendMail({
//       from: `"Website Enquiry" <${process.env.MAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "New Tour Enquiry Received",
//       html: `
//         <h3>New Tour Enquiry</h3>
//         <p><strong>Name:</strong> ${fullName}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Phone:</strong> ${phone}</p>
//         <p><strong>Country:</strong> ${country}</p>
//         <p><strong>Tour Type:</strong> ${travelType}</p>
//         <p><strong>Arrival:</strong> ${arrivalDate}</p>
//         <p><strong>Departure:</strong> ${departureDate}</p>
//         <p><strong>Total Days:</strong> ${totalDays}</p>
//         <p><strong>Adults:</strong> ${adults}</p>
//         <p><strong>Children:</strong> ${children}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `,
//     });

//     /* ================= THANK YOU EMAIL TO CLIENT ================= */
//     await transporter.sendMail({
//       from: `"Safari Team" <${process.env.MAIL_USER}>`,
//       to: email,
//       subject: "Thank you for contacting us",
//       html: `
//         <p>Hi ${fullName},</p>
//         <p>Thank you for reaching out to us.</p>
//         <p>We have received your tour enquiry and our team will contact you shortly.</p>
//         <p><strong>Your Travel Dates:</strong> ${arrivalDate} – ${departureDate}</p>
//         <br/>
//         <p>Warm regards,</p>
//         <p><strong>Safari Team</strong></p>
//       `,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Form submitted successfully",
//       data: contact,
//     });
//   } catch (error) {
//     console.error("Contact form error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

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
