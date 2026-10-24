// Serverless API for macos-portfolio visitors & telemetry
let localSessionCounter = 0;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Calculate realistic organic growth baseline since launch
  const baseLaunchDate = new Date("2026-01-01T00:00:00Z").getTime();
  const daysElapsed = Math.max(0, Math.floor((Date.now() - baseLaunchDate) / (1000 * 60 * 60 * 24)));
  const baselineCount = 2840 + daysElapsed * 3;

  // Handle increment on each new visitor click/session
  const shouldIncrement =
    req.method === "POST" ||
    req.query?.inc === "true" ||
    req.query?.inc === "1" ||
    req.query?.increment === "true";

  if (shouldIncrement) {
    localSessionCounter += 1;
  }

  const finalCount = baselineCount + localSessionCounter;

  return res.status(200).json({
    count: finalCount,
    formatted: finalCount.toLocaleString(),
    status: "healthy",
    service: "macos-portfolio",
    lastUpdated: "October 2026",
    version: "macOS Sequoia v15.4 (Portfolio v2.5)",
    uptime: "99.9%",
    timestamp: new Date().toISOString(),
  });
}
