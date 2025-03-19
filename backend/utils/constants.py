# Tags constants
AUTH_TAG = "auth"
NOTE_TAG = "note"

# Endpoints constants
ROOT_PATH = "/"
AUTH_PREFIX = "/api/auth"
USER_REGISTER_ENDPOINT = "/register"
USER_LOGIN_ENDPOINT = "/login"
USER_LOGOUT_ENDPOINT = "/logout"
NOTE_PREFIX = "/api/notes"
NOTE_PATH = "/{id}"
NO_PATH = ""

# User constants
VERIFY_CREDENTIAL = "Por favor, verifica los datos que has ingresado"
USER_REGISTERED = "¡Bienvenido! Tu cuenta ha sido creada con éxito"
USER_ALREADY_REGISTERED = "Este usuario ya está registrado. Intenta con otro nombre"
USER_SUCCESSFULLY_LOGIN = "¡Bienvenido de nuevo! Has iniciado sesión correctamente"

# Note constants
DATA_OBTAINED = "Los datos se han obtenido correctamente. ¡Todo listo!"
NOTE_REGISTERED = "¡Tu nota ha sido registrada correctamente!"
NOTE_DOES_NOT_EXIST = "Lo sentimos, no encontramos esa nota"
NOTE_UPDATED = "¡Tu nota ha sido actualizada exitosamente!"
NOTE_DELETED = "¡La nota ha sido eliminada con éxito!"
NOTE_UPDATE_CONCURRENCY_ERROR = "Hubo un problema al intentar actualizar la nota. Es posible que la nota haya sido modificada recientemente. Por favor, intenta nuevamente"
NOTE_DELETE_CONCURRENCY_ERROR = "Hubo un problema al intentar eliminar la nota. Es posible que la nota ya haya sido eliminada. Intenta nuevamente"

# Error constants
EXCEPTION_MESSAGE = "Algo salió mal. Intenta nuevamente en unos minutos"
NOT_AUTHORIZED_MESSAGE = "No tienes permisos para acceder a este servicio"

# Access keys
ACCESS_TOKEN_KEY = "access_token"
REFRESH_TOKEN_KEY = "refresh_token"

# ISO2 codes
ISO2_CODE_CHILE = "CL"

# Expiration constants
TOKEN_DAYS_EXPIRATION = 7
TOKEN_MINUTES_EXPIRATION = 60
