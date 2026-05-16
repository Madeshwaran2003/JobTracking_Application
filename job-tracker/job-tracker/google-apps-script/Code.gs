/**
 * Job Application Tracker — Google Apps Script Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet with these column headers in Row 1:
 *    id | company | role | jobLink | location | dateApplied | status | notes
 *
 * 2. Open Extensions > Apps Script in your Google Sheet
 *
 * 3. Paste this entire code into the Apps Script editor (replace any existing code)
 *
 * 4. Deploy as a Web App:
 *    - Click Deploy > New Deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 *    - Copy the Web App URL
 *
 * 5. Add the URL to your .env file:
 *    VITE_API_URL=your_web_app_url_here
 *
 * 6. Rebuild/restart your React application
 */

const SHEET_NAME = 'Sheet1';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function getHeaders() {
  return ['id', 'company', 'role', 'jobLink', 'location', 'dateApplied', 'status', 'notes'];
}

/**
 * Helper: Convert sheet rows to array of objects
 */
function rowsToObjects(data) {
  if (!data || data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });
}

/**
 * Helper: Create JSON response
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET handler — Read all applications
 * Usage: GET ?action=read
 */
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const records = rowsToObjects(data);

    return jsonResponse({
      status: 'success',
      records: records,
      count: records.length
    });
  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * POST handler — Create a new application
 * Usage: POST with JSON body containing application fields
 */
function doPost(e) {
  try {
    const sheet = getSheet();
    const body = JSON.parse(e.postData.contents);

    // Generate unique ID
    const id = Utilities.getUuid();

    // Prepare row data
    const headers = getHeaders();
    const rowData = headers.map(header => {
      if (header === 'id') return id;
      return body[header] || '';
    });

    sheet.appendRow(rowData);

    // Create the record object to return
    const record = {};
    headers.forEach((header, i) => {
      record[header] = rowData[i];
    });

    return jsonResponse({
      status: 'success',
      message: 'Application added successfully',
      record: record
    });
  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * PUT handler — Update an existing application
 * Usage: PUT ?action=update&id=<id> with JSON body containing fields to update
 */
function doPut(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const id = e.parameter.id;
    if (!id) {
      return jsonResponse({
        status: 'error',
        message: 'Missing id parameter'
      });
    }

    // Find row with matching id
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      return jsonResponse({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Parse update data
    const body = JSON.parse(e.postData.contents);

    // Update only provided fields
    const updatedRecord = {};
    headers.forEach((header, colIndex) => {
      const col = colIndex + 1;
      if (header === 'id') {
        updatedRecord[header] = id;
        return;
      }
      if (body.hasOwnProperty(header)) {
        sheet.getRange(rowIndex, col).setValue(body[header]);
        updatedRecord[header] = body[header];
      } else {
        updatedRecord[header] = data[rowIndex - 1][colIndex];
      }
    });

    return jsonResponse({
      status: 'success',
      message: 'Application updated successfully',
      record: updatedRecord
    });
  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * DELETE handler — Delete an application
 * Usage: DELETE ?action=delete&id=<id>
 */
function doDelete(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();

    const id = e.parameter.id;
    if (!id) {
      return jsonResponse({
        status: 'error',
        message: 'Missing id parameter'
      });
    }

    // Find row with matching id
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      return jsonResponse({
        status: 'error',
        message: 'Application not found'
      });
    }

    sheet.deleteRow(rowIndex);

    return jsonResponse({
      status: 'success',
      message: 'Application deleted successfully'
    });
  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * Optional: Setup function to initialize the sheet headers
 * Run this function once from the Apps Script editor to set up column headers
 */
function setupSheet() {
  const sheet = getSheet();
  const headers = getHeaders();

  // Clear existing headers
  const firstRow = sheet.getRange(1, 1, 1, headers.length);
  firstRow.setValues([headers]);

  // Format headers
  firstRow.setFontWeight('bold');
  firstRow.setBackground('#4a86e8');
  firstRow.setFontColor('#ffffff');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  Logger.log('Sheet headers set up successfully!');
}
