import transporter from "../../config/mailer.js";
import axios from "axios";
import { getZohoAccessToken } from "../../utils/zohoToken.js";

const sendSafariInquiry = async (req, res) => {
  try {
    const {
      safari_days,
      safari_type,
      start_date,
      first_name,
      last_name,
      email,
      country,
      adults,
      child,
      number,
      message,
    } = req.body;

    const destination = req.body.destination || req.body["destination[]"];

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined");
    }

     /* ================= HANDLE DESTINATION ARRAY ================= */
    const destinationText = Array.isArray(destination)
      ? destination.join(", ")
      : destination;


    /* ================= SEND TO ZOHO CRM ================= */

try {
  const accessToken = await getZohoAccessToken();

  const zohoResponse = await axios.post(
    "https://www.zohoapis.com/crm/v2/Leads",
    {
      data: [
        {
          Last_Name: last_name,
          First_Name: first_name,
          Email: email,
          Phone: number,
          Description: message,
          Residency_Country: country,
          Destination_Package: destinationText,
          // Travel_Days:Number(safari_days),
          Tour_Type: safari_type,
          Arrival_Date: start_date,
          Adaults:Number(adults),
          Children:Number(child),
          Lead_Source:"Google Ads Form "
        },
      ],
    },
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    }
  );

  console.log("Zoho Lead Created:", zohoResponse.data);

} catch (zohoError) {
  console.error(
    "Zoho CRM Error:",
    zohoError.response?.data || zohoError.message
  );
}

    


    /* ================= ADMIN EMAIL ================= */
    const adminMail = {
      from: `"Imara Safaris" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: "New Safari Inquiry Received",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:20px 0;">
<table width="600" style="background:#ffffff;border:1px solid #d6b48c;">

<tr>
<td style="padding:20px;border-bottom:2px solid #d6b48c;">
<table width="100%">
<tr>
<td><img src="https://imarakilelenisafaris.com/src/assets/imaralogo.png" height="50"/></td>
<td align="right" style="font-size:18px;font-weight:bold;color:#d87028;">
Imara Kileleni Safaris
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:25px;color:#333;">
<p><strong>New Safari Inquiry received</strong></p>

<h3>Safari Details</h3>
<ul>
<li><strong>Preferred Destiation:</strong> ${destinationText}</li>
<li><strong>Duration:</strong> ${safari_days}</li>
<li><strong>Safari Style:</strong> ${safari_type}</li>
<li><strong>Travel Date:</strong> ${start_date}</li>
</ul>

<h3>Guest Information</h3>
<ul>
<li><strong>First Name:</strong> ${first_name}</li>
<li><strong>Last Name:</strong> ${last_name}</li>

<li><strong>Email:</strong> ${email}</li>
<li><strong>Phone:</strong>  ${number}</li>
<li><strong>Country :</strong> ${country} </li>

<li><strong>Number of Adault:</strong> ${adults}</li>
<li><strong>Number of Child:</strong> ${child}</li>

</ul>

<h3>Client Message</h3>
<p style="background:#f9f9f9;padding:15px;border-left:4px solid #d6b48c;">
${message || "No message provided"}
</p>

<p>Regards,<br/><strong>Website Inquiry System</strong></p>
</td>
</tr>

<tr>
<td style="background:#d87028;color:#fff;text-align:center;padding:15px;font-size:13px;">
© 2026 – 2027 Imara Kileleni Safaris | Tanzania
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
      `,
    };

    /* ================= CUSTOMER CONFIRMATION ================= */
    const customerMail = {
      from: `"Imara Safaris" <${process.env.MAIL_USER}>`,
      to:email,
      subject: "Thank you for your Safari Inquiry",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Safari Inquiry Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px 0;">

        <!-- MAIN CONTAINER -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #d6b48c;">

          <!-- HEADER -->
          <tr>
            <td style="padding:20px;border-bottom:2px solid #d6b48c;">
              <table width="100%">
                <tr>
                  <td align="left">
                    <img
                      src="https://imarakilelenisafaris.com/src/assets/imaralogo.png"
                      alt="Imara Kileleni Safaris"
                      style="height:50px;"
                    />
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
                Thank you, ${first_name}!
              </h2>

              <p>
                We have successfully received your <strong>Tanzania safari inquiry</strong>.
                Our safari specialists are currently reviewing your preferences and will
                contact you shortly with a personalized itinerary.
              </p>

              <!-- DETAILS -->
              <h3 style="border-bottom:1px solid #ddd;padding-bottom:6px;">
                Your Safari Details
              </h3>

              <ul style="padding-left:20px;">
                <li><strong>Preferred destination:</strong> ${destinationText}</li>
                <li><strong>Safari Duration:</strong> ${safari_days}</li>
                <li><strong>Safari Style:</strong> ${safari_type}</li>
                <li><strong>Expected Travel Date:</strong> ${start_date}</li>
              </ul>

              <p style="margin-top:20px;">
                If you have additional preferences or questions, simply reply to this
                email and our team will be happy to assist you.
              </p>

              <p style="margin-top:25px;">
                Warm regards,<br />
                <strong>Imara Kileleni Safaris Team</strong><br />
                Tanzania
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#d87028;padding:15px;text-align:center;color:#ffffff;font-size:13px;">
              © 2026 – 2027 Imara Kileleni Safaris<br />
              Tanzania
            </td>
          </tr>

        </table>
        <!-- END MAIN CONTAINER -->

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

    res.status(200).json({ message: "Safari inquiry sent successfully" });

  } catch (error) {
    console.error("Safari mail error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export default sendSafariInquiry;
