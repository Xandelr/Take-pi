function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja 1");
  const data = sheet.getDataRange().getValues();

  // Verifica que haya datos y que haya más de una fila (para evitar error si solo hay encabezados)
  if (data && data.length > 1) {
    const lastRow = data[data.length - 1]; // Obtiene la última fila
    const temperatura = lastRow[0];
    const fecha = lastRow[1];

    const output = {
      temperatura: temperatura,
      fecha: fecha
    };

    return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
  } else {
    const errorOutput = {
      error: "No hay datos disponibles en la hoja de cálculo."
    };
    return ContentService.createTextOutput(JSON.stringify(errorOutput)).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja 1"); // Asegúrate de que el nombre de la hoja sea correcto importanteee!!!!!!! 

    // Verifica que el evento 'e' y sus parámetros existan
    if (e && e.parameter) {
      const temperatura = e.parameter.temperatura;
      const fecha = e.parameter.fecha;

      // Registra los datos en la hoja de cálculo
      sheet.appendRow([temperatura, fecha]);

      // Devuelve una respuesta de éxito
      return ContentService.createTextOutput("Datos recibidos correctamente");
    } else {
      // Devuelve un error si no hay parámetros
      return ContentService.createTextOutput("Error: No se recibieron datos").setMimeType(ContentService.MimeType.TEXT);
    }
  } catch (error) {
    // Registra el error en el log del script
    Logger.log(error);
    // Devuelve un mensaje de error
    return ContentService.createTextOutput("Error al procesar la solicitud: " + error).setMimeType(ContentService.MimeType.TEXT);
  }
}
