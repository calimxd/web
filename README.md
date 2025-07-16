# El Chavo del 8 - Página Web

## Descripción
Página web profesional y optimizada para reproducir episodios de El Chavo del 8, organizados por temporadas con reproductor integrado.

## Características

### ✨ Funcionalidades Principales
- **Reproductor integrado** con controles de navegación
- **Filtrado por temporadas** (1-5)
- **Diseño responsive** para todos los dispositivos
- **Lazy loading** para mejor rendimiento
- **Navegación con teclado** (flechas izquierda/derecha)
- **Búsqueda de episodios** (funcionalidad futura)
- **Favoritos** con localStorage
- **Compartir episodios** con URL directa

### 🎨 Diseño
- **Interfaz moderna** con gradientes y animaciones
- **Colores temáticos** inspirados en la serie
- **Tipografía Fredoka One** para títulos (estilo infantil)
- **Iconos emoji** para representar episodios
- **Efectos hover** y transiciones suaves

### ⚡ Optimización
- **CSS optimizado** con variables CSS
- **JavaScript modular** con funciones específicas
- **Lazy loading** para cards de episodios
- **Debounced events** para mejor rendimiento
- **Intersection Observer** para animaciones

## Estructura del Proyecto

```
chavo-web/
├── index.html                 # Página principal
├── css/
│   └── styles.css            # Estilos optimizados
├── js/
│   ├── main.js               # Funcionalidad principal
│   └── episodes-data.js      # Datos de episodios
├── images/                   # Imágenes (vacío por ahora)
├── data/                     # Datos adicionales
└── README.md                 # Este archivo
```

## Instalación

1. **Clonar o descargar** el proyecto
2. **Abrir `index.html`** en un navegador web
3. **¡Listo!** No requiere servidor web

## Uso

### Navegación
- **Temporadas**: Filtra episodios por temporada específica
- **Episodios**: Click en cualquier card para reproducir
- **Controles**: Botones Anterior/Siguiente en el reproductor
- **Teclado**: Flechas izquierda/derecha para navegación

### URLs Directas
- Acceso directo a episodios: `index.html?episode=1`
- Compartir episodios específicos con URL generada

### Favoritos
- Click en ❤️ para agregar/quitar favoritos
- Se guardan en localStorage del navegador

## Personalización

### Agregar Episodios Reales
1. Editar `js/episodes-data.js`
2. Reemplazar URLs de ejemplo con URLs reales
3. Actualizar información de episodios

### Ejemplo de estructura de episodio:
```javascript
{
    id: 1,
    title: "Nombre del Episodio",
    season: 1,
    episode: 1,
    description: "Descripción del episodio",
    url: "https://www.youtube.com/embed/VIDEO_ID",
    thumbnail: "🏠"
}
```

### Cambiar Colores
Editar variables CSS en `css/styles.css`:
```css
:root {
    --primary-color: #FF6B35;    /* Color principal */
    --secondary-color: #2E8B57;  /* Color secundario */
    --accent-color: #FFD700;     /* Color de acento */
}
```

## Funcionalidades Futuras

### 🔄 Implementadas
- [x] Reproductor integrado
- [x] Filtros por temporada
- [x] Navegación con teclado
- [x] Lazy loading
- [x] Favoritos
- [x] Compartir episodios

### 🚀 Por Implementar
- [ ] Barra de búsqueda funcional
- [ ] Modo oscuro
- [ ] Lista de reproducción
- [ ] Historial de visualización
- [ ] Comentarios por episodio
- [ ] Calificaciones
- [ ] Modo offline

## Soporte de Navegadores

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Móviles modernos

## Rendimiento

### Optimizaciones Implementadas
- **Lazy loading** de episodios
- **Intersection Observer** para animaciones
- **Debounced events** para scroll/resize
- **CSS Grid** para layouts eficientes
- **Minimal DOM manipulation**

### Métricas Esperadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## Desarrollo

### Comando para servidor local (opcional)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

### Convertir Excel a JSON
Para convertir el archivo Excel original a formato JSON:
1. Abrir Excel
2. Guardar como CSV
3. Usar herramienta online CSV to JSON
4. Formatear según estructura requerida

## Contribuir

1. **Fork** el proyecto
2. **Crear branch** para feature
3. **Commit** cambios
4. **Push** al branch
5. **Abrir Pull Request**

## Licencia

Este proyecto es para uso educativo y de entretenimiento. Todos los derechos de El Chavo del 8 pertenecen a Roberto Gómez Bolaños y sus herederos.

## Contacto

Para soporte o sugerencias, crear un issue en el repositorio.

---

**¡Fue sin querer queriendo!** 🏠✨
