from django.apps import AppConfig


class RealtimeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'realtime'

    def ready(self):
        from . import celery_event_listener  # This imports the module to ensure it connects the signals