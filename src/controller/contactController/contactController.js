import axios from "axios";
import Contact from "../../models/Contact/Contact.js";
import transporter from "../../config/mailer.js";
import { bookingEmailTemplate } from "../../utils/emailTemplate.js";
import { getZohoAccessToken } from "../../utils/zohoToken.js";

export const submitContactForm = async (req, res) => {
  try {
    const data = req.body;

    /* ================= SAVE TO DB ================= */
    const contact = await Contact.create(data);

    /* ================= SEND TO ZOHO CRM ================= */

    // const accessToken = await getZohoAccessToken();

    // await axios.post(
    //   "https://www.zohoapis.com/crm/v2/Leads",
    //   {
    //     data: [
    //       {
    //         Last_Name: data.fullName,
    //         Email: data.email,
    //         Phone: data.phone,
    //         Residence_Country: data.country,
    //         Description: data.message,
    //         Travel_Type: data.travelType,
    //         Arrival_Date: data.arrivalDate,
    //         Departure_Date: data.departureDate,
    //         Total_Days: data.totalDays,
    //         Adults: data.adults,
    //         Children: data.children,
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       Authorization: `Zoho-oauthtoken ${accessToken}`,
    //     },
    //   },
    // );

    try {
      const accessToken = await getZohoAccessToken();

      const zohoResponse = await axios.post(
        "https://www.zohoapis.com/crm/v2/Leads",
        {
          data: [
            {
              Last_Name: data.fullName,
              Email: data.email,
              Phone: data.phone,
              // Residence_Country: data.country,
              // Description: data.message,
              // Travel_Type: data.travelType,
              // Arrival_Date: data.arrivalDate,
              // Departure_Date: data.departureDate,
              // Total_Days: data.totalDays,
              Adults: data.adults,
              Children: data.children,
            },
          ],
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        },
      );

      console.log("Zoho Lead Created:", zohoResponse.data);
    } catch (zohoError) {
      console.error(
        "Zoho Error:",
        zohoError.response?.data || zohoError.message,
      );
    }

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
