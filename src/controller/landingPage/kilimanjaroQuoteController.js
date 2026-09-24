import transporter from "../../config/mailer.js";
import axios from "axios";
import { getZohoAccessToken } from "../../utils/zohoToken.js";

const sendKilimanjaroQuote = async (req, res) => {
  try {
    // =====================================
    // GET FORM DATA
    // =====================================

    const {
      preferred_route,
      party_size,

      trip_date,
      trip_month,
      trip_year,

      first_name,
      last_name,
      email,

      country_code,
      phone_number,

      nationality,
      message,
      consent,
    } = req.body;

    console.log("========== KILIMANJARO QUOTE ==========");
    console.log("Form Data:", {
      preferred_route,
      party_size,
      trip_date,
      trip_month,
      trip_year,
      first_name,
      last_name,
      email,
      country_code,
      phone_number,
      nationality,
      message,
      consent,
    });

    // =====================================
    // BASIC VALIDATION
    // =====================================

    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!country_code) {
      return res.status(400).json({
        success: false,
        message: "Country code is required.",
      });
    }

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (!preferred_route) {
      return res.status(400).json({
        success: false,
        message: "Preferred Kilimanjaro route is required.",
      });
    }

    if (!party_size) {
      return res.status(400).json({
        success: false,
        message: "Party size is required.",
      });
    }

    if (!trip_month) {
      return res.status(400).json({
        success: false,
        message: "Travel month is required.",
      });
    }

    if (!nationality) {
      return res.status(400).json({
        success: false,
        message: "Nationality is required.",
      });
    }

    if (consent !== "yes") {
      return res.status(400).json({
        success: false,
        message: "Consent is required.",
      });
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined");
    }

    // =====================================
    // FULL PHONE NUMBER
    // =====================================

    const fullPhone = `${country_code} ${phone_number}`.trim();

    // =====================================
    // TRAVEL DATE
    // =====================================

    const travelMonth = trip_month || "";
    const travelYear = trip_year || "";

    const travelDate =
      trip_date ||
      (travelMonth && travelYear
        ? `${travelMonth} ${travelYear}`
        : travelMonth);

    // =====================================
    // SEND TO ZOHO CRM
    // =====================================

    try {
      const accessToken = await getZohoAccessToken();

      const zohoPayload = {
        data: [
          {
            // Guest information
            Last_Name: last_name,
            First_Name: first_name,
            Email: email,
            Mobile: fullPhone,

            // Message
            Description: message || "",

            // Form information
            Residency_Country: nationality,

            // Kilimanjaro information
            Destination_Package: preferred_route,
            Number_of_Travellers: party_size,

            Planning_to_Travel_In: travelDate,

            Travel_Month: travelMonth,
            Travel_Year: travelYear,

            Lead_Source: "Kilimanjaro Quote",

            Consent: consent === "yes",
          },
        ],
      };

      console.log("Zoho Payload:", JSON.stringify(zohoPayload, null, 2));

      const zohoResponse = await axios.post(
        "https://www.zohoapis.com/crm/v2/Leads",
        zohoPayload,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(
        "Zoho Kilimanjaro Quote Response:",
        JSON.stringify(zohoResponse.data, null, 2),
      );
    } catch (zohoError) {
      console.error(
        "Zoho CRM Error:",
        zohoError.response?.data || zohoError.message,
      );

      // Zoho failure will not stop email submission
    }

    // =====================================
    // ADMIN EMAIL
    // =====================================

    const adminMail = {
      from: `"Imara Kileleni Safaris" <${process.env.MAIL_USER}>`,

      to: process.env.ADMIN_EMAIL,

      replyTo: email,

      subject: "Imara Kileleni Safaris || Kilimanjaro Quote Request",

      html: `
<!DOCTYPE html>
<html>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f4f4;
    font-family:Arial,sans-serif;
  "
>

<table width="100%" cellpadding="0" cellspacing="0">

<tr>

<td align="center" style="padding:20px 0;">

<table
  width="600"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#ffffff;
    border:1px solid #d6b48c;
  "
>

<!-- HEADER -->

<tr>

<td
  style="
    padding:20px;
    border-bottom:2px solid #d6b48c;
  "
>

<table width="100%">

<tr>

<td>

<img
  src="https://imarakilelenisafaris.com/_next/static/media/imaralogo.0g8.1.bc43or-.png"
  height="50"
  alt="Imara Kileleni Safaris"
/>

</td>

<td
  align="right"
  style="
    font-size:18px;
    font-weight:bold;
    color:#d87028;
  "
>
Imara Kileleni Safaris
</td>

</tr>

</table>

</td>

</tr>

<!-- BODY -->

<tr>

<td style="padding:25px;color:#333;">

<h2 style="color:#d87028;">
Kilimanjaro Quote Request
</h2>

<h3>Climbing Details</h3>

<ul>

<li>
<strong>Preferred Route:</strong>
${preferred_route || "N/A"}
</li>

<li>
<strong>Party Size:</strong>
${party_size || "N/A"}
</li>

<li>
<strong>Travel Month:</strong>
${travelMonth || "N/A"}
</li>

<li>
<strong>Travel Year:</strong>
${travelYear || "N/A"}
</li>

<li>
<strong>Travel Date:</strong>
${trip_date || "N/A"}
</li>

</ul>

<h3>Guest Information</h3>

<ul>

<li>
<strong>First Name:</strong>
${first_name}
</li>

<li>
<strong>Last Name:</strong>
${last_name}
</li>

<li>
<strong>Email:</strong>
${email}
</li>

<li>
<strong>Phone:</strong>
${fullPhone}
</li>

<li>
<strong>Nationality:</strong>
${nationality || "N/A"}
</li>

</ul>

<h3>Message</h3>

<p
  style="
    background:#f9f9f9;
    padding:15px;
    border-left:4px solid #d6b48c;
  "
>
${message || "No message provided"}
</p>

<h3>Consent</h3>

<p>
Accepted
</p>

<p>
Regards,<br/>
<strong>Imara Kileleni Safaris</strong>
</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
  style="
    background:#d87028;
    color:#ffffff;
    text-align:center;
    padding:15px;
    font-size:13px;
  "
>

© 2026 – 2027 Imara Kileleni Safaris | Tanzania

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,
    };

    // =====================================
    // CUSTOMER EMAIL
    // =====================================

    const customerMail = {
      from: `"Imara Kileleni Safaris" <${process.env.MAIL_USER}>`,

      to: email,

      subject: `Thank You, ${first_name} – Your Kilimanjaro Quote Request`,

      html: `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8" />

<title>
Kilimanjaro Quote Request
</title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f4f4;
    font-family:Arial,sans-serif;
  "
>

<table width="100%" cellpadding="0" cellspacing="0">

<tr>

<td align="center" style="padding:20px 0;">

<table
  width="600"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#ffffff;
    border:1px solid #d6b48c;
  "
>

<!-- HEADER -->

<tr>

<td
  style="
    padding:20px;
    border-bottom:2px solid #d6b48c;
  "
>

<img
  src="https://imarakilelenisafaris.com/_next/static/media/imaralogo.0g8.1.bc43or-.png"
  alt="Imara Kileleni Safaris"
  style="height:50px;"
/>

</td>

</tr>

<!-- BODY -->

<tr>

<td style="padding:25px;color:#333;">

<h2
  style="
    color:#d87028;
    margin-top:0;
  "
>
Thank You, ${first_name}!
</h2>

<p>
Thank you for your interest in climbing Mount Kilimanjaro with
Imara Kileleni Safaris.
</p>

<p>
We have successfully received your quote request. Our safari
specialists will review your requirements and contact you shortly
with your personalized Kilimanjaro climbing quote.
</p>

<h3
  style="
    border-bottom:1px solid #ddd;
    padding-bottom:6px;
  "
>
Your Kilimanjaro Details
</h3>

<ul style="padding-left:20px;">

<li>
<strong>Preferred Route:</strong>
${preferred_route}
</li>

<li>
<strong>Party Size:</strong>
${party_size}
</li>

<li>
<strong>Travel Month:</strong>
${travelMonth}
</li>

<li>
<strong>Travel Year:</strong>
${travelYear}
</li>

<li>
<strong>Phone:</strong>
${fullPhone}
</li>

<li>
<strong>Nationality:</strong>
${nationality}
</li>

</ul>

<p style="margin-top:25px;">

If you have any additional requirements or questions,
simply reply to this email and our team will be happy to assist you.

</p>

<p style="margin-top:25px;">

Warm regards,<br/>

<strong>
Imara Kileleni Safaris Team
</strong>

<br/>

Tanzania

</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
  style="
    background:#d87028;
    padding:15px;
    text-align:center;
    color:#ffffff;
    font-size:13px;
  "
>

© 2026 – 2027 Imara Kileleni Safaris

<br/>

Tanzania

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,
    };

    // =====================================
    // SEND EMAILS
    // =====================================

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(customerMail),
    ]);

    // =====================================
    // SUCCESS
    // =====================================

    return res.status(200).json({
      success: true,
      message: "Kilimanjaro quote request submitted successfully.",
    });
  } catch (error) {
    console.error("Kilimanjaro quote error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit Kilimanjaro quote request.",
    });
  }
};

export default sendKilimanjaroQuote;
