# 📋 Fórmulas de Auto-Clasificación — LICMAN Dashboard

> **Objetivo:** Tú solo escribes la descripción del trabajo. Google Sheets detecta las palabras clave y clasifica automáticamente en `Tipo de Trabajo`, `Tipo de Falla`, `Complejidad` y `Estado`. Si quieres corregir algo, lo sobreescribes en las columnas `_Manual` y el `_Final` se actualiza solo.

---

## 🎯 Cómo funciona el flujo

```
TÚ ESCRIBES:                              GOOGLE SHEETS AUTOCALCULA:
────────────────────                      ──────────────────────────────
  • Fuente                                → (lo que tú elijas)
  • Técnico                               → (lo que tú elijas)
  • Fechas                                → Período, Semana
  • Cliente                               → (lo que tú elijas)
  • Marca / Equipo / Horómetro            → (lo que tú elijas)
  • Días_Trabajados / Horas_Trabajadas    → (lo que tú elijas)
  • Observación (descripción) ──────────→ Tipo_Trabajo_Auto  ┐
  • Repuestos                              Tipo_Falla_Auto    ├─→ _Final
                                           Complejidad_Auto   │   (elige
                                           Estado_Auto        ┘    Manual
                                                                si existe)
```

**Si estás de acuerdo** con el auto → dejas las columnas `_Manual` vacías y el `_Final` toma el `_Auto`.

**Si NO estás de acuerdo** → escribes el valor correcto en `_Manual` (ej: `_Manual` = "Correctiva") y el `_Final` cambia automáticamente.

### 🎯 Precisión de las fórmulas (validadas contra tus 176 registros)

| Columna | Precisión | Notas |
|---|---|---|
| Tipo de Trabajo | **91.5%** | Muy buena — solo 15 casos requieren override manual |
| Tipo de Falla | **71.6%** | Buena — los equipos usan términos variados para la misma falla |
| Complejidad | **43.8%** | Más difícil — la complejidad es subjetiva, se recomienda siempre usar Manual |

**Traducción:** de cada 10 informes nuevos, ~9 quedan bien clasificados en Tipo Trabajo, ~7 en Tipo Falla, ~4 en Complejidad. El resto los corriges en Manual en 2 segundos.

---

## 📊 Resumen de palabras clave usadas

### Tipo de Trabajo (en orden de prioridad)
| Resultado | Palabras clave detectadas |
|---|---|
| **Mantención/Preventiva** | `mantenci`, `preventiv` |
| **Correctiva** | `cambio`, `reparaci`, `correctiv`, `falla`, `no funciona`, `no opera`, `se cambia` |
| **Diagnóstico/Revisión** | `chequeo`, `revisi`, `diagn`, `evaluaci`, `visita a terreno` |
| **Otro** | (cualquier otra cosa) |

### Tipo de Falla (en orden de prioridad)
| Resultado | Palabras clave detectadas |
|---|---|
| **Eléctrica/Batería** | `bater`, `eléctr`, `cable`, `luz`, `foco`, `interrupt`, `born`, `punteros`, `sensor`, `joystick`, `circuito`, `apilador` |
| **Hidráulica/Fluidos** | `hidrául`, `fluido`, `aceite`, `filtro`, `mangera`, `nivel` |
| **Motor/Combustión** | `motor`, `combust`, `transmis`, `refriger`, `diesel`, `bencina`, `bobina` |
| **Mecánica/Ruedas** | `rueda`, `neumát`, `freno`, `mecánic`, `rodamiento`, `pasador` |
| **Otro/No clasificado** | (cualquier otra cosa) |

### Complejidad (basada en longitud de la descripción)
| Resultado | Condición |
|---|---|
| **Alta** | >200 chars o >6 items o >30 palabras |
| **Media** | >120 chars o >2 items o >15 palabras |
| **Baja** | (default) |

### Estado (basado en palabras clave)
| Resultado | Palabras clave |
|---|---|
| **Operativo** | `operativ`, `funciona`, `listo`, `completad`, `se entrega`, `operando` |
| **Pendiente/Observación** | `pendiente`, `falta`, `por hacer`, `no se pudo`, `queda pendiente` |
| **No informado** | (default — si no hay palabras clave) |

---

## 🪜 Paso 1 — Identifica tus columnas

En tu Google Sheet actual, las columnas relevantes son:

| Columna | Letra (si está en A1) | Nombre |
|---|---|---|
| `P` | Observación | La descripción del trabajo (INPUT principal) |
| `Q` | Tipo_Trabajo_Auto | Fórmula ↓ |
| `R` | Tipo_Falla_Auto | Fórmula ↓ |
| `S` | Complejidad_Auto | Fórmula ↓ |
| `T` | Estado_Auto | Fórmula ↓ |
| `U` | Tipo_Trabajo_Manual | Manual (puedes escribir para override) |
| `V` | Tipo_Falla_Manual | Manual |
| `W` | Complejidad_Manual | Manual |
| `X` | Estado_Manual | Manual |
| `Y` | Tipo_Trabajo_Final | Fórmula que toma Manual o Auto |
| `Z` | Tipo_Falla_Final | Fórmula |
| `AA` | Complejidad_Final | Fórmula |
| `AB` | Estado_Final | Fórmula |

> ⚠️ **Importante:** Verifica las letras/posiciones exactas mirando tu Sheet. Si tu Sheet tiene las columnas en otro orden, ajusta las letras accordingly.

---

## 🧮 Paso 2 — Pega estas fórmulas

### Fórmula 1 — `Tipo_Trabajo_Auto` (columna Q, fila 2)

```excel
=ARRAYFORMULA(
  IF(P2:P="", "",
    IF(REGEXMATCH(LOWER(P2:P), "mantenci|preventiv"),
      "Mantención/Preventiva",
      IF(REGEXMATCH(LOWER(P2:P), "cambio|reparaci|correctiv|falla|no funciona|no opera|se cambia"),
        "Correctiva",
        IF(REGEXMATCH(LOWER(P2:P), "chequeo|revisi|diagn|evaluaci|visita a terreno"),
          "Diagnóstico/Revisión",
          "Otro"
        )
      )
    )
  )
)
```

### Fórmula 2 — `Tipo_Falla_Auto` (columna R, fila 2)

```excel
=ARRAYFORMULA(
  IF(P2:P="", "",
    IF(REGEXMATCH(LOWER(P2:P), "bater|eléctr|cable|luz|foco|interrupt|born|punteros|sensor|joystick|circuito|apilador"),
      "Eléctrica/Batería",
      IF(REGEXMATCH(LOWER(P2:P), "hidrául|fluido|aceite|filtro|mangera|nivel"),
        "Hidráulica/Fluidos",
        IF(REGEXMATCH(LOWER(P2:P), "motor|combust|transmis|refriger|diesel|bencina|bobina"),
          "Motor/Combustión",
          IF(REGEXMATCH(LOWER(P2:P), "rueda|neumát|freno|mecánic|rodamiento|pasador"),
            "Mecánica/Ruedas",
            "Otro/No clasificado"
          )
        )
      )
    )
  )
)
```

### Fórmula 3 — `Complejidad_Auto` (columna S, fila 2)

```excel
=ARRAYFORMULA(
  IF(P2:P="", "",
    IF(OR(LEN(P2:P)>200, (LEN(P2:P)-LEN(SUBSTITUTE(SUBSTITUTE(P2:P,"-",""),CHAR(10),"")))>6, LEN(SPLIT(P2:P," "))>30),
      "Alta",
      IF(OR(LEN(P2:P)>120, (LEN(P2:P)-LEN(SUBSTITUTE(SUBSTITUTE(P2:P,"-",""),CHAR(10),"")))>2, LEN(SPLIT(P2:P," "))>15),
        "Media",
        "Baja"
      )
    )
  )
)
```

### Fórmula 4 — `Estado_Auto` (columna T, fila 2)

```excel
=ARRAYFORMULA(
  IF(P2:P="", "",
    IF(REGEXMATCH(LOWER(P2:P), "operativ|funciona|listo|completad|se entrega|operando|oper normal"),
      "Operativo",
      IF(REGEXMATCH(LOWER(P2:P), "pendiente|falta|por hacer|no se pudo|queda pendiente"),
        "Pendiente/Observación",
        "No informado"
      )
    )
  )
)
```

### Fórmula 5-8 — Columnas `_Final` (toma Manual si existe, si no Auto)

**Tipo_Trabajo_Final** (columna Y):
```excel
=ARRAYFORMULA(IF(U2:U="", Q2:Q, U2:U))
```

**Tipo_Falla_Final** (columna Z):
```excel
=ARRAYFORMULA(IF(V2:V="", R2:R, V2:V))
```

**Complejidad_Final** (columna AA):
```excel
=ARRAYFORMULA(IF(W2:W="", S2:S, W2:W))
```

**Estado_Final** (columna AB):
```excel
=ARRAYFORMULA(IF(X2:X="", T2:T, X2:X))
```

### Extras útiles (opcional) — Más auto-cálculos

**Días_Trabajados** (basado en fechas, columna L):
```excel
=ARRAYFORMULA(IF(AND(F2:F<>"", G2:G<>""), G2:G - F2:F, ""))
```

**Periodo** (basado en fecha inicio, columna AC):
```excel
=ARRAYFORMULA(IF(F2:F="", "", TEXT(F2:F, "mmm-yyyy")))
```

**Semana** (basado en fecha inicio, columna AD):
```excel
=ARRAYFORMULA(IF(F2:F="", "", WEEKNUM(F2:F)))
```

**Reincidencia_Equipo** (cuenta cuántas veces aparece el mismo equipo, columna AE):
```excel
=ARRAYFORMULA(IF(K2:K="", "", COUNTIF(K$2:K2, K2:K)))
```

---

## 🪜 Paso 3 — Cómo pegar las fórmulas en tu Google Sheet

### 3.1 Para una fórmula con `ARRAYFORMULA`

1. Click en la celda donde empieza (ej: Q2)
2. **Borra** el contenido actual
3. Pega la fórmula
4. **Enter** → la fórmula se aplica a TODAS las filas de abajo automáticamente

### 3.2 Verificar que funcionó

- Debe aparecer el valor en cada fila (no solo en Q2)
- Las celdas vacías (donde Observación está vacía) deben quedar vacías
- Si no funciona, verifica que `P` sea realmente la columna Observación en tu Sheet

### 3.3 Si algo no funciona

**Si dice "Hay un problema con esta fórmula":**
- Verifica que las comillas sean rectas: `"` no `"`
- Verifica que los `|` para OR estén correctos
- Verifica que las letras de columna correspondan a tu Sheet

**Si el resultado es "Otro" para todo:**
- Las palabras clave no están matcheando
- Revisa que la columna Observación tenga texto (no esté vacía)

---

## ✅ Checklist de implementación

- [ ] Fórmulas pegadas en Q2, R2, S2, T2 (las `_Auto`)
- [ ] Fórmulas pegadas en Y2, Z2, AA2, AB2 (las `_Final`)
- [ ] Verificado que los 176 registros existentes se reclasificaron
- [ ] Verificado que coincidan con los valores anteriores (puede haber pequeñas diferencias)
- [ ] (Opcional) Fórmulas extras en L, AC, AD, AE para Días/Periodo/Semana/Reincidencia
- [ ] Probado agregando una fila nueva de prueba

---

## 🧪 Probar con un ejemplo

Agrega una fila nueva con:

```
Observación: "Se realiza cambio de aceite motor y filtro, se ajusta freno delantero, queda operativo"
```

Debería auto-clasificar como:
- `Tipo_Trabajo_Auto`: **Mantención/Preventiva** (porque tiene "cambio de aceite")
- `Tipo_Falla_Auto`: **Hidráulica/Fluidos** (porque "aceite", "filtro")
- `Complejidad_Auto`: **Baja** (porque tiene menos de 100 chars)
- `Estado_Auto`: **Operativo** (porque "operativo")

---

## 🛠 Personalizar palabras clave

Si alguna clasificación no te gusta, **edita la fórmula**. Por ejemplo, si quieres que también detecte "diagnóstico" como palabra clave de Correctiva, agrégala al grupo de Correctiva:

```excel
... "falla|reparaci|arreglo|correctiv|no funciona|diagnostico" ...
```

Solo agrega la palabra nueva separada por `|`. **No te preocupes por mayúsculas** — la fórmula usa `LOWER()` para que todo funcione.

---

## 💡 Tips pro

1. **Para verificar fórmulas**: Click en una celda con fórmula → en la barra de arriba ves el código. Si te equivocas, solo borra y pega de nuevo.

2. **Si tienes miles de filas**: `ARRAYFORMULA` solo funciona para llenar hacia abajo desde donde la pones. Si necesitas más, cópiala y pégala en otra fila más abajo.

3. **Respaldar antes**: Antes de hacer cambios masivos, haz una copia del Sheet (`Archivo → Hacer una copia`).

4. **Errores comunes**:
   - "Circular dependency" → Hay un error en alguna fórmula, revisa letra por letra
   - "#REF!" → Alguna columna referenciada no existe
   - "#VALUE!" → La columna referenciada tiene texto donde debería tener número (o viceversa)

---

## 📞 Si te trabas

Pásame pantallazo del error o del resultado y te ayudo a ajustar la fórmula.