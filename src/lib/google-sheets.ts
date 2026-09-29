import { Registration } from "@/types/database";
import { formatDateTime } from "./utils";

/**
 * Google Sheets API Integration Service
 * Uses Google Service Account to sync registrations to target spreadsheet.
 */
export async function appendRegistrationToSheet(registration: Registration, periodTitle: string): Promise<boolean> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    console.warn("[GoogleSheets] Service account credentials or SPREADSHEET_ID not configured. Skipping automated sheet sync.");
    return false;
  }

  try {
    // Generate JWT access token for Google API
    const token = await getGoogleAuthToken(serviceAccountEmail, privateKey);
    if (!token) {
      throw new Error("Failed to acquire Google OAuth token");
    }

    // Clean sheet tab title (e.g. "PPDB 2027-Gel 1")
    const sheetName = periodTitle.replace(/[\\/?*[\]]/g, "").slice(0, 30);

    // 1. Ensure sheet tab exists
    await ensureSheetExists(spreadsheetId, sheetName, token);

    // 2. Format row data
    const rowValues = [
      formatDateTime(registration.created_at),
      registration.reg_number,
      registration.registration_track.toUpperCase(),
      registration.full_name,
      `'${registration.nisn}`, // prefix with ' so leading zeroes aren't dropped in sheets
      `'${registration.nik}`,
      registration.gender,
      `${registration.birth_place}, ${registration.birth_date}`,
      registration.religion,
      registration.school_origin,
      registration.phone_number,
      registration.parent_name,
      registration.parent_phone,
      registration.address,
      registration.document_urls?.photo || "-",
      registration.document_urls?.kk || "-",
      registration.document_urls?.skl || "-",
      registration.status.toUpperCase(),
    ];

    // 3. Append row
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:R:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[GoogleSheets] Append failed:", errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[GoogleSheets] Unexpected error during sync:", error);
    return false;
  }
}

/**
 * Creates Google OAuth2 Token from Service Account Key
 */
async function getGoogleAuthToken(email: string, privateKey: string): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64UrlClaim = Buffer.from(JSON.stringify(claimSet)).toString("base64url");
  const signPayload = `${base64UrlHeader}.${base64UrlClaim}`;

  const crypto = await import("crypto");
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signPayload);
  signer.end();
  const signature = signer.sign(privateKey, "base64url");
  const assertion = `${signPayload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    console.error("[GoogleSheets] Token error:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Checks if target tab exists, if not creates it and prepends header
 */
async function ensureSheetExists(spreadsheetId: string, sheetTitle: string, token: string) {
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`;
  const metaRes = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!metaRes.ok) return;

  const metadata = await metaRes.json();
  const sheets: { properties: { title: string } }[] = metadata.sheets || [];
  const exists = sheets.some((s) => s.properties.title === sheetTitle);

  if (!exists) {
    // Add new tab sheet
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle,
              },
            },
          },
        ],
      }),
    });

    // Write Header Row
    const headerRow = [
      "Waktu Daftar",
      "No. Registrasi",
      "Jalur",
      "Nama Lengkap Siswa",
      "NISN",
      "NIK",
      "Jenis Kelamin",
      "Tempat, Tgl Lahir",
      "Agama",
      "Asal Sekolah",
      "No. HP Siswa",
      "Nama Orang Tua/Wali",
      "No. HP Orang Tua",
      "Alamat Lengkap",
      "URL Pas Foto",
      "URL KK",
      "URL SKL/Ijazah",
      "Status Verifikasi",
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:R1?valueInputOption=USER_ENTERED`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [headerRow],
      }),
    });
  }
}
