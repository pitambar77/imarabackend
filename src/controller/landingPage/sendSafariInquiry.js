import transporter from "../../config/mailer.js";

const sendSafariInquiry = async (req, res) => {
  try {
    const {
      parks,
      planningDays,
      safariStyle,
      travelDate,
      contact,
    } = req.body;

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined");
    }

    /* ================= ADMIN EMAIL ================= */
    const adminMail = {
      from: `"Imara Safaris" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: contact.email,
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
<li><strong>Preferred Parks:</strong> ${parks.join(", ")}</li>
<li><strong>Duration:</strong> ${planningDays}</li>
<li><strong>Safari Style:</strong> ${safariStyle}</li>
<li><strong>Travel Date:</strong> ${travelDate}</li>
</ul>

<h3>Guest Information</h3>
<ul>
<li><strong>Name:</strong> ${contact.fullName}</li>
<li><strong>Email:</strong> ${contact.email}</li>
<li><strong>Phone:</strong> ${contact.countryCode} ${contact.phone}</li>
<li><strong>Number of People:</strong> ${contact.people}</li>
</ul>

<h3>Client Message</h3>
<p style="background:#f9f9f9;padding:15px;border-left:4px solid #d6b48c;">
${contact.message || "No message provided"}
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
      to: contact.email,
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
                Thank you, ${contact.fullName}!
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
                <li><strong>Preferred Parks:</strong> ${parks.join(", ")}</li>
                <li><strong>Safari Duration:</strong> ${planningDays}</li>
                <li><strong>Safari Style:</strong> ${safariStyle}</li>
                <li><strong>Expected Travel Date:</strong> ${travelDate}</li>
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
