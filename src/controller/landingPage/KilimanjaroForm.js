

import transporter from "../../config/mailer.js";

const sendContactMail = async (req, res) => {
  try {
    const { route, people, travelDate, contact } = req.body;

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not defined in .env");
    }

    /* ================= ADMIN EMAIL ================= */
    const adminMailOptions = {
      from: `"Imara Kilimanjaro" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: contact.email,
      subject: "New Kilimanjaro Climb Inquiry",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">
<table width="600" style="background:#ffffff;border:1px solid #d6b48c;">

<tr>
<td style="padding:20px;border-bottom:2px solid #d6b48c;">
<table width="100%">
<tr>
<td align="left">
<img src="https://imarakilelenisafaris.com/src/assets/imaralogo.png" height="50" />
</td>
<td align="right" style="font-size:18px;font-weight:bold;color:#d87028;">
Imara Kileleni Safaris
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:25px;color:#333;">
<p>Dear Team,</p>

<p>You have received a <strong>new Kilimanjaro climbing inquiry</strong>.</p>

<h3>Travel Details</h3>
<ul>
<li><strong>Selected Route:</strong> ${route}</li>
<li><strong>Number of Climbers:</strong> ${people}</li>
<li><strong>Expected Travel Date:</strong> ${travelDate}</li>
</ul>

<h3>Guest Information</h3>
<ul>
<li><strong>Name:</strong> ${contact.fullName}</li>
<li><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></li>
<li><strong>Phone:</strong> ${contact.countryCode} ${contact.phoneNumber}</li>
<li><strong>Nationality:</strong> ${contact.nationality}</li>
</ul>

<h3>Client Message</h3>
<p style="background:#f9f9f9;padding:15px;border-left:4px solid #d6b48c;">
${contact.message || "No message provided"}
</p>

<p>Regards,<br><strong>Imara Kileleni Safaris</strong></p>
</td>
</tr>

<tr>
<td style="background:#d87028;padding:15px;text-align:center;color:#fff;font-size:13px;">
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

    /* ================= CUSTOMER CONFIRMATION EMAIL ================= */
    const customerMailOptions = {
      from: `"Imara Kilimanjaro" <${process.env.MAIL_USER}>`,
      to: contact.email,
      subject: "We received your Kilimanjaro climbing inquiry",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Kilimanjaro Inquiry Confirmation</title>
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
                Thank you, ${contact.fullName}!
              </h2>

              <p>
                We have successfully received your <strong>Kilimanjaro climbing inquiry</strong>.
                Our team is currently reviewing your details and will contact you shortly with
                a personalized response.
              </p>

              <!-- DETAILS -->
              <h3 style="border-bottom:1px solid #ddd;padding-bottom:6px;">
                Your Submitted Details
              </h3>

              <ul style="padding-left:20px;">
                <li><strong>Selected Route:</strong> ${route}</li>
                <li><strong>Number of Climbers:</strong> ${people}</li>
                <li><strong>Expected Travel Date:</strong> ${travelDate}</li>
              </ul>

              <!-- MESSAGE -->
              <h3 style="border-bottom:1px solid #ddd;padding-bottom:6px;">
                Your Message
              </h3>

              <p style="background:#f9f9f9;padding:15px;border-left:4px solid #d6b48c;">
                ${contact.message || "No message provided"}
              </p>

              <p style="margin-top:25px;">
                If you have any additional questions or details to share, feel free to reply
                directly to this email.
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

    /* ================= SEND BOTH ================= */
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    res.status(200).json({
      message: "Inquiry submitted successfully. Confirmation email sent.",
    });
  } catch (error) {
    console.error("Mail error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export default sendContactMail;
