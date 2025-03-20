# Aplicación de Notas

## Descripción

Esta aplicación web permite a los usuarios gestionar sus notas de manera privada y segura. Con una interfaz intuitiva y un backend optimizado, los usuarios pueden:

- Crear nuevas notas con un título y contenido.
- Leer sus notas en cualquier momento desde cualquier dispositivo.
- Actualizar el contenido de sus notas cuando sea necesario.
- Eliminar notas que ya no necesiten.

## Características principales

- **Autenticación de usuarios**: Cada usuario tiene acceso exclusivo a sus notas.
- **Seguridad y privacidad**: Protección de datos mediante autenticación y autorización.
- **Gestión eficiente de concurrencia**: Implementación de estrategias de bloqueo para evitar condiciones de carrera en entornos paralelizados.
- **Interfaz amigable**: Diseño moderno y accesible para una experiencia fluida.

## Tecnologías utilizadas

### Frontend:

- **React**: Framework principal para el desarrollo de la interfaz de usuario.
- **TypeScript**: Lenguaje de programación para un desarrollo más seguro y fácil de mantener.
- **Material UI**: Para una interfaz de usuario elegante y accesible.
- **React Router**: Para la navegación entre las diferentes vistas de la aplicación.
- **Zustand**: Para el manejo del estado global de la aplicación de manera eficiente.
- **Formik** y **Yup**: Para la gestión de formularios y validación de datos.
- **Axios**: Para la comunicación con el backend mediante solicitudes HTTP.
- **React-Toastify**: Para mostrar notificaciones de manera intuitiva.
- **i18n**: Para la internacionalización y soporte de múltiples idiomas.
- **Vite**: Para la construcción rápida y eficiente del proyecto.
- **Prettier**: Para asegurar un formato consistente en el código.

### Backend:

- **Python**: Lenguaje de programación para el desarrollo del backend.
- **FastAPI**: Framework rápido y eficiente para crear APIs RESTful.
- **Async SQLAlchemy**: ORM asincrónico para interactuar con la base de datos de manera eficiente.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **JWT**: Para la autenticación segura de los usuarios.
- **bcrypt**: Para el cifrado de contraseñas.
- **Pydantic**: Para la validación de datos de entrada y salida.
- **dotenv**: Para manejar variables de entorno.
- **Black**: Para formatear el código Python.

## Estrategia de Bloqueo Implementada

Se ha implementado una **estrategia de bloqueo optimista** utilizando el campo `updated_at` de la tabla `note`. Esta estrategia permite gestionar los conflictos de concurrencia cuando varios usuarios intentan modificar la misma nota al mismo tiempo. Si un usuario intenta actualizar una nota que ha sido modificada por otro antes de que termine su acción, se detectará un conflicto y se le informará al usuario. Se le otorgarán diferentes opciones para resolver el conflicto de la manera que estime conveniente.

### Resolución de Conflictos:

- **Recargar la nota** para obtener la última versión.
- **Fusionar los cambios manualmente**.
- **Reintentar la actualización**

### Desafíos y Soluciones:

Uno de los principales desafíos fue manejar correctamente los conflictos de concurrencia, ya que había que analizar bien cómo debía interactuar el usuario una vez notificado respecto al conflicto.

Inicialmente, se implementó un **bloqueo pesimista**, en el cual una nota quedaba bloqueada cuando un usuario comenzaba a editarla, impidiendo que otros la modificaran simultáneamente. Sin embargo, este enfoque presentó varios inconvenientes:

- Requería mecanismos adicionales para liberar los bloqueos en caso de que un usuario abandonara la edición sin guardar.
- Podía generar una mala experiencia de usuario, ya que otros usuarios no podían realizar cambios hasta que el bloqueo se liberara.
- Introducía posibles cuellos de botella en escenarios de alta concurrencia.

Debido a estas limitaciones, se optó por un **bloqueo optimista**, en el cual cada nota almacena un campo `updated_at` que se actualiza con cada modificación. Con este método:

- Los usuarios pueden editar una nota sin bloquear a otros.
- Al momento de guardar, si `updated_at` no coincide con la versión en la base de datos, se detecta un conflicto.
- Se le presentan opciones al usuario para resolver el conflicto: recargar la nota, fusionar los cambios manualmente o reintentar la actualización.

Este enfoque permite una mayor flexibilidad, mejor experiencia de usuario y un manejo más eficiente de la concurrencia en comparación con el bloqueo pesimista.

## Instrucciones de Configuración

### Frontend:

1. **Instalar dependencias**:

   - Ejecuta el siguiente comando en la terminal dentro de la carpeta del frontend:
     ```
     npm install
     ```
     o si usas Yarn:
     ```
     yarn install
     ```

2. **Iniciar el servidor de desarrollo**:
   - Una vez que las dependencias estén instaladas, inicia el servidor de desarrollo con el siguiente comando:
     ```
     npm run dev
     ```
     o si usas Yarn:
     ```
     yarn run dev
     ```

### Backend:

1. **Crear un entorno virtual**:

   - Primero, crea un entorno virtual en la carpeta del backend con el siguiente comando:
     ```
     python -m venv venv
     ```

2. **Activar el entorno virtual**:

   - En **Windows**, ejecuta:
     ```
     venv\Scripts\activate
     ```
   - En **Unix/Linux**, ejecuta:
     ```
     source venv/bin/activate
     ```

3. **Instalar dependencias**:

   - Una vez que el entorno virtual esté activado, instala las dependencias del proyecto con el siguiente comando:
     ```
     pip install -r requirements.txt
     ```

4. **Establecer las variables de entorno**:

   - Crea un archivo `.env` en la carpeta del backend con las siguientes variables:
     ```plaintext
     JWT_KEY=d5s6ff1dedd5XXsd@ss@
     URL_DATABASE=postgresql+asyncpg://<usuario>:<contraseña>@localhost:5432/NotesApp
     ORIGIN_URL=http://localhost:5173
     ENVIRONMENT=testing
     ```

5. **Ejecutar migraciones de base de datos**:

   - Si estás utilizando Alembic con SQLAlchemy, ejecuta las migraciones de base de datos necesarias.

6. **Iniciar el servidor**:
   - Inicia el servidor con el siguiente comando:
     ```
     uvicorn main:app --reload
     ```

### Base de Datos (PostgreSQL):

1. **Instalar y ejecutar PostgreSQL**:

   - Si no tienes PostgreSQL instalado, instálalo y ejecuta el servidor.

2. **Crear la base de datos y el usuario necesarios**:

   - Crea una base de datos llamada `NotesApp` y un usuario para conectarte a la base de datos.

3. **Configurar la conexión a la base de datos**:
   - En el archivo `.env` del backend, configura la URL de la base de datos de acuerdo a los detalles de tu instalación de PostgreSQL.

## Variables de Entorno

### Frontend:

Crea un archivo `.env.development` en la carpeta `frontend` con el siguiente contenido:

```plaintext
VITE_SERVER=http://localhost:8000
VITE_NOTE_PATH=/api/notes
VITE_AUTH_PATH=/api/auth
```

### Backend:

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido (recuerda incorporar tu configuración de PostgreSQL):

```plaintext
JWT_KEY=d5s6ff1dedd5XXsd@ss@
URL_DATABASE=postgresql+asyncpg://<usuario>:<contraseña>@localhost:5432/NotesApp
ORIGIN_URL=http://localhost:5173
ENVIRONMENT=testing
```

## Simulación de Concurrencia

Para probar la eficiencia de la estrategia de bloqueo optimista bajo condiciones de concurrencia, se abrieron múltiples pestañas del navegador y se realizaron modificaciones e interacciones del usuario en diferentes pestañas de manera independiente. Aunque no se trató de una simulación de alto volumen, este enfoque permitió observar cómo la aplicación maneja los conflictos de concurrencia cuando varios usuarios modifican la misma información en pestañas separadas.

Las pruebas realizadas ayudaron a identificar posibles mejoras en la implementación para gestionar adecuadamente los conflictos y asegurar una experiencia fluida en escenarios de concurrencia moderada.

## Mensajes de Error

La aplicación proporciona retroalimentación significativa a los usuarios cuando ocurren conflictos o errores, como cuando dos usuarios intentan modificar la misma nota al mismo tiempo. Los mensajes de error son claros y orientan a los usuarios a las opciones disponibles para resolver los conflictos de manera efectiva.

## Mensajes de Error

La aplicación asegura que los datos permanezcan consistentes y que no se pierdan actualizaciones debido a condiciones de carrera. La estrategia de bloqueo optimista garantiza que las actualizaciones se manejen de manera segura y eficiente, incluso en escenarios de alta concurrencia.
