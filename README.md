# 📊 LICMAN — Dashboard KPI Mantenimiento

Dashboard web para visualizar KPIs de mantenimiento de equipos industriales (OTs Taller + Informes Terreno). Lee datos desde un Google Sheet vía **Apps Script Proxy** para evitar problemas de caché.

🌐 **Producción**: [kpi-licman.netlify.app](https://kpi-licman.netlify.app/)

---

## ✨ Funcionalidades

- **4 vistas**: Resumen Ejecutivo · Desempeño por Técnico · Reincidencia y Calidad · Análisis de Tiempos
- **KPIs en vivo**: Total actividades, % preventivas/correctivas, reincidencia, equipos críticos
- **Auto-refresh cada 2 minutos** (configurable)
- **Filtros**: técnico, cliente, fuente (OT/Informes), período
- **Responsive mobile-first** (probado en iPhone/Android)
- **Stack**: HTML + Tailwind CSS (CDN) + Chart.js + PapaParse

---

## 🚀 Quickstart local

```bash
# Clonar
git clone https://github.com/bvasquezf/licman-kpi-dashboard.git
cd licman-kpi-dashboard

# Abrir con servidor local (necesario por CORS en fetch)
python3 -m http.server 8000
# o
npx serve
```

Abrir `http://localhost:8000` en el navegador.

> ⚠️ No funciona abrir `index.html` directo con `file://` por las políticas CORS del navegador.

---

## ⚙️ Configuración inicial

1. Click en **⚙ Configurar fuente** (arriba a la derecha)
2. Pega la URL del Google Sheet exportado a CSV o la URL del **Apps Script Proxy** (recomendado)
3. Click **Guardar y actualizar**

Ver [README_PROXY.md](README_PROXY.md) para instrucciones detalladas del proxy.

---

## 📁 Estructura del proyecto

```
licman-kpi-dashboard/
├── index.html                          ← Dashboard principal
├── netlify.toml                        ← Configuración de Netlify
├── logo.svg                            ← Logo de LICMAN
├── proxy-google-sheet-apps-script.js   ← Código del Apps Script Proxy (pegar en script.google.com)
├── README.md                           ← Este archivo
├── README_PROXY.md                     ← Guía de despliegue del proxy
├── QUIICKSTART.md                      ← Guía de fórmulas de auto-clasificación
├── FORMULAS_AUTO_CLASIFICACION.md      ← Detalle de las fórmulas
├── CAMPOS_REFERENCIA.html              ← Referencia de columnas del Sheet
└── .gitignore
```

---

## 🔄 Deploy continuo

Cada `git push` a `main` dispara un deploy automático en Netlify.

```bash
git add .
git commit -m "tu mensaje"
git push
```

Ver el progreso en: `https://app.netlify.com/sites/kpi-licman/deploys`

---

## 🛠 Cambios recientes

- ✅ **Auto-clasificación** en Google Sheets con fórmulas (`Tipo_Trabajo_Auto`, etc.)
- ✅ **Apps Script Proxy** para evitar caché del CDN de Google Sheets
- ✅ **Responsive mobile** (charts se ajustan al contenedor, padding mobile-first)
- ✅ **Retry con backoff exponencial** al cargar datos
- ✅ **Escape HTML** en tablas (defensa XSS)
- ✅ **Auto-refresh cada 2 min** (antes 5 min)

---

## 📝 Licencia

Uso interno — LICMAN.