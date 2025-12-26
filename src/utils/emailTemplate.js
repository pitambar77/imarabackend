export const bookingEmailTemplate = ({
  type = "user", // "admin" | "user"
  fullName,
  email,
  phone,
  country,
  travelType,
  arrivalDate,
  departureDate,
  totalDays,
  adults,
  children,
  message,
}) => {
  const isAdmin = type === "admin";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Imara kileleni Safaris</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff;border:1px solid #ddd;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding:20px;text-align:center;border-bottom:2px solid #0f5c5c;">
              <h2 style="margin:0;color:#d87029;">Imara kileleni Safaris</h2>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:25px;color:#333;font-size:14px;line-height:1.6;">
              
              <p>Dear ${isAdmin ? "Admin" : fullName},</p>

              ${
                isAdmin
                  ? `<p>You have received a <strong>new tour enquiry</strong>. Details are below:</p>`
                  : `<p>Thank you for reaching out to us. We have received your booking request.</p>
                     <p>Our travel consultant will contact you shortly to help finalize your trip.</p>`
              }

              <h3 style="margin-top:20px;color:#d87029;">Booking Details</h3>

              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                <tr><td><strong>Full Name</strong></td><td>${fullName}</td></tr>
                <tr><td><strong>Email</strong></td><td>${email}</td></tr>
                <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
                <tr><td><strong>Country</strong></td><td>${country}</td></tr>
                <tr><td><strong>Travel Type</strong></td><td>${travelType}</td></tr>
                <tr><td><strong>Arrival Date</strong></td><td>${arrivalDate}</td></tr>
                <tr><td><strong>Departure Date</strong></td><td>${departureDate}</td></tr>
                <tr><td><strong>Total Days</strong></td><td>${totalDays}</td></tr>
                <tr><td><strong>Adults</strong></td><td>${adults}</td></tr>
                <tr><td><strong>Children</strong></td><td>${children || "0"}</td></tr>
                ${
                  message
                    ? `<tr><td><strong>Additional Info</strong></td><td>${message}</td></tr>`
                    : ""
                }
              </table>

              <p style="margin-top:20px;">
                Regards,<br/>
                <strong>Imara kileleni Safaris Team</strong>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#d87029;color:#fff;text-align:center;padding:15px;font-size:12px;">
              © 2025–2026 Imara kileleni Safaris<br/>
              CCM Mkoa Moshi Kilimanjaro
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
