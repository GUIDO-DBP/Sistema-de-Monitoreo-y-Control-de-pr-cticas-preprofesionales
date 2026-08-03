Crea una aplicación web funcional y un prototipo de alta fidelidad llamado:

SMCPP — Sistema de Monitoreo y Control de Prácticas Preprofesionales

IMPORTANTE:
No diseñes un dashboard administrativo genérico ni una plantilla corporativa repetitiva. El resultado debe sentirse como un producto universitario contemporáneo, especializado en el seguimiento de prácticas preprofesionales. Debe tener identidad visual propia, información realista, flujos coherentes y una interfaz lista para presentarse como proyecto final universitario y como base de una futura implementación en React.

IDIOMA:
Toda la interfaz debe estar en español.

OBJETIVO DEL PRODUCTO:
El SMCPP centraliza la administración de prácticas preprofesionales de una universidad. Reemplaza el uso disperso de documentos físicos, hojas de cálculo, archivos independientes y mensajes. Debe permitir controlar convenios, empresas receptoras, postulaciones, documentación, horas de práctica, evaluaciones, observaciones, notificaciones y reportes.

USUARIOS PRINCIPALES:
1. Estudiante.
2. Coordinador de prácticas.
3. Tutor empresarial.
4. Administrador del sistema.

ALCANCE DE ESTA PRIMERA GENERACIÓN:
Construye una experiencia funcional centrada principalmente en el rol “Coordinador de prácticas”, pero incluye un selector de rol en el menú de perfil para visualizar también una versión simplificada del dashboard del estudiante.

No intentes mostrar todos los módulos en una sola pantalla. Construye una aplicación navegable con diferentes rutas y vistas.

==================================================
1. DIRECCIÓN VISUAL Y CONCEPTO DE DISEÑO
==================================================

Concepto visual:
“Trayectoria profesional en progreso”.

La identidad debe representar que cada estudiante avanza a través de un proceso claramente definido: postulación, revisión documentaria, aprobación, ejecución de prácticas, registro de horas y evaluación final.

Usa como elemento distintivo del producto:
- líneas de progreso,
- rutas o trayectorias sutiles,
- hitos circulares,
- conexiones entre etapas,
- indicadores de avance,
- cronologías verticales y horizontales,
- patrones gráficos discretos inspirados en redes, nodos y recorridos.

No usar ilustraciones infantiles.
No usar birretes, libros, lápices o íconos educativos clichés como elemento principal.
No usar enormes degradados morados típicos de plantillas de IA.
No usar glassmorphism excesivo.
No usar demasiadas tarjetas flotantes.
No usar colores neón.
No usar sombras fuertes.
No llenar cada espacio con elementos decorativos.

La interfaz debe ser sobria, moderna, académica y tecnológica.

REFERENCIA ESTÉTICA:
Combina:
- la limpieza y precisión de un producto SaaS contemporáneo,
- la densidad controlada de una herramienta de gestión,
- la claridad institucional de un portal universitario,
- una composición editorial con títulos grandes y jerarquía tipográfica,
- tablas y formularios de nivel profesional.

La interfaz no debe parecer un sistema gubernamental antiguo ni una plantilla Bootstrap básica.

==================================================
2. SISTEMA VISUAL
==================================================

PALETA PRINCIPAL:

Color principal:
- Azul tinta profundo: #152A43

Color de acción:
- Azul brillante controlado: #2563EB

Color característico secundario:
- Turquesa profesional: #0F9F92

Fondo general:
- Gris azulado muy claro: #F4F7FA

Superficies:
- Blanco: #FFFFFF
- Superficie secundaria: #EDF2F7

Texto principal:
- #172033

Texto secundario:
- #5F6B7A

Bordes:
- #DCE3EA

Estados:
- Aprobado: verde #168A5B
- En revisión: azul #2563EB
- Pendiente: ámbar #B7791F
- Observado: naranja #D65A31
- Rechazado: rojo #C43D4D
- Completado: turquesa #0F9F92
- Inactivo: gris #7A8491

Usa colores de estado con moderación.
Cada estado debe incluir texto e icono, no depender solamente del color.

TIPOGRAFÍA:
Usa Inter, Geist o Manrope.
Preferencia: Inter.

Escala sugerida:
- Título de página: 30–32 px, semibold.
- Título principal del dashboard: 34–38 px, semibold.
- Subtítulo de sección: 20–22 px, semibold.
- Título de tarjeta: 14–16 px, medium.
- Texto de interfaz: 14 px.
- Texto auxiliar: 12–13 px.
- Datos KPI: 26–32 px, semibold.

No usar demasiado texto en mayúsculas.
Usar números tabulares en indicadores y tablas.

ESPACIADO:
Usa una escala de 4, 8, 12, 16, 24, 32 y 48 px.
Mantén bastante espacio entre secciones, pero una densidad media dentro de tablas y formularios.

BORDES:
- Radio general de tarjetas: 14 px.
- Radio de inputs: 10 px.
- Radio de botones: 9 px.
- Chips de estado: totalmente redondeados.
- Borde de superficies: 1 px suave.
- Sombras casi imperceptibles; prioriza bordes y contraste de superficies.

ICONOGRAFÍA:
Usa iconos lineales coherentes, estilo Lucide.
Grosor uniforme.
No mezclar familias de iconos.

==================================================
3. ESTRUCTURA GENERAL DE LA APLICACIÓN
==================================================

Diseña para escritorio con un frame base de 1440 × 1024 px.

Usa:
- barra lateral izquierda fija de aproximadamente 248 px;
- encabezado superior dentro del área de contenido;
- área principal flexible;
- diseño basado en CSS Grid y Flexbox;
- componentes reutilizables;
- comportamiento responsive.

SIDEBAR:

La barra lateral debe tener fondo azul tinta profundo #152A43.

En la parte superior:
- isotipo propio del SMCPP;
- nombre corto “SMCPP”;
- texto pequeño “Prácticas preprofesionales”.

Diseña un isotipo minimalista:
una ruta formada por tres nodos conectados que termina en una marca de verificación.
No usar un logo universitario inventado.
Dejar un espacio preparado para añadir posteriormente el logo real de la universidad.

Menú principal del coordinador:

Grupo “GENERAL”
- Resumen
- Bandeja de trabajo

Grupo “GESTIÓN”
- Convenios
- Empresas receptoras
- Postulaciones
- Documentos
- Control de horas
- Evaluaciones

Grupo “ANÁLISIS”
- Reportes
- Seguimiento

Grupo “SISTEMA”
- Notificaciones
- Usuarios
- Configuración

El elemento activo debe mostrarse con:
- fondo azul ligeramente más claro,
- pequeña barra turquesa a la izquierda,
- icono y texto blanco,
- sin una cápsula exageradamente redondeada.

Permitir colapsar la barra lateral a una versión de 72 px con solo iconos y tooltips.

En la parte inferior:
- bloque compacto del periodo académico:
  “Periodo 2026-I”
  “Activo”
- acceso a ayuda y soporte.

TOPBAR:

Debe contener:
- breadcrumb breve;
- buscador global con placeholder:
  “Buscar estudiante, convenio o empresa…”;
- botón de acciones rápidas con icono “+”;
- campana de notificaciones con contador;
- avatar y menú de perfil;
- selector de rol para demostración:
  Coordinador / Estudiante.

No hacer un encabezado excesivamente alto.

==================================================
4. PANTALLA DE INICIO DE SESIÓN
==================================================

Crea una ruta /login.

Evita el diseño típico de formulario a la izquierda e imagen de stock a la derecha.

Usa una composición editorial dividida 42/58:

Panel izquierdo:
- fondo azul tinta;
- isotipo del sistema;
- título:
  “Cada práctica, claramente acompañada.”
- texto breve:
  “Centraliza postulaciones, documentos, horas y evaluaciones en una sola trayectoria.”
- una representación abstracta y elegante de una ruta con cinco hitos:
  Postulación → Revisión → Aprobación → Práctica → Evaluación.
- pequeñas métricas ilustrativas:
  “128 estudiantes en seguimiento”
  “24 convenios activos”
- patrón tenue de nodos conectados.

Panel derecho:
- fondo blanco;
- formulario centrado, no demasiado ancho;
- encabezado:
  “Bienvenido al SMCPP”
- texto:
  “Ingresa con tus credenciales institucionales.”
- campo correo institucional;
- campo contraseña con mostrar/ocultar;
- checkbox “Mantener mi sesión iniciada”;
- enlace “¿Olvidaste tu contraseña?”;
- botón principal “Ingresar al sistema”;
- acceso demostrativo:
  “Explorar como estudiante”;
- texto de ayuda institucional al pie.

Agregar validaciones visuales y estado de error:
“Las credenciales ingresadas no son correctas.”

==================================================
5. DASHBOARD DEL COORDINADOR
==================================================

Ruta: /dashboard

No crear una simple fila de cuatro tarjetas iguales y dos gráficos genéricos.

Construye una composición asimétrica y editorial.

ENCABEZADO:

Mostrar:
“Buenas tardes, Coordinador”
“Este es el estado de las prácticas durante el periodo 2026-I.”

A la derecha:
- botón secundario “Descargar resumen”;
- botón principal “Nueva postulación”.

Debajo incluir una franja contextual:
“Periodo 2026-I · Del 18 de marzo al 25 de julio”
con un selector de periodo.

ZONA PRINCIPAL SUPERIOR:

Columna izquierda, aproximadamente 65%:
una tarjeta protagonista llamada “Avance del periodo”.

Debe mostrar:
- 128 estudiantes activos;
- 79% con documentación completa;
- 68% con prácticas iniciadas;
- 42% con evaluación final registrada.

Usar una visualización propia:
una trayectoria horizontal con cuatro hitos conectados:
1. Postulación
2. Documentación
3. En práctica
4. Evaluación

Cada hito debe mostrar:
- cantidad de estudiantes;
- porcentaje;
- pequeña variación respecto de la semana anterior.

No usar un gráfico de dona como visual principal.

Columna derecha, aproximadamente 35%:
tarjeta “Atención requerida”.

Mostrar una lista priorizada:
- 12 documentos observados;
- 8 convenios próximos a vencer;
- 6 estudiantes con horas retrasadas;
- 4 evaluaciones pendientes.

Cada fila:
- icono,
- descripción,
- cifra,
- nivel de prioridad,
- enlace “Revisar”.

Esta tarjeta debe verse operativa, no decorativa.

SEGUNDA ZONA:

Tres indicadores compactos de diferente ancho:
- Convenios activos: 24
- Horas registradas esta semana: 486 h
- Evaluaciones completadas: 54 de 76

Usa sparklines pequeños y comparaciones reales:
“+3 respecto al mes anterior”
“+12% esta semana”
“71% completadas”

TERCERA ZONA:

Columna izquierda:
“Flujo de postulaciones”
Usa un gráfico de barras horizontal apilado o embudo limpio con:
- Pendientes: 14
- En revisión: 22
- Observadas: 11
- Aprobadas: 67
- Rechazadas: 5

Debe permitir alternar:
“Estado” / “Escuela profesional”.

Columna derecha:
“Actividad reciente”
Lista cronológica con avatar o inicial:
- “Ana Torres corrigió dos documentos.”
- “El tutor Carlos Medina validó 8 horas.”
- “Se aprobó la postulación de Luis Quispe.”
- “El convenio con AndesTech vence en 15 días.”

Mostrar hora y tipo de actividad.

CUARTA ZONA:

Tabla compacta:
“Casos que necesitan seguimiento”

Columnas:
- Estudiante
- Empresa
- Etapa actual
- Incidencia
- Última actualización
- Responsable
- Acción

Usar solo cinco filas visibles.
Agregar enlace “Ver bandeja completa”.

DATOS REALISTAS:
Usar nombres peruanos y contexto universitario plausible:
- Ana Torres Mamani
- Luis Quispe Condori
- Daniela Flores Choque
- Diego Apaza Ramos
- Carmen Huanca Yucra

Empresas:
- AndesTech Solutions
- DataSur Consultores
- Municipalidad Provincial de Puno
- Altiplano Digital
- InnovaSoft Perú

No usar “John Doe”, “Acme Inc.” ni texto lorem ipsum.

==================================================
6. BANDEJA DE TRABAJO
==================================================

Ruta: /bandeja

Esta debe ser una pantalla diferenciadora del producto.

Su objetivo es reunir todos los casos que requieren acción del coordinador.

Encabezado:
“Bandeja de trabajo”
“Prioriza revisiones, observaciones y vencimientos desde un solo lugar.”

Contadores superiores:
- Todo: 31
- Alta prioridad: 7
- Por vencer: 9
- Sin responsable: 4

Diseña tres vistas intercambiables:
- Lista
- Kanban
- Calendario

La vista predeterminada será Lista.

Filtros:
- Tipo de tarea
- Prioridad
- Responsable
- Fecha límite
- Estado
- Empresa

Cada tarea debe mostrar:
- tipo;
- estudiante o convenio asociado;
- descripción;
- fecha límite;
- prioridad;
- responsable;
- acción principal.

Ejemplos:
- “Revisar corrección de carta de presentación”
- “Validar registro semanal de horas”
- “Renovar convenio próximo a vencer”
- “Solicitar evaluación al tutor empresarial”

La vista Kanban debe usar columnas:
- Pendiente
- En revisión
- Esperando respuesta
- Resuelto

No usar colores fuertes para todas las columnas.
Usar color solo para prioridad y estado.

==================================================
7. LISTA DE POSTULACIONES
==================================================

Ruta: /postulaciones

Encabezado:
“Postulaciones”
“Revisa el estado y documentación de cada estudiante.”

Acciones:
- Exportar
- Nueva postulación

Usar tabs:
- Todas
- Pendientes
- En revisión
- Observadas
- Aprobadas
- Rechazadas

Toolbar:
- buscador;
- filtro por empresa;
- filtro por fecha;
- filtro por responsable;
- botón “Más filtros”;
- control de columnas visibles.

Tabla profesional con:
- checkbox;
- estudiante, con avatar de iniciales y código;
- empresa receptora;
- fecha de envío;
- progreso documentario, por ejemplo “4/5”;
- estado;
- última actualización;
- responsable;
- menú de acciones.

Permitir:
- ordenar columnas;
- seleccionar varias filas;
- acciones masivas;
- paginar;
- abrir un panel lateral de detalle sin abandonar la tabla.

No mostrar bordes verticales en todas las columnas.
Usar filas con buena separación y hover discreto.

ESTADOS:
Pendiente, En revisión, Observada, Aprobada y Rechazada.
Cada chip debe tener:
- icono;
- etiqueta textual;
- fondo tonal muy suave.

==================================================
8. DETALLE DE POSTULACIÓN
==================================================

Ruta de ejemplo:
/postulaciones/SMCPP-2026-048

No usar una página llena de pequeñas tarjetas.

Crear una cabecera potente:
- botón volver;
- nombre del estudiante;
- código universitario;
- empresa;
- estado;
- responsable;
- acciones:
  “Observar”
  “Rechazar”
  “Aprobar postulación”

Debajo crear un layout de dos columnas.

Columna principal 68%:

A. “Trayectoria de la postulación”
Timeline horizontal:
- Enviada
- Revisión inicial
- Corrección
- Validación final
- Aprobada

Mostrar fecha, responsable y resultado de cada etapa.

B. Tabs:
- Resumen
- Documentos
- Historial
- Comentarios

TAB RESUMEN:
- información académica;
- información de la empresa;
- periodo solicitado;
- modalidad;
- fechas estimadas;
- breve motivación.

TAB DOCUMENTOS:
Lista documental con:
- nombre;
- versión;
- fecha;
- tamaño;
- estado;
- observación;
- botones ver y descargar.

Documentos:
- Solicitud de prácticas
- Carta de presentación
- Currículum vitae
- Constancia académica
- Plan de actividades

Permitir abrir una vista previa del documento en un panel lateral derecho.
El coordinador debe poder:
- aprobar;
- observar;
- escribir una observación;
- solicitar una nueva versión.

TAB HISTORIAL:
Cronología detallada y auditable.

TAB COMENTARIOS:
Conversación interna entre coordinador y estudiante.
No debe parecer un chat informal; usar comentarios asociados al trámite.

Columna secundaria 32%:

- tarjeta “Siguiente acción”;
- fecha límite;
- responsable;
- lista de comprobación;
- datos de contacto del estudiante;
- tutor empresarial;
- resumen de incidencias.

==================================================
9. NUEVA POSTULACIÓN DEL ESTUDIANTE
==================================================

Ruta: /mi-postulacion/nueva

Crear un asistente de cuatro pasos:

1. Empresa y convenio
2. Información de la práctica
3. Documentos
4. Revisión y envío

Mostrar un stepper horizontal claro, con:
- paso actual;
- pasos completados;
- pasos pendientes;
- posibilidad de regresar.

PASO 1:
No usar un select enorme y genérico.
Mostrar empresas en una lista visual compacta con:
- nombre;
- rubro;
- ubicación;
- modalidad;
- vacantes;
- vigencia del convenio.

Agregar búsqueda y filtros:
- modalidad;
- rubro;
- ubicación.

PASO 2:
Campos:
- área de interés;
- modalidad;
- fecha de inicio;
- fecha prevista de término;
- horas semanales;
- tutor empresarial, si se conoce;
- breve descripción de actividades.

PASO 3:
Área de carga documental.
Permitir arrastrar archivos y también seleccionar mediante botón.
Cada requisito debe mostrar:
- nombre;
- formatos permitidos;
- tamaño máximo;
- archivo adjuntado;
- estado.

Mostrar progreso:
“4 de 5 documentos completados”.

PASO 4:
Resumen completo antes del envío.
Incluir checkbox:
“Declaro que la información registrada es correcta.”
Botón principal:
“Enviar postulación”
Botón secundario:
“Guardar como borrador”.

Mostrar autoguardado:
“Borrador guardado hace 1 min.”

==================================================
10. CONTROL DE HORAS
==================================================

Ruta: /control-horas

Encabezado:
“Control de horas”
“Monitorea el cumplimiento y valida los registros enviados.”

Zona superior:
una visualización de progreso global:
- 9,840 horas validadas;
- 2,160 horas pendientes;
- meta del periodo: 15,000 horas.

Filtros:
- estudiante;
- empresa;
- estado;
- semana;
- tutor.

Tabla:
- estudiante;
- empresa;
- semana;
- horas registradas;
- horas acumuladas;
- evidencia;
- estado;
- tutor;
- acción.

Agregar una vista de calendario semanal para un estudiante.

En el perfil del estudiante:
- barra de progreso de 0 a 320 horas;
- horas aprobadas;
- pendientes;
- observadas;
- promedio semanal;
- proyección de fecha de cumplimiento.

Formulario “Registrar horas”:
- fecha;
- hora de entrada;
- hora de salida;
- pausa;
- total calculado automáticamente;
- actividad realizada;
- evidencia;
- observación.

Mostrar validaciones:
- no permitir hora de salida anterior a entrada;
- advertir registros duplicados;
- advertir más de 12 horas en un día.

==================================================
11. EVALUACIONES
==================================================

Ruta: /evaluaciones

Encabezado:
“Evaluaciones de desempeño”
“Gestiona las evaluaciones remitidas por los tutores empresariales.”

Resumen:
- Pendientes: 18
- En proceso: 9
- Completadas: 54
- Vencidas: 4

Tabla de estudiantes con:
- estudiante;
- empresa;
- tutor;
- fecha límite;
- avance;
- resultado;
- estado;
- acciones.

Formulario de evaluación:
Diseño limpio, dividido en categorías.

Categorías:
A. Desempeño profesional
- Calidad del trabajo
- Cumplimiento de tareas
- Capacidad técnica

B. Habilidades interpersonales
- Comunicación
- Trabajo en equipo
- Adaptabilidad

C. Responsabilidad
- Puntualidad
- Iniciativa
- Ética profesional

Usar escala de 1 a 5 con etiquetas:
1 Deficiente
2 En desarrollo
3 Adecuado
4 Destacado
5 Excelente

No usar solamente estrellas.
Usar controles segmentados con número y descripción.

Mostrar:
- promedio por categoría;
- puntaje total;
- comentarios del tutor;
- fortalezas;
- aspectos por mejorar;
- botón “Guardar borrador”;
- botón “Enviar evaluación”.

==================================================
12. CONVENIOS Y EMPRESAS
==================================================

Ruta: /convenios

Diseñar una vista que permita alternar:
- Tabla
- Mapa de relaciones

Tabla:
- código;
- empresa;
- rubro;
- fecha de inicio;
- vencimiento;
- vacantes;
- estudiantes activos;
- estado;
- acciones.

Mostrar una alerta contextual:
“8 convenios vencen durante los próximos 30 días.”

El “Mapa de relaciones” debe mostrar:
- empresas como nodos;
- cantidad de estudiantes asociados;
- rubro;
- fuerza de colaboración;
- filtros por periodo y actividad.

Este mapa debe ser visualmente interesante pero legible, no decorativo.

Detalle del convenio:
- datos generales;
- documento PDF;
- vigencia;
- responsables;
- historial de renovaciones;
- estudiantes asociados;
- vacantes;
- actividades permitidas;
- botón renovar convenio.

==================================================
13. REPORTES
==================================================

Ruta: /reportes

No diseñar una colección de gráficas sin propósito.

Crear un constructor de reportes.

Panel lateral de filtros:
- periodo académico;
- rango de fechas;
- empresa;
- estado;
- escuela profesional;
- modalidad;
- responsable.

Zona principal:
- título dinámico del reporte;
- resumen ejecutivo;
- métricas;
- gráfico principal;
- tabla detallada;
- conclusiones automáticas simples basadas en los datos.

Reportes rápidos:
- Estado de postulaciones
- Cumplimiento de horas
- Rendimiento por empresa
- Evaluaciones finales
- Convenios por vencer
- Casos con incidencias

Acciones:
- Exportar PDF
- Exportar Excel
- Guardar vista
- Programar reporte

==================================================
14. CENTRO DE NOTIFICACIONES
==================================================

Ruta: /notificaciones

No usar solamente una lista extensa.

Crear dos columnas:
- bandeja de notificaciones;
- detalle de la notificación seleccionada.

Categorías:
- Todas
- Postulaciones
- Documentos
- Horas
- Evaluaciones
- Sistema

Cada notificación:
- icono contextual;
- título;
- resumen;
- hora;
- prioridad;
- estado de lectura.

Ejemplos:
- “Daniela Flores envió una corrección.”
- “El convenio CV-2024-018 vence en 12 días.”
- “El tutor de Luis Quispe completó la evaluación.”
- “Se detectó un registro duplicado de horas.”

Permitir:
- marcar como leída;
- archivar;
- abrir el trámite relacionado;
- configurar preferencias.

==================================================
15. DASHBOARD DEL ESTUDIANTE
==================================================

Al cambiar el selector de rol a “Estudiante”, mostrar una experiencia distinta.

Encabezado:
“Hola, Ana”
“Tu práctica se encuentra en etapa de ejecución.”

Elemento protagonista:
una trayectoria completa de cinco etapas:
1. Postulación
2. Documentos
3. Aprobación
4. Registro de horas
5. Evaluación

Marcar las tres primeras como completadas, la cuarta en progreso y la quinta pendiente.

Mostrar:
- 186 de 320 horas completadas;
- 58% de avance;
- próxima acción:
  “Registrar las horas de esta semana”;
- documentos;
- observaciones;
- notificaciones recientes;
- datos de la empresa;
- contacto del coordinador;
- fecha estimada de finalización.

Acciones rápidas:
- Registrar horas
- Subir evidencia
- Ver documentos
- Contactar al coordinador

Este dashboard debe ser más sencillo que el del coordinador.

==================================================
16. ESTADOS Y MICROINTERACCIONES
==================================================

Diseña estados completos para los componentes:

- carga con skeletons en tarjetas y tablas;
- estado vacío;
- sin resultados;
- error;
- éxito;
- conexión lenta;
- sesión vencida;
- archivo inválido;
- confirmación antes de acciones irreversibles.

Ejemplos de estados vacíos:
“No tienes postulaciones pendientes.”
“Todavía no se registraron horas esta semana.”
“No se encontraron convenios con estos filtros.”

Ejemplos de confirmación:
“Postulación aprobada correctamente.”
“Se envió la observación al estudiante.”
“Las horas fueron validadas.”

Usa toasts discretos en la esquina superior derecha.

Agregar microinteracciones:
- transición suave al colapsar sidebar;
- animación sutil al avanzar una etapa;
- hover claro en filas;
- expansión de panel lateral;
- contador animado solo al cargar el dashboard;
- feedback inmediato al cargar archivos.

No crear animaciones decorativas constantes.

==================================================
17. COMPONENTES REUTILIZABLES
==================================================

Crea componentes y variantes para:

- Sidebar expandido y colapsado
- Topbar
- Breadcrumb
- Botones primary, secondary, ghost y danger
- Input
- Select
- Combobox
- Date picker
- Textarea
- Checkbox
- Radio
- Segment control
- File uploader
- Status chip
- Priority indicator
- Metric card
- Action card
- Data table
- Pagination
- Tabs
- Timeline
- Stepper
- Progress bar
- Drawer
- Modal
- Tooltip
- Dropdown
- Toast
- Empty state
- Skeleton
- Chart container
- User avatar
- Comments
- Document row

Usa Auto Layout.
Usa propiedades y variantes coherentes.
Nombra las capas y componentes de forma descriptiva.

==================================================
18. ACCESIBILIDAD
==================================================

Cumple criterios de accesibilidad:

- contraste suficiente;
- estados de foco visibles;
- navegación mediante teclado;
- labels persistentes en formularios;
- no usar placeholder como único label;
- iconos acompañados de texto cuando la acción pueda ser ambigua;
- áreas táctiles de al menos 44 px;
- mensajes de error próximos al campo;
- no depender solo del color;
- títulos y jerarquía semántica;
- tablas legibles;
- tooltips para iconos cuando el sidebar esté colapsado.

==================================================
19. RESPONSIVE
==================================================

Escritorio:
1440 px.

Tablet:
768–1024 px.
La sidebar debe convertirse en drawer.
Los gráficos deben reorganizarse en una columna o dos.
Las tablas pueden mantener scroll horizontal controlado.

Móvil:
390 px.
Prioriza solamente:
- login;
- dashboard del estudiante;
- seguimiento de postulación;
- registro de horas;
- notificaciones.

En móvil:
- navegación inferior con máximo cinco opciones;
- cards en una columna;
- acciones principales persistentes cuando sea útil;
- no intentar mostrar tablas completas;
- transformar filas en tarjetas resumidas.

==================================================
20. FUNCIONALIDAD DEL PROTOTIPO
==================================================

El prototipo debe ser navegable y funcional.

Implementa estas interacciones:

1. Login exitoso conduce al dashboard.
2. El menú cambia de ruta.
3. El sidebar puede colapsarse.
4. El selector de rol cambia entre Coordinador y Estudiante.
5. Los tabs cambian de contenido.
6. Los filtros actualizan visualmente los datos.
7. Una postulación puede abrirse desde la tabla.
8. El panel lateral de documentos puede abrirse y cerrarse.
9. El flujo de nueva postulación permite avanzar y retroceder.
10. La carga de archivos muestra progreso.
11. Aprobar una postulación cambia su estado y genera un toast.
12. Registrar horas actualiza el progreso.
13. Las notificaciones pueden marcarse como leídas.
14. Los modales de confirmación deben funcionar.
15. Las vistas Lista/Kanban de la bandeja deben alternarse.

Usa datos simulados consistentes en toda la aplicación.
El mismo estudiante debe conservar la misma empresa, estado y datos en todas las vistas.

==================================================
21. RESTRICCIONES FINALES DE CALIDAD
==================================================

No generar lorem ipsum.
No dejar botones sin propósito.
No incluir módulos repetidos.
No mostrar gráficos circulares para todas las métricas.
No usar más de un color de acento dominante por pantalla.
No usar fotografías de stock como decoración principal.
No llenar el dashboard con tarjetas idénticas.
No utilizar gradientes intensos.
No hacer textos demasiado pequeños.
No crear una interfaz excesivamente redondeada.
No copiar literalmente un dashboard financiero o de comercio electrónico.
No usar términos en inglés en la interfaz.
No inventar funciones ajenas al manejo de prácticas preprofesionales.

El resultado final debe sentirse como un producto específico, coherente y original llamado SMCPP.

Primero genera las rutas y pantallas principales:
- Login
- Dashboard del coordinador
- Bandeja de trabajo
- Postulaciones
- Detalle de postulación
- Nueva postulación
- Control de horas
- Evaluaciones
- Convenios
- Reportes
- Notificaciones
- Dashboard del estudiante

Después verifica que toda la navegación y los datos sean coherentes.