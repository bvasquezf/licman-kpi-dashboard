# 🚀 Quickstart — Auto-clasificación en tu Google Sheet

> Esta guía te lleva paso a paso en 5 minutos. Vas a tener las fórmulas funcionando y tus datos existentes ya clasificados.

---

## ⏱ Tiempo: 5-10 minutos

---

## 🪜 Paso 1 — Abre tu Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Abre el Sheet donde tienes los 176 registros
3. Identifica la columna de **Observación** (la descripción del trabajo)
4. Mira arriba en la barra de letras (A, B, C...) hasta identificar en qué letra está Observación

> 💡 **Tip**: Click en una celda de la columna Observación → arriba verás `P2` (o la letra que sea). Esa es tu columna.

---

## 🪜 Paso 2 — Prepara la fórmula

Abre el archivo `FORMULAS_AUTO_CLASIFICACION.md` que te entregué. Identifica:

| Fórmula | Columna donde va | Letra probable |
|---|---|---|
| Tipo_Trabajo_Auto | `Tipo_Trabajo_Auto` | Q |
| Tipo_Falla_Auto | `Tipo_Falla_Auto` | R |
| Complejidad_Auto | `Complejidad_Auto` | S |
| Estado_Auto | `Estado_Auto` | T |
| Tipo_Trabajo_Final | `Tipo_Trabajo_Final` | Y |
| Tipo_Falla_Final | `Tipo_Falla_Final` | Z |
| Complejidad_Final | `Complejidad_Final` | AA |
| Estado_Final | `Estado_Final` | AB |

⚠️ **VERIFICA LAS LETRAS EXACTAS** mirando tu Sheet. Si están en otras posiciones, ajusta las letras de la fórmula.

---

## 🪜 Paso 3 — Pega la primera fórmula (Tipo_Trabajo_Auto)

1. Click en la celda **Q2** (o la que corresponda a `Tipo_Trabajo_Auto`)
2. Borra el contenido actual (si hay datos manuales)
3. Pega esta fórmula:

```
=ARRAYFORMULA(
  IF(P2:P="", "",
    IF(REGEXMATCH(LOWER(P2:P), "mantenci|preventiv|horas|250|500|1000"),
      "Mantención/Preventiva",
      IF(REGEXMATCH(LOWER(P2:P), "chequeo|revisi|diagn|evaluaci"),
        "Diagnóstico/Revisión",
        IF(REGEXMATCH(LOWER(P2:P), "falla|reparaci|arreglo|correctiv|no funciona|no opera"),
          "Correctiva",
          "Otro"
        )
      )
    )
  )
)
```

4. Presiona **Enter**
5. ✅ Debería auto-llenar TODAS las filas hacia abajo (los 176 registros se reclasifican en 2 segundos)

---

## 🪜 Paso 4 — Repite para las otras 3 columnas `_Auto`

Pega las fórmulas en R2, S2 y T2 siguiendo el mismo procedimiento.

---

## 🪜 Paso 5 — Pega las fórmulas `_Final`

Pega las 4 fórmulas `_Final` en Y2, Z2, AA2, AB2.

Estas toman `_Manual` si está lleno, si no `_Auto`.

---

## 🪜 Paso 6 — Verifica que todo funcione

1. **Mira algunas filas**: ¿los `_Auto` muestran el valor correcto?
2. **Mira el dashboard** (`kpi-licman.netlify.app`): ¿se actualizó?
3. **Prueba agregar una fila nueva** (abajo, fila 177):
   - Llena solo los datos básicos + descripción
   - Las fórmulas deberían auto-clasificar

---

## ⚠️ Si algo falla

| Síntoma | Causa probable | Solución |
|---|---|---|
| "Hay un problema con esta fórmula" | Comillas mal copiadas o letra de columna incorrecta | Borra y vuelve a pegar, verificando letra |
| Toda la columna dice "Otro" | Las palabras clave no matchean | Verifica que la columna referenciada tenga texto |
| "Circular dependency detected" | Alguna fórmula se referencia a sí misma | Revisa letra por letra |
| No se aplica a todas las filas | Falta `ARRAYFORMULA` o la fórmula no está en la fila correcta | Pega de nuevo desde la fila 2 |
| Resultados muy distintos a los manuales | Las palabras clave no cubren todos los casos | Ajusta los patrones (ver sección "Personalizar palabras clave" en el otro doc) |

---

## 🎯 Prueba rápida

Una vez todo pegado, agrega esta fila de prueba en la fila siguiente a tu última data:

```
ID: 999
Fuente: OT Taller
Técnico: Adolfo Concha
Especialidad: Tec. Combustion
Fecha_Inicio: 2026-07-01
Fecha_Termino: 2026-07-02
Fecha_Servicio: 2026-07-01
Cliente: (cualquiera)
Marca: Hyster
Equipo: 9999
Horómetro: 5000
Días_Trabajados: 1
Horas_Trabajadas: 8
Observación: "Se realiza cambio de aceite motor y filtro. Se ajusta freno delantero. Equipo queda operativo."
Repuestos: "Aceite 15W40, filtro aceite"
```

Debería auto-clasificar como:
- **Tipo_Trabajo_Auto**: Mantención/Preventiva (porque "cambio de aceite")
- **Tipo_Falla_Auto**: Hidráulica/Fluidos (porque "aceite", "filtro")
- **Complejidad_Auto**: Baja (descripción corta)
- **Estado_Auto**: Operativo (porque "operativo")

---

## 🧹 Limpieza opcional

Una vez que todo funciona, puedes:

1. **Borrar columnas `_Manual` vacías** (no las necesitas si no vas a sobreescribir)
   - ⚠️ Mejor déjalas — te dan flexibilidad para corregir

2. **Comparar los nuevos `_Auto` con los `_Manual` antiguos** para validar que las fórmulas funcionan bien

3. **Marcar visualmente** las filas donde el `_Auto` no coincide con el `_Final` antiguo (con formato condicional)

---

## 📞 ¿Necesitas ayuda?

Si te trabas, pásame:
- Pantallazo del error
- Las letras exactas de las columnas en tu Sheet
- Qué tipo de descripción no se está clasificando bien

Y te ayudo a ajustar.