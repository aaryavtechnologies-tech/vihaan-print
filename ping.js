const https = require("https");

const RENDER_URL = process.env.RENDER_URL || "https://vihaan-print.onrender.com/api/ping";

function pingServer() {
  console.log(`[${new Date().toISOString()}] Pinging ${RENDER_URL}...`);

  https.get(RENDER_URL, (res) => {
    const { statusCode } = res;
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (statusCode >= 200 && statusCode < 300) {
        console.log(`[PING SUCCESS] Status Code: ${statusCode}`);
        console.log(`Response: ${data}`);
      } else {
        console.error(`[PING FAILED] Status Code: ${statusCode}`);
      }
    });
  }).on("error", (err) => {
    console.error(`[PING ERROR] ${err.message}`);
  });
}

pingServer();
