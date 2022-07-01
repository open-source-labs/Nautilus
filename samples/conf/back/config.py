from .common import *

PUBLIC_REGISTER_ENABLED = False
DEBUG = False
TEMPLATE_DEBUG = False

SECRET_KEY = 'secret'

MEDIA_URL = "http://taiga.lan/media/"
STATIC_URL = "http://taiga.lan/static/"
ADMIN_MEDIA_PREFIX = "http://taiga.lan/static/admin/"
SITES["api"]["scheme"] = "http"
SITES["api"]["domain"] = "taiga.lan"
SITES["front"]["scheme"] = "http"
SITES["front"]["domain"] = "taiga.lan"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "taiga",
        "HOST": "db",
        "USER": "postgres",
        "PASSWORD": "password"
    }
}

#DEFAULT_FROM_EMAIL = "john@doe.com"
#CHANGE_NOTIFICATIONS_MIN_INTERVAL = 300 #seconds
#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#EMAIL_USE_TLS = False
#EMAIL_USE_SSL = False # You cannot use both (TLS and SSL) at the same time!
#EMAIL_HOST = 'localhost'
#EMAIL_PORT = 25
#EMAIL_HOST_USER = 'user'
#EMAIL_HOST_PASSWORD = 'password'

EVENTS_PUSH_BACKEND = "taiga.events.backends.rabbitmq.EventsPushBackend"
EVENTS_PUSH_BACKEND_OPTIONS = {"url": "amqp://taiga:password@rabbit:5672/taiga"}

CELERY_ENABLED = True
