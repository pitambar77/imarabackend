import transporter from "../../config/mailer.js";
import axios from "axios";
import { getZohoAccessToken } from "../../utils/zohoToken.js";

const sendKilimanjaroQuote = async (req, res) => {
  try {
    const {
      preferredRoute,
      routePrice,
      partySize,

      trip_date,
      trip_month,
      trip_year,

      first_name,
      last_name,
      email,
      phone,
      country,
      message,
      consent,
    } = req.body;

    // =====================================
    // BASIC VALIDATION
    // =====================================

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    if (!preferredRoute) {
      return res.status(400).json({
        message: "Preferred Kilimanjaro route is required.",
      });
    }

    if (!partySize) {
      return res.status(400).json({
        message: "Party size is required.",
      });
    }

    if (!trip_month) {
      return res.status(400).json({
        message: "Travel month is required.",
      });
    }

    if (consent !== "yes") {
      return res.status(400).json({
        message: "Consent is required.",
      });
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined");
    }

    // =====================================
    // FORMAT TRAVEL DATE
    // =====================================

    const travelMonth = trip_month || "";
    const travelYear = trip_year || "";

    const travelDate =
      trip_date ||
      (travelMonth && travelYear ? `${travelMonth} ${travelYear}` : "");

    // =====================================
    // SEND TO ZOHO CRM
    // =====================================

    try {
      const accessToken = await getZohoAccessToken();

      const zohoPayload = {
        data: [
          {
            Last_Name: last_name,
            First_Name: first_name,
            Email: email,
            Mobile: phone,

            Description: message || "",

            Residency_Country: country || "",

            // Kilimanjaro information
            Kilimanjaro_Route: preferredRoute,
            Route_Price: routePrice || "",
            Number_of_Travellers: partySize,

            Planning_to_Travel_In: travelDate,

            Travel_Month: travelMonth,
            Travel_Year: travelYear,

            Lead_Source: "Kilimanjaro Quote",

            Consent: consent === "yes",
          },
        ],
      };

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

      // Do not stop email submission if Zoho fails
    }

    // =====================================
    // ADMIN EMAIL
    // =====================================

    const adminMail = {
      from: `"Imara Kileleni Safaris" <${process.env.MAIL_USER}>`,

      to: process.env.ADMIN_EMAIL,

      replyTo: email,

      subject: `Imara Kileleni Safaris || Kilimanjaro Quote Request`,

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
${preferredRoute || "N/A"}
</li>

<li>
<strong>Route Price:</strong>
${routePrice || "N/A"}
</li>

<li>
<strong>Party Size:</strong>
${partySize || "N/A"}
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
${phone}
</li>

<li>
<strong>Country:</strong>
${country || "N/A"}
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
${consent === "yes" ? "Accepted" : "Not accepted"}
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
<title>Kilimanjaro Quote Request</title>
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

<h2 style="color:#d87028;margin-top:0;">
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
${preferredRoute}
</li>

<li>
<strong>Party Size:</strong>
${partySize}
</li>

<li>
<strong>Travel Month:</strong>
${travelMonth}
</li>

<li>
<strong>Travel Year:</strong>
${travelYear}
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
