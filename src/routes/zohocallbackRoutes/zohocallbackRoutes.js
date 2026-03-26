import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          redirect_uri:
            "https://imarabackend.imarakilelenisafaris.com/zoho/callback",
          code: code,
        },
      }
    );

    console.log("Zoho Token:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Zoho token error" });
  }
});

export default router;