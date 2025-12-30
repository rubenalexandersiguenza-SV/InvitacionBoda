/**
 * Código para Google Apps Script
 * 
 * INSTRUCCIONES:
 * 1. Ve a tu hoja de Google Sheets
 * 2. Extensiones → Apps Script
 * 3. Pega este código completo
 * 4. Guarda el proyecto
 * 5. Despliega como Aplicación Web (ver GOOGLE_SHEETS_SETUP.md)
 */

function doPost(e) {
  try {
    // Obtener la hoja activa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Crear timestamp
    const timestamp = new Date();
    
    // Agregar los datos a la hoja en el orden correcto:
    // Nombre, Apellido, Respuesta, Mensaje, Fecha
    sheet.appendRow([
      data.firstName || '',
      data.lastName || '',
      data.response || '',
      data.message || '',
      timestamp
    ]);
    
    // Retornar respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        message: 'Datos guardados correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // En caso de error, retornar mensaje de error
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función opcional para probar el script
 * Ejecuta esta función desde el editor de Apps Script para verificar que funciona
 */
function testScript() {
  const testData = {
    firstName: 'Test',
    lastName: 'Usuario',
    response: 'Sí',
    message: 'Mensaje de prueba'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

