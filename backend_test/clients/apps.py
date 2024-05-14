from django.apps import AppConfig


class ClientsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'clients'

    def ready(self):
        # Import the function here to avoid circular imports
        from .signals import create_default_user
        from django.db.models.signals import post_migrate
        post_migrate.connect(create_default_user, sender=self)