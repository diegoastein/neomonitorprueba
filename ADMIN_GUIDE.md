# NeoMonitor Admin Panel — Guía de Uso

## Acceso

1. Abre `https://neomonitor.pro/admin.html` (cuando esté deployado)
2. Ingresa la clave: **`neomonitor2024`**

## Estructura: Casos Clínicos vs Biblioteca

### ¿Cuál es la diferencia ahora?

**Antes:**
- Si creabas un caso personal y lo guardabas, no podías subirlo a la biblioteca oficial
- La biblioteca era estática (hardcodeada en el código)

**Ahora:**
- **Casos personales** — siguen guardándose en el navegador/control (sin cambios)
- **Biblioteca oficial** (`clinicalCases`) — se gestiona desde el panel admin y se sincroniza a todos los usuarios a través de Firebase

### Casos de Uso

#### Caso A: Editar un caso existente de la biblioteca
1. Selecciona el caso en la lista izquierda
2. Click en "Editar"
3. Modifica títulos, presentación o etapas
4. Click en "Guardar Cambios"
5. ✓ El cambio aparece automáticamente en **neomonitor.pro** para todos

#### Caso B: Crear un nuevo caso clínico
1. (Función por agregar — actualmente solo puedes editar los existentes)
2. Para crear uno nuevo, solicita a Diego

#### Caso C: Eliminar un caso de la biblioteca
1. Selecciona el caso
2. Click en "Eliminar"
3. Confirma la eliminación

**Importante:** Eliminar un caso de la biblioteca **no** afecta los casos guardados en navegadores (datos locales).

## Estructura de un Caso Clínico

Cada caso tiene:
- **ID** — identificador único, no editable (ej: `rcp_basica`)
- **Tipo de paciente** — `neonatal`, `pediatrico`, `adulto`
- **Títulos** — en español (ES), inglés (EN), portugués (PT)
- **Presentación** — descripción clínica trilíngüe
- **Etapas** — secuencia de cambios de signos vitales
  - Cada etapa tiene: nombre (ES/EN/PT), HR, SpO2, tiempo de transición (segundos)

## Sincronización con Firebase

- Los cambios se guardan en **tiempo real** a Firestore
- La app principal (`index.html`) carga los casos cada 5-10 segundos (listener automático)
- **No requiere refresh** en los navegadores de los usuarios

## Seguridad

- La clave `neomonitor2024` está en el HTML (visible en DevTools)
- Si necesitas mayor seguridad, implementar autenticación real con Firebase Auth

## Próximas Mejoras

- [ ] Crear nuevos casos desde el panel
- [ ] Vista previa en vivo de cómo se vería el caso
- [ ] Historial de cambios / versiones
- [ ] Exportar/importar casos en JSON

## Troubleshooting

**P: Edité un caso pero no aparece el cambio en la app**
- Espera 5-10 segundos
- Recarga la página de la app

**P: La clave no funciona**
- Asegúrate de tener JavaScript habilitado
- Prueba en otro navegador

**P: Quiero crear un nuevo caso**
- Actualmente solo puedo editar. Contacta a Diego para crear nuevos casos (se deben agregar manualmente al código)

---

**Autor:** Dr. Diego Steinberg  
**Última actualización:** 2026-04-07
