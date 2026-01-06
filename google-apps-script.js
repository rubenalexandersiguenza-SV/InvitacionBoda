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
    // Verificar que existan los datos
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'No se recibieron datos' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener la hoja activa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos recibidos
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Error al parsear JSON: ' + parseError.toString() 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validar que existan los campos requeridos
    if (!data.firstName || !data.response) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Faltan campos requeridos (firstName o response)' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Crear timestamp
    const timestamp = new Date();
    
    // Agregar los datos a la hoja en el orden correcto:
    // Nombre, Apellido (vacío), Respuesta, Mensaje, Fecha
    sheet.appendRow([
      data.firstName || '',
      '', // Apellido ya no se usa, se mantiene vacío para compatibilidad
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
 * Función para verificar si un invitado ya confirmó su asistencia
 * Se llama con: GET /exec?action=check&name=Nombre%20del%20Invitado
 * 
 * IMPORTANTE: Después de agregar esta función, debes volver a desplegar la aplicación web
 * para que los cambios surtan efecto.
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'check') {
      const name = e.parameter.name;
      
      if (!name) {
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            error: 'Nombre no proporcionado' 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Obtener la hoja activa
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // Obtener todos los datos (asumiendo que la columna A tiene el nombre)
      const data = sheet.getDataRange().getValues();
      
      // Buscar si existe una respuesta para este nombre
      // Saltar la primera fila (encabezados) si existe
      let found = false;
      for (let i = 1; i < data.length; i++) {
        const rowName = data[i][0]; // Columna A (nombre)
        if (rowName && rowName.toString().trim().toLowerCase() === name.toString().trim().toLowerCase()) {
          found = true;
          break;
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true,
          confirmed: found
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Acción no válida' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
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
    firstName: 'Test Usuario',
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

