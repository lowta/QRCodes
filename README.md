# QR Counter

Bóveda pública de QR con el estilo de DSPTools2.0. Web estática en GitHub Pages, sin base de datos, servicios externos ni tokens. Búsqueda por nombre, dirección, ciudad, ID o código manual. QR en popup y botón **Copiar código manual**.

## Publicación inicial

Crear un repositorio público `qrcounter`, subir este proyecto a la rama `main` y seleccionar **Settings → Pages → Source → GitHub Actions**. El workflow valida los datos y publica la web. No requiere instalar dependencias.

## Agregar counters

Abrir `https://lowta.github.io/qrcounter/agregar/` (no hay enlace en la página principal). Completar los campos, descargar el ZIP y extraerlo. Pulsar **Abrí GitHub para agregar**, arrastrar la carpeta numerada completa y confirmar con **Commit changes**. Esperar a que termine Actions antes de agregar el siguiente.

La página propone el siguiente ID disponible. Los IDs son fijos, no nombres: `001`, `002`, …, `999`, `1000`. No renumerar al editar. Si otra persona agrega simultáneamente, revisar el repo antes de subir para no sobrescribir una carpeta.

```text
counters/
  001/
    datos.json
    qr.png
  002/
    datos.json
    qr.jpg
```

Ejemplo de `datos.json` (sustituir por datos reales):

```json
{
  "nombre": "Nombre del counter",
  "direccion": "Calle y número",
  "ciudad": "Ciudad",
  "codigoManual": "codigo-del-cartel",
  "qr": "qr.png"
}
```

La imagen debe ser PNG, JPG o WebP, hasta 10 MB. El código manual es texto y conserva ceros iniciales. No se interpreta como el contenido del QR. Se muestra la imagen proporcionada, sin alterar su contenido. Preferir QR recortado, completo, nítido y con margen blanco.

No hay un límite fijo de counters en el código; aplican los límites de GitHub/Pages. El índice se genera automáticamente al publicar. Los códigos manuales duplicados y registros incompletos detienen la publicación para evitar errores.

Para editar, modificar `datos.json` o reemplazar la imagen en GitHub. Para eliminar, borrar la carpeta completa y confirmar el cambio. Git conserva el historial. `/agregar/` está fuera del menú, pero no es privada: la escritura la protege la sesión de GitHub.

## Desarrollo

Node.js 22 o superior. `npm test`, `npm run build`, `npm run dev`. Abrir http://127.0.0.1:4173. Sin conexión no se garantiza disponibilidad: no se implementa caché offline. La copia al portapapeles requiere HTTPS o localhost.
