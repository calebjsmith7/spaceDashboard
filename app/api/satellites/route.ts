import { NextResponse } from "next/server";

const SPACE_TRACK_BASE = "https://www.space-track.org";
const SPACE_TRACK_AUTH = `${SPACE_TRACK_BASE}/ajaxauth/login`;
const SPACE_TRACK_QUERY = `${SPACE_TRACK_BASE}/basicspacedata/query/class/gp`;

// Get credentials from environment variables
const SPACE_TRACK_USER = process.env.SPACE_TRACK_USER;
const SPACE_TRACK_PASS = process.env.SPACE_TRACK_PASS;

// Map our category names to Space-Track query filters
// Space-Track GP class uses specific predicates
const CATEGORY_QUERIES: Record<string, string> = {
  // Space stations - filter by specific NORAD IDs for ISS, CSS, Tiangong
  stations: "/NORAD_CAT_ID/25544,48274,41765,59441/orderby/NORAD_CAT_ID/format/json",
  // Weather satellites - NOAA, GOES, METEOSAT
  weather: "/NORAD_CAT_ID/25338,28654,33591,43013,41866,43226,52752/orderby/NORAD_CAT_ID/format/json",
  // GPS operational satellites
  "gps-ops": "/OBJECT_NAME/~~GPS/DECAY_DATE/null-val/orderby/NORAD_CAT_ID/limit/32/format/json",
  // Science satellites - Hubble, Terra, Aqua, Landsat, James Webb
  science: "/NORAD_CAT_ID/20580,25994,27424,39084,50463/orderby/NORAD_CAT_ID/format/json",
  // Starlink - recent active ones
  starlink: "/OBJECT_NAME/~~STARLINK/DECAY_DATE/null-val/orderby/EPOCH%20desc/limit/50/format/json",
  // Active satellites - recent payloads
  active: "/OBJECT_TYPE/PAYLOAD/DECAY_DATE/null-val/orderby/EPOCH%20desc/limit/50/format/json",
};

// Store session cookie for reuse
let sessionCookie: string | null = null;
let sessionExpiry: number = 0;

async function getSpaceTrackSession(): Promise<string | null> {
  // Return cached session if still valid (sessions last ~2 hours)
  if (sessionCookie && Date.now() < sessionExpiry) {
    return sessionCookie;
  }

  if (!SPACE_TRACK_USER || !SPACE_TRACK_PASS) {
    console.error("Space-Track credentials not configured");
    return null;
  }

  try {
    const response = await fetch(SPACE_TRACK_AUTH, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `identity=${encodeURIComponent(SPACE_TRACK_USER)}&password=${encodeURIComponent(SPACE_TRACK_PASS)}`,
    });

    if (!response.ok) {
      console.error("Space-Track auth failed:", response.status);
      return null;
    }

    // Get the session cookie
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      sessionCookie = cookies.split(";")[0];
      // Set expiry to 1.5 hours from now (sessions last ~2 hours)
      sessionExpiry = Date.now() + 90 * 60 * 1000;
      return sessionCookie;
    }

    return null;
  } catch (error) {
    console.error("Space-Track auth error:", error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "Category parameter is required" },
      { status: 400 }
    );
  }

  const queryPath = CATEGORY_QUERIES[category];
  if (!queryPath) {
    return NextResponse.json(
      { error: `Unknown category: ${category}` },
      { status: 400 }
    );
  }

  // Get authenticated session
  const cookie = await getSpaceTrackSession();
  if (!cookie) {
    return NextResponse.json(
      { error: "Space-Track authentication failed. Check credentials." },
      { status: 401 }
    );
  }

  try {
    const url = `${SPACE_TRACK_QUERY}${queryPath}`;
    console.log(`Fetching from Space-Track: ${url}`);

    const response = await fetch(url, {
      headers: {
        Cookie: cookie,
      },
      // Cache for 2 hours
      next: { revalidate: 7200 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Space-Track error for ${category}:`, response.status, errorText);
      
      // If unauthorized, clear session and retry once
      if (response.status === 401) {
        sessionCookie = null;
        sessionExpiry = 0;
      }
      
      return NextResponse.json(
        { error: `Space-Track API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Fetched ${data.length} satellites for ${category}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${category} satellites:`, error);
    return NextResponse.json(
      { error: "Failed to fetch satellite data" },
      { status: 500 }
    );
  }
}
