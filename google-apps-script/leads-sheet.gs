/**
 * PROXe lead sink — Google Apps Script Web App.
 *
 * Receives POSTs from the site's /api/lead route and appends/updates rows in the
 * leads spreadsheet. Upserts by email: a 'lead' creates or updates the contact
 * row; a 'booking' fills the Booking columns on that same row.
 *
 * ── One-time setup ─────────────────────────────────────────────────────────
 * 1. Open the sheet:
 *    https://docs.google.com/spreadsheets/d/1Kn-q0yfMZLEJ6mWqvMdQVfMhRfTg8dWTmSdxyW3bw6E/edit
 * 2. Extensions → Apps Script. Delete any boilerplate, paste this whole file, Save.
 * 3. Deploy → New deployment → type "Web app".
 *      - Execute as:  Me
 *      - Who has access:  Anyone
 *    Deploy, authorise when prompted, and COPY the "Web app URL"
 *    (https://script.google.com/macros/s/……/exec).
 * 4. Put that URL in the site's server env as LEADS_WEBHOOK_URL, then redeploy
 *    the site. Done — submissions now land in the sheet.
 *
 * To re-deploy after editing: Deploy → Manage deployments → edit → Version: New.
 */

var SHEET_ID = '1Kn-q0yfMZLEJ6mWqvMdQVfMhRfTg8dWTmSdxyW3bw6E';
var TAB_NAME = 'Web Leads'; // the tab data is written to
var HEADERS = [
  'Received At', 'Name', 'Email', 'Phone', 'Brand', 'Website',
  'CTA', 'Booking Date', 'Booking Time',
  'Channel', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Referrer', 'Landing Page',
];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

/** Find the 1-based row index of the most recent row matching this email. */
function findRowByEmail_(sheet, email) {
  if (!email) return -1;
  var values = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 0), 1).getValues(); // col C = Email
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim().toLowerCase() === email.trim().toLowerCase()) {
      return i + 2; // +2: header row + 0-based → 1-based
    }
  }
  return -1;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var email = data.email || '';
    var existingRow = findRowByEmail_(sheet, email);

    if (data.type === 'booking') {
      // Only update the Booking columns on the matching lead row.
      if (existingRow > 0) {
        sheet.getRange(existingRow, 8).setValue(data.bookingDate || ''); // H
        sheet.getRange(existingRow, 9).setValue(data.bookingTime || ''); // I
      } else {
        // No prior lead row (edge case) — append a booking-only row.
        sheet.appendRow([
          data.receivedAt || new Date().toISOString(), '', email, '', '', '',
          data.source || '', data.bookingDate || '', data.bookingTime || '',
          data.channel || '', data.utmSource || '', data.utmMedium || '',
          data.utmCampaign || '', data.referrer || '', data.landingPage || '',
        ]);
      }
    } else {
      // 'lead' — upsert the contact row (incl. first-touch attribution).
      var row = [
        data.receivedAt || new Date().toISOString(),
        data.name || '', email, data.phone || '', data.brand || '',
        data.website || '', data.source || '', data.bookingDate || '', data.bookingTime || '',
        data.channel || '', data.utmSource || '', data.utmMedium || '',
        data.utmCampaign || '', data.referrer || '', data.landingPage || '',
      ];
      if (existingRow > 0) {
        sheet.getRange(existingRow, 1, 1, HEADERS.length).setValues([row]);
      } else {
        sheet.appendRow(row);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Optional: visit the /exec URL in a browser to confirm it's deployed. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'proxe-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}
