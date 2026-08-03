Corrige la gestión de roles del proyecto SMCPP.

Actualmente, al cambiar de Coordinador a Estudiante solo cambia el contenido del dashboard, pero la barra lateral, las rutas y varias opciones siguen mostrando funciones exclusivas del coordinador. Esto es incorrecto.

Implementa una experiencia realmente distinta para cada rol.

REGLA PRINCIPAL:
El cambio de rol debe modificar completamente:
- la barra lateral;
- la barra superior;
- el buscador;
- las rutas permitidas;
- las acciones rápidas;
- los títulos;
- las notificaciones;
- los datos mostrados;
- los accesos disponibles.

==================================================
ROL COORDINADOR
==================================================

El coordinador debe conservar este menú:

GENERAL
- Resumen
- Bandeja de trabajo

GESTIÓN
- Convenios
- Empresas receptoras
- Postulaciones
- Documentos
- Control de horas
- Evaluaciones

ANÁLISIS
- Reportes
- Seguimiento

SISTEMA
- Notificaciones
- Usuarios
- Configuración

El coordinador puede:
- revisar todas las postulaciones;
- aprobar, observar o rechazar;
- administrar convenios;
- consultar empresas;
- validar horas;
- revisar evaluaciones;
- generar reportes;
- administrar usuarios;
- consultar incidencias generales.

==================================================
ROL ESTUDIANTE
==================================================

Al cambiar al rol Estudiante, reemplaza completamente el menú lateral por uno simplificado:

MI PRÁCTICA
- Inicio
- Mi postulación
- Mis documentos
- Mis horas
- Mi evaluación

COMUNICACIÓN
- Notificaciones
- Ayuda y soporte

CUENTA
- Mi perfil

El estudiante NO debe ver:
- Bandeja de trabajo
- Gestión general de convenios
- Empresas receptoras administrativas
- Lista global de postulaciones
- Documentos de otros estudiantes
- Evaluaciones generales
- Reportes institucionales
- Seguimiento general
- Usuarios
- Configuración
- Acciones de aprobar, rechazar o validar a otros usuarios

El estudiante solo debe acceder a su propia información.

==================================================
RUTAS DEL ESTUDIANTE
==================================================

Crea o adapta estas rutas:

/dashboard
Dashboard personal del estudiante.

/mi-postulacion
Debe mostrar el estado de su postulación, la empresa seleccionada, el avance, las observaciones y la línea de tiempo.

/mi-postulacion/nueva
Formulario para iniciar una postulación.

/mis-documentos
Debe mostrar únicamente sus documentos, sus versiones, estados y observaciones.

/mis-horas
Debe permitir registrar horas, ver horas acumuladas, pendientes, observadas y validadas.

/mi-evaluacion
Debe mostrar el estado de su evaluación, puntajes y comentarios cuando estén disponibles.

/notificaciones
Solo notificaciones relacionadas con su proceso.

/perfil
Datos personales y académicos del estudiante.

/soporte
Formulario simple para solicitar ayuda.

==================================================
DASHBOARD DEL ESTUDIANTE
==================================================

Mantén el dashboard actual del estudiante, pero mejora su coherencia.

Debe mostrar:

- saludo: “Hola, Ana”;
- estado actual: “Tu práctica se encuentra en ejecución”;
- trayectoria:
  Postulación → Documentos → Aprobación → Registro de horas → Evaluación;
- 186 de 320 horas;
- 58% de avance;
- empresa: AndesTech Solutions;
- próxima acción: “Registrar las horas de esta semana”;
- últimas observaciones;
- notificaciones recientes;
- datos del tutor empresarial;
- contacto del coordinador.

Acciones rápidas:
- Registrar horas
- Subir documento
- Ver mi postulación
- Contactar al coordinador

No mostrar métricas globales de otros estudiantes.

==================================================
TOPBAR POR ROL
==================================================

Para Coordinador:
Buscador:
“Buscar estudiante, convenio o empresa…”

Para Estudiante:
Buscador:
“Buscar en mi postulación, documentos u horas…”

El botón de acción rápida también debe cambiar:

Coordinador:
- Nueva postulación
- Nuevo convenio
- Generar reporte

Estudiante:
- Registrar horas
- Subir documento
- Ver mi avance

El avatar, nombre y subtítulo deben corresponder al rol activo.

==================================================
PROTECCIÓN DE RUTAS
==================================================

Implementa protección visual y lógica de rutas.

Si el rol Estudiante intenta acceder mediante URL a una ruta exclusiva del coordinador:
- redirigir a /dashboard;
- mostrar un toast:
  “No tienes permisos para acceder a esta sección.”

Si el rol Coordinador entra en una ruta personal del estudiante desde el selector de demostración, puede verla solamente cuando el rol activo sea Estudiante.

No basta con ocultar las opciones del menú. También deben bloquearse las rutas.

==================================================
COHERENCIA DE DATOS
==================================================

Para el rol Estudiante usa siempre estos datos:

Nombre:
Ana Torres Mamani

Código:
2021064821

Empresa:
AndesTech Solutions

Área:
Desarrollo de software

Tutor empresarial:
Carlos Medina

Coordinador:
Coord. Ramos

Horas:
186 de 320

Estado:
En práctica

Postulación:
Aprobada

Documentos:
4 aprobados y 1 pendiente

Evaluación:
Pendiente

Mantén estos datos iguales en todas las pantallas del estudiante.

==================================================
REQUISITOS TÉCNICOS
==================================================

- El componente Sidebar debe recibir el rol activo.
- Define menús separados para coordinador y estudiante.
- Las rutas deben tener control de acceso por rol.
- No dupliques componentes innecesariamente.
- Reutiliza Layout, Topbar y componentes visuales.
- Mantén el diseño actual y sus colores.
- No rediseñes toda la interfaz.
- No elimines funciones que ya funcionan.
- Corrige únicamente la arquitectura por roles, navegación y coherencia de contenido.
- Verifica que al cambiar de rol se redirija automáticamente al dashboard correspondiente.