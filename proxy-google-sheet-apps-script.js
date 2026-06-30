/**
 * ============================================================
 *  LICMAN Dashboard — Google Apps Script Proxy
 * ============================================================
 *
 *  Lee un Google Sheet y lo expone como CSV sin caché.
 *  Soluciona el problema de caché agresivo del endpoint
 *  /export?format=csv de Google Sheets.
 *
 *  CÓMO DESPLEGAR (resumen; ver README_PROXY.md para detalle):
 *    1. Abre https://script.google.com → "Nuevo proyecto"
 *    2. Pega TODO este archivo en el editor (Code.gs)
 *    3. Edita CONFIG abajo si tu Sheet/GID cambia
 *    4. Implementar → "Aplicación web"
 *         Ejecutar como: Yo
 *         Acceso:         Cualquier persona
 *    5. Copia la URL "/exec" que te da Google
 *    6. Pégala en el dashboard: botón "Configurar fuente"
 * ============================================================
 */

// ============================================================
// CONFIGURACIÓN — ajusta aquí si tu Sheet cambia
// ============================================================
const CONFIG = {
  // ID del spreadsheet (lo sacas de la URL entre /d/ y /edit)
  SHEET_ID: '1XTcgYVS-RrX4wWDb_Etjg0lrBgJBqP1LwT8n-9L61nc',

  // GID de la pestaña (lo sacas del final de la URL: #gid=XXXXXXX)
  SHEET_GID: 606760141,

  // Zona horaria para serializar fechas (ej: 'America/Santiago')
  TIMEZONE: 'America/Santiago',

  // Máximo de filas a devolver (defensa contra Sheets enormes)
  MAX_ROWS: 50000,
};

// ============================================================
// HTTP HANDLER — entrypoint del Web App
// ============================================================
function doGet(e) {
  const params = (e && e.parameter) || {};
  const startTime = Date.now();

  // Endpoint de diagnóstico: ?diag=1 → JSON con info del Sheet
  if (params.diag === '1') {
    return handleDiagnostic();
  }

  // Endpoint de ping: ?ping=1 → JSON minimalista para verificar
  // que el proxy responde sin descargar todo el CSV
  if (params.ping === '1') {
    return jsonResponse_({
      ok: true,
      serverTimestamp: new Date().toISOString(),
      timezone: CONFIG.TIMEZONE,
      sheetId: CONFIG.SHEET_ID,
      gid: CONFIG.SHEET_GID,
    });
  }

  // Endpoint principal: CSV
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = findSheet_(ss, CONFIG.SHEET_GID);

    if (!sheet) {
      return jsonResponse_({
        ok: false,
        error: 'Sheet no encontrado con gid=' + CONFIG.SHEET_GID,
        availableSheets: ss.getSheets().map(function (s) {
          return { name: s.getName(), gid: s.getSheetId() };
        }),
      }, 404);
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow === 0 || lastCol === 0) {
      return csvResponse_('', {
        rowCount: 0,
        sheetName: sheet.getName(),
        elapsedMs: Date.now() - startTime,
      });
    }

    // Limitar filas por seguridad
    const numRows = Math.min(lastRow, CONFIG.MAX_ROWS);
    const range = sheet.getRange(1, 1, numRows, lastCol);
    const data = range.getValues();

    const csv = toCsv_(data, CONFIG.TIMEZONE);

    return csvResponse_(csv, {
      rowCount: data.length - 1, // excluye encabezado
      totalRows: data.length,
      cols: lastCol,
      sheetName: sheet.getName(),
      serverTimestamp: new Date().toISOString(),
      elapsedMs: Date.now() - startTime,
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      error: String(err && err.message ? err.message : err),
      hint: 'Verifica que el SHEET_ID sea correcto y que tengas acceso al Sheet.',
    }, 500);
  }
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Busca una pestaña por GID. Si no la encuentra, devuelve null.
 */
function findSheet_(ss, gid) {
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) return sheets[i];
  }
  return null;
}

/**
 * Serializa una matriz 2D a CSV respetando RFC 4180:
 *  - Celdas con coma, comilla o salto de línea se envuelven en "..."
 *  - Comillas internas se duplican
 *  - Fechas se formatean como YYYY-MM-DD HH:mm:ss
 */
function toCsv_(data, timezone) {
  return data
    .map(function (row) {
      return row
        .map(function (cell) {
          return csvEscape_(cell, timezone);
        })
        .join(',');
    })
    .join('\n');
}

function csvEscape_(value, timezone) {
  if (value === null || value === undefined) return '';

  let str;
  if (value instanceof Date) {
    str = Utilities.formatDate(value, timezone, 'yyyy-MM-dd HH:mm:ss');
  } else {
    str = String(value);
  }

  const needsQuoting =
    str.indexOf(',') !== -1 ||
    str.indexOf('"') !== -1 ||
    str.indexOf('\n') !== -1 ||
    str.indexOf('\r') !== -1;
  if (needsQuoting) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Devuelve el CSV con metadatos en una segunda línea comentada.
 * La primera línea es el CSV puro (parseable por Papa.parse).
 * La segunda línea es metadata JSON prefijada con "# " para
 * que Papa.parse la ignore si tiene `comments: true`, o el
 * dashboard puede leerla y removerla.
 *
 * Formato de la segunda línea:
 *   # {"serverTimestamp":"...","rowCount":...,"sheetName":"..."}
 *
 * Esto le da al dashboard información del servidor sin necesidad
 * de un endpoint separado.
 */
function csvResponse_(csv, meta) {
  const metaLine = '# ' + JSON.stringify(meta || {});
  const body = csv + '\n' + metaLine;
  const output = ContentService.createTextOutput(body);
  output.setMimeType(ContentService.MimeType.CSV);
  return output;
}

function jsonResponse_(obj, status) {
  // Apps Script no permite fijar HTTP status arbitrario en Web Apps,
  // pero sí podemos incluir el código en el cuerpo
  const payload = Object.assign({ status: status || 200 }, obj);
  const output = ContentService.createTextOutput(JSON.stringify(payload, null, 2));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ============================================================
// DIAGNÓSTICO — ejecuta esta función desde el editor
// de Apps Script (botón "Ejecutar") para probar que el
// proxy lee bien tu Sheet sin necesidad de desplegar.
// ============================================================
function testProxy() {
  const result = doGet({ parameter: {} });
  const content = result.getContent();
  const lines = content.split('\n');
  Logger.log('Total lines: ' + lines.length);
  Logger.log('Header: ' + lines[0]);
  Logger.log('First data row: ' + (lines[1] || '(empty)'));
  Logger.log('Last line (metadata): ' + (lines[lines.length - 1] || '(empty)'));
  Logger.log('---');
  Logger.log('First 1500 chars of body:');
  Logger.log(content.substring(0, 1500));
  return content;
}

function testDiagnostic() {
  const result = doGet({ parameter: { diag: '1' } });
  Logger.log(result.getContent());
  return result.getContent();
}