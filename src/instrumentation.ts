export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const RENDER_URL = process.env.RENDER_URL || "https://vihaan-print.onrender.com/api/ping";
    console.log(`[Render Auto-Ping] Initialized server keep-alive ping loop for ${RENDER_URL}`);

    // Ping every 5 minutes (300,000 ms)
    setInterval(async () => {
      try {
        const res = await fetch(RENDER_URL, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) RenderServerAutoPing/1.0",
          },
        });
        console.log(`[Render Auto-Ping] Server self-ping status: ${res.status}`);
      } catch (err: any) {
        console.error(`[Render Auto-Ping] Self-ping error: ${err.message}`);
      }
    }, 5 * 60 * 1000);
  }
}
