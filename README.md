# 🫧 SquishyPop 2.0 — Marketplace Móvil Inteligente

Aplicación móvil desarrollada en **React Native con Expo** como ampliación del prototipo de comercio electrónico **SquishyPop** (Taller 4 → Taller 5). Permite explorar productos con variantes, filtrar por múltiples criterios, comparar artículos, gestionar direcciones de entrega con cálculo de envío por municipio, simular pedidos con seguimiento por estados, cancelar compras con reintegro de stock, recibir notificaciones internas y crear tickets de soporte.

## Estructura del Proyecto
- `App.js`: Controlador principal de navegación por pestañas y estado global en memoria (`useState`).
- `src/datos.js`: Fuente única de datos iniciales (productos, variantes con stock independiente, tarifas de envío y hoja de estilos).
- `src/Catalogo.js`: Vistas de catálogo con filtros combinados (`VistaCatalogo`) y comparador de hasta 3 productos (`VistaComparador`).
- `src/Detalle.js`: Vista de detalle (`VistaDetalle`) con selección obligatoria de variantes, preguntas/respuestas simuladas, alertas de reposición y productos relacionados.
- `src/Compra.js`: Carrito con estimador de envío por municipio y modalidad (`VistaCarrito`) y libreta de direcciones (`VistaDirecciones`).
- `src/Posventa.js`: Seguimiento cronológico y cancelación lógica de pedidos (`VistaPedidos`), centro de notificaciones (`VistaNotifs`) y soporte (`VistaAyuda`).

## Instrucciones de Ejecución
1. Clonar el repositorio y ubicarse en la rama `marketplace-v2`:
   ```bash
   git checkout marketplace-v2