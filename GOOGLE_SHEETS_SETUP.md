# Configuración de Google Sheets para RSVP

## Paso 1: Crear la Hoja de Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo
2. En la primera fila, agrega estos encabezados (en ese orden):
   - `Nombre`
   - `Apellido`
   - `Respuesta`
   - `Mensaje`
   - `Fecha`

## Paso 2: Configurar Google Apps Script

1. En tu hoja de Google Sheets, ve a **Extensiones** → **Apps Script**
2. Elimina todo el código que aparece por defecto
3. Copia y pega el siguiente código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Agregar timestamp
    const timestamp = new Date();
    
    // Agregar los datos a la hoja
    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.guests || '',
      data.message || '',
      timestamp
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Guarda el proyecto (Ctrl+S o Cmd+S) y dale un nombre, por ejemplo: "RSVP Handler"

## Paso 3: Desplegar como Aplicación Web

1. Haz clic en **Desplegar** → **Nueva implementación**
2. Selecciona tipo: **Aplicación web**
3. Configura:
   - **Descripción**: "RSVP Form Handler"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: "Cualquiera"
4. Haz clic en **Desplegar**
5. **IMPORTANTE**: Copia la **URL de la aplicación web** que aparece (algo como: `https://script.google.com/macros/s/...`)
https://script.google.com/macros/s/AKfycbzMCdxt6JcEzEAXCtolxzlG8X0gdPy9_c7flZjFYK1tbom0kXurHUqDBbLzcEsPZI7J3g/exec
6. Autoriza el acceso cuando te lo solicite (haz clic en "Revisar permisos" y autoriza)

## Paso 4: Actualizar el código del sitio

1. Abre el archivo `script.js` en tu proyecto
2. Busca la variable `GOOGLE_SCRIPT_URL` y reemplaza el valor con la URL que copiaste en el paso anterior

## Paso 5: Probar

1. Abre tu sitio web
2. Completa el formulario RSVP
3. Verifica que los datos aparezcan en tu hoja de Google Sheets

## Notas importantes:

- La URL de la aplicación web es pública, pero solo puede escribir en tu hoja de cálculo
- Cada vez que actualices el código de Apps Script, necesitarás crear una nueva implementación
- Los datos se agregarán automáticamente con un timestamp

