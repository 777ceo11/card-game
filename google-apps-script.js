/**
 * Updated Google Apps Script for saving results AND fetching Top 3 Ranking.
 * (Extensions > Apps Script in your Google Sheet)
 * 
 * After updating, REDEPLOY:
 * 1. "Deploy" > "New Deployment"
 * 2. Description: Top 3 Ranking added
 * 3. Access: Anyone
 */

const SHEET_NAME = 'Sheet1'; // Make sure this matches your sheet tab name

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const data = JSON.parse(e.postData.contents);
    
    const timestamp = new Date();
    const name = data.name || "Unknown";
    const finishTime = data.finishTime || 0;
    
    sheet.appendRow([timestamp, name, finishTime]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    
    // Skip header and convert to objects
    const data = rows.slice(1).map(row => ({
      timestamp: row[0],
      name: row[1],
      finishTime: row[2]
    })).filter(item => item.name && item.finishTime);
    
    // Sort by finishTime ASC and get top 3
    const ranking = data.sort((a, b) => a.finishTime - b.finishTime).slice(0, 3);
    
    return ContentService.createTextOutput(JSON.stringify(ranking))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
