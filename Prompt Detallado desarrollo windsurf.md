Prompt Detallado para la Creación de una Aplicación Web de Planificación Financiera
1. Resumen del Proyecto

Crear una aplicación web completa (Full-Stack) que permita a los usuarios registrarse, iniciar sesión y gestionar un plan de viabilidad económica personalizado. Cada usuario solo tendrá acceso a sus propios datos financieros. La aplicación debe ser interactiva, permitiendo al usuario modificar supuestos y ver proyecciones financieras actualizadas en tiempo real.

La interfaz de usuario (UI) y la lógica de cálculo del lado del cliente se basarán en el artefacto HTML/CSS "plan_financiero_interactivo_ibiza" ya creado.

2. Arquitectura Tecnológica (Tech Stack)

Frontend: React.js con Vite.js para el empaquetado.

Estilos: Tailwind CSS.

Backend: Node.js con el framework Express.js.

Base de Datos: MySQL.

Autenticación: Basada en JSON Web Tokens (JWT).

3. Modelo de Datos (Esquema de la Base de Datos MySQL)

Se necesitan las siguientes tablas:

Tabla users:

id (INT, Primary Key, AUTO_INCREMENT)

email (VARCHAR(255), UNIQUE, NOT NULL)

password (VARCHAR(255), NOT NULL) - Debe almacenarse hasheada (ej: con bcrypt).

created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Tabla financial_plans: Almacena los supuestos principales de cada usuario.

id (INT, Primary Key, AUTO_INCREMENT)

user_id (INT, Foreign Key a users.id)

inversion_inicial (DECIMAL(15, 2), DEFAULT 500000.00)

cuota_mensual (DECIMAL(10, 2), DEFAULT 70.00)

ingreso_pt (DECIMAL(10, 2), DEFAULT 0.00)

cuota_inscripcion (DECIMAL(10, 2), DEFAULT 0.00)

tasa_bajas (DECIMAL(5, 2), DEFAULT 5.00)

coste_variable_socio (DECIMAL(10, 2), DEFAULT 15.00)

coste_llave_socio (DECIMAL(10, 2), DEFAULT 0.00)

tasa_morosos (DECIMAL(5, 2), DEFAULT 0.00)

cac (DECIMAL(10, 2), DEFAULT 50.00)

Tabla fixed_costs: Almacena las líneas de costes fijos dinámicos de cada plan.

id (INT, Primary Key, AUTO_INCREMENT)

plan_id (INT, Foreign Key a financial_plans.id)

label (VARCHAR(255), NOT NULL)

value (DECIMAL(15, 2), NOT NULL)

4. Funcionalidades del Backend (API Endpoints)

El backend debe exponer una API RESTful con los siguientes endpoints:

Autenticación:

POST /api/auth/register: Recibe email y password. Crea un nuevo usuario en la BBDD (con la contraseña hasheada) y crea su financial_plan y fixed_costs por defecto.

POST /api/auth/login: Recibe email y password. Verifica las credenciales y, si son correctas, devuelve un JWT.

Datos del Plan (Rutas Protegidas con JWT):

GET /api/plan: Obtiene todos los datos del plan financiero (financial_plans y fixed_costs) del usuario autenticado.

PUT /api/plan/assumptions: Recibe un objeto con los supuestos generales (cuota_mensual, cac, etc.) y los actualiza en la tabla financial_plans.

POST /api/plan/costs: Recibe { label, value }. Añade una nueva línea de coste fijo a la tabla fixed_costs para el plan del usuario.

PUT /api/plan/costs/:costId: Recibe { label, value }. Actualiza una línea de coste fijo existente.

DELETE /api/plan/costs/:costId: Elimina una línea de coste fijo.

5. Funcionalidades del Frontend (React)

Routing: Configurar un sistema de rutas (ej: con React Router).

/login: Página de inicio de sesión.

/register: Página de registro.

/dashboard: Ruta protegida. El panel principal con el plan financiero. Redirigir a /login si no hay un usuario autenticado.

Estado Global: Utilizar React Context o una librería como Zustand para gestionar el estado de autenticación (JWT, datos del usuario).

Flujo de Datos:

Al cargar el /dashboard, hacer una petición a GET /api/plan para obtener todos los datos del usuario y rellenar los campos de la interfaz.

Cada vez que un usuario modifica un campo de "Supuestos", guardar el cambio automáticamente con una petición PUT al backend.

El botón "Añadir Coste" debe hacer una petición POST /api/plan/costs.

El botón "X" para eliminar un coste debe hacer una petición DELETE /api/plan/costs/:costId.

El botón "Log Out" debe eliminar el JWT del almacenamiento local y redirigir al usuario a /login.

6. Interfaz de Usuario (UI/UX)

Reutilización: Adaptar el código HTML y CSS del artefacto "plan_financiero_interactivo_ibiza" a componentes de React.

Diseño: Mantener la estética limpia y profesional inspirada en Vercel (tema claro), incluyendo la cabecera con el logo centrado y el panel de usuario a la derecha.

Componentes: Crear componentes reutilizables para:

Card: Los contenedores blancos con sombra.

InputGroup: El conjunto de label e input.

KpiCard: Las tarjetas de métricas clave.

ProjectionTable: Las tablas de proyecciones.

FixedCostRow: Cada línea editable de los costes fijos.

7. Consideraciones de Seguridad

Backend:

Nunca almacenar contraseñas en texto plano. Usar bcrypt para hashearlas.

Validar y sanear todos los datos que llegan del cliente para prevenir inyecciones SQL.

Implementar CORS para permitir peticiones solo desde el dominio del frontend.

Frontend:

Almacenar el JWT de forma segura (ej: en localStorage o sessionStorage).

Asegurarse de enviar el token en el Authorization Header de cada petición a las rutas protegidas (ej: Authorization: Bearer <token>).