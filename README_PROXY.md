# 🔌 Apps Script Proxy — Instalación paso a paso

> Tiempo: **3-5 minutos**. Una sola vez.

Este proxy lee tu Google Sheet desde el servidor y lo entrega al dashboard **sin el caché agresivo** del endpoint `/export?format=csv`. Eso resuelve el problema de "pego filas nuevas y el dashboard no se actualiza".

---

## 🪜 Paso 1 — Abre Apps Script

1. Ve a [script.google.com](https://script.google.com) (con la misma cuenta Google donde está el Sheet)
2. Click en **"Nuevo proyecto"** (esquina superior izquierda)
3. Te abrirá el editor con un `Code.gs` vacío

---

## 🪜 Paso 2 — Pega el código del proxy

1. Abre el archivo `proxy-google-sheet-apps-script.js` que está en esta misma carpeta
2. Selecciona **todo el contenido** (Cmd+A / Ctrl+A)
3. **Cópialo** (Cmd+C / Ctrl+C)
4. Vuelve al editor de Apps Script
5. **Selecciona todo** el código por defecto que aparece en `Code.gs` y bórralo
6. **Pega** el código del proxy (Cmd+V / Ctrl+V)

> 💡 Verás que arriba en el archivo hay un bloque `CONFIG` con tu `SHEET_ID` y `SHEET_GID` ya configurados. No necesitas cambiar nada.

---

## 🪜 Paso 3 — Guarda el proyecto

1. Click en el ícono del disquete (o Cmd+S / Ctrl+S)
2. Te pedirá un nombre: escribe **`LICMAN Proxy`** (o el que prefieras)
3. Click **"Guardar"**

---

## 🪜 Paso 4 — Despliega como Web App

1. Click en el botón azul **"Implementar"** (arriba a la derecha)
2. Selecciona **"Nueva implementación"**
3. Click en el ícono de ⚙️ engranaje (al lado del selector de tipo) → elige **"Aplicación web"**
4. Configura:
   - **Descripción**: `Proxy LICMAN v1` (o lo que quieras)
   - **Ejecutar como**: **`Yo`** (tu correo) ← IMPORTANTE
   - **Quién tiene acceso**: **`Cualquier persona`** ← IMPORTANTE (sin esto el dashboard no podrá llamarlo)
5. Click **"Implementar"**
6. Te pedirá autorización:
   - Click **"Autorizar acceso"**
   - Elige tu cuenta Google
   - Puede aparecer **"Esta aplicación no está verificada"** → click **"Opciones avanzadas"** → **"Ir a LICMAN Proxy (no seguro)"**
   - Click **"Permitir"**
7. ✅ **Listo**: te mostrará una URL que termina en `/exec`. **Cópiala** — la necesitas en el siguiente paso.

La URL se ve así:
```
https://script.google.com/macros/s/AKfycbx...larga.../exec
```

---

## 🪜 Paso 5 — Conecta el dashboard al proxy

1. Abre tu dashboard (sea local o en `kpi-licman.netlify.app`)
2. Click en el botón **"⚙ Configurar fuente"** (arriba a la derecha)
3. En el campo **"URL del Google Sheet"** pega la URL `/exec` que copiaste
4. Click **"Guardar y actualizar"**
5. ✅ El dashboard debería mostrar `✓ Datos en vivo · X registros · actualizado HH:MM:SS`

> 💡 A partir de ahora el dashboard lee **del proxy**, no directamente del Sheet. Eso significa que aunque Google cachee el Sheet, el proxy siempre lee lo más reciente.

---

## 🧪 Cómo verificar que funciona

### Test rápido desde el navegador
Abre la URL del proxy en otra pestaña y agrega `?diag=1` al final:
```
https://script.google.com/macros/s/AKfycbx.../exec?diag=1
```
Deberías ver un JSON con:
- `availableSheets`: lista de pestañas del Sheet
- `lastRow`, `lastCol`: dimensiones del Sheet

### Test rápido desde Apps Script
1. En el editor de Apps Script, abre el selector de funciones (arriba, junto al botón "Ejecutar")
2. Elige **`testProxy`**
3. Click **"Ejecutar"**
4. Mira el log (menú **"Ver" → "Registros"** o `Ctrl+Enter`)
5. Deberías ver el header del CSV y la metadata

---

## 🔄 Actualizar el proxy después de hacer cambios

Si modificas el código del proxy:
1. Click **"Implementar"** → **"Gestionar implementaciones"**
2. Click en el ícono ✏️ lápiz de tu implementación
3. Versión → **"Nueva versión"**
4. Click **"Implementar"**
5. La URL `/exec` **no cambia**, así que no tienes que reconfigurar el dashboard

---

## ❓ Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| El dashboard dice "Error al cargar" | URL del proxy mal copiada o proxy sin autorizar | Vuelve al Paso 4 y verifica acceso "Cualquier persona" |
| `Sheet no encontrado con gid=X` | El GID cambió | Revisa la URL de tu Sheet, edita `CONFIG.SHEET_GID` en el código, reimplementa |
| Datos viejos después de pegar filas | El navegador cacheó la respuesta | Click **"Actualizar ahora"** en el dashboard (usa cache-buster `?_t=...`) |
| `ScriptError: No tiene acceso` | Falta autorización o el Sheet no es tuyo | Verifica que ejecutas como "Yo" y que tu cuenta es dueña del Sheet |
| El dashboard no muestra nada nuevo | Estás pegando filas sin las fórmulas `_Final` | Asegúrate de que las filas tengan todas las columnas hasta `Estado_Final` (columna AB) |

---

## 🗑 Cómo deshacer

Si quieres volver al modo anterior (lectura directa del Sheet):
1. Abre el dashboard
2. Click **"⚙ Configurar fuente"**
3. Reemplaza la URL del proxy por la URL directa del Sheet:
   ```
   https://docs.google.com/spreadsheets/d/1XTcgYVS-RrX4wWDb_Etjg0lrBgJBqP1LwT8n-9L61nc/export?format=csv&gid=606760141
   ```
4. Guardar

---

## 📊 Endpoints útiles del proxy

| URL | Devuelve | Para qué sirve |
|---|---|---|
| `/exec` | CSV con metadata al final | Consumo principal del dashboard |
| `/exec?diag=1` | JSON con info del Sheet | Diagnosticar si el proxy lee bien |
| `/exec?ping=1` | JSON minimal con timestamp | Verificar que el proxy responde |

---

**Hecho con 🛠 para LICMAN — Mantenimiento KPI Dashboard**