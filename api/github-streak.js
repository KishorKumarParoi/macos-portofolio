// Live GitHub Streak API (SVG + JSON) backed directly by GitHub's public contribution calendar
const DEFAULT_USER = "KishorKumarParoi";

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getBdtToday() {
  const now = new Date(Date.now() + 6 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

function formatShortDate(isoDate) {
  if (!isoDate) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, m, d] = isoDate.split("-");
  const monthIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
  return `${months[monthIdx]} ${parseInt(d, 10)}, ${y}`;
}

function formatRangeShort(startIso, endIso) {
  if (!startIso || !endIso) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [, sm, sd] = startIso.split("-");
  const [, em, ed] = endIso.split("-");
  const sLabel = `${months[parseInt(sm, 10) - 1]} ${parseInt(sd, 10)}`;
  const eLabel = `${months[parseInt(em, 10) - 1]} ${parseInt(ed, 10)}`;
  return sLabel === eLabel ? sLabel : `${sLabel} - ${eLabel}`;
}

async function fetchYearContributions(username, year) {
  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`;
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "kishor-portfolio-telemetry/1.0",
      "Accept": "text/html",
    },
  });
  if (!resp.ok) {
    return { year, total: 0, days: {} };
  }
  const html = await resp.text();
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+(?:the\s+last\s+year|\d{4})/);
  const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 0;
  const days = {};
  const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    days[match[1]] = parseInt(match[2], 10);
  }
  return { year, total, days };
}

function computeStreakStats(mergedDays, todayIso) {
  const dates = Object.keys(mergedDays)
    .filter((d) => d <= todayIso)
    .sort();

  let longestStreak = 0;
  let longestStart = "";
  let longestEnd = "";
  let run = 0;
  let runStart = "";
  let firstActive = "";

  for (const d of dates) {
    if (mergedDays[d] > 0) {
      if (!firstActive) firstActive = d;
      if (run === 0) runStart = d;
      run += 1;
      if (run > longestStreak) {
        longestStreak = run;
        longestStart = runStart;
        longestEnd = d;
      }
    } else {
      run = 0;
      runStart = "";
    }
  }

  let currentStreak = 0;
  let currentStart = "";
  let currentEnd = "";
  let idx = dates.length - 1;

  // If today is still 0, allow active streak up through yesterday; otherwise count backward from today
  if (idx >= 0 && mergedDays[dates[idx]] === 0 && idx > 0 && mergedDays[dates[idx - 1]] > 0) {
    idx -= 1;
  }

  if (idx >= 0 && mergedDays[dates[idx]] > 0) {
    currentEnd = dates[idx];
    while (idx >= 0 && mergedDays[dates[idx]] > 0) {
      currentStart = dates[idx];
      currentStreak += 1;
      idx -= 1;
    }
  }

  return {
    firstActive,
    currentStreak,
    currentStart,
    currentEnd,
    longestStreak,
    longestStart,
    longestEnd,
    recent14: dates.slice(-14).map((date) => ({ date, level: mergedDays[date] })),
  };
}

function renderStreakSvg({ username, totalContributions, stats }) {
  const totalFormatted = escapeXml(totalContributions.toLocaleString("en-US"));
  const totalRange = stats.firstActive ? `${formatShortDate(stats.firstActive)} - Present` : "All Time";
  const currentRange = stats.currentStreak > 0 ? formatRangeShort(stats.currentStart, stats.currentEnd) : "No Active Streak";
  const longestRange = stats.longestStreak > 0 ? formatRangeShort(stats.longestStart, stats.longestEnd) : "-";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" role="img" aria-label="${escapeXml(username)} GitHub Streak: ${stats.currentStreak} Days">
  <rect width="495" height="195" rx="6" fill="#1a1b27" stroke="#2f334d" stroke-width="1"/>

  <!-- Column Dividers -->
  <line x1="165" y1="30" x2="165" y2="165" stroke="#2f334d" stroke-width="1"/>
  <line x1="330" y1="30" x2="330" y2="165" stroke="#2f334d" stroke-width="1"/>

  <!-- Total Contributions -->
  <text x="82.5" y="78" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="28" font-weight="700" fill="#70a5fd">${totalFormatted}</text>
  <text x="82.5" y="110" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="13.5" font-weight="500" fill="#a9b1d6">Total Contributions</text>
  <text x="82.5" y="135" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="11.5" fill="#38bdae">${escapeXml(totalRange)}</text>

  <!-- Current Streak Ring & Flame -->
  <circle cx="247.5" cy="71" r="36" fill="none" stroke="#bf91f3" stroke-width="4.5" stroke-opacity="0.9"/>
  <circle cx="247.5" cy="35" r="9" fill="#1a1b27"/>
  <path d="M247.5 27c2 3.2 4.5 5 4.5 8a4.5 4.5 0 1 1-9 0c0-1.9.9-3.6 2.1-4.8-.1 1.3.7 2.2 1.7 2.2.8 0 1.4-.7 1.4-1.7 0-1.2-.7-2.6-.7-3.7z" fill="#ff9e64"/>
  <text x="247.5" y="81" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="27" font-weight="800" fill="#bf91f3">${stats.currentStreak}</text>
  <text x="247.5" y="131" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="14" font-weight="700" fill="#bf91f3">Current Streak</text>
  <text x="247.5" y="153" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="11.5" fill="#38bdae">${escapeXml(currentRange)}</text>

  <!-- Longest Streak -->
  <text x="412.5" y="78" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="28" font-weight="700" fill="#70a5fd">${stats.longestStreak}</text>
  <text x="412.5" y="110" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="13.5" font-weight="500" fill="#a9b1d6">Longest Streak</text>
  <text x="412.5" y="135" text-anchor="middle" font-family="'Segoe UI', Ubuntu, Arial, sans-serif" font-size="11.5" fill="#38bdae">${escapeXml(longestRange)}</text>
</svg>`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const rawUser = String(req.query?.user || DEFAULT_USER).replace(/[^a-zA-Z0-9-]/g, "") || DEFAULT_USER;
    const todayIso = getBdtToday();
    const currentYear = parseInt(todayIso.slice(0, 4), 10);
    const years = [];
    for (let y = 2020; y <= currentYear; y += 1) years.push(y);

    const results = await Promise.all(years.map((y) => fetchYearContributions(rawUser, y)));
    let totalContributions = 0;
    const mergedDays = {};
    for (const item of results) {
      totalContributions += item.total;
      Object.assign(mergedDays, item.days);
    }

    const stats = computeStreakStats(mergedDays, todayIso);

    if (req.query?.format === "json") {
      return res.status(200).json({
        username: rawUser,
        asOf: todayIso,
        totalContributions,
        currentStreak: stats.currentStreak,
        currentRange: `${stats.currentStart} -> ${stats.currentEnd}`,
        longestStreak: stats.longestStreak,
        longestRange: `${stats.longestStart} -> ${stats.longestEnd}`,
        recent14Days: stats.recent14,
        updatedAt: new Date().toISOString(),
      });
    }

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(200).send(renderStreakSvg({ username: rawUser, totalContributions, stats }));
  } catch (err) {
    return res.status(500).json({ error: "Failed to compute GitHub streak telemetry", detail: err.message });
  }
}
