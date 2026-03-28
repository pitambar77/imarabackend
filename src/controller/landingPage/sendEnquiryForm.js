import transporter from "../../config/mailer.js";
import axios from "axios";
import { getZohoAccessToken } from "../../utils/zohoToken.js";

const sendEnquiryForm = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      country,
      adults,
      children,
      destination,
      tourType,
      travelDate,
      days,
      message,
    } = req.body;

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined");
    }

    /* ================= ZOHO CRM ================= */

    try {
      const accessToken = await getZohoAccessToken();

      await axios.post(
        "https://www.zohoapis.com/crm/v2/Leads",
        {
          data: [
            {
              Last_Name: name,
              Email: email,
              Phone: phone,
              Residency_Country: country,
              Destination: destination,
              Safari_Type: tourType,
              Safari_Days: days,
              Arrival_Date: travelDate,
              Adults: adults,
              Children: children,
              Description: message,
              Lead_Source: "Website Tailormade form Form",
            },
          ],
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        },
      );

      console.log("Zoho Lead Created");
    } catch (zohoError) {
      console.error(
        "Zoho CRM Error:",
        zohoError.response?.data || zohoError.message,
      );
    }

    /* ================= ADMIN EMAIL ================= */

    const adminMail = {
      from: `"Imara Safaris" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: "New Travel Inquiry Received",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<table width="600" style="background:#ffffff;border:1px solid #d6b48c;">

<!-- HEADER -->
<tr>
<td style="padding:20px;border-bottom:2px solid #d6b48c;">
<table width="100%">
<tr>
<td>
<img src="https://imarakilelenisafaris.com/src/assets/imaralogo.png" height="50"/>
</td>
<td align="right" style="font-size:18px;font-weight:bold;color:#d87028;">
Imara Kileleni Safaris
</td>
</tr>
</table>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:25px;color:#333;">

<p><strong>New Travel Inquiry received</strong></p>

<h3>Trip Details</h3>
<ul>
<li><strong>Destination:</strong> ${destination}</li>
<li><strong>Tour Type:</strong> ${tourType}</li>
<li><strong>Travel Date:</strong> ${travelDate}</li>
<li><strong>Duration:</strong> ${days} Days</li>
</ul>

<h3>Traveler Information</h3>
<ul>
<li><strong>Name:</strong> ${name}</li>
<li><strong>Email:</strong> ${email}</li>
<li><strong>Phone:</strong> ${phone}</li>
<li><strong>Country:</strong> ${country}</li>
<li><strong>Adults:</strong> ${adults}</li>
<li><strong>Children:</strong> ${children}</li>
</ul>

<h3>Client Message</h3>

<p style="background:#f9f9f9;padding:15px;border-left:4px solid #d6b48c;">
${message || "No message provided"}
</p>

<p>
Regards,<br/>
<strong>Website Inquiry System</strong>
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#d87028;color:#fff;text-align:center;padding:15px;font-size:13px;">
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

    /* ================= CUSTOMER EMAIL ================= */

    const customerMail = {
      from: `"Imara Safaris" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Thank you for your Travel Inquiry",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Travel Inquiry Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #d6b48c;">

<!-- HEADER -->
<tr>
<td style="padding:20px;border-bottom:2px solid #d6b48c;">
<table width="100%">
<tr>
<td align="left">
<img src="https://imarakilelenisafaris.com/src/assets/imaralogo.png" height="50"/>
</td>

<td align="right" style="font-size:18px;font-weight:bold;color:#d87028;">
Imara Kileleni Safaris
</td>
</tr>
</table>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:25px;color:#333;">

<h2 style="color:#d87028;margin-top:0;">
Thank you, ${name}!
</h2>

<p>
We have successfully received your travel inquiry.
Our safari specialists are currently reviewing your request and will contact you shortly with a personalized itinerary.
</p>

<h3 style="border-bottom:1px solid #ddd;padding-bottom:6px;">
Your Trip Details
</h3>

<ul style="padding-left:20px;">
<li><strong>Destination:</strong> ${destination}</li>
<li><strong>Tour Type:</strong> ${tourType}</li>
<li><strong>Travel Date:</strong> ${travelDate}</li>
<li><strong>Duration:</strong> ${days} Days</li>
</ul>

<p style="margin-top:20px;">
If you have additional preferences or questions, simply reply to this email and our team will be happy to assist you.
</p>

<p style="margin-top:25px;">
Warm regards,<br/>
<strong>Imara Kileleni Safaris Team</strong><br/>
Tanzania
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#d87028;padding:15px;text-align:center;color:#ffffff;font-size:13px;">
© 2026 – 2027 Imara Kileleni Safaris<br/>
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

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(customerMail),
    ]);

    res.status(200).json({
      message: "Travel inquiry sent successfully",
    });
  } catch (error) {
    console.error("Inquiry Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export default sendEnquiryForm;
