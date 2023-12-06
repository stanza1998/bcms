// Install express by running: npm install express

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3001; // Use a different port than your React app

app.use(express.json());

app.post("/send-email", async (req, res) => {
  const apiUrl = "https://api.sendgrid.com/v3/mail/send";
  const apiKey =
    "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";

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(apiUrl, req.body, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding request to SendGrid:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
